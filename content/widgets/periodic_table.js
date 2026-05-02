// Periodic Table widget for ISC Class 12 Chemistry.
// Used by V61 (chem ch4 d-and-f-block, chem ch5 coordination compounds).
// Data: z, symbol, name, atomic mass (rounded), group (1-18 or 'L'/'A' for lanth/actin), period, block, electron config, common oxidation states, Pauling electronegativity.
// d-block elements have richer data because they're the syllabus focus.

(function () {
  'use strict';
  // Compact element table. Atomic masses rounded to typical ISC textbook values.
  // ox = common oxidation states (string), en = Pauling EN (or null), config = noble-gas shorthand.
  const ELEMENTS = [
    { z: 1,  sym: 'H',  name: 'Hydrogen',     mass: 1.008,  group: 1,  period: 1, block: 's', config: '1s¹',          ox: '+1, -1',         en: 2.20 },
    { z: 2,  sym: 'He', name: 'Helium',       mass: 4.003,  group: 18, period: 1, block: 's', config: '1s²',          ox: '0',               en: null },
    { z: 3,  sym: 'Li', name: 'Lithium',      mass: 6.941,  group: 1,  period: 2, block: 's', config: '[He] 2s¹',     ox: '+1',              en: 0.98 },
    { z: 4,  sym: 'Be', name: 'Beryllium',    mass: 9.012,  group: 2,  period: 2, block: 's', config: '[He] 2s²',     ox: '+2',              en: 1.57 },
    { z: 5,  sym: 'B',  name: 'Boron',        mass: 10.81,  group: 13, period: 2, block: 'p', config: '[He] 2s²2p¹',  ox: '+3',              en: 2.04 },
    { z: 6,  sym: 'C',  name: 'Carbon',       mass: 12.01,  group: 14, period: 2, block: 'p', config: '[He] 2s²2p²',  ox: '+4, +2, -4',      en: 2.55 },
    { z: 7,  sym: 'N',  name: 'Nitrogen',     mass: 14.01,  group: 15, period: 2, block: 'p', config: '[He] 2s²2p³',  ox: '+5, +3, -3',      en: 3.04 },
    { z: 8,  sym: 'O',  name: 'Oxygen',       mass: 16.00,  group: 16, period: 2, block: 'p', config: '[He] 2s²2p⁴',  ox: '-2',              en: 3.44 },
    { z: 9,  sym: 'F',  name: 'Fluorine',     mass: 19.00,  group: 17, period: 2, block: 'p', config: '[He] 2s²2p⁵',  ox: '-1',              en: 3.98 },
    { z: 10, sym: 'Ne', name: 'Neon',         mass: 20.18,  group: 18, period: 2, block: 'p', config: '[He] 2s²2p⁶',  ox: '0',               en: null },
    { z: 11, sym: 'Na', name: 'Sodium',       mass: 22.99,  group: 1,  period: 3, block: 's', config: '[Ne] 3s¹',     ox: '+1',              en: 0.93 },
    { z: 12, sym: 'Mg', name: 'Magnesium',    mass: 24.31,  group: 2,  period: 3, block: 's', config: '[Ne] 3s²',     ox: '+2',              en: 1.31 },
    { z: 13, sym: 'Al', name: 'Aluminium',    mass: 26.98,  group: 13, period: 3, block: 'p', config: '[Ne] 3s²3p¹',  ox: '+3',              en: 1.61 },
    { z: 14, sym: 'Si', name: 'Silicon',      mass: 28.09,  group: 14, period: 3, block: 'p', config: '[Ne] 3s²3p²',  ox: '+4, -4',          en: 1.90 },
    { z: 15, sym: 'P',  name: 'Phosphorus',   mass: 30.97,  group: 15, period: 3, block: 'p', config: '[Ne] 3s²3p³',  ox: '+5, +3, -3',      en: 2.19 },
    { z: 16, sym: 'S',  name: 'Sulfur',       mass: 32.07,  group: 16, period: 3, block: 'p', config: '[Ne] 3s²3p⁴',  ox: '+6, +4, -2',      en: 2.58 },
    { z: 17, sym: 'Cl', name: 'Chlorine',     mass: 35.45,  group: 17, period: 3, block: 'p', config: '[Ne] 3s²3p⁵',  ox: '+7, +5, +1, -1',  en: 3.16 },
    { z: 18, sym: 'Ar', name: 'Argon',        mass: 39.95,  group: 18, period: 3, block: 'p', config: '[Ne] 3s²3p⁶',  ox: '0',               en: null },
    { z: 19, sym: 'K',  name: 'Potassium',    mass: 39.10,  group: 1,  period: 4, block: 's', config: '[Ar] 4s¹',     ox: '+1',              en: 0.82 },
    { z: 20, sym: 'Ca', name: 'Calcium',      mass: 40.08,  group: 2,  period: 4, block: 's', config: '[Ar] 4s²',     ox: '+2',              en: 1.00 },
    // d-block period 4 (3d series) — ISC syllabus focus
    { z: 21, sym: 'Sc', name: 'Scandium',     mass: 44.96,  group: 3,  period: 4, block: 'd', config: '[Ar] 3d¹4s²',  ox: '+3',                          en: 1.36, syllabus: true, color: 'colourless', magnetic: 'diamagnetic' },
    { z: 22, sym: 'Ti', name: 'Titanium',     mass: 47.87,  group: 4,  period: 4, block: 'd', config: '[Ar] 3d²4s²',  ox: '+4, +3, +2',                  en: 1.54, syllabus: true, color: 'TiO₂ white; Ti³⁺ purple', magnetic: 'paramagnetic' },
    { z: 23, sym: 'V',  name: 'Vanadium',     mass: 50.94,  group: 5,  period: 4, block: 'd', config: '[Ar] 3d³4s²',  ox: '+5, +4, +3, +2',              en: 1.63, syllabus: true, color: 'VO²⁺ blue, V³⁺ green, V²⁺ violet', magnetic: 'paramagnetic' },
    { z: 24, sym: 'Cr', name: 'Chromium',     mass: 52.00,  group: 6,  period: 4, block: 'd', config: '[Ar] 3d⁵4s¹',  ox: '+6, +3, +2',                  en: 1.66, syllabus: true, color: 'Cr₂O₇²⁻ orange, CrO₄²⁻ yellow, Cr³⁺ green', magnetic: 'paramagnetic', note: 'Half-filled 3d⁵ extra-stable — anomalous config' },
    { z: 25, sym: 'Mn', name: 'Manganese',    mass: 54.94,  group: 7,  period: 4, block: 'd', config: '[Ar] 3d⁵4s²',  ox: '+7, +6, +4, +3, +2',          en: 1.55, syllabus: true, color: 'MnO₄⁻ purple, MnO₄²⁻ green, Mn²⁺ pink', magnetic: 'paramagnetic', note: 'Widest oxidation-state range of 3d series' },
    { z: 26, sym: 'Fe', name: 'Iron',         mass: 55.85,  group: 8,  period: 4, block: 'd', config: '[Ar] 3d⁶4s²',  ox: '+3, +2',                      en: 1.83, syllabus: true, color: 'Fe³⁺ yellow-brown, Fe²⁺ pale green', magnetic: 'paramagnetic / ferromagnetic in solid' },
    { z: 27, sym: 'Co', name: 'Cobalt',       mass: 58.93,  group: 9,  period: 4, block: 'd', config: '[Ar] 3d⁷4s²',  ox: '+3, +2',                      en: 1.88, syllabus: true, color: 'Co²⁺ pink, Co³⁺ blue', magnetic: 'paramagnetic' },
    { z: 28, sym: 'Ni', name: 'Nickel',       mass: 58.69,  group: 10, period: 4, block: 'd', config: '[Ar] 3d⁸4s²',  ox: '+2',                          en: 1.91, syllabus: true, color: 'Ni²⁺ green', magnetic: 'paramagnetic / ferromagnetic in solid' },
    { z: 29, sym: 'Cu', name: 'Copper',       mass: 63.55,  group: 11, period: 4, block: 'd', config: '[Ar] 3d¹⁰4s¹', ox: '+2, +1',                      en: 1.90, syllabus: true, color: 'Cu²⁺ blue, Cu⁺ colourless', magnetic: 'paramagnetic (Cu²⁺)', note: 'Fully-filled 3d¹⁰ extra-stable — anomalous config' },
    { z: 30, sym: 'Zn', name: 'Zinc',         mass: 65.38,  group: 12, period: 4, block: 'd', config: '[Ar] 3d¹⁰4s²', ox: '+2',                          en: 1.65, syllabus: true, color: 'colourless', magnetic: 'diamagnetic', note: 'Filled 3d ⇒ strictly speaking not a transition element' },
    { z: 31, sym: 'Ga', name: 'Gallium',      mass: 69.72,  group: 13, period: 4, block: 'p', config: '[Ar] 3d¹⁰4s²4p¹', ox: '+3',           en: 1.81 },
    { z: 32, sym: 'Ge', name: 'Germanium',    mass: 72.63,  group: 14, period: 4, block: 'p', config: '[Ar] 3d¹⁰4s²4p²', ox: '+4, +2',       en: 2.01 },
    { z: 33, sym: 'As', name: 'Arsenic',      mass: 74.92,  group: 15, period: 4, block: 'p', config: '[Ar] 3d¹⁰4s²4p³', ox: '+5, +3, -3',   en: 2.18 },
    { z: 34, sym: 'Se', name: 'Selenium',     mass: 78.96,  group: 16, period: 4, block: 'p', config: '[Ar] 3d¹⁰4s²4p⁴', ox: '+6, +4, -2',   en: 2.55 },
    { z: 35, sym: 'Br', name: 'Bromine',      mass: 79.90,  group: 17, period: 4, block: 'p', config: '[Ar] 3d¹⁰4s²4p⁵', ox: '+5, +1, -1',   en: 2.96 },
    { z: 36, sym: 'Kr', name: 'Krypton',      mass: 83.80,  group: 18, period: 4, block: 'p', config: '[Ar] 3d¹⁰4s²4p⁶', ox: '0',            en: 3.00 },
    { z: 37, sym: 'Rb', name: 'Rubidium',     mass: 85.47,  group: 1,  period: 5, block: 's', config: '[Kr] 5s¹',        ox: '+1',           en: 0.82 },
    { z: 38, sym: 'Sr', name: 'Strontium',    mass: 87.62,  group: 2,  period: 5, block: 's', config: '[Kr] 5s²',        ox: '+2',           en: 0.95 },
    // d-block period 5 (4d series)
    { z: 39, sym: 'Y',  name: 'Yttrium',      mass: 88.91,  group: 3,  period: 5, block: 'd', config: '[Kr] 4d¹5s²',     ox: '+3',           en: 1.22 },
    { z: 40, sym: 'Zr', name: 'Zirconium',    mass: 91.22,  group: 4,  period: 5, block: 'd', config: '[Kr] 4d²5s²',     ox: '+4',           en: 1.33 },
    { z: 41, sym: 'Nb', name: 'Niobium',      mass: 92.91,  group: 5,  period: 5, block: 'd', config: '[Kr] 4d⁴5s¹',     ox: '+5',           en: 1.6  },
    { z: 42, sym: 'Mo', name: 'Molybdenum',   mass: 95.96,  group: 6,  period: 5, block: 'd', config: '[Kr] 4d⁵5s¹',     ox: '+6',           en: 2.16 },
    { z: 43, sym: 'Tc', name: 'Technetium',   mass: 98,     group: 7,  period: 5, block: 'd', config: '[Kr] 4d⁵5s²',     ox: '+7',           en: 1.9 },
    { z: 44, sym: 'Ru', name: 'Ruthenium',    mass: 101.07, group: 8,  period: 5, block: 'd', config: '[Kr] 4d⁷5s¹',     ox: '+3, +4',       en: 2.2 },
    { z: 45, sym: 'Rh', name: 'Rhodium',      mass: 102.91, group: 9,  period: 5, block: 'd', config: '[Kr] 4d⁸5s¹',     ox: '+3',           en: 2.28 },
    { z: 46, sym: 'Pd', name: 'Palladium',    mass: 106.42, group: 10, period: 5, block: 'd', config: '[Kr] 4d¹⁰',       ox: '+2, +4',       en: 2.20 },
    { z: 47, sym: 'Ag', name: 'Silver',       mass: 107.87, group: 11, period: 5, block: 'd', config: '[Kr] 4d¹⁰5s¹',    ox: '+1',           en: 1.93 },
    { z: 48, sym: 'Cd', name: 'Cadmium',      mass: 112.41, group: 12, period: 5, block: 'd', config: '[Kr] 4d¹⁰5s²',    ox: '+2',           en: 1.69 },
    { z: 49, sym: 'In', name: 'Indium',       mass: 114.82, group: 13, period: 5, block: 'p', config: '[Kr] 4d¹⁰5s²5p¹', ox: '+3',           en: 1.78 },
    { z: 50, sym: 'Sn', name: 'Tin',          mass: 118.71, group: 14, period: 5, block: 'p', config: '[Kr] 4d¹⁰5s²5p²', ox: '+4, +2',       en: 1.96 },
    { z: 51, sym: 'Sb', name: 'Antimony',     mass: 121.76, group: 15, period: 5, block: 'p', config: '[Kr] 4d¹⁰5s²5p³', ox: '+5, +3, -3',   en: 2.05 },
    { z: 52, sym: 'Te', name: 'Tellurium',    mass: 127.60, group: 16, period: 5, block: 'p', config: '[Kr] 4d¹⁰5s²5p⁴', ox: '+6, +4, -2',   en: 2.10 },
    { z: 53, sym: 'I',  name: 'Iodine',       mass: 126.90, group: 17, period: 5, block: 'p', config: '[Kr] 4d¹⁰5s²5p⁵', ox: '+5, +1, -1',   en: 2.66 },
    { z: 54, sym: 'Xe', name: 'Xenon',        mass: 131.29, group: 18, period: 5, block: 'p', config: '[Kr] 4d¹⁰5s²5p⁶', ox: '+6, +4, +2',   en: 2.60 },
    { z: 55, sym: 'Cs', name: 'Caesium',      mass: 132.91, group: 1,  period: 6, block: 's', config: '[Xe] 6s¹',        ox: '+1',           en: 0.79 },
    { z: 56, sym: 'Ba', name: 'Barium',       mass: 137.33, group: 2,  period: 6, block: 's', config: '[Xe] 6s²',        ox: '+2',           en: 0.89 },
    // f-block: lanthanides
    { z: 57, sym: 'La', name: 'Lanthanum',    mass: 138.91, group: 'L', period: 6, block: 'd', config: '[Xe] 5d¹6s²',           ox: '+3',           en: 1.10 },
    { z: 58, sym: 'Ce', name: 'Cerium',       mass: 140.12, group: 'L', period: 6, block: 'f', config: '[Xe] 4f¹5d¹6s²',        ox: '+3, +4',       en: 1.12, syllabus: true },
    { z: 59, sym: 'Pr', name: 'Praseodymium', mass: 140.91, group: 'L', period: 6, block: 'f', config: '[Xe] 4f³6s²',           ox: '+3, +4',       en: 1.13 },
    { z: 60, sym: 'Nd', name: 'Neodymium',    mass: 144.24, group: 'L', period: 6, block: 'f', config: '[Xe] 4f⁴6s²',           ox: '+3',           en: 1.14 },
    { z: 61, sym: 'Pm', name: 'Promethium',   mass: 145,    group: 'L', period: 6, block: 'f', config: '[Xe] 4f⁵6s²',           ox: '+3',           en: 1.13 },
    { z: 62, sym: 'Sm', name: 'Samarium',     mass: 150.36, group: 'L', period: 6, block: 'f', config: '[Xe] 4f⁶6s²',           ox: '+3, +2',       en: 1.17 },
    { z: 63, sym: 'Eu', name: 'Europium',     mass: 151.96, group: 'L', period: 6, block: 'f', config: '[Xe] 4f⁷6s²',           ox: '+3, +2',       en: 1.20 },
    { z: 64, sym: 'Gd', name: 'Gadolinium',   mass: 157.25, group: 'L', period: 6, block: 'f', config: '[Xe] 4f⁷5d¹6s²',        ox: '+3',           en: 1.20 },
    { z: 65, sym: 'Tb', name: 'Terbium',      mass: 158.93, group: 'L', period: 6, block: 'f', config: '[Xe] 4f⁹6s²',           ox: '+3, +4',       en: 1.20 },
    { z: 66, sym: 'Dy', name: 'Dysprosium',   mass: 162.50, group: 'L', period: 6, block: 'f', config: '[Xe] 4f¹⁰6s²',          ox: '+3',           en: 1.22 },
    { z: 67, sym: 'Ho', name: 'Holmium',      mass: 164.93, group: 'L', period: 6, block: 'f', config: '[Xe] 4f¹¹6s²',          ox: '+3',           en: 1.23 },
    { z: 68, sym: 'Er', name: 'Erbium',       mass: 167.26, group: 'L', period: 6, block: 'f', config: '[Xe] 4f¹²6s²',          ox: '+3',           en: 1.24 },
    { z: 69, sym: 'Tm', name: 'Thulium',      mass: 168.93, group: 'L', period: 6, block: 'f', config: '[Xe] 4f¹³6s²',          ox: '+3, +2',       en: 1.25 },
    { z: 70, sym: 'Yb', name: 'Ytterbium',    mass: 173.05, group: 'L', period: 6, block: 'f', config: '[Xe] 4f¹⁴6s²',          ox: '+3, +2',       en: 1.10 },
    { z: 71, sym: 'Lu', name: 'Lutetium',     mass: 174.97, group: 'L', period: 6, block: 'd', config: '[Xe] 4f¹⁴5d¹6s²',       ox: '+3',           en: 1.27 },
    // d-block period 6 (5d series)
    { z: 72, sym: 'Hf', name: 'Hafnium',      mass: 178.49, group: 4,  period: 6, block: 'd', config: '[Xe] 4f¹⁴5d²6s²',       ox: '+4',           en: 1.3 },
    { z: 73, sym: 'Ta', name: 'Tantalum',     mass: 180.95, group: 5,  period: 6, block: 'd', config: '[Xe] 4f¹⁴5d³6s²',       ox: '+5',           en: 1.5 },
    { z: 74, sym: 'W',  name: 'Tungsten',     mass: 183.84, group: 6,  period: 6, block: 'd', config: '[Xe] 4f¹⁴5d⁴6s²',       ox: '+6',           en: 2.36 },
    { z: 75, sym: 'Re', name: 'Rhenium',      mass: 186.21, group: 7,  period: 6, block: 'd', config: '[Xe] 4f¹⁴5d⁵6s²',       ox: '+7',           en: 1.9 },
    { z: 76, sym: 'Os', name: 'Osmium',       mass: 190.23, group: 8,  period: 6, block: 'd', config: '[Xe] 4f¹⁴5d⁶6s²',       ox: '+4, +6, +8',   en: 2.2 },
    { z: 77, sym: 'Ir', name: 'Iridium',      mass: 192.22, group: 9,  period: 6, block: 'd', config: '[Xe] 4f¹⁴5d⁷6s²',       ox: '+3, +4',       en: 2.20 },
    { z: 78, sym: 'Pt', name: 'Platinum',     mass: 195.08, group: 10, period: 6, block: 'd', config: '[Xe] 4f¹⁴5d⁹6s¹',       ox: '+2, +4',       en: 2.28 },
    { z: 79, sym: 'Au', name: 'Gold',         mass: 196.97, group: 11, period: 6, block: 'd', config: '[Xe] 4f¹⁴5d¹⁰6s¹',      ox: '+3, +1',       en: 2.54 },
    { z: 80, sym: 'Hg', name: 'Mercury',      mass: 200.59, group: 12, period: 6, block: 'd', config: '[Xe] 4f¹⁴5d¹⁰6s²',      ox: '+2, +1',       en: 2.00 },
    { z: 81, sym: 'Tl', name: 'Thallium',     mass: 204.38, group: 13, period: 6, block: 'p', config: '[Xe] 4f¹⁴5d¹⁰6s²6p¹',   ox: '+3, +1',       en: 1.62 },
    { z: 82, sym: 'Pb', name: 'Lead',         mass: 207.2,  group: 14, period: 6, block: 'p', config: '[Xe] 4f¹⁴5d¹⁰6s²6p²',   ox: '+4, +2',       en: 2.33 },
    { z: 83, sym: 'Bi', name: 'Bismuth',      mass: 208.98, group: 15, period: 6, block: 'p', config: '[Xe] 4f¹⁴5d¹⁰6s²6p³',   ox: '+5, +3',       en: 2.02 },
    { z: 84, sym: 'Po', name: 'Polonium',     mass: 209,    group: 16, period: 6, block: 'p', config: '[Xe] 4f¹⁴5d¹⁰6s²6p⁴',   ox: '+4, +2, -2',   en: 2.0 },
    { z: 85, sym: 'At', name: 'Astatine',     mass: 210,    group: 17, period: 6, block: 'p', config: '[Xe] 4f¹⁴5d¹⁰6s²6p⁵',   ox: '+5, +1, -1',   en: 2.2 },
    { z: 86, sym: 'Rn', name: 'Radon',        mass: 222,    group: 18, period: 6, block: 'p', config: '[Xe] 4f¹⁴5d¹⁰6s²6p⁶',   ox: '0',            en: 2.2 },
    { z: 87, sym: 'Fr', name: 'Francium',     mass: 223,    group: 1,  period: 7, block: 's', config: '[Rn] 7s¹',              ox: '+1',           en: 0.7 },
    { z: 88, sym: 'Ra', name: 'Radium',       mass: 226,    group: 2,  period: 7, block: 's', config: '[Rn] 7s²',              ox: '+2',           en: 0.9 },
    // Actinides
    { z: 89, sym: 'Ac', name: 'Actinium',     mass: 227,    group: 'A', period: 7, block: 'd', config: '[Rn] 6d¹7s²',                  ox: '+3',           en: 1.1 },
    { z: 90, sym: 'Th', name: 'Thorium',      mass: 232.04, group: 'A', period: 7, block: 'f', config: '[Rn] 6d²7s²',                  ox: '+4',           en: 1.3 },
    { z: 91, sym: 'Pa', name: 'Protactinium', mass: 231.04, group: 'A', period: 7, block: 'f', config: '[Rn] 5f²6d¹7s²',               ox: '+5, +4',       en: 1.5 },
    { z: 92, sym: 'U',  name: 'Uranium',      mass: 238.03, group: 'A', period: 7, block: 'f', config: '[Rn] 5f³6d¹7s²',               ox: '+6, +5, +4, +3', en: 1.38, syllabus: true },
    { z: 93, sym: 'Np', name: 'Neptunium',    mass: 237,    group: 'A', period: 7, block: 'f', config: '[Rn] 5f⁴6d¹7s²',               ox: '+5, +4, +3, +6, +7', en: 1.36 },
    { z: 94, sym: 'Pu', name: 'Plutonium',    mass: 244,    group: 'A', period: 7, block: 'f', config: '[Rn] 5f⁶7s²',                  ox: '+4, +3, +5, +6', en: 1.28 },
    { z: 95, sym: 'Am', name: 'Americium',    mass: 243,    group: 'A', period: 7, block: 'f', config: '[Rn] 5f⁷7s²',                  ox: '+3, +4, +5, +6', en: 1.3 },
    { z: 96, sym: 'Cm', name: 'Curium',       mass: 247,    group: 'A', period: 7, block: 'f', config: '[Rn] 5f⁷6d¹7s²',               ox: '+3',           en: 1.3 },
    { z: 97, sym: 'Bk', name: 'Berkelium',    mass: 247,    group: 'A', period: 7, block: 'f', config: '[Rn] 5f⁹7s²',                  ox: '+3, +4',       en: 1.3 },
    { z: 98, sym: 'Cf', name: 'Californium',  mass: 251,    group: 'A', period: 7, block: 'f', config: '[Rn] 5f¹⁰7s²',                 ox: '+3',           en: 1.3 },
    { z: 99, sym: 'Es', name: 'Einsteinium',  mass: 252,    group: 'A', period: 7, block: 'f', config: '[Rn] 5f¹¹7s²',                 ox: '+3',           en: 1.3 },
    { z: 100,sym: 'Fm', name: 'Fermium',      mass: 257,    group: 'A', period: 7, block: 'f', config: '[Rn] 5f¹²7s²',                 ox: '+3',           en: 1.3 },
    { z: 101,sym: 'Md', name: 'Mendelevium',  mass: 258,    group: 'A', period: 7, block: 'f', config: '[Rn] 5f¹³7s²',                 ox: '+3',           en: 1.3 },
    { z: 102,sym: 'No', name: 'Nobelium',     mass: 259,    group: 'A', period: 7, block: 'f', config: '[Rn] 5f¹⁴7s²',                 ox: '+2, +3',       en: 1.3 },
    { z: 103,sym: 'Lr', name: 'Lawrencium',   mass: 262,    group: 'A', period: 7, block: 'd', config: '[Rn] 5f¹⁴7s²7p¹',              ox: '+3',           en: 1.3 },
    // Period 7 d-block (6d series)
    { z: 104,sym: 'Rf', name: 'Rutherfordium',mass: 267,    group: 4,  period: 7, block: 'd', config: '[Rn] 5f¹⁴6d²7s²',  ox: '+4', en: null },
    { z: 105,sym: 'Db', name: 'Dubnium',      mass: 268,    group: 5,  period: 7, block: 'd', config: '[Rn] 5f¹⁴6d³7s²',  ox: '+5', en: null },
    { z: 106,sym: 'Sg', name: 'Seaborgium',   mass: 269,    group: 6,  period: 7, block: 'd', config: '[Rn] 5f¹⁴6d⁴7s²',  ox: '+6', en: null },
    { z: 107,sym: 'Bh', name: 'Bohrium',      mass: 270,    group: 7,  period: 7, block: 'd', config: '[Rn] 5f¹⁴6d⁵7s²',  ox: '+7', en: null },
    { z: 108,sym: 'Hs', name: 'Hassium',      mass: 277,    group: 8,  period: 7, block: 'd', config: '[Rn] 5f¹⁴6d⁶7s²',  ox: '+8', en: null },
    { z: 109,sym: 'Mt', name: 'Meitnerium',   mass: 278,    group: 9,  period: 7, block: 'd', config: '[Rn] 5f¹⁴6d⁷7s²',  ox: '?',  en: null },
    { z: 110,sym: 'Ds', name: 'Darmstadtium', mass: 281,    group: 10, period: 7, block: 'd', config: '[Rn] 5f¹⁴6d⁸7s²',  ox: '?',  en: null },
    { z: 111,sym: 'Rg', name: 'Roentgenium',  mass: 282,    group: 11, period: 7, block: 'd', config: '[Rn] 5f¹⁴6d⁹7s²',  ox: '?',  en: null },
    { z: 112,sym: 'Cn', name: 'Copernicium',  mass: 285,    group: 12, period: 7, block: 'd', config: '[Rn] 5f¹⁴6d¹⁰7s²', ox: '+2', en: null },
    { z: 113,sym: 'Nh', name: 'Nihonium',     mass: 286,    group: 13, period: 7, block: 'p', config: '[Rn] 5f¹⁴6d¹⁰7s²7p¹', ox: '?', en: null },
    { z: 114,sym: 'Fl', name: 'Flerovium',    mass: 289,    group: 14, period: 7, block: 'p', config: '[Rn] 5f¹⁴6d¹⁰7s²7p²', ox: '?', en: null },
    { z: 115,sym: 'Mc', name: 'Moscovium',    mass: 290,    group: 15, period: 7, block: 'p', config: '[Rn] 5f¹⁴6d¹⁰7s²7p³', ox: '?', en: null },
    { z: 116,sym: 'Lv', name: 'Livermorium',  mass: 293,    group: 16, period: 7, block: 'p', config: '[Rn] 5f¹⁴6d¹⁰7s²7p⁴', ox: '?', en: null },
    { z: 117,sym: 'Ts', name: 'Tennessine',   mass: 294,    group: 17, period: 7, block: 'p', config: '[Rn] 5f¹⁴6d¹⁰7s²7p⁵', ox: '?', en: null },
    { z: 118,sym: 'Og', name: 'Oganesson',    mass: 294,    group: 18, period: 7, block: 'p', config: '[Rn] 5f¹⁴6d¹⁰7s²7p⁶', ox: '?', en: null },
  ];

  const BLOCK_COLORS = {
    s: '#fde68a',  // amber-200
    p: '#bfdbfe',  // blue-200
    d: '#fed7aa',  // orange-200
    f: '#e9d5ff',  // purple-200
  };

  // Map z → element for fast lookup
  const BY_Z = Object.fromEntries(ELEMENTS.map(e => [e.z, e]));

  function el(tag, props, children) {
    const e = document.createElement(tag);
    if (props) for (const k in props) {
      if (k === 'style') Object.assign(e.style, props[k]);
      else if (k === 'className') e.className = props[k];
      else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), props[k]);
      else e.setAttribute(k, props[k]);
    }
    if (children) {
      for (const c of children) {
        if (c == null) continue;
        e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      }
    }
    return e;
  }

  function gridCol(elem) {
    if (elem.group === 'L' || elem.group === 'A') {
      return elem.z - (elem.group === 'L' ? 56 : 88) + 3;
    }
    return elem.group;
  }
  function gridRow(elem) {
    if (elem.group === 'L') return 9; // row below main table
    if (elem.group === 'A') return 10;
    return elem.period;
  }

  function elementCell(elem, onClick) {
    const cell = el('div', {
      className: 'pt-cell',
      style: {
        gridColumn: String(gridCol(elem)),
        gridRow: String(gridRow(elem)),
        background: BLOCK_COLORS[elem.block] || '#e5e7eb',
        border: elem.syllabus ? '2px solid #b91c1c' : '1px solid #6b7280',
        padding: '2px 3px',
        cursor: 'pointer',
        fontSize: '10px',
        textAlign: 'center',
        lineHeight: '1.05',
        color: '#1f2937',
        userSelect: 'none',
        minHeight: '38px',
      },
      onclick: () => onClick(elem),
    }, [
      el('div', { style: { fontSize: '8px', opacity: '0.7' } }, [String(elem.z)]),
      el('div', { style: { fontSize: '13px', fontWeight: '700' } }, [elem.sym]),
      el('div', { style: { fontSize: '8px' } }, [elem.mass.toString().slice(0, 5)]),
    ]);
    return cell;
  }

  function detailPanel(elem) {
    if (!elem) return el('div', { style: { padding: '14px', color: '#6b7280' } }, ['Click an element to see details.']);
    const rows = [
      ['Atomic number',     String(elem.z)],
      ['Atomic mass',       String(elem.mass)],
      ['Block / Period / Group', `${elem.block.toUpperCase()}-block · Period ${elem.period} · Group ${elem.group}`],
      ['Electron config',   elem.config || '—'],
      ['Oxidation states',  elem.ox || '—'],
      ['Electronegativity (Pauling)', elem.en != null ? String(elem.en) : '—'],
    ];
    if (elem.color)    rows.push(['Aqueous-ion / oxide colour', elem.color]);
    if (elem.magnetic) rows.push(['Magnetic behaviour', elem.magnetic]);
    if (elem.note)     rows.push(['Note', elem.note]);
    if (elem.syllabus) rows.push(['ISC syllabus', 'Yes — emphasized in d/f-block chapter']);

    return el('div', {
      style: { padding: '12px 14px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px' },
    }, [
      el('div', { style: { fontSize: '20px', fontWeight: '800', marginBottom: '4px', color: '#111827' } },
        [`${elem.sym} — ${elem.name}`]),
      el('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#1f2937' } },
        rows.map(([k, v]) => el('tr', null, [
          el('td', { style: { padding: '4px 6px', fontWeight: '600', color: '#374151', verticalAlign: 'top', width: '40%' } }, [k]),
          el('td', { style: { padding: '4px 6px', color: '#1f2937' } }, [v]),
        ]))
      ),
    ]);
  }

  function renderPeriodicTable(target) {
    target.innerHTML = '';
    const wrap = el('div', { style: { padding: '14px', background: '#f9fafb', borderRadius: '8px' } });

    const title = el('div', {
      style: { fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#111827' },
    }, ['Periodic Table — ISC Class 12 reference']);
    const legend = el('div', {
      style: { display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '11px', marginBottom: '10px', color: '#374151' },
    }, [
      el('span', null, ['Blocks:']),
      ...Object.entries(BLOCK_COLORS).map(([b, c]) =>
        el('span', { style: { padding: '2px 6px', background: c, borderRadius: '3px', border: '1px solid #6b7280' } },
          [`${b}-block`])),
      el('span', { style: { color: '#b91c1c' } }, ['🔴 red border = ISC 3d-series syllabus focus']),
    ]);

    const grid = el('div', {
      className: 'pt-grid',
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(18, minmax(36px, 1fr))',
        gridTemplateRows: 'repeat(10, auto)',
        gap: '2px',
        marginBottom: '10px',
      },
    });

    const detail = el('div', { style: { marginTop: '8px' } });
    let current = null;
    const onPick = (elem) => {
      current = elem;
      detail.innerHTML = '';
      detail.appendChild(detailPanel(elem));
    };
    detail.appendChild(detailPanel(null));

    for (const e of ELEMENTS) grid.appendChild(elementCell(e, onPick));

    // Add row labels for f-block
    const lanLabel = el('div', {
      style: {
        gridColumn: '1 / 3', gridRow: '9', display: 'flex',
        alignItems: 'center', justifyContent: 'flex-end',
        fontSize: '10px', color: '#6b7280', paddingRight: '4px', fontStyle: 'italic',
      },
    }, ['Lanthanides →']);
    const actLabel = el('div', {
      style: {
        gridColumn: '1 / 3', gridRow: '10', display: 'flex',
        alignItems: 'center', justifyContent: 'flex-end',
        fontSize: '10px', color: '#6b7280', paddingRight: '4px', fontStyle: 'italic',
      },
    }, ['Actinides →']);
    grid.appendChild(lanLabel);
    grid.appendChild(actLabel);

    wrap.appendChild(title);
    wrap.appendChild(legend);
    wrap.appendChild(grid);
    wrap.appendChild(detail);
    target.appendChild(wrap);
  }

  window.PERIODIC_TABLE = { ELEMENTS, BY_Z, render: renderPeriodicTable };
  if (typeof console !== 'undefined') console.log(`[PT] ${ELEMENTS.length} elements loaded`);
})();
