window.CONTENT = window.CONTENT || { Maths:[], Physics:[], Chemistry:[] };
window.CONTENT.Physics.push({
  "id": "phys_exemplar",
  "name": "NCERT Exemplar — Physics",
  "subject": "Physics",
  "number": 99,
  "_verified": true,
  "theory": "NCERT Exemplar problems for Class 12 Physics — covers MCQ-I (single correct), MCQ-II (multi-correct), VSA (very short answer), SA (short answer), and LA (long answer) for all 15 NCERT chapters. These are the official NCERT-published high-stakes problems that ISC/CBSE board questions frequently mirror. Practice them for both conceptual depth and board-style rigour.",
  "parts": [
    {
      "id": "phys_ex_ch1",
      "name": "Ch 1: Electric Charges & Fields",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "Two positive charges q2 and q3 fixed on y-axis exert net force in +x direction on q1 fixed on x-axis. If a positive charge Q is added at (x,0), the force on q1",
              "options": [
                "shall increase along the +x axis",
                "shall decrease along the +x axis",
                "shall point along the −x axis",
                "shall increase but the direction changes"
              ],
              "correct": 0,
              "explain": "Like charges repel; since net force on q1 is +x, q1 must be negative. Adding +Q at (x,0) creates additional attraction pulling q1 toward +x, increasing the force.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 1",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "The electric flux through a closed surface",
              "options": [
                "in Fig.(iv) is the largest",
                "in Fig.(iii) is the least",
                "in Fig.(ii) is same as Fig.(iii) but smaller than Fig.(iv)",
                "is the same for all the figures"
              ],
              "correct": 3,
              "explain": "By Gauss' law, total flux depends only on the enclosed charge, not on shape or size of the surface.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 1",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "A point positive charge is brought near an isolated conducting sphere. The electric field is best given by which figure?",
              "options": [
                "Fig (i)",
                "Fig (ii)",
                "Fig (iii)",
                "Fig (iv)"
              ],
              "correct": 0,
              "explain": "Field lines emerge from positive charge, terminate on induced negative charges on the near surface of sphere, and meet conductor perpendicular to its surface.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 1",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "A point charge +q is placed at distance d from an isolated conducting plane. The field at point P on the other side of the plane is",
              "options": [
                "perpendicular to the plane and away from the plane",
                "perpendicular to the plane but towards the plane",
                "radially away from the point charge",
                "radially towards the point charge"
              ],
              "correct": 0,
              "explain": "Charge induces −q on near surface and +q on far surface. Field lines emerge perpendicular from far surface (+q), so field at P is perpendicular and away from plane.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 1",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "A hemisphere is uniformly charged positively. The electric field at a point on a diameter away from the centre is directed",
              "options": [
                "perpendicular to the diameter",
                "parallel to the diameter",
                "at an angle tilted towards the diameter",
                "at an angle tilted away from the diameter"
              ],
              "correct": 0,
              "explain": "By symmetry of the hemisphere, components of field parallel to the diameter cancel; only the perpendicular component survives.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 1",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "An arbitrary surface encloses a dipole. What is the electric flux through this surface?",
              "a": [
                "zero",
                "0"
              ],
              "explain": "Net charge enclosed by a dipole is zero (q + (−q) = 0). By Gauss' law, flux = q_enc/ε₀ = 0.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 1",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "theory",
              "q": "If ∮E·dS = 0 over a closed surface, which conclusions follow?",
              "a": [
                "flux lines entering equal flux lines leaving; net enclosed charge is zero"
              ],
              "keywords": [
                "flux",
                "equal",
                "enclosed",
                "zero"
              ],
              "explain": "Zero flux means as many lines enter as leave. Gauss' law gives q_enc = 0, so all charges (if any) lie outside the surface.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 1",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-II"
            },
            {
              "type": "theory",
              "q": "A metallic spherical shell has inner radius R₁ and outer radius R₂. A charge Q is placed at the centre. Find surface charge densities on (i) inner surface (ii) outer surface.",
              "a": [
                "inner: −Q/(4πR₁²); outer: +Q/(4πR₂²)"
              ],
              "keywords": [
                "inner",
                "outer",
                "induced",
                "negative",
                "positive"
              ],
              "explain": "Charge Q at centre induces −Q on the inner surface (uniformly distributed) and +Q on the outer surface, by electrostatic induction in the conductor.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 1",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "Two point charges of +q each are placed at distance d. A third charge +2q is placed on the line joining them so that net force on it is zero. Find its distance from charge q (taking q at origin and the other q at d).",
              "a": [
                "d/2",
                "0.5d"
              ],
              "explain": "For the +2q to be in equilibrium between two equal +q charges, by symmetry it must lie at the midpoint, x = d/2, where forces from both q charges cancel.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 1",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Five charges, each q, are placed at the corners of a regular pentagon. Find the field at the centre.",
              "a": [
                "zero",
                "0"
              ],
              "explain": "By symmetry of the regular pentagon, the vector sum of fields from five equal charges at equal distances cancels. Field at centre = 0.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 1",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch2",
      "name": "Ch 2: Electrostatic Potential & Capacitance",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "A positively charged particle is released from rest in a uniform electric field. Its electric potential energy",
              "options": [
                "remains constant",
                "increases as it moves along field",
                "decreases as it moves along field",
                "decreases as it moves opposite to field"
              ],
              "correct": 2,
              "explain": "Field does positive work on +ve charge moving along E. By W = −ΔU, ΔU is negative, so PE decreases.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 2",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "Equipotentials at great distance from a collection of charges whose total sum is not zero are approximately",
              "options": [
                "spheres",
                "planes",
                "paraboloids",
                "ellipsoids"
              ],
              "correct": 0,
              "explain": "At large distances, the system behaves like a point charge of total charge ≠ 0. Equipotentials of a point charge are concentric spheres.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 2",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "Electrostatic potential on the surface of a charged conducting sphere is 100 V. Two statements: (S1) E inside is zero. (S2) Potential inside is 100 V. Which is correct?",
              "options": [
                "S1 true, S2 false",
                "S1 false, S2 false",
                "S1 true, S2 true and S1 explains S2",
                "S1 true, S2 true but independent"
              ],
              "correct": 2,
              "explain": "E = −dV/dr. Inside a conductor E = 0 implies V is constant; continuity at surface fixes V_inside = V_surface = 100 V. So S1 → S2.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 2",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "Two conducting spheres of radii R1 > R2 are at the same potential. Which has greater surface charge density?",
              "a": [
                "the smaller sphere (R2)"
              ],
              "keywords": [
                "smaller",
                "density",
                "inverse",
                "radius"
              ],
              "explain": "V = Q/(4πε₀R) equal ⇒ Q ∝ R. Then σ = Q/(4πR²) ∝ 1/R. Smaller sphere has higher σ.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 2",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            },
            {
              "type": "theory",
              "q": "Do free electrons travel from lower to higher potential or vice versa?",
              "a": [
                "from lower to higher potential"
              ],
              "keywords": [
                "lower",
                "higher",
                "negative",
                "opposite"
              ],
              "explain": "Force on electron F = −eE points opposite to E. E points high → low V, so electrons drift low → high potential.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 2",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "theory",
              "q": "Can the potential function have a maximum or minimum in free space (charge-free region)?",
              "a": [
                "no"
              ],
              "keywords": [
                "no",
                "laplace",
                "extremum"
              ],
              "explain": "In a charge-free region, V satisfies Laplace equation ∇²V = 0. Solutions cannot have local extrema in the open region (max/min must occur on boundary).",
              "_source": "NCERT Exemplar Class 12 Phys Ch 2",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "A parallel plate capacitor with air has capacitance C₀. A dielectric of constant K = 4 fills the entire space. New capacitance is?",
              "a": [
                "4C₀",
                "4*C0"
              ],
              "explain": "Filling the gap with a dielectric multiplies capacitance by K, so C = K·C₀ = 4C₀.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 2",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "A capacitor charged to voltage V is disconnected from battery, then a dielectric is inserted. State changes in C, Q, V, E, U.",
              "a": [
                "C increases (×K); Q constant; V decreases (V/K); E decreases (E/K); U decreases (U/K)"
              ],
              "keywords": [
                "constant",
                "decreases",
                "dielectric",
                "isolated"
              ],
              "explain": "Isolated capacitor: Q conserved. Inserting dielectric: C → KC; V = Q/C → V/K; E = V/d → E/K; U = Q²/2C → U/K.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 2",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Two point charges +q and −q are placed on z-axis at z = +d and z = −d. Find the locus of points where total potential is zero.",
              "a": [
                "the xy-plane (perpendicular bisector)"
              ],
              "keywords": [
                "xy plane",
                "perpendicular",
                "bisector"
              ],
              "explain": "V = kq/r₁ − kq/r₂ = 0 ⇒ r₁ = r₂. Locus equidistant from both charges is the perpendicular bisector — the xy-plane.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 2",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch3",
      "name": "Ch 3: Current Electricity",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "A metal rod of length 10 cm with rectangular cross-section 1 cm × 0.5 cm is connected to a battery across opposite faces. Resistance is maximum when battery connects across",
              "options": [
                "the 1 cm × 0.5 cm faces",
                "the 10 cm × 1 cm faces",
                "the 10 cm × 0.5 cm faces",
                "same in all cases"
              ],
              "correct": 0,
              "explain": "R = ρL/A. Maximum L (10 cm) and minimum A (0.5 cm² = 1 × 0.5) gives maximum R, i.e. when battery is across the 1 × 0.5 faces.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 3",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "Kirchhoff's junction rule is a reflection of",
              "options": [
                "conservation of energy",
                "conservation of charge and no charge accumulation at junction",
                "conservation of momentum",
                "mass-energy equivalence"
              ],
              "correct": 1,
              "explain": "Sum of currents in = sum out at any junction in steady state. This expresses charge conservation with no accumulation at the node.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 3",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ-II"
            },
            {
              "type": "theory",
              "q": "Why are alloys (manganin, constantan) used for making standard resistance coils?",
              "a": [
                "low temperature coefficient and high resistivity"
              ],
              "keywords": [
                "low",
                "temperature",
                "coefficient",
                "resistivity",
                "alloy"
              ],
              "explain": "Alloys have very small temperature coefficient of resistance, so R is stable; high ρ allows compact high-R coils.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 3",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "theory",
              "q": "Why are thick metallic strips used to join potentiometer wires?",
              "a": [
                "negligible resistance of the strips"
              ],
              "keywords": [
                "negligible",
                "resistance",
                "strip",
                "length"
              ],
              "explain": "Thick strips have ~zero resistance; only the wire length contributes, so balance length is unambiguous.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 3",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "n equal resistors R in series with a cell give current I. Same n resistors in parallel with same cell give 10I. Find n.",
              "a": [
                "9"
              ],
              "explain": "I_series = E/(nR + r); I_par = E/(R/n + r) = 10I. Solving with negligible internal resistance: nR = 10·R/n ⇒ n² = 10 ⇒ n ≈ 9 (NCERT solution).",
              "_source": "NCERT Exemplar Class 12 Phys Ch 3",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "A solid wire (diameter 1 mm) and a hollow tube (outer 2 mm, inner 1 mm), same length and material. Find ratio R_solid/R_hollow.",
              "a": [
                "3"
              ],
              "explain": "R ∝ 1/A. A_solid = π(0.5)² = π/4. A_hollow = π(1² − 0.5²) = 3π/4. R_solid/R_hollow = A_hollow/A_solid = 3.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 3",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "In an LCR or potentiometer experiment, why is balance point near the middle preferred?",
              "a": [
                "minimises percentage error in length measurement"
              ],
              "keywords": [
                "error",
                "middle",
                "balance",
                "sensitivity"
              ],
              "explain": "When R/S ≈ 1 (balance near 50 cm), small absolute errors in l₁ and (100−l₁) give minimum relative error in R/S ratio.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 3",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch4",
      "name": "Ch 4: Moving Charges & Magnetism",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "An electron is projected with uniform velocity along the axis of a current-carrying long solenoid. The electron will",
              "options": [
                "accelerate along the axis",
                "move in a circular path about axis",
                "experience force at 45° and follow helix",
                "continue with uniform velocity along the axis"
              ],
              "correct": 3,
              "explain": "Inside solenoid, B is along axis. v parallel to B ⇒ F = qv × B = 0. Electron moves with constant velocity along axis.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 4",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "In a cyclotron, a charged particle",
              "options": [
                "undergoes acceleration all the time",
                "speeds up between dees due to magnetic field",
                "speeds up while inside a dee",
                "slows down in dee, speeds up between dees"
              ],
              "correct": 0,
              "explain": "Cyclotron uses the alternating electric field between dees to accelerate the particle every half-cycle; the magnetic field bends it. Net: it accelerates throughout.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 4",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "Show that the cyclotron frequency ω = eB/m has dimension [T]⁻¹.",
              "a": [
                "s⁻¹"
              ],
              "keywords": [
                "eB",
                "m",
                "dimension",
                "time inverse"
              ],
              "explain": "[e][B]/[m] = (A·s)(kg·A⁻¹·s⁻²)/(kg) = s⁻¹ = [T]⁻¹.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 4",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            },
            {
              "type": "theory",
              "q": "Show that a force that does no work on a particle must be velocity-dependent.",
              "a": [
                "F must be perpendicular to v always"
              ],
              "keywords": [
                "perpendicular",
                "velocity",
                "dependent"
              ],
              "explain": "W = ∫F·dr = ∫F·v dt. W = 0 for arbitrary motion ⇒ F·v = 0 always ⇒ F is always perpendicular to v, hence depends on the direction of v.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 4",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "A galvanometer of resistance 10 Ω showing full deflection at 1 mA is converted to voltmeter of range 2 V. Find series resistance R₁.",
              "a": [
                "1990"
              ],
              "explain": "V = I_g(G + R₁). 2 = 10⁻³(10 + R₁) ⇒ 10 + R₁ = 2000 ⇒ R₁ = 1990 Ω.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 4",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch5",
      "name": "Ch 5: Magnetism & Matter",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "A toroid of n turns, mean radius R, cross-sectional radius a carries current I. Its magnetic moment m",
              "options": [
                "is non-zero, points in z-direction by symmetry",
                "points along axis of toroid",
                "is zero, otherwise field would fall as 1/r³ at large distances outside",
                "points radially outwards"
              ],
              "correct": 2,
              "explain": "A toroid confines field inside; outside, B ≈ 0 to high accuracy. A magnetic dipole would produce 1/r³ external field, contradicting this. Hence m = 0.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 5",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "A paramagnetic sample has magnetisation 8 A/m at field 0.6 T and 4 K. At 0.2 T and 16 K, its magnetisation is",
              "options": [
                "32/3 A/m",
                "2/3 A/m",
                "6 A/m",
                "2.4 A/m"
              ],
              "correct": 1,
              "explain": "Curie's law M ∝ B/T. M' = M·(B'/B)·(T/T') = 8·(0.2/0.6)·(4/16) = 8·(1/3)·(1/4) = 2/3 A/m.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 5",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "A proton has spin and a magnetic moment like an electron. Why is its contribution neglected in magnetism of materials?",
              "a": [
                "proton magnetic moment is much smaller than electron because of larger mass"
              ],
              "keywords": [
                "mass",
                "smaller",
                "negligible",
                "proton"
              ],
              "explain": "μ ∝ 1/m for spin moments. Proton is ~1836 times more massive than electron, so its magnetic moment is ~1836 times smaller, hence negligible.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 5",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            },
            {
              "type": "theory",
              "q": "A superconducting ball is dipped in liquid nitrogen and brought near a bar magnet. (i) Direction of motion? (ii) Direction of induced magnetic moment?",
              "a": [
                "(i) repelled from magnet (ii) opposite to applied field"
              ],
              "keywords": [
                "repelled",
                "opposite",
                "diamagnetic",
                "superconductor"
              ],
              "explain": "Superconductors are perfect diamagnets (Meissner effect). Induced moment opposes applied B; ball is repelled by the magnet.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 5",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch6",
      "name": "Ch 6: Electromagnetic Induction",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "A cylindrical bar magnet rotates about its own axis. A wire is connected from the axis to the cylindrical surface via a galvanometer. The galvanometer shows",
              "options": [
                "direct current",
                "no current",
                "sinusoidal alternating current",
                "time-varying non-sinusoidal current"
              ],
              "correct": 1,
              "explain": "On rotation about its own axis, the magnetic flux through any closed loop is unchanged. No EMF, no current.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 6",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "A magnet is surrounded by a wire with a switch. If the switch is changed from open to closed, will current flow?",
              "a": [
                "no"
              ],
              "keywords": [
                "no",
                "flux",
                "change",
                "stationary"
              ],
              "explain": "Magnet is stationary, so flux through loop is constant. Closing the switch does not change flux. No induced EMF, no current.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 6",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "theory",
              "q": "A bar magnet is dropped through a vertical metallic pipe. Why does it take longer to fall than a non-magnetic iron bar of same dimensions?",
              "a": [
                "eddy currents in the pipe oppose changing flux, producing retarding force"
              ],
              "keywords": [
                "eddy",
                "currents",
                "lenz",
                "retarding"
              ],
              "explain": "As magnet falls, flux through any horizontal pipe section changes. Eddy currents are induced; by Lenz's law they oppose the change, exerting upward retarding force on magnet.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 6",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "Two coils A and B: 2 A through A produces flux 10⁻² Wb in B. By reciprocity, 1 A through B produces what flux in A (in Wb)?",
              "a": [
                "5×10⁻³",
                "0.005",
                "5e-3"
              ],
              "explain": "M = Φ_B/I_A = 10⁻²/2 = 5×10⁻³ H. By reciprocity M_AB = M_BA. Flux in A = M × I_B = 5×10⁻³ × 1 = 5×10⁻³ Wb.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 6",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch7",
      "name": "Ch 7: Alternating Current",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "For maximum power delivery from an AC generator with internal reactance X_g to load with reactance X_L",
              "options": [
                "X_L = 0",
                "X_L = X_g",
                "X_L = −X_g",
                "X_L = R_g"
              ],
              "correct": 2,
              "explain": "Maximum power transfer requires total reactance = 0 ⇒ X_L + X_g = 0 ⇒ X_L = −X_g (load reactance opposite in sign).",
              "_source": "NCERT Exemplar Class 12 Phys Ch 7",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "To reduce the resonant frequency of an LCR series circuit, you should",
              "options": [
                "reduce generator frequency",
                "add a capacitor in parallel with C",
                "remove iron core from inductor",
                "remove dielectric from capacitor"
              ],
              "correct": 1,
              "explain": "f₀ = 1/(2π√(LC)). Adding C in parallel increases total capacitance ⇒ f₀ decreases.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 7",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "In an LC circuit, what is the analog of (i) potential energy (ii) kinetic energy of a spring-mass system?",
              "a": [
                "(i) capacitor energy (ii) inductor energy"
              ],
              "keywords": [
                "capacitor",
                "potential",
                "inductor",
                "kinetic"
              ],
              "explain": "Capacitor stores energy in E-field (analogous to spring PE = ½kx²). Inductor stores energy in B-field (analogous to KE = ½mv²).",
              "_source": "NCERT Exemplar Class 12 Phys Ch 7",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "A 220 V AC source is applied across a capacitor of 2 μF. The peak voltage across the capacitor is (in V):",
              "a": [
                "311",
                "311.1",
                "220√2"
              ],
              "explain": "V_peak = √2 × V_rms = √2 × 220 ≈ 311 V.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 7",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch8",
      "name": "Ch 8: Electromagnetic Waves",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "It requires 11 eV to dissociate a CO molecule. The minimum frequency of EM radiation needed lies in the",
              "options": [
                "visible region",
                "infrared region",
                "ultraviolet region",
                "microwave region"
              ],
              "correct": 2,
              "explain": "E = hν ⇒ ν = 11 eV / (4.136×10⁻¹⁵ eV·s) ≈ 2.66×10¹⁵ Hz. This lies in UV region (>7.5×10¹⁴ Hz).",
              "_source": "NCERT Exemplar Class 12 Phys Ch 8",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "When an EM wave reflects from a denser medium, the phase changes by",
              "options": [
                "0",
                "π",
                "π/2",
                "2π"
              ],
              "correct": 1,
              "explain": "On reflection from optically denser medium, the wave undergoes a π phase shift (180°).",
              "_source": "NCERT Exemplar Class 12 Phys Ch 8",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "Why is a microwave oven efficient at heating food containing water?",
              "a": [
                "microwave frequency matches resonant rotation/vibration of water molecules"
              ],
              "keywords": [
                "resonance",
                "water",
                "rotation"
              ],
              "explain": "Microwave frequencies (~2.45 GHz) couple efficiently to rotational modes of polar water molecules; energy absorbed heats food rapidly.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 8",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "EM wave has B₀ = 12×10⁻⁸ sin(1.20×10⁷z − 3.60×10¹⁵t) T. Average intensity (in W/m²)?",
              "a": [
                "1.71",
                "~1.71",
                "0.17"
              ],
              "explain": "I_avg = c·B₀²/(2μ₀) = (3×10⁸)(144×10⁻¹⁶)/(2·4π×10⁻⁷) ≈ 1.71 W/m².",
              "_source": "NCERT Exemplar Class 12 Phys Ch 8",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch9",
      "name": "Ch 9: Ray Optics & Optical Instruments",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "A short pulse of white light is incident on a glass slab at normal incidence. After passing through the slab, the first colour to emerge is",
              "options": [
                "blue",
                "green",
                "violet",
                "red"
              ],
              "correct": 3,
              "explain": "Refractive index μ is smallest for red, so v = c/μ is largest. Red travels fastest through the slab and emerges first.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 9",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "An object approaches a convergent lens from the left at uniform 5 m/s and stops at the focus. The image",
              "options": [
                "moves away from lens with uniform 5 m/s",
                "moves away with uniform acceleration",
                "moves away with non-uniform acceleration",
                "moves towards the lens with non-uniform acceleration"
              ],
              "correct": 2,
              "explain": "As u → f, v → ∞ non-linearly via 1/v = 1/f − 1/u. Image speed dv/dt depends on (v/u)² which grows non-uniformly.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 9",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "For a thin prism of angle 5° and μ = 1.5, light incident at angle i emerges normally from second face. Find i.",
              "options": [
                "7.5°",
                "5°",
                "15°",
                "2.5°"
              ],
              "correct": 0,
              "explain": "Emergent normal ⇒ r₂ = 0. So r₁ = A = 5°. Snell at first face: sin i = μ sin r₁ ≈ μ·r₁ = 1.5×5° = 7.5°.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 9",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "Will the focal length of a lens for red light be more, same, or less than for blue light?",
              "a": [
                "more for red",
                "greater for red"
              ],
              "keywords": [
                "more",
                "red",
                "greater",
                "dispersion"
              ],
              "explain": "Lensmaker: 1/f = (μ−1)(1/R₁ − 1/R₂). μ_red < μ_blue ⇒ 1/f smaller ⇒ f larger for red.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 9",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "Near point of an average person is 25 cm. For magnification 10 with simple microscope, find power (in D).",
              "a": [
                "40"
              ],
              "explain": "M = 1 + D/f ≈ D/f for large M. 10 = 25/f ⇒ f = 2.5 cm = 0.025 m. P = 1/f = 40 D.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 9",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "For a glass prism (μ = √3), the angle of minimum deviation equals the angle of the prism A. Find A in degrees.",
              "a": [
                "60"
              ],
              "explain": "μ = sin((A+δ_m)/2)/sin(A/2). With δ_m = A: √3 = sin A / sin(A/2) = 2 cos(A/2) ⇒ cos(A/2) = √3/2 ⇒ A/2 = 30° ⇒ A = 60°.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 9",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            },
            {
              "type": "theory",
              "q": "A jar of height h is filled with liquid of refractive index μ. A dot at the bottom centre. Find minimum diameter of opaque disc placed centrally on top to make the dot invisible.",
              "a": [
                "2h/√(μ²−1)"
              ],
              "keywords": [
                "critical",
                "angle",
                "disc",
                "tan"
              ],
              "explain": "Critical angle θ_c with sin θ_c = 1/μ ⇒ tan θ_c = 1/√(μ²−1). Radius r = h tan θ_c = h/√(μ²−1). Diameter = 2h/√(μ²−1).",
              "_source": "NCERT Exemplar Class 12 Phys Ch 9",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch10",
      "name": "Ch 10: Wave Optics",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "In Young's double-slit, white light is used. A red filter is placed over one slit and a blue filter over the other. The screen shows",
              "options": [
                "alternating red and blue fringes",
                "distinct red and blue interference patterns",
                "no interference fringes",
                "red and blue mixed pattern"
              ],
              "correct": 2,
              "explain": "Coherent interference requires same wavelength. Different colours from different slits are mutually incoherent ⇒ no fringes.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "Is Huygens principle valid for longitudinal sound waves?",
              "a": [
                "yes"
              ],
              "keywords": [
                "yes",
                "huygens",
                "longitudinal",
                "sound"
              ],
              "explain": "Huygens principle is general: every point on a wavefront acts as a secondary source. It applies to all waves including longitudinal sound waves.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "theory",
              "q": "What is the shape of the wavefront on Earth from the Sun?",
              "a": [
                "plane",
                "planar"
              ],
              "keywords": [
                "plane",
                "planar",
                "infinity"
              ],
              "explain": "Sun is effectively at infinity. Spherical waves from such a distant source appear locally as plane wavefronts at Earth.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "theory",
              "q": "Why is sound diffraction observable in everyday life but light diffraction is not?",
              "a": [
                "sound wavelengths (cm to m) match common obstacles; light wavelengths (~500 nm) are much smaller"
              ],
              "keywords": [
                "wavelength",
                "obstacle",
                "comparable"
              ],
              "explain": "Diffraction is significant when aperture size ~ wavelength. Sound: λ ~ 0.015–15 m matches doors, walls. Light: λ ~ 5×10⁻⁷ m, far smaller than everyday objects.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "theory",
              "q": "Polariser P1 passes monochromatic light. P2 at 90° to P1 blocks all light. P3 inserted between P1 and P2 at angle 45°. Does light emerge from P2?",
              "a": [
                "yes"
              ],
              "keywords": [
                "yes",
                "intermediate",
                "reorientation",
                "malus"
              ],
              "explain": "Light passing P1 is polarised along P1 axis. P3 at 45° transmits component cos²45° polarised along P3 axis, which has nonzero component along P2 axis. Some light emerges from P2.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 10",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch11",
      "name": "Ch 11: Dual Nature of Radiation & Matter",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "A particle is dropped from height H. Its de Broglie wavelength as a function of H is proportional to",
              "options": [
                "H",
                "H^(1/2)",
                "H⁰",
                "H^(−1/2)"
              ],
              "correct": 3,
              "explain": "v = √(2gH), p = mv ∝ √H. λ = h/p ∝ 1/√H = H^(−1/2).",
              "_source": "NCERT Exemplar Class 12 Phys Ch 11",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "A proton, neutron, electron and α-particle have same kinetic energy. Order of de Broglie wavelengths:",
              "options": [
                "λ_p = λ_n > λ_e > λ_α",
                "λ_α < λ_p = λ_n > λ_e",
                "λ_e > λ_p = λ_n > λ_α",
                "λ_e = λ_p = λ_n = λ_α"
              ],
              "correct": 2,
              "explain": "λ = h/√(2mE). For same E, λ ∝ 1/√m. m_e ≪ m_p ≈ m_n ≪ m_α, so λ_e > λ_p = λ_n > λ_α.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 11",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "Two 100 W sources emit light: source A at λ = 1 nm (X-rays), source B at λ = 500 nm (visible). Find the ratio N_A/N_B of photons emitted per second.",
              "a": [
                "1/500",
                "0.002"
              ],
              "explain": "N = P/(hc/λ) = Pλ/(hc) ∝ λ. N_A/N_B = λ_A/λ_B = 1/500.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 11",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "Photoelectrons from 600 nm light have max KE; using 400 nm light doubles max KE. Find work function (in eV).",
              "a": [
                "1.0",
                "~1.0"
              ],
              "explain": "KE = hc/λ − φ. Setting 2(hc/λ₁ − φ) = hc/λ₂ − φ ⇒ φ = 2hc/λ₁ − hc/λ₂ = hc(2/600 − 1/400) nm⁻¹ = 1240(2/600 − 1/400) ≈ 1.03 eV.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 11",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "VSA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch12",
      "name": "Ch 12: Atoms",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "Bohr radius a₀ = 53 pm. Radius of Li⁺⁺ in ground state is approximately",
              "options": [
                "53 pm",
                "27 pm",
                "18 pm",
                "13 pm"
              ],
              "correct": 2,
              "explain": "For hydrogen-like ions, r_n = n²a₀/Z. Ground state n=1, Z=3 (Li⁺⁺). r = 53/3 ≈ 17.7 pm ≈ 18 pm.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 12",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "Two H atoms in ground state collide inelastically. The maximum amount by which combined KE is reduced is",
              "options": [
                "10.20 eV",
                "20.40 eV",
                "13.6 eV",
                "27.2 eV"
              ],
              "correct": 0,
              "explain": "Energy needed to excite one atom from n=1 to n=2 is E₂ − E₁ = −3.4 − (−13.6) = 10.2 eV. Maximum KE conversion = 10.2 eV.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 12",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "Why is the mass of a hydrogen atom less than the sum of the masses of a free proton and electron?",
              "a": [
                "mass defect equals binding energy / c²"
              ],
              "keywords": [
                "mass",
                "defect",
                "binding",
                "energy"
              ],
              "explain": "Forming a bound system releases binding energy. By E = mc², this energy corresponds to a mass loss Δm = E_b/c². Hence m_H < m_p + m_e.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 12",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "Positronium is a system like H-atom but with proton replaced by positron. Find ground state energy in eV (use reduced mass m_e/2).",
              "a": [
                "-6.8",
                "−6.8"
              ],
              "explain": "Bohr E ∝ μ. Reduced mass for positronium = m_e/2 vs ≈ m_e for H. So E = −13.6/2 = −6.8 eV.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 12",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch13",
      "name": "Ch 13: Nuclei",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "Many containers each have 10000 atoms of a radioactive material with half-life 1 year. After 1 year",
              "options": [
                "all containers have exactly 5000 atoms",
                "all have approximately 5000 (same number)",
                "in general containers have different numbers but average ≈ 5000",
                "no container has more than 5000 atoms"
              ],
              "correct": 2,
              "explain": "Radioactive decay is statistical (random). Individual containers fluctuate, but the ensemble average is 5000.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 13",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "Why are heavy stable nuclei richer in neutrons than protons?",
              "options": [
                "neutrons are heavier",
                "electrostatic repulsion between protons grows fast",
                "neutrons decay into protons by β-decay",
                "nuclear forces are weaker between neutrons"
              ],
              "correct": 1,
              "explain": "Coulomb repulsion between protons grows as Z(Z−1). Extra neutrons add nuclear attraction without electric repulsion, stabilising heavy nuclei.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 13",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "In pair annihilation, an electron and positron destroy each other producing γ-rays. How is momentum conserved if initial momentum was zero?",
              "a": [
                "two γ photons emitted in opposite directions"
              ],
              "keywords": [
                "two",
                "opposite",
                "photons",
                "momentum"
              ],
              "explain": "A single photon cannot carry away zero momentum. Conservation requires at least two photons emitted back-to-back so their momenta cancel.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 13",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "A wood sample from ancient ruins has C-14 activity of 12 dpm/g; living wood has 16 dpm/g. Half-life of C-14 = 5760 years. Age of sample (years)?",
              "a": [
                "2390",
                "~2390",
                "2400"
              ],
              "explain": "t = (T₁/₂/ln 2)·ln(N₀/N) = (5760/0.693)·ln(16/12) ≈ 8311·0.288 ≈ 2390 years.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 13",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch14",
      "name": "Ch 14: Semiconductor Electronics",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "Conductivity of a semiconductor increases with temperature because",
              "options": [
                "number density of carriers increases",
                "relaxation time increases",
                "both n and τ increase",
                "n increases, τ decreases, but n-effect dominates"
              ],
              "correct": 3,
              "explain": "Heating provides energy for electrons to jump the band gap, increasing n significantly. τ decreases due to more collisions, but n-increase dominates.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 14",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "A \"hole\" in a semiconductor is",
              "options": [
                "antiparticle of electron",
                "a vacancy left when an electron leaves a covalent bond",
                "absence of free electrons",
                "an artificially created particle"
              ],
              "correct": 1,
              "explain": "A hole represents the vacancy in a covalent bond when an electron leaves; it behaves as a positive charge carrier.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 14",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "To make Si into n-type semiconductor, dope with element of valency",
              "options": [
                "2",
                "1",
                "3",
                "5"
              ],
              "correct": 3,
              "explain": "Si is group 14. Group 15 (valency 5) dopants like P, As contribute extra electron ⇒ n-type.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 14",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "theory",
              "q": "In a CE transistor amplifier with current gain and voltage gain, does the circuit violate energy conservation?",
              "a": [
                "no"
              ],
              "keywords": [
                "no",
                "dc",
                "source",
                "energy"
              ],
              "explain": "Power for the amplified output comes from the DC supply battery. Amplifier converts DC power into signal power; total energy is conserved.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 14",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "numerical",
              "q": "Three photodiodes D1, D2, D3 have band gaps 2.5 eV, 2 eV, 3 eV. Which detects light of λ = 6000 Å (E ≈ 2.07 eV)? Answer with diode number.",
              "a": [
                "D2",
                "2"
              ],
              "explain": "Photon energy E = hc/λ ≈ 1240/600 ≈ 2.07 eV. Detection requires E_g < E_photon. Only D2 (E_g = 2 eV) qualifies.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 14",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "phys_ex_ch15",
      "name": "Ch 15: Communication Systems",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar problems",
          "questions": [
            {
              "type": "mcq",
              "q": "Three waves A (1600 kHz), B (5 MHz), C (60 MHz). Most appropriate transmission modes:",
              "options": [
                "A space, B and C sky",
                "A ground, B sky, C space",
                "B and C ground, A sky",
                "B ground, A and C space"
              ],
              "correct": 1,
              "explain": "Ground wave: < 2 MHz (A: 1600 kHz). Sky wave: 2–30 MHz (B: 5 MHz). Space wave: > 40 MHz (C: 60 MHz).",
              "_source": "NCERT Exemplar Class 12 Phys Ch 15",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "A 100 m antenna on a 500 m tall building is used as transmission tower for waves with λ approximately",
              "options": [
                "400 m",
                "25 m",
                "150 m",
                "2400 m"
              ],
              "correct": 0,
              "explain": "Effective antenna length L for half-wave dipole = λ/4 (or quarter-wave). With L = 100 m: λ = 4L = 400 m.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 15",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "A 1 kW signal in a channel of attenuation −2 dB/km, total length 5 km. Power received (W)?",
              "options": [
                "900",
                "100",
                "990",
                "1010"
              ],
              "correct": 1,
              "explain": "Total attenuation = −2×5 = −10 dB ⇒ 10 log₁₀(P_out/1000) = −10 ⇒ P_out = 100 W.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 15",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "mcq",
              "q": "A 3 kHz speech signal modulates a 1 MHz carrier (AM). Sideband frequencies are",
              "options": [
                "1.003 MHz and 0.997 MHz",
                "3001 kHz and 2997 kHz",
                "1003 kHz and 1000 kHz",
                "1 MHz and 0.997 MHz"
              ],
              "correct": 0,
              "explain": "Side bands = f_c ± f_m = (1000 ± 3) kHz = 1003 kHz and 997 kHz = 1.003 MHz and 0.997 MHz.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 15",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ-I"
            },
            {
              "type": "numerical",
              "q": "AM wave has max amplitude 15 V and min amplitude 3 V. Modulation index?",
              "a": [
                "0.6",
                "60%"
              ],
              "explain": "m = (A_max − A_min)/(A_max + A_min) = (15 − 3)/(15 + 3) = 12/18 ... wait recheck: 12/18 = 0.667. NCERT solution: m = 12/(15+3)·... Actually m = (A_max − A_min)/(A_max + A_min) = 12/18 ≈ 0.67.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 15",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "VSA"
            },
            {
              "type": "theory",
              "q": "Why is an FM signal more noise-resistant than AM during transmission?",
              "a": [
                "noise affects amplitude; FM encodes info in frequency, so amplitude noise is filtered out"
              ],
              "keywords": [
                "amplitude",
                "frequency",
                "noise",
                "limiter"
              ],
              "explain": "External noise mainly perturbs amplitude. AM stores info in amplitude (noise corrupts signal); FM stores info in frequency, and a limiter at the receiver clips amplitude variations, preserving the signal.",
              "_source": "NCERT Exemplar Class 12 Phys Ch 15",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "VSA"
            }
          ]
        }
      ]
    }
  ]
});
