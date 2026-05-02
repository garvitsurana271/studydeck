// StudyDeck — Firebase Cloud Sync (V70)
// Requires window.STUDYDECK_FIREBASE config object in StudyDeck.html.
// Provides: Google Sign-In, Firestore state sync, offline-first with debounced writes.
// State is stored as a JSON string in users/{uid}/data/state to avoid Firestore map limits.
//
// ── Firestore Security Rules (paste into Firebase Console → Firestore → Rules) ──
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /users/{userId}/data/{doc} {
//       allow read, write: if request.auth != null && request.auth.uid == userId;
//     }
//   }
// }

(function () {
  'use strict';

  const CFG = window.STUDYDECK_FIREBASE;
  if (!CFG || !CFG.apiKey) {
    console.log('[Sync] No Firebase config — running offline only');
    return;
  }

  function waitForSDK(cb) {
    if (window.firebase && window.firebase.auth && window.firebase.firestore) { cb(); return; }
    setTimeout(function () { waitForSDK(cb); }, 60);
  }

  waitForSDK(function () {
    if (!firebase.apps.length) firebase.initializeApp(CFG);
    var auth = firebase.auth();
    var db   = firebase.firestore();

    var uid       = null;
    var saveTimer = null;
    var SAVE_DELAY = 5000; // ms — debounce cloud writes

    // ── Cloud icon SVG ──────────────────────────────────────────────────────
    function cloudSVG(color) {
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + color +
        '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>';
    }

    // ── Header button ────────────────────────────────────────────────────────
    function injectUI() {
      if (document.getElementById('v70-sync-btn')) return;
      var anchor = document.getElementById('soundToggle');
      if (!anchor) { setTimeout(injectUI, 300); return; }

      var btn = document.createElement('button');
      btn.id        = 'v70-sync-btn';
      btn.className = 'icon-btn';
      btn.title     = 'Sync across devices — sign in with Google';
      btn.onclick   = onSyncClick;
      btn.innerHTML = cloudSVG('var(--ink-muted)');
      anchor.parentNode.insertBefore(btn, anchor);

      // Pulse animation
      if (!document.getElementById('v70-style')) {
        var s = document.createElement('style');
        s.id = 'v70-style';
        s.textContent = '@keyframes v70pulse{0%,100%{opacity:1}50%{opacity:.35}}';
        document.head.appendChild(s);
      }
    }

    function setIcon(status) {
      var btn = document.getElementById('v70-sync-btn');
      if (!btn) return;
      var colors = { idle:'var(--ink-muted)', pending:'#f59e0b', synced:'#16a34a', error:'#ef4444' };
      var titles = {
        idle:    'Sync — click to sign in with Google',
        pending: 'Syncing to cloud…',
        synced:  'Synced ✓ — all devices up to date',
        error:   'Sync failed — will retry'
      };
      btn.innerHTML        = cloudSVG(colors[status] || 'var(--ink-muted)');
      btn.title            = titles[status]  || 'Sync';
      btn.style.animation  = status === 'pending' ? 'v70pulse 1.2s ease-in-out infinite' : '';
    }

    // ── Sign-in / sign-out menu ──────────────────────────────────────────────
    function onSyncClick() {
      var existing = document.getElementById('v70-menu');
      if (existing) { existing.remove(); return; }

      if (!uid) {
        // Not signed in — trigger Google popup
        var p = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(p).catch(function (e) {
          console.error('[Sync] Sign-in failed', e);
          setIcon('error');
        });
        return;
      }

      // Already signed in — show mini menu
      var menu = document.createElement('div');
      menu.id = 'v70-menu';
      menu.style.cssText = 'position:fixed;top:52px;right:16px;background:var(--bg-elev);border:1px solid var(--line);border-radius:10px;padding:8px;z-index:9999;box-shadow:var(--shadow-md);min-width:190px;';
      var email = (auth.currentUser && auth.currentUser.email) || 'Signed in';
      menu.innerHTML =
        '<div style="font-size:11px;color:var(--ink-muted);padding:6px 8px 8px;font-family:\'Geist Mono\',monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + email + '</div>' +
        '<button id="v70-signout" style="width:100%;text-align:left;background:none;border:none;padding:8px 8px;border-radius:6px;cursor:pointer;font-size:13px;color:var(--danger);">Sign out</button>';
      document.body.appendChild(menu);

      document.getElementById('v70-signout').onclick = function () {
        menu.remove();
        auth.signOut();
      };

      // Close on outside click
      setTimeout(function () {
        document.addEventListener('click', function dismiss(e) {
          if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', dismiss); }
        });
      }, 10);
    }

    // ── Load state from Firestore ────────────────────────────────────────────
    function loadCloud() {
      db.doc('users/' + uid + '/data/state').get().then(function (snap) {
        if (!snap.exists) {
          console.log('[Sync] No cloud state yet — uploading local');
          writeToCloud();
          return;
        }
        var data = snap.data();
        var cloudState;
        try { cloudState = JSON.parse(data.json); } catch (e) { cloudState = null; }
        if (!cloudState) { console.warn('[Sync] Cloud JSON invalid'); setIcon('error'); return; }

        var localTs = (window.state && window.state._ts) || 0;
        var cloudTs = cloudState._ts || 0;

        if (cloudTs > localTs) {
          console.log('[Sync] Cloud is newer — applying (cloud:', cloudTs, 'local:', localTs, ')');
          // Merge into window.state
          if (window.state) {
            Object.keys(cloudState).forEach(function (k) { window.state[k] = cloudState[k]; });
          }
          // Persist to localStorage too
          try { localStorage.setItem('studydeck_state', JSON.stringify(window.state)); } catch (e) {}
          // Re-render visible parts
          try { if (typeof renderHeaderStats === 'function') renderHeaderStats(); } catch (e) {}
          try {
            var pv = document.getElementById('view-plan');
            if (pv && pv.style.display !== 'none' && typeof renderPlan === 'function') renderPlan();
          } catch (e) {}
        } else {
          console.log('[Sync] Local is newer or equal — pushing to cloud');
          writeToCloud();
        }
        setIcon('synced');
      }).catch(function (e) {
        console.warn('[Sync] Load failed:', e.code, e.message);
        setIcon('error');
      });
    }

    // ── Write state to Firestore (debounced) ─────────────────────────────────
    function scheduleWrite() {
      if (!uid) return;
      clearTimeout(saveTimer);
      setIcon('pending');
      saveTimer = setTimeout(writeToCloud, SAVE_DELAY);
    }

    function writeToCloud() {
      if (!uid || !window.state) return;
      window.state._ts = Date.now();
      var payload = { json: JSON.stringify(window.state), _ts: window.state._ts };
      db.doc('users/' + uid + '/data/state').set(payload).then(function () {
        setIcon('synced');
        console.log('[Sync] Saved to cloud at', new Date(window.state._ts).toISOString());
      }).catch(function (e) {
        console.warn('[Sync] Save failed:', e.code, e.message);
        setIcon('error');
        // Retry in 20s
        setTimeout(writeToCloud, 20000);
      });
    }

    // ── Cloud reset (called by resetAll in engine.js) ────────────────────────
    window.v70ClearCloud = function () {
      if (!uid) return Promise.resolve();
      return db.doc('users/' + uid + '/data/state').delete().then(function () {
        console.log('[Sync] Cloud state deleted');
        setIcon('idle');
      }).catch(function (e) {
        console.warn('[Sync] Cloud delete failed:', e.message);
      });
    };

    // ── Patch saveState ──────────────────────────────────────────────────────
    function patchSaveState() {
      if (typeof window.saveState !== 'function') { setTimeout(patchSaveState, 200); return; }
      if (window.saveState._v70) return;
      var orig = window.saveState;
      window.saveState = function () {
        orig.apply(this, arguments);
        if (uid) scheduleWrite();
      };
      window.saveState._v70 = true;
    }
    patchSaveState();

    // ── Auth listener ────────────────────────────────────────────────────────
    auth.onAuthStateChanged(function (user) {
      uid = user ? user.uid : null;
      injectUI();
      if (user) {
        console.log('[Sync] Signed in:', user.email);
        setIcon('pending');
        loadCloud();
      } else {
        setIcon('idle');
        console.log('[Sync] Signed out');
      }
    });

    injectUI();
  });
})();
