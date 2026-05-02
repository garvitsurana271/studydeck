// Organic mechanism reference cards for ISC Class 12 Chemistry.
// Used by V62 — visible on chem_6 (Haloalkanes), chem_7 (Alcohols/Phenols/Ethers),
// chem_8 (Aldehydes/Ketones/Acids), chem_9 (Amines).
// Each entry has: name, applies (chapter ids), equation, key facts, mechanism steps,
// optional inline SVG for the critical visual.

(function () {
  'use strict';

  const MECHANISMS = [
    {
      id: 'sn1',
      keywords: ['sn1', 's_n1', 'unimolecular nucleophilic', 'nucleophilic substitution', 'carbocation intermediate'],
      name: 'SN1 — Nucleophilic substitution, unimolecular',
      applies: ['chem_6'],
      equation: 'R–X  →  R⁺ + X⁻  →  R–Nu',
      kinetics: 'Rate = k[R–X]   (first order; nucleophile NOT in rate law)',
      stereochemistry: 'Racemization (planar carbocation attacked from either face)',
      favored_by: ['3° > 2° > 1° (carbocation stability)', 'Polar protic solvents (water, alcohols)', 'Weak nucleophiles', 'Better leaving groups'],
      steps: [
        'R–X ionizes slowly to give carbocation R⁺ + leaving group X⁻ (rate-determining).',
        'Nu attacks the planar sp² carbocation rapidly from either face.',
        'Product: racemic mixture if R was chiral.',
      ],
      svg: 'sn1',
    },
    {
      id: 'sn2',
      keywords: ['sn2', 's_n2', 'bimolecular nucleophilic', 'nucleophilic substitution', 'walden inversion', 'backside attack'],
      name: 'SN2 — Nucleophilic substitution, bimolecular',
      applies: ['chem_6'],
      equation: 'R–X + Nu⁻  →  [Nu···R···X]‡  →  R–Nu + X⁻',
      kinetics: 'Rate = k[R–X][Nu⁻]   (second order)',
      stereochemistry: 'Walden inversion — backside attack flips configuration',
      favored_by: ['1° > 2° (steric — 3° fails completely)', 'Polar aprotic solvents (DMSO, acetone)', 'Strong nucleophiles', 'Good leaving groups'],
      steps: [
        'Nu attacks the carbon from the side opposite to the leaving group.',
        'Single transition state with Nu and X both partially bonded.',
        'X leaves; Nu stays. The other three groups invert (umbrella flip).',
      ],
      svg: 'sn2',
    },
    {
      id: 'e2',
      keywords: ['e2 ', 'bimolecular elimination', 'β-elimination', 'beta elimination', 'dehydrohalogenation', 'elimination reaction', 'saytzeff', 'zaitsev'],
      name: 'E2 — Bimolecular elimination',
      applies: ['chem_6'],
      equation: 'H–Cα–Cβ–X + B⁻  →  alkene + BH + X⁻',
      kinetics: 'Rate = k[substrate][base]   (second order)',
      stereochemistry: 'Anti-periplanar — H and X on opposite faces',
      favored_by: ['Strong, bulky bases (DBU, t-BuO⁻)', '3° > 2° > 1° substrates', 'High temperature'],
      steps: [
        'Base abstracts β-hydrogen; simultaneously X leaves.',
        'C–H and C–X bonds break in a single concerted step.',
        'Anti-periplanar geometry required: H and X must be 180° apart.',
        'Saytzeff product (more substituted alkene) usually preferred.',
      ],
      svg: 'e2',
    },
    {
      id: 'aldol',
      keywords: ['aldol', 'aldol and ketol', 'α-hydrogen', 'alpha-hydrogen'],
      name: 'Aldol condensation',
      applies: ['chem_8'],
      equation: '2 R–CHO  ⇌(NaOH)⇌  β-hydroxy aldehyde  →(Δ)→  α,β-unsaturated carbonyl + H₂O',
      stereochemistry: 'Forms new C–C bond between α-carbon of one carbonyl and carbonyl C of another',
      requirement: 'At least one carbonyl must have an α-H',
      steps: [
        'Base abstracts α-H to form a carbanion (enolate ion stabilized by resonance).',
        'Enolate attacks the carbonyl C of a second molecule, forming a C–C bond.',
        'Protonation gives a β-hydroxy aldehyde/ketone (the "aldol").',
        'On heating, dehydration gives an α,β-unsaturated product (the "condensation").',
      ],
      mnemonic: 'Aldol = ALDehyde + alcohOL — both functional groups in the intermediate.',
    },
    {
      id: 'cannizzaro',
      keywords: ['cannizzaro', 'disproportionation', 'no α-h', 'haloform reaction'],
      name: 'Cannizzaro reaction',
      applies: ['chem_8'],
      equation: '2 HCHO  →(50% NaOH)→  HCOO⁻Na⁺ + CH₃OH',
      requirement: 'Aldehyde must have NO α-hydrogen (e.g., HCHO, PhCHO, (CH₃)₃C-CHO)',
      steps: [
        'OH⁻ adds to one aldehyde to give a tetrahedral alkoxide intermediate.',
        'This intermediate transfers a hydride (H⁻) to a second aldehyde molecule.',
        'One aldehyde becomes the alcohol (reduced); other becomes the carboxylate (oxidized).',
        'Disproportionation — same molecule, two fates.',
      ],
      mnemonic: 'No α-H? Aldehyde fights itself — half oxidizes, half reduces.',
    },
    {
      id: 'wurtz',
      keywords: ['wurtz', 'reaction with metals', 'sodium in dry ether'],
      name: 'Wurtz reaction (haloalkane → alkane)',
      applies: ['chem_6'],
      equation: '2 R–X + 2 Na  →(dry ether)→  R–R + 2 NaX',
      use: 'Synthesis of symmetrical alkanes (with even number of carbons)',
      limitation: 'Mixed alkyl halides give a mixture (R–R, R–R\', R\'–R\') — not useful for unsymmetric',
      steps: [
        'Sodium provides electrons that reduce R–X to R⁻ + Na⁺X⁻.',
        'R⁻ attacks another R–X in SN2 fashion to form R–R.',
      ],
    },
    {
      id: 'williamson',
      keywords: ['williamson', 'williamson\'s synthesis', 'preparation of ether', 'ether synthesis'],
      name: 'Williamson ether synthesis',
      applies: ['chem_7'],
      equation: 'R–O⁻Na⁺ + R\'–X  →  R–O–R\' + NaX',
      use: 'Both symmetric and unsymmetric ethers',
      limitation: 'R\'–X must be 1° (otherwise E2 dominates and you get an alkene)',
      steps: [
        'Alkoxide is prepared from alcohol + Na (or NaH) → R–O⁻Na⁺.',
        'Alkoxide attacks R\'–X via SN2.',
        'For unsymmetric ethers: pick the LESS hindered alkyl halide as the SN2 partner.',
      ],
    },
    {
      id: 'hoffmann',
      keywords: ['hoffmann bromamide', 'hofmann bromamide', 'bromamide', 'hofmann', 'amide to amine', 'reduction of amides'],
      name: 'Hoffmann bromamide degradation (amide → 1° amine)',
      applies: ['chem_9'],
      equation: 'R–CONH₂ + Br₂ + 4 KOH  →  R–NH₂ + K₂CO₃ + 2 KBr + 2 H₂O',
      use: 'Convert amide to primary amine with one fewer carbon',
      key_feature: 'Carbon count drops by 1 (amide loses the C=O carbon)',
      steps: [
        'Br₂/KOH brominates the amide N to give R–CONHBr.',
        'Base deprotonates and Br⁻ leaves to give a nitrene-like R–CON: (acyl nitrene).',
        'Alkyl group migrates from C to N — R–N=C=O (isocyanate intermediate).',
        'Hydrolysis of isocyanate gives amine R–NH₂ + CO₂.',
      ],
      mnemonic: 'Hoffmann shortens the chain by one carbon — amide loses its C, gains an amine.',
    },
    {
      id: 'sandmeyer',
      keywords: ['sandmeyer', 'diazonium salts', 'diazonium', 'displacement of nitrogen'],
      name: 'Sandmeyer reaction (diazonium → halide)',
      applies: ['chem_9'],
      equation: 'Ar–N₂⁺Cl⁻ + CuX  →  Ar–X + N₂ + CuCl   (X = Cl, Br, CN)',
      use: 'Replace the diazonium group with –Cl, –Br, –CN',
      note: 'For –I use KI directly (no Cu needed); for –F use HBF₄ then heat (Balz–Schiemann)',
      steps: [
        'Aniline → diazotization with NaNO₂/HCl at 0–5 °C → benzene diazonium chloride.',
        'Add CuCl (or CuBr / CuCN). The Cu(I) facilitates radical replacement.',
        'N₂ leaves as gas; X attaches to the aromatic ring.',
      ],
    },
    {
      id: 'reimer-tiemann',
      keywords: ['reimer', 'tiemann', 'salicylaldehyde'],
      name: 'Reimer–Tiemann reaction (phenol → salicylaldehyde)',
      applies: ['chem_7'],
      equation: 'PhOH + CHCl₃ + 3 NaOH  →  o-OH-C₆H₄-CHO + 3 NaCl + 2 H₂O',
      use: 'Introduce a –CHO group ortho to phenol –OH',
      steps: [
        'NaOH + CHCl₃ → :CCl₂ (dichlorocarbene) + Cl⁻ + H₂O.',
        'Phenoxide attacks the carbene at ortho position → ortho-substituted phenol with –CHCl₂.',
        'Hydrolysis of –CHCl₂ gives –CHO.',
      ],
    },
  ];

  function el(tag, props, children) {
    const e = document.createElement(tag);
    if (props) for (const k in props) {
      if (k === 'style') Object.assign(e.style, props[k]);
      else if (k === 'className') e.className = props[k];
      else if (k === 'innerHTML') e.innerHTML = props[k];
      else e.setAttribute(k, props[k]);
    }
    if (children) for (const c of children) {
      if (c == null) continue;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return e;
  }

  // Inline SVGs for the most critical visualizations
  const SVGS = {
    sn1: `<svg viewBox="0 0 360 80" style="max-width:360px;height:auto;background:#fafafa;border:1px solid #e5e7eb;border-radius:4px;">
      <text x="20" y="40" font-family="serif" font-size="14">R—X</text>
      <text x="55" y="40" font-size="13" fill="#6b7280">slow→</text>
      <text x="100" y="40" font-family="serif" font-size="14">R⁺  +  X⁻</text>
      <text x="180" y="40" font-size="13" fill="#6b7280">fast Nu⁻→</text>
      <text x="255" y="40" font-family="serif" font-size="14">R—Nu</text>
      <text x="20" y="65" font-size="11" fill="#9ca3af">step 1: ionize (rate-determining)</text>
      <text x="180" y="65" font-size="11" fill="#9ca3af">step 2: capture</text>
    </svg>`,
    sn2: `<svg viewBox="0 0 360 110" style="max-width:360px;height:auto;background:#fafafa;border:1px solid #e5e7eb;border-radius:4px;">
      <text x="10" y="55" font-family="serif" font-size="14">Nu⁻</text>
      <path d="M 45 55 Q 60 55 75 55" stroke="#3b82f6" stroke-width="1.5" fill="none" marker-end="url(#a1)"/>
      <text x="80" y="55" font-family="serif" font-size="14">C</text>
      <line x1="95" y1="55" x2="120" y2="55" stroke="#9ca3af"/>
      <text x="125" y="55" font-family="serif" font-size="14">X</text>
      <text x="80" y="35" font-size="10" fill="#9ca3af">↑</text>
      <text x="80" y="80" font-size="10" fill="#9ca3af">↓</text>
      <text x="155" y="55" font-size="13" fill="#6b7280">→</text>
      <text x="180" y="55" font-family="serif" font-size="14">Nu—C  +  X⁻</text>
      <text x="180" y="80" font-size="11" fill="#9ca3af">stereochemistry inverted</text>
      <text x="10" y="100" font-size="11" fill="#9ca3af">backside attack — single concerted step</text>
      <defs><marker id="a1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#3b82f6"/></marker></defs>
    </svg>`,
    e2: `<svg viewBox="0 0 360 110" style="max-width:360px;height:auto;background:#fafafa;border:1px solid #e5e7eb;border-radius:4px;">
      <text x="20" y="40" font-family="serif" font-size="14">B⁻</text>
      <text x="55" y="40" font-size="13" fill="#6b7280">→</text>
      <text x="80" y="35" font-size="13" fill="#1f2937">H</text>
      <text x="80" y="60" font-size="13" fill="#1f2937">|</text>
      <text x="78" y="80" font-family="serif" font-size="14">Cα</text>
      <text x="105" y="80" font-size="13">—</text>
      <text x="120" y="80" font-family="serif" font-size="14">Cβ</text>
      <text x="145" y="80" font-size="13">—</text>
      <text x="160" y="80" font-family="serif" font-size="14">X</text>
      <text x="200" y="60" font-size="13" fill="#6b7280">→</text>
      <text x="225" y="55" font-family="serif" font-size="14">C=C</text>
      <text x="270" y="55" font-size="12">+ BH + X⁻</text>
      <text x="20" y="100" font-size="11" fill="#9ca3af">anti-periplanar: H and X 180° apart</text>
    </svg>`,
  };

  function mechanismCard(m) {
    const card = el('div', {
      style: {
        padding: '16px',
        background: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        marginBottom: '14px',
      },
    });
    card.appendChild(el('div', { style: { fontWeight: '700', fontSize: '15px', color: '#111827', marginBottom: '6px' } }, [m.name]));
    card.appendChild(el('div', { style: { fontFamily: 'Geist Mono,monospace', fontSize: '13px', background: '#f3f4f6', padding: '6px 10px', borderRadius: '4px', marginBottom: '10px', color: '#1f2937' } }, [m.equation]));
    if (m.svg && SVGS[m.svg]) {
      const svgWrap = el('div', { style: { margin: '8px 0' }, innerHTML: SVGS[m.svg] });
      card.appendChild(svgWrap);
    }
    const dlPairs = [];
    if (m.kinetics)         dlPairs.push(['Kinetics', m.kinetics]);
    if (m.stereochemistry)  dlPairs.push(['Stereochemistry', m.stereochemistry]);
    if (m.requirement)      dlPairs.push(['Requirement', m.requirement]);
    if (m.use)              dlPairs.push(['Use', m.use]);
    if (m.limitation)       dlPairs.push(['Limitation', m.limitation]);
    if (m.note)             dlPairs.push(['Note', m.note]);
    if (m.key_feature)      dlPairs.push(['Key feature', m.key_feature]);
    if (m.favored_by)       dlPairs.push(['Favored by', m.favored_by.join(' · ')]);
    if (dlPairs.length) {
      const tbl = el('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '8px' } },
        dlPairs.map(([k, v]) => el('tr', null, [
          el('td', { style: { padding: '3px 6px', fontWeight: '600', color: '#374151', verticalAlign: 'top', width: '30%' } }, [k]),
          el('td', { style: { padding: '3px 6px', color: '#1f2937' } }, [v]),
        ]))
      );
      card.appendChild(tbl);
    }
    if (m.steps) {
      card.appendChild(el('div', { style: { fontWeight: '600', fontSize: '12px', color: '#374151', margin: '6px 0 4px' } }, ['Mechanism steps:']));
      const ol = el('ol', { style: { margin: '0 0 0 18px', padding: '0', fontSize: '12px', color: '#1f2937', lineHeight: '1.55' } },
        m.steps.map(s => el('li', { style: { marginBottom: '3px' } }, [s])));
      card.appendChild(ol);
    }
    if (m.mnemonic) {
      card.appendChild(el('div', { style: { background: '#fef3c7', border: '1px solid #fde68a', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', marginTop: '8px', color: '#78350f' } }, ['💡 ' + m.mnemonic]));
    }
    return card;
  }

  function renderMechanisms(target, chapterId) {
    target.innerHTML = '';
    const wrap = el('div', { style: { padding: '12px', background: '#f9fafb', borderRadius: '8px', maxHeight: '78vh', overflowY: 'auto' } });
    wrap.appendChild(el('div', { style: { fontSize: '15px', fontWeight: '700', marginBottom: '10px', color: '#111827' } },
      [`Organic Mechanisms — ${chapterId ? 'relevant to this chapter' : 'all'}`]));
    const list = chapterId ? MECHANISMS.filter(m => m.applies.includes(chapterId)) : MECHANISMS;
    if (list.length === 0) {
      wrap.appendChild(el('div', { style: { color: '#6b7280', padding: '14px' } }, ['No mechanisms catalogued for this chapter yet.']));
    } else {
      for (const m of list) wrap.appendChild(mechanismCard(m));
    }
    target.appendChild(wrap);
  }

  window.ORGANIC_MECHANISMS = { MECHANISMS, render: renderMechanisms, mechanismCard };
  if (typeof console !== 'undefined') console.log(`[OM] ${MECHANISMS.length} mechanisms loaded`);
})();
