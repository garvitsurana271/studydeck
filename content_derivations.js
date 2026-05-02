// content_derivations.js — ISC Board Derivation Drills
// 20 key derivations across PCM; each verified against ISC papers 2018–2025
(function () {
  'use strict';
  window.DERIVATIONS = [

    // ══════════════════════════════════════════
    //  PHYSICS
    // ══════════════════════════════════════════
    {
      id: 'phys_d1', subject: 'physics', chapter: 'phys_1',
      title: 'Electric field on the axial line of an electric dipole',
      marks: 5, time: 8,
      years: [2019, 2021, 2023, 2024],
      steps: [
        { label: 'Diagram + setup', marks: 1, text: 'Draw dipole: &minus;q at A, +q at B, separation 2a. Mark point P at distance <em>r</em> from centre O on the axial line (beyond +q). Label distances: (r&minus;a) from P to +q, and (r+a) from P to &minus;q.' },
        { label: 'E<sub>+</sub> and E<sub>&minus;</sub>', marks: 1, text: '$$E_+ = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{q}{(r-a)^2}\\quad(\\text{away from }+q,\\text{ away from centre})$$$$E_- = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{q}{(r+a)^2}\\quad(\\text{toward }-q,\\text{ toward centre})$$Since E<sub>+</sub> &gt; E<sub>&minus;</sub> and they are antiparallel, net field acts <strong>away from centre</strong>.' },
        { label: 'Net field', marks: 1, text: '$$E_{axial} = E_+ - E_- = \\frac{q}{4\\pi\\varepsilon_0}\\left[\\frac{1}{(r-a)^2} - \\frac{1}{(r+a)^2}\\right]$$' },
        { label: 'Simplify (expand difference of fractions)', marks: 1, text: '$$= \\frac{q}{4\\pi\\varepsilon_0}\\cdot\\frac{4ra}{(r^2-a^2)^2} = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{2pr}{(r^2-a^2)^2}$$ where $p = q \\cdot 2a$ is the dipole moment.' },
        { label: 'For r &gt;&gt; a (short dipole)', marks: 1, text: 'Drop a² vs r²: $$\\boxed{E_{axial} = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{2p}{r^3}}$$ Direction: along the dipole moment $\\hat{p}$ (away from &minus;q toward +q side).' }
      ]
    },

    {
      id: 'phys_d2', subject: 'physics', chapter: 'phys_1',
      title: 'Electric field on the equatorial line of an electric dipole',
      marks: 5, time: 8,
      years: [2018, 2020, 2022],
      steps: [
        { label: 'Diagram + setup', marks: 1, text: 'Draw dipole: &minus;q at A, +q at B. Point P at distance r from centre O on the equatorial line (perpendicular bisector). Distance from each charge to P = $\\sqrt{r^2+a^2}$. Mark angle &theta; that EP makes with equatorial line.' },
        { label: 'Equal magnitudes', marks: 1, text: '$$E_+ = E_- = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{q}{r^2+a^2}$$' },
        { label: 'Resolve components', marks: 1, text: '<strong>Perpendicular components:</strong> E<sub>+</sub>sin&theta; and E<sub>&minus;</sub>sin&theta; point in opposite directions (up and down) &rarr; cancel.<br><strong>Parallel components:</strong> both point in the same direction (from +q toward &minus;q) &rarr; add up.' },
        { label: 'Net field', marks: 1, text: '$$E_{eq} = 2E_+\\cos\\theta = \\frac{2q}{4\\pi\\varepsilon_0(r^2+a^2)}\\cdot\\frac{a}{\\sqrt{r^2+a^2}} = \\frac{p}{4\\pi\\varepsilon_0(r^2+a^2)^{3/2}}$$' },
        { label: 'For r &gt;&gt; a, comparison with axial', marks: 1, text: '$$\\boxed{E_{eq} = \\frac{1}{4\\pi\\varepsilon_0}\\cdot\\frac{p}{r^3}}$$ Direction: antiparallel to $\\hat{p}$. Note: $E_{axial} = 2\\,E_{eq}$ for the same r and same dipole.' }
      ]
    },

    {
      id: 'phys_d3', subject: 'physics', chapter: 'phys_1',
      title: "Gauss's law: E due to infinite plane sheet of charge",
      marks: 3, time: 5,
      years: [2018, 2020, 2022, 2024],
      steps: [
        { label: 'Gaussian surface', marks: 1, text: 'Infinite plane sheet, surface charge density &sigma;. Choose a <strong>cylindrical Gaussian surface</strong> (pillbox) with cross-section area A, axis perpendicular to sheet, extending equally on both sides.' },
        { label: 'Calculate flux', marks: 1, text: 'By symmetry, E is perpendicular to the sheet and equal on both sides. Flux through two flat faces = $2EA$. Flux through curved lateral surface = 0 (E &parallel; surface).<br>Total: $\\Phi_E = 2EA$.' },
        { label: 'Apply Gauss, get E', marks: 1, text: "Charge enclosed $q_{enc} = \\sigma A$. By Gauss's law: $2EA = \\sigma A/\\varepsilon_0$<br>$$\\boxed{E = \\frac{\\sigma}{2\\varepsilon_0}}$$ Perpendicular to sheet, away from it (for +&sigma;). <em>Note: between two oppositely charged plates, both sheets add: E = &sigma;/&varepsilon;<sub>0</sub></em>." }
      ]
    },

    {
      id: 'phys_d4', subject: 'physics', chapter: 'phys_2',
      title: 'Capacitance of a parallel plate capacitor',
      marks: 3, time: 5,
      years: [2019, 2021, 2023],
      steps: [
        { label: 'Field between plates', marks: 1, text: "Each plate: surface charge density $\\sigma = Q/A$. Using Gauss's law for a conductor: field between plates $E = \\sigma/\\varepsilon_0 = Q/(\\varepsilon_0 A)$. Field outside (where fields from two plates cancel) = 0." },
        { label: 'Potential difference', marks: 1, text: 'Plates separated by distance d. $V = E \\cdot d = \\dfrac{Qd}{\\varepsilon_0 A}$.' },
        { label: 'Capacitance and dielectric', marks: 1, text: '$C = Q/V$:<br>$$\\boxed{C = \\frac{\\varepsilon_0 A}{d}}$$With dielectric constant &kappa;: $C = \\kappa\\varepsilon_0 A/d$. Inserting dielectric increases C by factor &kappa; because it reduces E (and hence V) for same Q.' }
      ]
    },

    {
      id: 'phys_d5', subject: 'physics', chapter: 'phys_3',
      title: "Drift velocity → Ohm's law (electron theory of resistance)",
      marks: 5, time: 8,
      years: [2019, 2022, 2024],
      steps: [
        { label: 'Force on free electron', marks: 1, text: 'Applied voltage V across conductor of length l &rarr; E = V/l. Force on electron: F = eE = eV/l. Acceleration: $a = eE/m_e$.' },
        { label: 'Drift velocity', marks: 1, text: 'Electrons collide on average every &tau; seconds (relaxation time). Average drift velocity: $$v_d = a\\tau = \\frac{eE\\tau}{m_e} = \\frac{eV\\tau}{m_e l}$$' },
        { label: 'Current in terms of v<sub>d</sub>', marks: 1, text: 'In time t, charge drifting through cross-section A: $q = (n A v_d t) \\times e$. Current: $$I = \\frac{q}{t} = n e A v_d$$' },
        { label: 'Resistance from drift model', marks: 1, text: 'Substitute $v_d$: $I = neA \\cdot \\dfrac{eV\\tau}{m_e l} = \\dfrac{ne^2A\\tau}{m_e l}\\cdot V$. So $R = V/I$:<br>$$R = \\frac{m_e l}{ne^2\\tau A} = \\rho\\frac{l}{A}$$ where $\\rho = \\dfrac{m_e}{ne^2\\tau}$ is resistivity.' },
        { label: "Ohm's law statement", marks: 1, text: 'Since n, e, &tau; are constant at constant temperature, R is constant &rarr; V = IR &rarr; current is proportional to applied voltage. This is <strong>Ohm\'s law</strong>.' }
      ]
    },

    {
      id: 'phys_d6', subject: 'physics', chapter: 'phys_4',
      title: 'Biot-Savart: B at the centre of a circular current loop',
      marks: 5, time: 8,
      years: [2018, 2020, 2023, 2025],
      steps: [
        { label: 'Biot-Savart law', marks: 1, text: '$$dB = \\frac{\\mu_0}{4\\pi}\\cdot\\frac{I\\,dl\\sin\\theta}{r^2}$$For a circular loop of radius R at the centre: each element $dl$ is perpendicular to radius ($\\theta = 90°$, $\\sin\\theta = 1$) and $r = R$.' },
        { label: 'dB from one element', marks: 1, text: '$$dB = \\frac{\\mu_0 I\\,dl}{4\\pi R^2}$$Direction: by right-hand curl rule, all $dB$ contributions at the centre point in the <strong>same direction</strong> (along the axis).' },
        { label: 'Integrate around full loop', marks: 1, text: '$$B = \\int dB = \\frac{\\mu_0 I}{4\\pi R^2}\\int_0^{2\\pi R}dl = \\frac{\\mu_0 I}{4\\pi R^2}\\cdot 2\\pi R$$' },
        { label: 'Final result', marks: 1, text: '$$\\boxed{B = \\frac{\\mu_0 I}{2R}}$$For N turns: $B = \\dfrac{\\mu_0 NI}{2R}$.' },
        { label: 'Direction', marks: 1, text: 'Use right-hand thumb rule: curl fingers along current direction &rarr; thumb points in direction of B at centre.' }
      ]
    },

    {
      id: 'phys_d7', subject: 'physics', chapter: 'phys_4',
      title: "Ampere's circuital law: B inside a solenoid",
      marks: 5, time: 8,
      years: [2019, 2021, 2023],
      steps: [
        { label: 'Ideal solenoid', marks: 1, text: 'Solenoid: n turns per unit length, current I. Field is uniform and axial inside; zero outside.' },
        { label: 'Rectangular Amperian loop PQRS', marks: 1, text: 'PQ: inside solenoid, length l, along axis. QR, SP: perpendicular to axis (vertical). RS: outside solenoid.' },
        { label: 'Evaluate line integral', marks: 1, text: 'RS: B = 0 outside &rarr; contribution = 0.<br>QR, SP: B &perp; dl &rarr; contribution = 0.<br>PQ: B &parallel; dl &rarr; contribution = Bl.<br>Total: $\\oint \\vec{B}\\cdot d\\vec{l} = Bl$.' },
        { label: 'Enclosed current', marks: 1, text: 'Turns enclosed by loop = nl. Each carries current I. Total: $I_{enc} = nIl$.' },
        { label: "Apply Ampere's law", marks: 1, text: "$\\oint \\vec{B}\\cdot d\\vec{l} = \\mu_0 I_{enc}$ &rarr; $Bl = \\mu_0 nIl$<br>$$\\boxed{B = \\mu_0 nI}$$For n = N/L (total turns / length): $B = \\mu_0 NI/L$. Direction by right-hand rule." }
      ]
    },

    {
      id: 'phys_d8', subject: 'physics', chapter: 'phys_6',
      title: 'Motional EMF in a conductor moving through B',
      marks: 3, time: 5,
      years: [2018, 2020, 2022, 2024],
      steps: [
        { label: 'Magnetic force on free charges', marks: 1, text: 'Conductor of length l moves with velocity v perpendicular to field B. Free electrons in conductor experience force $F = ev \\times B$ (along conductor), causing charge separation until electric force balances magnetic force: $eE = evB \\Rightarrow E = vB$.' },
        { label: 'EMF from potential difference', marks: 1, text: 'Potential difference across ends of conductor: $\\varepsilon = El = Blv$.' },
        { label: 'Final result', marks: 1, text: '$$\\boxed{\\varepsilon = Blv}$$If part of closed circuit with resistance R: $I = Blv/R$. Power = $I^2R = B^2l^2v^2/R$.' }
      ]
    },

    {
      id: 'phys_d9', subject: 'physics', chapter: 'phys_9',
      title: "Lens maker's equation",
      marks: 5, time: 8,
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
      steps: [
        { label: 'Refraction at surface 1 (n₁ → n₂)', marks: 1, text: 'Object O in medium n₁. Refracted image I₁ formed in glass (n₂). Apply refraction at spherical surface (radius R₁):$$\\frac{n_2}{v_1} - \\frac{n_1}{u} = \\frac{n_2-n_1}{R_1}\\quad\\cdots(1)$$' },
        { label: 'Refraction at surface 2 (n₂ → n₁)', marks: 1, text: 'I₁ acts as virtual object for second surface (n₂ to n₁, radius R₂):$$\\frac{n_1}{v} - \\frac{n_2}{v_1} = \\frac{n_1-n_2}{R_2}\\quad\\cdots(2)$$' },
        { label: 'Add (1) + (2)', marks: 1, text: '$$\\frac{n_1}{v} - \\frac{n_1}{u} = (n_2-n_1)\\left(\\frac{1}{R_1}-\\frac{1}{R_2}\\right)$$Divide by n₁:$$\\frac{1}{v}-\\frac{1}{u} = \\left(\\frac{n_2}{n_1}-1\\right)\\left(\\frac{1}{R_1}-\\frac{1}{R_2}\\right)$$' },
        { label: 'Define focal length', marks: 1, text: 'For object at &infin;, image at f: $\\dfrac{1}{v}-\\dfrac{1}{u} = \\dfrac{1}{f}$.' },
        { label: "Final result (lens maker's equation)", marks: 1, text: '$$\\boxed{\\frac{1}{f} = (n-1)\\left(\\frac{1}{R_1}-\\frac{1}{R_2}\\right)}$$where $n = n_2/n_1$. <strong>ISC sign convention:</strong> For standard biconvex lens, R₁ &gt; 0, R₂ &lt; 0 &rarr; f &gt; 0 (converging). Always state sign convention before using.' }
      ]
    },

    {
      id: 'phys_d10', subject: 'physics', chapter: 'phys_12',
      title: "Bohr's model: radius of nth orbit and total energy",
      marks: 5, time: 8,
      years: [2018, 2020, 2022, 2024],
      steps: [
        { label: 'Centripetal = Coulomb (equation 1)', marks: 1, text: '$$\\frac{mv_n^2}{r_n} = \\frac{Ze^2}{4\\pi\\varepsilon_0 r_n^2} \\Rightarrow mv_n^2 = \\frac{Ze^2}{4\\pi\\varepsilon_0 r_n}\\quad\\cdots(1)$$' },
        { label: "Bohr's quantisation (equation 2)", marks: 1, text: '$$mv_n r_n = \\frac{nh}{2\\pi} \\Rightarrow v_n = \\frac{nh}{2\\pi m r_n}\\quad\\cdots(2)$$' },
        { label: 'Solve for r_n (substitute (2) into (1))', marks: 1, text: '$$m\\cdot\\frac{n^2h^2}{4\\pi^2 m^2 r_n^2} = \\frac{Ze^2}{4\\pi\\varepsilon_0 r_n}$$$$\\boxed{r_n = \\frac{n^2 h^2 \\varepsilon_0}{\\pi m_e Z e^2} = 0.529\\frac{n^2}{Z}\\ \\text{Å}}$$' },
        { label: 'Total energy = KE + PE', marks: 1, text: 'From (1): $KE = \\frac{1}{2}mv_n^2 = \\frac{Ze^2}{8\\pi\\varepsilon_0 r_n}$<br>$PE = -\\frac{Ze^2}{4\\pi\\varepsilon_0 r_n} = -2\\cdot KE$<br>$E_n = KE + PE = -\\frac{Ze^2}{8\\pi\\varepsilon_0 r_n}$' },
        { label: 'Final energy formula', marks: 1, text: 'Substitute r_n into E_n expression:$$\\boxed{E_n = -13.6\\frac{Z^2}{n^2}\\ \\text{eV}}$$Negative = bound state. H: E₁ = &minus;13.6, E₂ = &minus;3.4, E₃ = &minus;1.51 eV.' }
      ]
    },

    {
      id: 'phys_d11', subject: 'physics', chapter: 'phys_11',
      title: "Einstein's photoelectric equation",
      marks: 3, time: 5,
      years: [2018, 2020, 2022, 2024, 2025],
      steps: [
        { label: 'Photon energy', marks: 1, text: 'A photon of frequency &nu; carries energy $E = h\\nu$ (h = Planck\'s constant = 6.626 &times; 10&minus;&sup3;&sup4; J&middot;s).' },
        { label: 'Energy conservation at emission', marks: 1, text: 'Photon energy = Work function (minimum energy to eject electron from surface) + Kinetic energy of emitted electron:<br>$h\\nu = \\phi_0 + KE_{max}$' },
        { label: 'Final form', marks: 1, text: '$$\\boxed{KE_{max} = h\\nu - \\phi_0 = h(\\nu - \\nu_0)}$$where $\\nu_0 = \\phi_0/h$ is threshold frequency. Stopping potential $V_0$: $eV_0 = KE_{max}$. <strong>No electrons if &nu; &lt; &nu;₀</strong>, regardless of intensity.' }
      ]
    },

    {
      id: 'phys_d12', subject: 'physics', chapter: 'phys_13',
      title: 'Radioactive decay law and half-life derivation',
      marks: 3, time: 5,
      years: [2018, 2019, 2021, 2023],
      steps: [
        { label: 'Rate of decay', marks: 1, text: 'Rate of disintegration is proportional to number of undecayed nuclei N present:$$-\\frac{dN}{dt} = \\lambda N$$where &lambda; = decay constant (probability of decay per second).' },
        { label: 'Integrate to get decay law', marks: 1, text: '$$\\frac{dN}{N} = -\\lambda\\,dt \\Rightarrow \\ln N - \\ln N_0 = -\\lambda t$$$$\\boxed{N = N_0 e^{-\\lambda t}}$$' },
        { label: 'Half-life T₁/₂', marks: 1, text: 'At $t = T_{1/2}$, $N = N_0/2$:$$\\frac{N_0}{2} = N_0 e^{-\\lambda T_{1/2}} \\Rightarrow \\lambda T_{1/2} = \\ln 2$$$$\\boxed{T_{1/2} = \\frac{0.693}{\\lambda}}$$Mean life $\\tau = 1/\\lambda = T_{1/2}/0.693 \\approx 1.443\\,T_{1/2}$.' }
      ]
    },

    // ══════════════════════════════════════════
    //  CHEMISTRY
    // ══════════════════════════════════════════
    {
      id: 'chem_d1', subject: 'chemistry', chapter: 'chem_2',
      title: 'Nernst equation derivation from free energy',
      marks: 3, time: 5,
      years: [2018, 2019, 2021, 2023, 2025],
      steps: [
        { label: '&Delta;G relationships', marks: 1, text: 'For electrochemical cell: $\\Delta G = -nFE$ and $\\Delta G^\\circ = -nFE^\\circ$ where n = electrons transferred, F = 96485 C/mol.' },
        { label: 'Thermodynamic identity', marks: 1, text: 'From chemical thermodynamics: $\\Delta G = \\Delta G^\\circ + RT\\ln Q$ (Q = reaction quotient). Substitute $\\Delta G = -nFE$ and $\\Delta G^\\circ = -nFE^\\circ$:$$-nFE = -nFE^\\circ + RT\\ln Q$$' },
        { label: 'Nernst equation', marks: 1, text: 'Divide both sides by $-nF$:$$\\boxed{E = E^\\circ - \\frac{RT}{nF}\\ln Q}$$At 298 K: $RT/F = 0.02569$ V, and $\\ln = 2.303\\log$, so:$$E = E^\\circ - \\frac{0.0592}{n}\\log Q$$' }
      ]
    },

    {
      id: 'chem_d2', subject: 'chemistry', chapter: 'chem_3',
      title: 'Integrated rate law for first order reaction',
      marks: 3, time: 5,
      years: [2018, 2020, 2021, 2022, 2024, 2025],
      steps: [
        { label: 'Differential rate law', marks: 1, text: 'For A &rarr; Products, first order:$$-\\frac{d[A]}{dt} = k[A]$$' },
        { label: 'Separate variables and integrate', marks: 1, text: '$$\\frac{d[A]}{[A]} = -k\\,dt$$Integrate from [A]₀ to [A] (time 0 to t):$$\\ln[A] - \\ln[A]_0 = -kt$$$$\\boxed{\\ln\\frac{[A]_0}{[A]} = kt \\quad\\Leftrightarrow\\quad [A] = [A]_0 e^{-kt}}$$' },
        { label: 't₁/₂ for first order', marks: 1, text: 'At $t = t_{1/2}$, $[A] = [A]_0/2$:$$kt_{1/2} = \\ln 2 = 0.693$$$$\\boxed{t_{1/2} = \\frac{0.693}{k}}$$<strong>Key ISC point:</strong> t₁/₂ is <em>independent of initial concentration</em> — unique to first order reactions.' }
      ]
    },

    {
      id: 'chem_d3', subject: 'chemistry', chapter: 'chem_1',
      title: 'Elevation in boiling point &Delta;T<sub>b</sub> — formula derivation outline',
      marks: 3, time: 5,
      years: [2019, 2021, 2023],
      steps: [
        { label: "Raoult's law → vapour pressure lowering", marks: 1, text: "By Raoult's law, adding a non-volatile solute reduces vapour pressure: $\\Delta p = p^\\circ x_2$ where $x_2$ = mole fraction of solute. Lower vapour pressure means solution needs higher temperature to boil (vapour pressure must reach atmospheric)." },
        { label: 'Clausius-Clapeyron link to &Delta;T', marks: 1, text: 'Using Clausius-Clapeyron equation and approximations for dilute solutions (x₂ &approx; molality/1000):$$\\Delta T_b = \\frac{RT_b^2 M_1}{1000\\,\\Delta H_{vap}}\\times m$$where M₁ = molar mass of solvent, m = molality.' },
        { label: 'Define K<sub>b</sub> and result', marks: 1, text: '$$K_b = \\frac{RT_b^2 M_1}{1000\\,\\Delta H_{vap}}$$is the <strong>molal elevation constant (ebullioscopic constant)</strong>.$$\\boxed{\\Delta T_b = K_b \\times m}$$For electrolytes: $\\Delta T_b = i \\cdot K_b \\cdot m$ (i = van\'t Hoff factor). For water: K<sub>b</sub> = 0.52 K&middot;kg/mol.' }
      ]
    },

    // ══════════════════════════════════════════
    //  MATHS
    // ══════════════════════════════════════════
    {
      id: 'math_d1', subject: 'maths', chapter: 'math_6',
      title: 'Integration by parts — derive the formula',
      marks: 2, time: 4,
      years: [2019, 2021, 2023, 2025],
      steps: [
        { label: 'Start from product rule', marks: 1, text: 'Differentiate the product u&middot;v:$$\\frac{d(uv)}{dx} = u\\frac{dv}{dx} + v\\frac{du}{dx}$$' },
        { label: 'Integrate and rearrange', marks: 1, text: 'Integrate both sides with respect to x:$$uv = \\int u\\frac{dv}{dx}\\,dx + \\int v\\frac{du}{dx}\\,dx = \\int u\\,dv + \\int v\\,du$$Rearrange:$$\\boxed{\\int u\\,dv = uv - \\int v\\,du}$$<strong>ILATE rule for choosing u:</strong> Inverse trig &rarr; Logarithmic &rarr; Algebraic &rarr; Trigonometric &rarr; Exponential.' }
      ]
    },

    {
      id: 'math_d2', subject: 'maths', chapter: 'math_4',
      title: 'Derivative of sin<sup>&minus;1</sup>x from first principles',
      marks: 2, time: 4,
      years: [2018, 2020, 2022, 2024],
      steps: [
        { label: 'Set up the inverse relationship', marks: 1, text: 'Let $y = \\sin^{-1}x$, so $x = \\sin y$ where $y \\in [-\\pi/2,\\ \\pi/2]$.<br>Differentiate both sides with respect to x:$$1 = \\cos y\\cdot\\frac{dy}{dx}\\Rightarrow \\frac{dy}{dx} = \\frac{1}{\\cos y}$$' },
        { label: 'Express in terms of x', marks: 1, text: 'Since $y \\in [-\\pi/2,\\pi/2]$, $\\cos y \\geq 0$, so $\\cos y = \\sqrt{1-\\sin^2 y} = \\sqrt{1-x^2}$:$$\\boxed{\\frac{d}{dx}(\\sin^{-1}x) = \\frac{1}{\\sqrt{1-x^2}}}$$Similarly: $\\dfrac{d}{dx}(\\cos^{-1}x) = -\\dfrac{1}{\\sqrt{1-x^2}}$, $\\dfrac{d}{dx}(\\tan^{-1}x) = \\dfrac{1}{1+x^2}$.' }
      ]
    },

    {
      id: 'math_d3', subject: 'maths', chapter: 'math_13',
      title: "Bayes' theorem — derive from conditional probability",
      marks: 3, time: 5,
      years: [2018, 2020, 2022, 2024, 2025],
      steps: [
        { label: 'Conditional probability identity', marks: 1, text: 'For events A and B:$$P(A\\cap B) = P(A)\\cdot P(B|A) = P(B)\\cdot P(A|B)$$Rearranging the right two terms:$$P(B|A) = \\frac{P(B)\\cdot P(A|B)}{P(A)}$$' },
        { label: 'Total probability theorem', marks: 1, text: 'If $E_1, E_2, \\ldots, E_n$ are mutually exclusive and exhaustive events, then for any event A:$$P(A) = \\sum_{j=1}^{n}P(E_j)\\cdot P(A|E_j)$$' },
        { label: "Bayes' formula", marks: 1, text: 'Substitute total probability into the numerator:$$\\boxed{P(E_i|A) = \\frac{P(E_i)\\cdot P(A|E_i)}{\\displaystyle\\sum_{j=1}^{n}P(E_j)\\cdot P(A|E_j)}}$$P(E<sub>i</sub>) = <em>prior</em>, P(A|E<sub>i</sub>) = <em>likelihood</em>, P(E<sub>i</sub>|A) = <em>posterior</em>. To find most likely E<sub>i</sub> given A: compare numerators (denominator is same for all i).' }
      ]
    },

    {
      id: 'math_d4', subject: 'maths', chapter: 'math_11',
      title: 'Prove: direction cosines satisfy l&sup2; + m&sup2; + n&sup2; = 1',
      marks: 2, time: 4,
      years: [2019, 2021, 2023],
      steps: [
        { label: 'Definition of direction cosines', marks: 1, text: 'Direction cosines (l, m, n) of a line are the cosines of angles &alpha;, &beta;, &gamma; that the line makes with the positive x, y, z axes respectively. They are the components of the <strong>unit vector</strong> $\\hat{r}$ along the line: $\\hat{r} = (l,m,n) = (\\cos\\alpha,\\cos\\beta,\\cos\\gamma)$.' },
        { label: 'Proof using unit vector magnitude', marks: 1, text: 'Since $\\hat{r}$ is a unit vector: $|\\hat{r}|^2 = l^2 + m^2 + n^2 = 1$.$$\\boxed{\\cos^2\\alpha + \\cos^2\\beta + \\cos^2\\gamma = 1}$$Direction ratios a:b:c &rarr; $l = \\dfrac{a}{\\sqrt{a^2+b^2+c^2}}$, $m = \\dfrac{b}{\\sqrt{a^2+b^2+c^2}}$, $n = \\dfrac{c}{\\sqrt{a^2+b^2+c^2}}$.' }
      ]
    },

    {
      id: 'math_d5', subject: 'maths', chapter: 'math_3',
      title: 'Prove: any square matrix = symmetric + skew-symmetric parts',
      marks: 2, time: 4,
      years: [2020, 2022, 2024],
      steps: [
        { label: 'Define the two parts', marks: 1, text: 'For any square matrix A, define:$$P = \\frac{A+A^T}{2}\\quad\\text{and}\\quad Q = \\frac{A-A^T}{2}$$Note: $P + Q = A$ (the decomposition).' },
        { label: 'Prove P symmetric and Q skew-symmetric', marks: 1, text: '$P^T = \\left(\\dfrac{A+A^T}{2}\\right)^T = \\dfrac{A^T+A}{2} = P$ &rarr; P is <strong>symmetric</strong>.<br>$Q^T = \\left(\\dfrac{A-A^T}{2}\\right)^T = \\dfrac{A^T-A}{2} = -Q$ &rarr; Q is <strong>skew-symmetric</strong>.<br>$$\\boxed{A = \\underbrace{\\frac{A+A^T}{2}}_{\\text{symmetric}} + \\underbrace{\\frac{A-A^T}{2}}_{\\text{skew-symmetric}}}$$' }
      ]
    }

  ];

  console.log('[Derivations]', window.DERIVATIONS.length, 'derivations loaded across PCM');
})();
