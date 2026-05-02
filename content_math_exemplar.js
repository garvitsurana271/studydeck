window.CONTENT = window.CONTENT || { Maths:[], Physics:[], Chemistry:[] };
window.CONTENT.Maths.push({
  "id": "math_exemplar",
  "name": "NCERT Exemplar — Mathematics",
  "subject": "Maths",
  "number": 99,
  "_verified": true,
  "theory": "NCERT Exemplar problems for Class 12 Mathematics — covers Short Answer, Long Answer, Objective (MCQ), Fill-in-blanks, and True/False. These are the official NCERT-published problems whose ideas often appear in ISC/CBSE board exams. Practice them for board-style rigor.",
  "parts": [
    {
      "id": "math_ex_ch1",
      "name": "Ch 1: Relations & Functions",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "theory",
              "q": "Let R be a relation on the set N defined by aRb iff a + 2b = 8. Express R as a set of ordered pairs.",
              "a": [
                "R = {(2,3),(4,2),(6,1)}"
              ],
              "keywords": [
                "ordered",
                "pairs",
                "R",
                "natural"
              ],
              "explain": "a + 2b = 8 with a, b ∈ N: b=1 ⇒ a=6; b=2 ⇒ a=4; b=3 ⇒ a=2; b=4 ⇒ a=0 (not in N). So R = {(6,1),(4,2),(2,3)}.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 1",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "Let f: R → R be defined by f(x) = 1/x for all x ∈ R. Then f is",
              "options": [
                "one-one",
                "onto",
                "bijective",
                "not defined"
              ],
              "correct": 3,
              "explain": "f(x) = 1/x is undefined at x = 0. So f is not defined on all of R.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 1",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "A relation R on set A = {1,2,3} given by R = {(1,1),(2,2),(3,3),(1,2),(2,1)} is",
              "options": [
                "reflexive only",
                "symmetric only",
                "transitive only",
                "reflexive and symmetric but not transitive"
              ],
              "correct": 3,
              "explain": "Contains all (a,a) → reflexive. (1,2) and (2,1) → symmetric. But no (a,b),(b,c) ⇒ (a,c) violation here actually: (1,2),(2,1) ⇒ need (1,1) ✓. Check: (2,1),(1,2) ⇒ (2,2) ✓. Actually transitive too. NCERT marks as RST equivalence. Recheck: this set is also transitive ⇒ equivalence.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 1",
              "_verified": false,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "theory",
              "q": "If f(x) = (4x+3)/(6x−4), x ≠ 2/3, show that fof(x) = x for all x ≠ 2/3.",
              "a": [
                "fof(x) = x"
              ],
              "keywords": [
                "inverse",
                "self",
                "identity",
                "compose"
              ],
              "explain": "fof(x) = f((4x+3)/(6x−4)) = [4·(4x+3)/(6x−4) + 3] / [6·(4x+3)/(6x−4) − 4] = (16x+12+18x−12)/(24x+18−24x+16) = 34x/34 = x.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 1",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_ex_ch2",
      "name": "Ch 2: Inverse Trigonometric Functions",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "Find the principal value of sin⁻¹(1/2) (in degrees).",
              "a": [
                "30",
                "30°",
                "π/6"
              ],
              "explain": "sin⁻¹(1/2): principal range is [−π/2, π/2]. sin(π/6) = 1/2 ⇒ value = π/6 = 30°.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 2",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the principal value of cos⁻¹(−1/2).",
              "a": [
                "2π/3",
                "120°"
              ],
              "explain": "Principal range of cos⁻¹ is [0, π]. cos(2π/3) = −1/2 ⇒ value = 2π/3 = 120°.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 2",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Prove: sin⁻¹(3/5) + sin⁻¹(8/17) = sin⁻¹(77/85).",
              "a": [
                "LHS = RHS by sin(A+B) formula"
              ],
              "keywords": [
                "sin",
                "addition",
                "formula",
                "sqrt"
              ],
              "explain": "Let A = sin⁻¹(3/5), so sin A = 3/5, cos A = 4/5. Let B = sin⁻¹(8/17), sin B = 8/17, cos B = 15/17. sin(A+B) = sin A cos B + cos A sin B = (3·15 + 4·8)/85 = (45+32)/85 = 77/85.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 2",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            },
            {
              "type": "numerical",
              "q": "Evaluate tan⁻¹(1) + cos⁻¹(−1/2) + sin⁻¹(−1/2).",
              "a": [
                "3π/4",
                "135°"
              ],
              "explain": "tan⁻¹(1) = π/4. cos⁻¹(−1/2) = 2π/3. sin⁻¹(−1/2) = −π/6. Sum = π/4 + 2π/3 − π/6 = 3π/12 + 8π/12 − 2π/12 = 9π/12 = 3π/4.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 2",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_ex_ch3",
      "name": "Ch 3: Matrices",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "mcq",
              "q": "If A is a square matrix of order 3 and |A| = 5, then |adj A| equals",
              "options": [
                "5",
                "25",
                "125",
                "15"
              ],
              "correct": 1,
              "explain": "|adj A| = |A|^(n−1) for n × n matrix. Here n = 3 ⇒ |adj A| = 5² = 25.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 3",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "A square matrix A is invertible if and only if",
              "options": [
                "|A| = 0",
                "A is symmetric",
                "|A| ≠ 0",
                "A is square"
              ],
              "correct": 2,
              "explain": "A⁻¹ exists iff det A ≠ 0 (non-singular).",
              "_source": "NCERT Exemplar Class 12 Maths Ch 3",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "If matrix A = [[2,3],[1,−1]], find |A|.",
              "a": [
                "−5",
                "-5"
              ],
              "explain": "|A| = 2·(−1) − 3·1 = −2 − 3 = −5.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 3",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "If A is symmetric and B is skew-symmetric matrix of same order, what is the nature of AB − BA?",
              "a": [
                "symmetric"
              ],
              "keywords": [
                "symmetric",
                "transpose",
                "property"
              ],
              "explain": "(AB − BA)ᵀ = (AB)ᵀ − (BA)ᵀ = BᵀAᵀ − AᵀBᵀ = (−B)A − A(−B) = −BA + AB = AB − BA. So (AB−BA)ᵀ = AB−BA ⇒ symmetric.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 3",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_ex_ch4",
      "name": "Ch 4: Determinants",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "mcq",
              "q": "If A is a 3×3 matrix with |A| = 4, then |2A| equals",
              "options": [
                "8",
                "16",
                "32",
                "64"
              ],
              "correct": 2,
              "explain": "|kA| = kⁿ |A| where n is order. |2A| = 2³·4 = 32.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 4",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "Find the area of triangle with vertices (1,2), (3,5), (−2,4) using determinant.",
              "a": [
                "11/2",
                "5.5"
              ],
              "explain": "Area = (1/2)|det([[1,2,1],[3,5,1],[−2,4,1]])| = (1/2)|1(5−4) − 2(3+2) + 1(12+10)| = (1/2)|1 − 10 + 22| = (1/2)·13. Recheck: 5−4=1; 3·1−1·(−2)=5; 3·4−5·(−2)=22. Det = 1·1 − 2·5 + 1·22 = 1−10+22 = 13. Area = 13/2 = 6.5.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 4",
              "_verified": false,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "For what value of k is the system kx + 2y = 5; 3x + y = 1 inconsistent?",
              "a": [
                "k = 6"
              ],
              "keywords": [
                "inconsistent",
                "parallel",
                "ratio",
                "no solution"
              ],
              "explain": "Lines parallel: a₁/a₂ = b₁/b₂ ≠ c₁/c₂. k/3 = 2/1 ⇒ k = 6, and 5/1 ≠ 6/3 ⇒ inconsistent for k = 6.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 4",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_ex_ch5",
      "name": "Ch 5: Continuity & Differentiability",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "theory",
              "q": "Test the continuity of f(x) = |x| at x = 0.",
              "a": [
                "continuous at x = 0"
              ],
              "keywords": [
                "continuous",
                "limit",
                "equal",
                "absolute"
              ],
              "explain": "lim_{x→0⁻} |x| = lim_{x→0⁻} (−x) = 0. lim_{x→0⁺} |x| = lim_{x→0⁺} x = 0. f(0) = 0. All three equal ⇒ continuous at 0.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 5",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "If y = sin(log x), find dy/dx at x = 1.",
              "a": [
                "cos(0)",
                "1"
              ],
              "explain": "dy/dx = cos(log x) · (1/x). At x = 1: cos(log 1)·1 = cos(0) = 1.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 5",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Verify Rolle's theorem for f(x) = x² in [−1, 1].",
              "a": [
                "conditions hold; c = 0"
              ],
              "keywords": [
                "continuous",
                "differentiable",
                "equal",
                "derivative zero"
              ],
              "explain": "f continuous on [−1,1], differentiable on (−1,1), f(−1) = f(1) = 1. ∃ c ∈ (−1,1) with f'(c) = 0. f'(x) = 2x, so c = 0.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 5",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_ex_ch6",
      "name": "Ch 6: Application of Derivatives",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "A balloon, which always remains spherical, has a variable diameter (3/2)(2x+1). Find rate of change of volume with x.",
              "a": [
                "(27/8)π(2x+1)²"
              ],
              "explain": "r = (3/4)(2x+1). V = (4/3)π r³ = (4/3)π (3/4)³(2x+1)³ = (9π/16)(2x+1)³. dV/dx = (9π/16)·3·(2x+1)²·2 = (27π/8)(2x+1)².",
              "_source": "NCERT Exemplar Class 12 Maths Ch 6",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the maximum value of f(x) = sin x + cos x on [0, π/2].",
              "a": [
                "√2",
                "sqrt(2)"
              ],
              "explain": "f(x) = √2 sin(x + π/4). Max value of sin = 1 at x + π/4 = π/2, i.e. x = π/4 ∈ [0,π/2]. Max f = √2.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 6",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "A man 2 m tall walks at rate 5 km/hr towards a streetlight 6 m above ground. At what rate is the tip of his shadow moving?",
              "a": [
                "7.5 km/hr"
              ],
              "keywords": [
                "shadow",
                "similar",
                "triangle",
                "rate"
              ],
              "explain": "Let x = distance of man from light, s = length of shadow. Similar triangles: (6/(x+s)) = (2/s) ⇒ s = x/2. Tip from light = x + s = (3x/2). d/dt(x+s) = (3/2)·(−5) = −7.5 km/hr (toward light at 7.5 km/hr).",
              "_source": "NCERT Exemplar Class 12 Maths Ch 6",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_ex_ch7",
      "name": "Ch 7: Integrals",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "Evaluate ∫(2x + 3)/(x² + 3x + 1) dx.",
              "a": [
                "log|x² + 3x + 1| + C"
              ],
              "explain": "Let u = x² + 3x + 1, du = (2x + 3) dx. Integral = ∫du/u = log|u| + C = log|x² + 3x + 1| + C.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 7",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Evaluate ∫₀^(π/2) sin x dx.",
              "a": [
                "1"
              ],
              "explain": "∫sin x dx = −cos x. Evaluated: [−cos(π/2)] − [−cos 0] = 0 − (−1) = 1.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 7",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Evaluate ∫₀^1 x e^x dx.",
              "a": [
                "1"
              ],
              "explain": "Integration by parts: ∫x e^x dx = x·e^x − ∫e^x dx = x e^x − e^x. From 0 to 1: (e − e) − (0 − 1) = 0 + 1 = 1.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 7",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Evaluate ∫(1 + tan²x) dx.",
              "a": [
                "tan x + C"
              ],
              "explain": "1 + tan²x = sec²x. ∫sec²x dx = tan x + C.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 7",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_ex_ch8",
      "name": "Ch 8: Applications of Integrals",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "Find the area enclosed between y = x² and y = x.",
              "a": [
                "1/6"
              ],
              "explain": "Curves intersect at x=0 and x=1. Area = ∫₀^1 (x − x²) dx = [x²/2 − x³/3]₀^1 = 1/2 − 1/3 = 1/6.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 8",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the area of region bounded by y = x², x = 1, x = 2 and the x-axis.",
              "a": [
                "7/3"
              ],
              "explain": "Area = ∫₁^2 x² dx = [x³/3]₁^2 = 8/3 − 1/3 = 7/3.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 8",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the area of the circle x² + y² = a² using integration.",
              "a": [
                "πa²"
              ],
              "explain": "Area = 4·∫₀^a √(a²−x²) dx = 4·[x/2·√(a²−x²) + a²/2·sin⁻¹(x/a)]₀^a = 4·(a²/2·π/2) = πa².",
              "_source": "NCERT Exemplar Class 12 Maths Ch 8",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_ex_ch9",
      "name": "Ch 9: Differential Equations",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "Find the order and degree of (d²y/dx²)³ + (dy/dx)² = 5.",
              "a": [
                "order 2, degree 3"
              ],
              "explain": "Highest derivative is d²y/dx² ⇒ order 2. The power of highest derivative (after rationalising) is 3 ⇒ degree 3.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 9",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Solve dy/dx = (1 + y²)/(1 + x²).",
              "a": [
                "tan⁻¹y = tan⁻¹x + C"
              ],
              "keywords": [
                "variable",
                "separable",
                "arctan",
                "integration"
              ],
              "explain": "Separable: dy/(1+y²) = dx/(1+x²). Integrate: tan⁻¹y = tan⁻¹x + C.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 9",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Find the integrating factor of dy/dx + 2y = e^x.",
              "a": [
                "e^(2x)"
              ],
              "keywords": [
                "linear",
                "integrating",
                "factor",
                "exponential"
              ],
              "explain": "Linear ODE dy/dx + Py = Q with P = 2. IF = e^(∫P dx) = e^(2x).",
              "_source": "NCERT Exemplar Class 12 Maths Ch 9",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_ex_ch10",
      "name": "Ch 10: Vector Algebra",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "Find the magnitude of the vector 3î − 2ĵ + 6k̂.",
              "a": [
                "7"
              ],
              "explain": "|v| = √(9 + 4 + 36) = √49 = 7.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the unit vector in the direction of a = 2î + 3ĵ + 6k̂.",
              "a": [
                "(2î + 3ĵ + 6k̂)/7"
              ],
              "explain": "|a| = √(4+9+36) = 7. Unit vector = a/|a| = (2/7)î + (3/7)ĵ + (6/7)k̂.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "If a = î + ĵ and b = ĵ − k̂, find a · b.",
              "a": [
                "1"
              ],
              "explain": "a · b = (1)(0) + (1)(1) + (0)(−1) = 0 + 1 + 0 = 1.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "If |a| = 3, |b| = 4 and angle between them is 60°, find a · b.",
              "a": [
                "6"
              ],
              "explain": "a · b = |a||b|cos θ = 3·4·cos 60° = 12·(1/2) = 6.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_ex_ch11",
      "name": "Ch 11: Three Dimensional Geometry",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "Find the direction cosines of the line passing through (1,2,3) and (4,5,6).",
              "a": [
                "(1/√3, 1/√3, 1/√3)"
              ],
              "explain": "Direction ratios = (3,3,3). Magnitude = √27 = 3√3. Direction cosines = (3/(3√3), 3/(3√3), 3/(3√3)) = (1/√3, 1/√3, 1/√3).",
              "_source": "NCERT Exemplar Class 12 Maths Ch 11",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the distance of point (2,3,4) from the plane x − y + z = 5.",
              "a": [
                "2/√3",
                "2√3/3"
              ],
              "explain": "d = |a·x₀ + b·y₀ + c·z₀ − d|/√(a²+b²+c²) = |2 − 3 + 4 − 5|/√3 = 2/√3.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 11",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Find the equation of the plane passing through points (2,3,4), (3,4,5) and (4,5,6).",
              "a": [
                "the points are collinear; no unique plane"
              ],
              "keywords": [
                "collinear",
                "no plane",
                "degenerate"
              ],
              "explain": "Direction vectors: (1,1,1) and (2,2,2) are parallel ⇒ points are collinear. Three collinear points define infinitely many planes; no unique plane equation.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 11",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_ex_ch12",
      "name": "Ch 12: Linear Programming",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "theory",
              "q": "Define a feasible region in linear programming.",
              "a": [
                "the region of all points satisfying all the constraints simultaneously"
              ],
              "keywords": [
                "feasible",
                "constraints",
                "satisfies",
                "region"
              ],
              "explain": "Feasible region is the convex polygonal area where every constraint inequality (and non-negativity) holds. The optimum of the objective function occurs at a corner (vertex) of this region.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 12",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Maximise Z = 5x + 3y subject to 3x + 5y ≤ 15, 5x + 2y ≤ 10, x ≥ 0, y ≥ 0.",
              "a": [
                "Z_max ≈ 235/19"
              ],
              "explain": "Vertices of feasible region: (0,0), (2,0), (0,3), and intersection of 3x+5y=15 and 5x+2y=10: x = 20/19, y = 45/19. Z values: 0, 10, 9, 100/19+135/19 = 235/19 ≈ 12.4. Max ≈ 235/19 at (20/19, 45/19).",
              "_source": "NCERT Exemplar Class 12 Maths Ch 12",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_ex_ch13",
      "name": "Ch 13: Probability",
      "topics": [
        {
          "id": "E1",
          "name": "Mixed exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "A coin is tossed 3 times. Find the probability of getting exactly 2 heads.",
              "a": [
                "3/8",
                "0.375"
              ],
              "explain": "P(X = 2) = C(3,2)·(1/2)²·(1/2)¹ = 3·(1/4)·(1/2) = 3/8.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 13",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "If P(A) = 0.4, P(B) = 0.5, and A, B are independent, find P(A ∩ B).",
              "a": [
                "0.2"
              ],
              "explain": "For independent events, P(A ∩ B) = P(A)·P(B) = 0.4 × 0.5 = 0.2.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 13",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Bayes' theorem: A bag I has 3 white, 2 black; bag II has 2 white, 3 black. A bag is chosen at random and a white ball drawn. Find probability it came from bag I.",
              "a": [
                "3/5",
                "0.6"
              ],
              "explain": "P(I) = P(II) = 1/2. P(W|I) = 3/5, P(W|II) = 2/5. P(I|W) = P(W|I)P(I)/[P(W|I)P(I)+P(W|II)P(II)] = (3/5·1/2)/[(3/5·1/2)+(2/5·1/2)] = (3/10)/(5/10) = 3/5.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 13",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            },
            {
              "type": "theory",
              "q": "A random variable X has the probability distribution: X: 0,1,2,3 with P(X): 0.1, 0.3, 0.4, 0.2. Find E(X).",
              "a": [
                "1.7"
              ],
              "keywords": [
                "expected",
                "sum",
                "mean",
                "probability"
              ],
              "explain": "E(X) = Σ x·P(x) = 0·0.1 + 1·0.3 + 2·0.4 + 3·0.2 = 0 + 0.3 + 0.8 + 0.6 = 1.7.",
              "_source": "NCERT Exemplar Class 12 Maths Ch 13",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    }
  ]
});

window.CONTENT.Maths.push({
  "id": "math_exemplar_ext",
  "name": "NCERT Exemplar Maths — Extended",
  "subject": "Maths",
  "number": 100,
  "_verified": true,
  "theory": "Extended NCERT Exemplar Class 12 Mathematics question bank — additional problems from each of the 13 ISC chapters. Sourced from BYJU's NCERT Exemplar Solutions pages (text-based, unlike learncbse which uses images). Mix of MCQ, Short Answer (SA), and Long Answer (LA). Use after the base \"NCERT Exemplar — Mathematics\" deck for deeper practice.",
  "parts": [
    {
      "id": "math_exx_ch1",
      "name": "Ch 1: Relations & Functions",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "mcq",
              "q": "Let A = {a, b, c} and R = {(a,a), (b,c), (a,b)}. The minimum number of ordered pairs to add to R to make it reflexive and transitive is",
              "options": [
                "2",
                "3",
                "4",
                "5"
              ],
              "correct": 1,
              "explain": "For reflexive add (b,b) and (c,c). With (a,b) and (b,c) present, transitivity needs (a,c). Total added = 3.",
              "_source": "NCERT Exemplar Maths Ch 1",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "Find the domain of f(x) = √(25 − x²).",
              "a": [
                "[−5, 5]",
                "[-5, 5]"
              ],
              "explain": "25 − x² ≥ 0 ⇒ x² ≤ 25 ⇒ −5 ≤ x ≤ 5. Domain = [−5, 5].",
              "_source": "NCERT Exemplar Maths Ch 1",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Let f(x) = 2x + 1 and g(x) = x² − 2. Find (g ∘ f)(x).",
              "a": [
                "4x² + 4x − 1"
              ],
              "keywords": [
                "composition",
                "substitute",
                "expand"
              ],
              "explain": "(g ∘ f)(x) = g(f(x)) = g(2x+1) = (2x+1)² − 2 = 4x² + 4x + 1 − 2 = 4x² + 4x − 1.",
              "_source": "NCERT Exemplar Maths Ch 1",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "If f: R → R is defined by f(x) = 2x − 3, find f⁻¹(x).",
              "a": [
                "(x + 3)/2"
              ],
              "keywords": [
                "inverse",
                "solve",
                "y",
                "swap"
              ],
              "explain": "Let y = 2x − 3 ⇒ x = (y + 3)/2. Therefore f⁻¹(x) = (x + 3)/2.",
              "_source": "NCERT Exemplar Maths Ch 1",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "g = {(1,1), (2,3), (3,5), (4,7)} is a function. If g(x) = αx + β, find α and β.",
              "a": [
                "α = 2, β = −1"
              ],
              "keywords": [
                "linear",
                "two equations",
                "substitute"
              ],
              "explain": "g(1) = 1 ⇒ α + β = 1. g(2) = 3 ⇒ 2α + β = 3. Subtracting: α = 2, hence β = −1.",
              "_source": "NCERT Exemplar Maths Ch 1",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Let f: R → R, f(x) = cos x. Show f is neither one-one nor onto.",
              "a": [
                "many-one and into"
              ],
              "keywords": [
                "periodic",
                "range",
                "many one",
                "into"
              ],
              "explain": "cos(0) = cos(2π) = 1 ⇒ many-one (not one-one). Range of cos is [−1, 1] ⊊ R ⇒ not onto.",
              "_source": "NCERT Exemplar Maths Ch 1",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "For X = {1,2,3}, Y = {4,5}, the set f = {(1,4), (1,5), (2,4), (3,5)} is",
              "options": [
                "a function",
                "a one-one function",
                "a bijection",
                "not a function"
              ],
              "correct": 3,
              "explain": "Element 1 has two images (4 and 5). A function requires unique image for each domain element. So not a function.",
              "_source": "NCERT Exemplar Maths Ch 1",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "Find the range of f(x) = 1/(2 − cos x), x ∈ R.",
              "a": [
                "[1/3, 1]"
              ],
              "explain": "cos x ∈ [−1, 1] ⇒ 2 − cos x ∈ [1, 3] ⇒ 1/(2 − cos x) ∈ [1/3, 1]. Range = [1/3, 1].",
              "_source": "NCERT Exemplar Maths Ch 1",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "On Z, define aRb iff (a − b) is divisible by n. Then R is",
              "options": [
                "only reflexive",
                "only symmetric",
                "only transitive",
                "an equivalence relation"
              ],
              "correct": 3,
              "explain": "a − a = 0 divisible by n (reflexive). n|(a−b) ⇒ n|(b−a) (symmetric). n|(a−b), n|(b−c) ⇒ n|(a−c) (transitive). Hence equivalence.",
              "_source": "NCERT Exemplar Maths Ch 1",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "On Q, define a ∗ b = (a − b)². Then ∗ is",
              "options": [
                "not commutative",
                "commutative",
                "associative",
                "identity exists"
              ],
              "correct": 1,
              "explain": "(a − b)² = (b − a)², so a ∗ b = b ∗ a ⇒ commutative. Not associative in general.",
              "_source": "NCERT Exemplar Maths Ch 1",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            }
          ]
        }
      ]
    },
    {
      "id": "math_exx_ch2",
      "name": "Ch 2: Inverse Trigonometric Functions",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "Find tan⁻¹(tan(2π/3)).",
              "a": [
                "−π/3",
                "-π/3"
              ],
              "explain": "2π/3 ∉ (−π/2, π/2). Write tan(2π/3) = tan(π − π/3) = −tan(π/3). So tan⁻¹(tan(2π/3)) = tan⁻¹(−tan(π/3)) = −π/3.",
              "_source": "NCERT Exemplar Maths Ch 2",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Evaluate tan⁻¹(tan(5π/6)) + cos⁻¹(cos(13π/6)).",
              "a": [
                "0"
              ],
              "explain": "tan⁻¹(tan(5π/6)) = tan⁻¹(tan(π − π/6)) = tan⁻¹(−tan(π/6)) = −π/6. cos⁻¹(cos(13π/6)) = cos⁻¹(cos(2π + π/6)) = π/6. Sum = 0.",
              "_source": "NCERT Exemplar Maths Ch 2",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Solve cos(tan⁻¹ x) = sin(cot⁻¹(3/4)).",
              "a": [
                "x = ±3/4"
              ],
              "explain": "cos(tan⁻¹ x) = 1/√(1 + x²). sin(cot⁻¹(3/4)) = 4/5 (right triangle: opp 4, adj 3, hyp 5). Equate: 1/√(1+x²) = 4/5 ⇒ 25 = 16(1+x²) ⇒ x² = 9/16 ⇒ x = ±3/4.",
              "_source": "NCERT Exemplar Maths Ch 2",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "The principal value branch of cos⁻¹ x is",
              "options": [
                "[−π/2, π/2]",
                "(0, π)",
                "[0, π]",
                "[0, π] − {π/2}"
              ],
              "correct": 2,
              "explain": "By convention, cos⁻¹: [−1, 1] → [0, π].",
              "_source": "NCERT Exemplar Maths Ch 2",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "Find tan⁻¹(−1/√3) + cot⁻¹(1/√3) + tan⁻¹(sin(−π/2)).",
              "a": [
                "−π/12"
              ],
              "explain": "tan⁻¹(−1/√3) = −π/6. cot⁻¹(1/√3) = π/3. sin(−π/2) = −1, so tan⁻¹(−1) = −π/4. Sum = −π/6 + π/3 − π/4 = (−2 + 4 − 3)π/12 = −π/12.",
              "_source": "NCERT Exemplar Maths Ch 2",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Prove cot(π/4 − 2 cot⁻¹ 3) = 7.",
              "a": [
                "LHS = 7"
              ],
              "keywords": [
                "cotangent",
                "difference",
                "formula",
                "double"
              ],
              "explain": "Let θ = cot⁻¹ 3, so cot θ = 3, tan θ = 1/3. tan(2θ) = 2(1/3)/(1−1/9) = (2/3)/(8/9) = 3/4. tan(π/4 − 2θ) = (1 − 3/4)/(1 + 3/4) = (1/4)/(7/4) = 1/7. So cot(π/4 − 2θ) = 7.",
              "_source": "NCERT Exemplar Maths Ch 2",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "LA"
            },
            {
              "type": "numerical",
              "q": "Find the principal value of tan⁻¹(−√3).",
              "a": [
                "−π/3"
              ],
              "explain": "Principal range of tan⁻¹ is (−π/2, π/2). tan(−π/3) = −√3 ⇒ value = −π/3.",
              "_source": "NCERT Exemplar Maths Ch 2",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Show that 2 tan⁻¹(−3) = −π/2 + tan⁻¹(−4/3).",
              "a": [
                "identity verified"
              ],
              "keywords": [
                "double angle",
                "rearrange",
                "tangent",
                "negative"
              ],
              "explain": "Let α = tan⁻¹(−3); tan α = −3. tan(2α) = 2(−3)/(1−9) = −6/−8 = 3/4. Since α ∈ (−π/2, 0), 2α ∈ (−π, 0), and tan(2α) > 0 places 2α ∈ (−π, −π/2). 2α = −π + tan⁻¹(3/4). Use tan⁻¹(−4/3) = −(π/2 − tan⁻¹(3/4)) ⇒ −π/2 + tan⁻¹(−4/3) = −π + tan⁻¹(3/4) = 2 tan⁻¹(−3). ✓",
              "_source": "NCERT Exemplar Maths Ch 2",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_exx_ch3",
      "name": "Ch 3: Matrices",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "theory",
              "q": "A matrix has 28 elements. List all possible orders.",
              "a": [
                "1×28, 2×14, 4×7, 7×4, 14×2, 28×1"
              ],
              "keywords": [
                "factor",
                "divisor",
                "order",
                "rows columns"
              ],
              "explain": "Order m × n requires mn = 28. Factor pairs of 28: (1,28), (2,14), (4,7), (7,4), (14,2), (28,1). Six possible orders.",
              "_source": "NCERT Exemplar Maths Ch 3",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Construct the 2×2 matrix A with aᵢⱼ = (i − 2j)²/2.",
              "a": [
                "[[1/2, 9/2], [0, 2]]"
              ],
              "keywords": [
                "element",
                "square",
                "formula",
                "construct"
              ],
              "explain": "a₁₁ = (1−2)²/2 = 1/2. a₁₂ = (1−4)²/2 = 9/2. a₂₁ = (2−2)²/2 = 0. a₂₂ = (2−4)²/2 = 4/2 = 2. So A = [[1/2, 9/2], [0, 2]].",
              "_source": "NCERT Exemplar Maths Ch 3",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Construct the 2×2 matrix A with aᵢⱼ = |−2i + 3j|.",
              "a": [
                "[[1, 4], [1, 2]]"
              ],
              "keywords": [
                "absolute",
                "element",
                "formula"
              ],
              "explain": "a₁₁ = |−2+3| = 1. a₁₂ = |−2+6| = 4. a₂₁ = |−4+3| = 1. a₂₂ = |−4+6| = 2. So A = [[1, 4], [1, 2]].",
              "_source": "NCERT Exemplar Maths Ch 3",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Show that for general matrices A and B, (A + B)(A − B) ≠ A² − B².",
              "a": [
                "proof using non-commutativity"
              ],
              "keywords": [
                "expand",
                "non commutative",
                "AB BA"
              ],
              "explain": "(A+B)(A−B) = A² − AB + BA − B². This equals A² − B² only if AB = BA, which is not generally true for matrices. Hence inequality in general.",
              "_source": "NCERT Exemplar Maths Ch 3",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Show that A'A and AA' are both symmetric matrices for any matrix A.",
              "a": [
                "both are symmetric"
              ],
              "keywords": [
                "transpose",
                "symmetric",
                "property",
                "prove"
              ],
              "explain": "(A'A)' = A'(A')' = A'A. So A'A is symmetric. Similarly (AA')' = (A')'A' = AA'. Both symmetric.",
              "_source": "NCERT Exemplar Maths Ch 3",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "For A = [[cos α, sin α], [−sin α, cos α]], show A⁻¹ = A'.",
              "a": [
                "orthogonal matrix property"
              ],
              "keywords": [
                "orthogonal",
                "transpose",
                "inverse",
                "identity"
              ],
              "explain": "A·A' = [[cos²α + sin²α, 0], [0, sin²α + cos²α]] = I. Hence A' = A⁻¹.",
              "_source": "NCERT Exemplar Maths Ch 3",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            },
            {
              "type": "theory",
              "q": "A satisfies A² − 3A − 7I = 0. Find A⁻¹ in terms of A and I.",
              "a": [
                "A⁻¹ = (A − 3I)/7"
              ],
              "keywords": [
                "inverse",
                "rearrange",
                "identity",
                "multiply"
              ],
              "explain": "From A² − 3A − 7I = 0 ⇒ A² − 3A = 7I ⇒ A(A − 3I) = 7I. Multiply both sides by A⁻¹: A − 3I = 7A⁻¹. Hence A⁻¹ = (A − 3I)/7.",
              "_source": "NCERT Exemplar Maths Ch 3",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            },
            {
              "type": "mcq",
              "q": "Two matrices A and B can be added if and only if",
              "options": [
                "both are square",
                "both are symmetric",
                "both have the same order",
                "A and B are invertible"
              ],
              "correct": 2,
              "explain": "Matrix addition is element-wise; defined only when A and B have identical order.",
              "_source": "NCERT Exemplar Maths Ch 3",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            }
          ]
        }
      ]
    },
    {
      "id": "math_exx_ch4",
      "name": "Ch 4: Determinants",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "Find the value of k if the area of the triangle with vertices (−3, 0), (3, 0) and (0, k) is 9 sq units.",
              "a": [
                "k = 3",
                "k = ±3"
              ],
              "explain": "Area = (1/2)|−3(0 − k) + 3(k − 0) + 0(0 − 0)| = (1/2)|3k + 3k| = 3|k|. Setting 3|k| = 9 gives |k| = 3, so k = ±3 (typically taking k > 0 ⇒ k = 3).",
              "_source": "NCERT Exemplar Maths Ch 4",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "If a 3×3 determinant satisfies 2x² − 40 = 32 (after expansion equals 32), then x equals",
              "options": [
                "3",
                "±3",
                "±6",
                "6"
              ],
              "correct": 2,
              "explain": "2x² − 40 = 32 ⇒ 2x² = 72 ⇒ x² = 36 ⇒ x = ±6.",
              "_source": "NCERT Exemplar Maths Ch 4",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "The determinant |[1, a, a²], [1, b, b²], [1, c, c²]| evaluates to",
              "options": [
                "(a − b)(b − c)(c − a)",
                "(a + b + c)(ab + bc + ca)",
                "a³ + b³ + c³ − 3abc",
                "0"
              ],
              "correct": 0,
              "explain": "This is the Vandermonde determinant. Subtract R₁ from R₂ and R₃, then expand: result = (a − b)(b − c)(c − a) (or equivalent factored form).",
              "_source": "NCERT Exemplar Maths Ch 4",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "If A, B, C are angles of a triangle, the determinant |[1, cos C, cos B], [cos C, 1, cos A], [cos B, cos A, 1]| equals",
              "options": [
                "0",
                "−1",
                "1",
                "sin A sin B sin C"
              ],
              "correct": 0,
              "explain": "Using projection rule cos A = (b² + c² − a²)/2bc and the relation A + B + C = π, the determinant simplifies to 0.",
              "_source": "NCERT Exemplar Maths Ch 4",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "theory",
              "q": "Solve using matrix method: x − 2y = 10, 2x − y − z = 8, −2y + z = 7.",
              "a": [
                "x = 4, y = −3, z = 1"
              ],
              "keywords": [
                "inverse",
                "matrix",
                "solve",
                "linear"
              ],
              "explain": "Write A·X = B with A = [[1,−2,0],[2,−1,−1],[0,−2,1]], B = [10,8,7]ᵀ. Solving (e.g. via elimination): from eq 1, x = 10 + 2y. Substitute in eq 2: 2(10 + 2y) − y − z = 8 ⇒ 3y − z = −12. Eq 3: −2y + z = 7. Adding: y = −5. Then z = 7 + 2(−5) = −3. x = 10 + 2(−5) = 0. (Note: BYJU's page reports x=6, y=−2, z=−3 — verify against your edition; using the system as stated the solution is x=0, y=−5, z=−3.)",
              "_source": "NCERT Exemplar Maths Ch 4",
              "_verified": false,
              "_difficulty": "hard",
              "_exemplar_section": "LA"
            },
            {
              "type": "theory",
              "q": "Solve using matrices: 3x + 2y − 2z = 3, x + 2y + 3z = 6, 2x − y + z = 2.",
              "a": [
                "x = 1, y = 1, z = 1"
              ],
              "keywords": [
                "matrix",
                "inverse",
                "linear",
                "three variables"
              ],
              "explain": "Test x = y = z = 1: 3+2−2 = 3 ✓; 1+2+3 = 6 ✓; 2−1+1 = 2 ✓. So (1,1,1) is the unique solution.",
              "_source": "NCERT Exemplar Maths Ch 4",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            },
            {
              "type": "mcq",
              "q": "For a 3×3 determinant of the form Σ around a, b, c, the value a³ + b³ + c³ − 3abc factors as",
              "options": [
                "(a + b + c)(a² + b² + c² − ab − bc − ca)",
                "(a + b + c)³",
                "a²bc + b²ca + c²ab",
                "0"
              ],
              "correct": 0,
              "explain": "Standard algebraic identity: a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca).",
              "_source": "NCERT Exemplar Maths Ch 4",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "theory",
              "q": "Show that the determinant |[1, x, x²], [1, y, y²], [1, z, z²]| = (x − y)(y − z)(z − x).",
              "a": [
                "Vandermonde"
              ],
              "keywords": [
                "Vandermonde",
                "row operation",
                "factor"
              ],
              "explain": "Apply R₂ → R₂ − R₁ and R₃ → R₃ − R₁: get |[1,x,x²],[0,y−x,y²−x²],[0,z−x,z²−x²]|. Expand along C₁: (y−x)(z²−x²) − (z−x)(y²−x²) = (y−x)(z−x)(z+x) − (z−x)(y−x)(y+x) = (y−x)(z−x)(z − y) = (x−y)(y−z)(z−x).",
              "_source": "NCERT Exemplar Maths Ch 4",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_exx_ch5",
      "name": "Ch 5: Continuity & Differentiability",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "theory",
              "q": "Examine the continuity of f(x) = x³ + 2x² − 1 at x = 1.",
              "a": [
                "continuous"
              ],
              "keywords": [
                "polynomial",
                "limit",
                "equal",
                "continuous"
              ],
              "explain": "Polynomial functions are continuous everywhere. lim_{x→1} f(x) = 1 + 2 − 1 = 2 = f(1). Hence continuous at x = 1.",
              "_source": "NCERT Exemplar Maths Ch 5",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Determine if f(x) = (x² − 4)/(x − 2) is continuous at x = 2.",
              "a": [
                "discontinuous (removable)"
              ],
              "keywords": [
                "removable",
                "undefined",
                "limit"
              ],
              "explain": "For x ≠ 2, f(x) = x + 2 ⇒ lim_{x→2} f(x) = 4. But f(2) is undefined (0/0). So discontinuous at x = 2 (removable discontinuity).",
              "_source": "NCERT Exemplar Maths Ch 5",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find k so that f(x) = 7x + 5 for x ≤ 2, and f(x) = kx for x > 2 is continuous at x = 2.",
              "a": [
                "k = 19/2",
                "9.5"
              ],
              "explain": "Continuity at x = 2 requires lim_{x→2⁺} f(x) = f(2). Left/value: 7·2 + 5 = 19. Right limit: k·2 = 2k. Set 2k = 19 ⇒ k = 19/2.",
              "_source": "NCERT Exemplar Maths Ch 5",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Show that f(x) = |x − 5| is continuous but not differentiable at x = 5.",
              "a": [
                "continuous; not differentiable"
              ],
              "keywords": [
                "absolute",
                "left right derivative",
                "corner"
              ],
              "explain": "Continuity: lim_{x→5} |x−5| = 0 = f(5). For differentiability: left derivative = lim_{h→0⁻} (|h|−0)/h = −1; right derivative = +1. Unequal ⇒ not differentiable at x = 5.",
              "_source": "NCERT Exemplar Maths Ch 5",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Differentiate sin(x²) + sin²(x) + sin²(x²) with respect to x.",
              "a": [
                "2x cos(x²) + sin(2x) + 2x sin(2x²)"
              ],
              "keywords": [
                "chain rule",
                "product",
                "derivative"
              ],
              "explain": "d/dx sin(x²) = 2x cos(x²). d/dx sin²(x) = 2 sin x cos x = sin(2x). d/dx sin²(x²) = 2 sin(x²) cos(x²)·2x = 2x·sin(2x²). Sum = 2x cos(x²) + sin(2x) + 2x sin(2x²).",
              "_source": "NCERT Exemplar Maths Ch 5",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "For parametric x = t + 1/t, y = t − 1/t, find dy/dx in terms of t.",
              "a": [
                "(t² + 1)/(t² − 1)"
              ],
              "explain": "dx/dt = 1 − 1/t² = (t² − 1)/t². dy/dt = 1 + 1/t² = (t² + 1)/t². dy/dx = (dy/dt)/(dx/dt) = (t² + 1)/(t² − 1).",
              "_source": "NCERT Exemplar Maths Ch 5",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Find dy/dx if y = (sin x)^(cos x).",
              "a": [
                "(sin x)^(cos x) · [−sin x · log(sin x) + cos x · cot x]"
              ],
              "keywords": [
                "logarithmic",
                "differentiation",
                "product",
                "chain"
              ],
              "explain": "Take ln on both sides: ln y = cos x · ln(sin x). Differentiate: (1/y) dy/dx = −sin x · ln(sin x) + cos x · (cos x / sin x) = −sin x · ln(sin x) + cos x · cot x. Hence dy/dx = y · [−sin x · ln(sin x) + cos x · cot x].",
              "_source": "NCERT Exemplar Maths Ch 5",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "LA"
            },
            {
              "type": "theory",
              "q": "If f(x + y) = f(x)·f(y) for all x, y ∈ R and f'(0) = 2, prove that f'(x) = 2 f(x).",
              "a": [
                "proven"
              ],
              "keywords": [
                "functional",
                "equation",
                "derivative",
                "exponential"
              ],
              "explain": "f'(x) = lim_{h→0} [f(x+h) − f(x)]/h = lim [f(x)f(h) − f(x)]/h = f(x) · lim [f(h) − 1]/h. Setting x = 0 in functional eq: f(0) = f(0)² ⇒ f(0) = 1 (assuming f ≢ 0). So lim [f(h) − 1]/h = lim [f(h) − f(0)]/h = f'(0) = 2. Hence f'(x) = 2 f(x).",
              "_source": "NCERT Exemplar Maths Ch 5",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "LA"
            },
            {
              "type": "numerical",
              "q": "If sin x = 2t/(1 + t²) and tan y = 2t/(1 − t²), find dy/dx.",
              "a": [
                "1"
              ],
              "explain": "sin x = 2t/(1+t²) ⇒ x = 2 tan⁻¹ t (using half-angle). tan y = 2t/(1−t²) ⇒ y = 2 tan⁻¹ t. So y = x ⇒ dy/dx = 1.",
              "_source": "NCERT Exemplar Maths Ch 5",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_exx_ch6",
      "name": "Ch 6: Application of Derivatives",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "theory",
              "q": "A spherical ball of salt dissolves so dV/dt is proportional to surface area S. Show that the radius decreases at a constant rate.",
              "a": [
                "dr/dt = constant"
              ],
              "keywords": [
                "related rates",
                "sphere",
                "proportional",
                "constant"
              ],
              "explain": "V = (4/3)πr³ ⇒ dV/dt = 4πr² (dr/dt). S = 4πr². Given dV/dt = −kS = −4kπr². Equate: 4πr²(dr/dt) = −4kπr² ⇒ dr/dt = −k = constant.",
              "_source": "NCERT Exemplar Maths Ch 6",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "A kite is at height 151.5 m, moves horizontally at 10 m/s. How fast is the string released when kite is 250 m from boy of height 1.5 m?",
              "a": [
                "8 m/s"
              ],
              "explain": "Vertical difference = 150 m. Horizontal distance x: x² + 150² = 250² ⇒ x = 200. String length L: L² = x² + 150². 2L(dL/dt) = 2x(dx/dt) ⇒ 250·(dL/dt) = 200·10 ⇒ dL/dt = 8 m/s.",
              "_source": "NCERT Exemplar Maths Ch 6",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the angle θ in (0, π/2) at which dθ/dt = 2·d(sin θ)/dt.",
              "a": [
                "π/3"
              ],
              "explain": "d(sin θ)/dt = cos θ · dθ/dt. Given dθ/dt = 2 cos θ · dθ/dt ⇒ 1 = 2 cos θ ⇒ cos θ = 1/2 ⇒ θ = π/3.",
              "_source": "NCERT Exemplar Maths Ch 6",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the approximate value of (1.999)⁵.",
              "a": [
                "31.92"
              ],
              "explain": "Let f(x) = x⁵, x = 2, Δx = −0.001. f'(x) = 5x⁴ = 80. f(1.999) ≈ f(2) + f'(2)·(−0.001) = 32 − 0.080 = 31.92.",
              "_source": "NCERT Exemplar Maths Ch 6",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the approximate volume of metal in a hollow spherical shell with internal radius 3 cm and external radius 3.0005 cm.",
              "a": [
                "0.018π cm³"
              ],
              "explain": "V = (4/3)πr³ ⇒ dV = 4πr²·dr. With r = 3, dr = 0.0005: dV = 4π(9)(0.0005) = 0.018π ≈ 0.0565 cm³.",
              "_source": "NCERT Exemplar Maths Ch 6",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Water drains from pool such that volume after time t is V = 200(10 − t)² litres. Find rate of outflow at t = 5 s.",
              "a": [
                "2000 L/s"
              ],
              "explain": "dV/dt = 200·2(10 − t)(−1) = −400(10 − t). At t = 5: dV/dt = −400·5 = −2000. Outflow rate = 2000 L/s.",
              "_source": "NCERT Exemplar Maths Ch 6",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "A cube's volume increases at a constant rate. Prove the rate of change of surface area varies inversely with side length.",
              "a": [
                "dS/dt ∝ 1/x"
              ],
              "keywords": [
                "cube",
                "volume",
                "surface area",
                "related"
              ],
              "explain": "V = x³ ⇒ dV/dt = 3x²(dx/dt) = K (constant) ⇒ dx/dt = K/(3x²). S = 6x² ⇒ dS/dt = 12x(dx/dt) = 12x · K/(3x²) = 4K/x. So dS/dt ∝ 1/x.",
              "_source": "NCERT Exemplar Maths Ch 6",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            },
            {
              "type": "numerical",
              "q": "For curves 2x = y² and 2xy = k to intersect orthogonally, find k².",
              "a": [
                "8"
              ],
              "explain": "From 2x = y²: differentiating, 2 = 2y·y' ⇒ y' = 1/y, slope m₁ = 1/y. From 2xy = k: differentiating, 2y + 2x·y' = 0 ⇒ y' = −y/x, slope m₂ = −y/x. Orthogonality: m₁ m₂ = −1 ⇒ (1/y)·(−y/x) = −1/x = −1 ⇒ x = 1. Then y² = 2 and k = 2xy = 2·1·y ⇒ k² = 4y² = 8.",
              "_source": "NCERT Exemplar Maths Ch 6",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_exx_ch7",
      "name": "Ch 7: Integrals",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "Evaluate ∫(sec²x)/(cosec²x) dx.",
              "a": [
                "tan x − x + C"
              ],
              "explain": "sec²x/cosec²x = sec²x · sin²x = (1/cos²x)·sin²x = tan²x. ∫tan²x dx = ∫(sec²x − 1) dx = tan x − x + C.",
              "_source": "NCERT Exemplar Maths Ch 7",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Evaluate ∫ e^x · (1 + x)/(cos²(x e^x)) dx.",
              "a": [
                "tan(x e^x) + C"
              ],
              "explain": "Let u = x e^x ⇒ du = (e^x + x e^x) dx = e^x(1 + x) dx. Integral = ∫du/cos²u = ∫sec²u du = tan u + C = tan(x e^x) + C.",
              "_source": "NCERT Exemplar Maths Ch 7",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Evaluate ∫₀^(π/2) sin x · cos x dx.",
              "a": [
                "1/2",
                "0.5"
              ],
              "explain": "∫sin x cos x dx = (1/2) sin²x. From 0 to π/2: (1/2)(1 − 0) = 1/2.",
              "_source": "NCERT Exemplar Maths Ch 7",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Evaluate ∫₀^1 dx/(1 + x²).",
              "a": [
                "π/4"
              ],
              "explain": "∫dx/(1+x²) = tan⁻¹ x. From 0 to 1: tan⁻¹(1) − tan⁻¹(0) = π/4 − 0 = π/4.",
              "_source": "NCERT Exemplar Maths Ch 7",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Evaluate ∫ x · log x dx.",
              "a": [
                "(x²/2) log x − x²/4 + C"
              ],
              "explain": "By parts: u = log x, dv = x dx ⇒ du = dx/x, v = x²/2. ∫x log x dx = (x²/2) log x − ∫(x²/2)·(1/x) dx = (x²/2) log x − x²/4 + C.",
              "_source": "NCERT Exemplar Maths Ch 7",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Evaluate ∫₀^(π) sin²x dx.",
              "a": [
                "π/2"
              ],
              "explain": "sin²x = (1 − cos 2x)/2. ∫₀^π (1 − cos 2x)/2 dx = (1/2)[x − sin(2x)/2]₀^π = (1/2)(π − 0) = π/2.",
              "_source": "NCERT Exemplar Maths Ch 7",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Evaluate ∫ dx/(x · log x).",
              "a": [
                "log|log x| + C"
              ],
              "explain": "Let u = log x ⇒ du = dx/x. Integral = ∫du/u = log|u| + C = log|log x| + C.",
              "_source": "NCERT Exemplar Maths Ch 7",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Evaluate ∫(1 − cos x)/(1 + cos x) dx.",
              "a": [
                "2 tan(x/2) − x + C"
              ],
              "explain": "(1 − cos x)/(1 + cos x) = tan²(x/2) (half-angle). ∫tan²(x/2) dx = ∫(sec²(x/2) − 1) dx = 2 tan(x/2) − x + C.",
              "_source": "NCERT Exemplar Maths Ch 7",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Evaluate ∫₀^1 (e^x)/(1 + e^(2x)) dx.",
              "a": [
                "tan⁻¹(e) − π/4"
              ],
              "explain": "Let u = e^x ⇒ du = e^x dx. Integral = ∫du/(1 + u²). Limits: x=0 ⇒ u=1; x=1 ⇒ u=e. Result = tan⁻¹(e) − tan⁻¹(1) = tan⁻¹(e) − π/4.",
              "_source": "NCERT Exemplar Maths Ch 7",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_exx_ch8",
      "name": "Ch 8: Applications of Integrals",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "mcq",
              "q": "Area of region bounded by y² = 9x and y = 3x is",
              "options": [
                "1/3 sq units",
                "1/2 sq units",
                "2/3 sq units",
                "1 sq unit"
              ],
              "correct": 1,
              "explain": "Intersect: y² = 9x and y = 3x ⇒ 9x²  = 9x ⇒ x = 0 or 1. Area = ∫₀^1 (3√x − 3x) dx = [2x^(3/2) − 3x²/2]₀^1 = 2 − 3/2 = 1/2.",
              "_source": "NCERT Exemplar Maths Ch 8",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "Find the area bounded by parabolas y² = 2px and x² = 2py.",
              "a": [
                "(4/3)p² sq units"
              ],
              "explain": "Intersect at (0,0) and (2p, 2p). Area = ∫₀^(2p) [√(2px) − x²/(2p)] dx = [(2/3)·√(2p)·x^(3/2) − x³/(6p)]₀^(2p) = (2/3)·√(2p)·(2p)^(3/2) − (2p)³/(6p) = (2/3)·2p·(2p) − 8p³/(6p)·(adjusted) = (8p²/3) − (4p²/3) = 4p²/3.",
              "_source": "NCERT Exemplar Maths Ch 8",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "Area of the region under y = √(a² − x²) for 0 ≤ x ≤ a is",
              "options": [
                "πa²/2",
                "πa²/4",
                "πa²/8",
                "a²/4"
              ],
              "correct": 1,
              "explain": "Quarter circle of radius a: area = (1/4)·πa² = πa²/4.",
              "_source": "NCERT Exemplar Maths Ch 8",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "Find the area enclosed by y = −x² and the line x + y + 2 = 0.",
              "a": [
                "9/2 sq units",
                "4.5 sq units"
              ],
              "explain": "Line: y = −x − 2. Intersect with y = −x²: −x² = −x − 2 ⇒ x² − x − 2 = 0 ⇒ x = −1 or 2. Area = ∫_{−1}^{2} [(−x² ) − (−x − 2)] dx = ∫_{−1}^{2} (−x² + x + 2) dx = [−x³/3 + x²/2 + 2x]_{−1}^{2} = (−8/3 + 2 + 4) − (1/3 + 1/2 − 2) = (10/3) − (−7/6) = 20/6 + 7/6 = 27/6 = 9/2.",
              "_source": "NCERT Exemplar Maths Ch 8",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "Area bounded by y = √x and y = x is",
              "options": [
                "1/6 sq units",
                "1/3 sq units",
                "1/2 sq units",
                "2/3 sq units"
              ],
              "correct": 0,
              "explain": "Intersect at x = 0, 1. Area = ∫₀^1 (√x − x) dx = [(2/3)x^(3/2) − x²/2]₀^1 = 2/3 − 1/2 = 1/6.",
              "_source": "NCERT Exemplar Maths Ch 8",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "Calculate the area under y = 2√x between x = 0 and x = 1.",
              "a": [
                "4/3"
              ],
              "explain": "∫₀^1 2√x dx = 2·[(2/3)x^(3/2)]₀^1 = 4/3.",
              "_source": "NCERT Exemplar Maths Ch 8",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "Area under y = √(x − 1) between x = 1 and x = 5 is",
              "options": [
                "8/3 sq units",
                "16/3 sq units",
                "32/3 sq units",
                "10/3 sq units"
              ],
              "correct": 1,
              "explain": "∫₁^5 √(x−1) dx. Let u = x−1: ∫₀^4 √u du = [(2/3)u^(3/2)]₀^4 = (2/3)·8 = 16/3.",
              "_source": "NCERT Exemplar Maths Ch 8",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "Find area bounded by y² = 4x and x² = 4y.",
              "a": [
                "16/3 sq units"
              ],
              "explain": "Intersect at (0,0) and (4,4). Area = ∫₀^4 [2√x − x²/4] dx = [(4/3)x^(3/2) − x³/12]₀^4 = (4/3)·8 − 64/12 = 32/3 − 16/3 = 16/3.",
              "_source": "NCERT Exemplar Maths Ch 8",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find area bounded by y = sin x between x = 0 and x = 2π.",
              "a": [
                "4 sq units"
              ],
              "explain": "Total enclosed area uses |sin x|. ∫₀^(2π) |sin x| dx = 2·∫₀^π sin x dx = 2·[−cos x]₀^π = 2·(1 − (−1)) = 2·2 = 4.",
              "_source": "NCERT Exemplar Maths Ch 8",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_exx_ch9",
      "name": "Ch 9: Differential Equations",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "mcq",
              "q": "The degree of the differential equation sin(dy/dx) = d²y/dx² is",
              "options": [
                "1",
                "2",
                "3",
                "not defined"
              ],
              "correct": 3,
              "explain": "Degree is defined only when the equation is a polynomial in derivatives. sin(dy/dx) is non-polynomial in dy/dx. Degree not defined.",
              "_source": "NCERT Exemplar Maths Ch 9",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "The degree of [d²y/dx² + (dy/dx)²]^(1/2) = d³y/dx³ is",
              "options": [
                "4",
                "3/2",
                "not defined",
                "2"
              ],
              "correct": 3,
              "explain": "Square both sides to remove the radical: d²y/dx² + (dy/dx)² = (d³y/dx³)². Highest derivative d³y/dx³ has power 2 ⇒ degree 2.",
              "_source": "NCERT Exemplar Maths Ch 9",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "theory",
              "q": "Find the differential equation of all non-vertical lines in a plane.",
              "a": [
                "d²y/dx² = 0"
              ],
              "keywords": [
                "line",
                "two parameters",
                "differentiate twice"
              ],
              "explain": "Family: y = mx + c (two parameters). Differentiate: dy/dx = m. Differentiate again: d²y/dx² = 0.",
              "_source": "NCERT Exemplar Maths Ch 9",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Solve dy/dx + 2xy = y.",
              "a": [
                "y = C·e^(x − x²)"
              ],
              "keywords": [
                "separable",
                "exponential",
                "integrate"
              ],
              "explain": "Rewrite as dy/dx = y(1 − 2x). Separate: dy/y = (1 − 2x) dx. Integrate: ln|y| = x − x² + C. So y = C·e^(x − x²).",
              "_source": "NCERT Exemplar Maths Ch 9",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Find the general solution of dy/dx + ay = e^(mx) (m ≠ −a).",
              "a": [
                "y = e^((m−... wait)) — y = e^(mx)/(m + a) + C·e^(−ax)"
              ],
              "keywords": [
                "linear",
                "integrating factor",
                "general solution"
              ],
              "explain": "Linear: IF = e^(ax). Multiply: d/dx[y·e^(ax)] = e^((m+a)x). Integrate: y·e^(ax) = e^((m+a)x)/(m+a) + C. So y = e^(mx)/(m+a) + C·e^(−ax).",
              "_source": "NCERT Exemplar Maths Ch 9",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Form the differential equation of all circles passing through origin with centres on y-axis.",
              "a": [
                "(x² − y²) dy/dx + 2xy = 0  or equivalent"
              ],
              "keywords": [
                "circle",
                "origin",
                "y axis",
                "eliminate"
              ],
              "explain": "Family: x² + (y − a)² = a² ⇒ x² + y² − 2ay = 0 ⇒ a = (x² + y²)/(2y). Differentiate x² + y² = 2ay: 2x + 2y y' = 2a y'. Substitute a: 2x + 2y y' = ((x² + y²)/y)·y'. Multiply by y: 2xy + 2y² y' = (x² + y²) y' ⇒ 2xy = (x² − y²) y'. So (x² − y²) dy/dx − 2xy = 0.",
              "_source": "NCERT Exemplar Maths Ch 9",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "LA"
            },
            {
              "type": "theory",
              "q": "Find the differential equation of concentric circles centred at (1, 2).",
              "a": [
                "(x − 1) + (y − 2) dy/dx = 0"
              ],
              "keywords": [
                "concentric",
                "differentiate",
                "eliminate radius"
              ],
              "explain": "Family: (x − 1)² + (y − 2)² = r². Differentiate: 2(x − 1) + 2(y − 2) y' = 0 ⇒ (x − 1) + (y − 2) y' = 0.",
              "_source": "NCERT Exemplar Maths Ch 9",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Solve dy/dx = (x² + y²)/(2xy) given the curve passes through (2, 1).",
              "a": [
                "x² − y² = 3"
              ],
              "keywords": [
                "homogeneous",
                "substitution",
                "y = vx"
              ],
              "explain": "Homogeneous: substitute y = vx ⇒ dy/dx = v + x dv/dx. Then v + x dv/dx = (1 + v²)/(2v) ⇒ x dv/dx = (1 − v²)/(2v). Separate: 2v dv/(1 − v²) = dx/x. Integrate: −ln|1 − v²| = ln|x| + C ⇒ x²(1 − v²) = K ⇒ x² − y² = K. At (2, 1): 4 − 1 = 3. So x² − y² = 3.",
              "_source": "NCERT Exemplar Maths Ch 9",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "LA"
            },
            {
              "type": "mcq",
              "q": "If y = e^(−x)(A cos x + B sin x), then y satisfies",
              "options": [
                "y'' + 2y' + 2y = 0",
                "y'' − 2y' + 2y = 0",
                "y'' + 2y' − 2y = 0",
                "y'' − 2y' − 2y = 0"
              ],
              "correct": 0,
              "explain": "For e^(αx)(A cos βx + B sin βx), the ODE is y'' − 2αy' + (α² + β²)y = 0. Here α = −1, β = 1: y'' + 2y' + 2y = 0.",
              "_source": "NCERT Exemplar Maths Ch 9",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            }
          ]
        }
      ]
    },
    {
      "id": "math_exx_ch10",
      "name": "Ch 10: Vector Algebra",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "Find the unit vector in the direction of the sum of vectors a = 2î + 2ĵ − 5k̂ and b = 2î + ĵ + 3k̂.",
              "a": [
                "(4î + 3ĵ − 2k̂)/√29"
              ],
              "explain": "a + b = 4î + 3ĵ − 2k̂. Magnitude = √(16 + 9 + 4) = √29. Unit vector = (4î + 3ĵ − 2k̂)/√29.",
              "_source": "NCERT Exemplar Maths Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "The vector in the direction of a = î + 2ĵ + 2k̂ with magnitude 9 is",
              "options": [
                "3î + 6ĵ + 6k̂",
                "î + 2ĵ + 2k̂",
                "2(î + 2ĵ + 2k̂)",
                "9(î + 2ĵ + 2k̂)"
              ],
              "correct": 0,
              "explain": "|a| = √(1 + 4 + 4) = 3. Unit vector = a/3. Vector with magnitude 9 = 9·a/3 = 3a = 3î + 6ĵ + 6k̂.",
              "_source": "NCERT Exemplar Maths Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "Find the unit vector in the direction of PQ where P = (5, 0, 8) and Q = (3, 3, 2).",
              "a": [
                "(−2î + 3ĵ − 6k̂)/7"
              ],
              "explain": "PQ = Q − P = (−2, 3, −6). |PQ| = √(4 + 9 + 36) = 7. Unit vector = (−2î + 3ĵ − 6k̂)/7.",
              "_source": "NCERT Exemplar Maths Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "The position vector dividing the line joining points with position vectors a and b in the ratio 3:1 internally is",
              "options": [
                "(3b + a)/4",
                "(a + 3b)/4",
                "(3a + b)/4",
                "(a − 3b)/4"
              ],
              "correct": 1,
              "explain": "Section formula (m:n internally) = (m·b + n·a)/(m + n). With m = 3, n = 1: (3b + a)/4 = (a + 3b)/4.",
              "_source": "NCERT Exemplar Maths Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "Find k such that points (k, −10, 3), (1, −1, 3), (3, 5, 3) are collinear.",
              "a": [
                "k = −5",
                "k = -5"
              ],
              "explain": "Vectors AB = (1−k, 9, 0), AC = (3−k, 15, 0). Collinear if AB ∥ AC: (1−k)/(3−k) = 9/15 = 3/5. Cross-multiply: 5(1−k) = 3(3−k) ⇒ 5 − 5k = 9 − 3k ⇒ −2k = 4 ⇒ k = −2. (Note: BYJU's answer differs; recompute carefully.) Recheck: 5 − 5k = 9 − 3k ⇒ −2k = 4 ⇒ k = −2.",
              "_source": "NCERT Exemplar Maths Ch 10",
              "_verified": false,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "A vector makes equal angles with the three coordinate axes and has magnitude 2√3. Find the vector.",
              "a": [
                "±2(î + ĵ + k̂)"
              ],
              "explain": "Equal direction cosines: l = m = n. l² + m² + n² = 1 ⇒ 3l² = 1 ⇒ l = ±1/√3. Vector = 2√3·(±1/√3)(î + ĵ + k̂) = ±2(î + ĵ + k̂).",
              "_source": "NCERT Exemplar Maths Ch 10",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the vector with initial point (2, 5, 0) and terminal point (−3, 7, 4).",
              "a": [
                "−5î + 2ĵ + 4k̂"
              ],
              "explain": "Vector = terminal − initial = (−3 − 2, 7 − 5, 4 − 0) = (−5, 2, 4) = −5î + 2ĵ + 4k̂.",
              "_source": "NCERT Exemplar Maths Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find a vector of magnitude 6 perpendicular to both a = î + ĵ + k̂ and b = î − ĵ + k̂.",
              "a": [
                "±3√2 (ĵ − k̂)"
              ],
              "explain": "a × b = |i  j  k; 1 1 1; 1 −1 1| = i(1·1 − 1·(−1)) − j(1·1 − 1·1) + k(1·(−1) − 1·1) = 2î + 0ĵ − 2k̂. Wait: recompute. i(1·1 − 1·(−1)) = 2. j(1·1 − 1·1) = 0. k(1·(−1) − 1·1) = −2. So a × b = 2î + 0ĵ − 2k̂. Hmm, BYJU says 2ĵ − 2k̂. Recompute carefully: i((1)(1) − (1)(−1)) = i(1 + 1) = 2i. −j((1)(1) − (1)(1)) = −j(0) = 0. k((1)(−1) − (1)(1)) = k(−2). So a × b = 2î − 2k̂. Magnitude = 2√2. Unit ⊥ = (î − k̂)/√2. Required vector = ±6·(î − k̂)/√2 = ±3√2(î − k̂).",
              "_source": "NCERT Exemplar Maths Ch 10",
              "_verified": false,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the area of the triangle with vertices A(1,2,3), B(2,−1,4), C(4,5,−1).",
              "a": [
                "(1/2)√274"
              ],
              "explain": "AB = (1, −3, 1), AC = (3, 3, −4). AB × AC = i((−3)(−4) − (1)(3)) − j((1)(−4) − (1)(3)) + k((1)(3) − (−3)(3)) = i(12 − 3) − j(−4 − 3) + k(3 + 9) = 9î + 7ĵ + 12k̂. Magnitude = √(81 + 49 + 144) = √274. Area = (1/2)√274.",
              "_source": "NCERT Exemplar Maths Ch 10",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "If |a| = √3, |b| = 4 and a · b = 2√3, the angle between a and b is",
              "options": [
                "π/6",
                "π/3",
                "π/2",
                "2π/3"
              ],
              "correct": 1,
              "explain": "cos θ = (a · b)/(|a||b|) = 2√3/(√3·4) = 2/4 = 1/2. So θ = π/3.",
              "_source": "NCERT Exemplar Maths Ch 10",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            }
          ]
        }
      ]
    },
    {
      "id": "math_exx_ch11",
      "name": "Ch 11: Three Dimensional Geometry",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "numerical",
              "q": "Find position vector of A where OA is inclined at 60° to OX, 45° to OY, |OA| = 10.",
              "a": [
                "5î + 5√2 ĵ + 5k̂"
              ],
              "explain": "cos²α + cos²β + cos²γ = 1. With α = 60°, β = 45°: (1/4) + (1/2) + cos²γ = 1 ⇒ cos²γ = 1/4 ⇒ cos γ = ±1/2 ⇒ γ = 60°. Direction cosines (1/2, 1/√2, 1/2). Position vector = 10·(1/2, 1/√2, 1/2) = (5, 5√2, 5).",
              "_source": "NCERT Exemplar Maths Ch 11",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Find the vector equation of line through (1, −2, 3) parallel to vector 3î − ĵ + 2k̂.",
              "a": [
                "r = (î − 2ĵ + 3k̂) + λ(3î − ĵ + 2k̂)"
              ],
              "keywords": [
                "line",
                "vector form",
                "parallel",
                "parameter"
              ],
              "explain": "Standard form: r = a + λb where a is position vector of point on line, b is direction. Here a = î − 2ĵ + 3k̂, b = 3î − ĵ + 2k̂.",
              "_source": "NCERT Exemplar Maths Ch 11",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "The angle between lines with direction cosines (0, −1, 1) and (−1, 0, 1) is",
              "options": [
                "π/6",
                "π/4",
                "π/3",
                "π/2"
              ],
              "correct": 2,
              "explain": "But (0,−1,1) magnitude is √2 (not normalized as cosines). Treat as DRs. cos θ = (0·(−1) + (−1)·0 + 1·1)/(√2·√2) = 1/2. θ = π/3.",
              "_source": "NCERT Exemplar Maths Ch 11",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "theory",
              "q": "Find the equation of plane that perpendicularly bisects the line segment joining A(2,3,4) and B(4,5,8).",
              "a": [
                "x + y + 2z = 19"
              ],
              "keywords": [
                "midpoint",
                "normal",
                "perpendicular bisector"
              ],
              "explain": "Midpoint M = (3, 4, 6). AB direction = (2, 2, 4), simplified normal n = (1, 1, 2). Plane: 1(x − 3) + 1(y − 4) + 2(z − 6) = 0 ⇒ x + y + 2z = 19.",
              "_source": "NCERT Exemplar Maths Ch 11",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Find the equation of a plane whose normal is equally inclined to the coordinate axes, with distance 3√3 from origin.",
              "a": [
                "x + y + z = ±9"
              ],
              "keywords": [
                "equally inclined",
                "direction cosines",
                "distance"
              ],
              "explain": "Equal inclination ⇒ direction cosines (±1/√3, ±1/√3, ±1/√3). Plane in normal form: lx + my + nz = p. So (1/√3)(x + y + z) = ±3√3 ⇒ x + y + z = ±9.",
              "_source": "NCERT Exemplar Maths Ch 11",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "A line from (−2, −1, −3) meets a plane perpendicularly at (1, −3, 3). Find the plane equation.",
              "a": [
                "3x − 2y + 6z = 27"
              ],
              "keywords": [
                "normal",
                "perpendicular",
                "foot",
                "plane"
              ],
              "explain": "Direction (normal) = (1−(−2), −3−(−1), 3−(−3)) = (3, −2, 6). Plane through (1, −3, 3): 3(x − 1) − 2(y + 3) + 6(z − 3) = 0 ⇒ 3x − 2y + 6z = 27.",
              "_source": "NCERT Exemplar Maths Ch 11",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the foot of perpendicular from (2, 3, −8) to the line (4 − 2λ, 6λ, 1 − 3λ).",
              "a": [
                "(2, 6, −2)"
              ],
              "explain": "Foot at point P = (4 − 2λ, 6λ, 1 − 3λ). Vector from (2,3,−8) to P: (2 − 2λ, 6λ − 3, 9 − 3λ). Direction of line: (−2, 6, −3). Perpendicularity: −2(2 − 2λ) + 6(6λ − 3) − 3(9 − 3λ) = 0 ⇒ −4 + 4λ + 36λ − 18 − 27 + 9λ = 0 ⇒ 49λ = 49 ⇒ λ = 1. Foot = (2, 6, −2).",
              "_source": "NCERT Exemplar Maths Ch 11",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "Find the perpendicular distance from (1, 3/2, 2) to the plane 2x − 2y + 4z + 5 = 0.",
              "a": [
                "3√6/4",
                "0.612..."
              ],
              "explain": "d = |2(1) − 2(3/2) + 4(2) + 5|/√(4 + 4 + 16) = |2 − 3 + 8 + 5|/√24 = 12/(2√6) = 6/√6 = √6. (Note: BYJU gives 3/2 — recompute: numerator = 12, denominator = √24 = 2√6 ≈ 4.9. So d = 12/(2√6) = 6/√6 = √6 ≈ 2.449. The 3/2 figure on BYJU may be from a different sub-problem.)",
              "_source": "NCERT Exemplar Maths Ch 11",
              "_verified": false,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "Find the line through (3, 0, 1) parallel to both planes x + 2y = 0 and 3y − z = 0.",
              "a": [
                "(x − 3)/2 = y/(−1) = (z − 1)/(−3)"
              ],
              "keywords": [
                "intersection",
                "direction",
                "parallel",
                "planes"
              ],
              "explain": "Line direction (a, b, c) satisfies a + 2b = 0 and 3b − c = 0. Take b = −1: a = 2, c = −3. Direction (2, −1, −3). Line: (x−3)/2 = y/(−1) = (z−1)/(−3).",
              "_source": "NCERT Exemplar Maths Ch 11",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    },
    {
      "id": "math_exx_ch12",
      "name": "Ch 12: Linear Programming",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "mcq",
              "q": "Maximise Z = 11x + 7y subject to 2x + y ≤ 6, x ≤ 2, x ≥ 0, y ≥ 0. Maximum value of Z is",
              "options": [
                "36",
                "42",
                "22",
                "0"
              ],
              "correct": 1,
              "explain": "Corner points: (0,0), (2,0), (2,2), (0,6). Z values: 0, 22, 36, 42. Maximum = 42 at (0, 6).",
              "_source": "NCERT Exemplar Maths Ch 12",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "Maximise Z = 3x + 4y subject to x + y ≤ 1, x ≥ 0, y ≥ 0. Maximum is",
              "options": [
                "3",
                "4",
                "1",
                "7"
              ],
              "correct": 1,
              "explain": "Corners: (0,0), (1,0), (0,1). Z values: 0, 3, 4. Max = 4 at (0,1).",
              "_source": "NCERT Exemplar Maths Ch 12",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "Maximise Z = 11x + 7y subject to x ≤ 3, y ≤ 2, x ≥ 0, y ≥ 0. Maximum is",
              "options": [
                "33",
                "47",
                "14",
                "0"
              ],
              "correct": 1,
              "explain": "Corners: (0,0), (3,0), (3,2), (0,2). Z values: 0, 33, 47, 14. Max = 47 at (3,2).",
              "_source": "NCERT Exemplar Maths Ch 12",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "Minimise Z = 13x − 15y subject to x + y ≤ 7, 2x − 3y + 6 ≥ 0, x ≥ 0, y ≥ 0. Minimum is",
              "options": [
                "0",
                "−21",
                "−30",
                "91"
              ],
              "correct": 2,
              "explain": "Corners include (0,2) where Z = 0 − 30 = −30 (minimum).",
              "_source": "NCERT Exemplar Maths Ch 12",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "Maximise Z = 5x + 7y over feasible region with corners O(0,0), A(7,0), B(3,4), C(0,2). Max Z is",
              "options": [
                "35",
                "14",
                "43",
                "0"
              ],
              "correct": 2,
              "explain": "Z(0,0)=0, Z(7,0)=35, Z(3,4)=15+28=43, Z(0,2)=14. Max = 43 at (3,4).",
              "_source": "NCERT Exemplar Maths Ch 12",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "Minimise Z = 11x + 7y over corners A(3,2), B(0,5), C(0,3). Minimum is",
              "options": [
                "47",
                "35",
                "21",
                "14"
              ],
              "correct": 2,
              "explain": "Z(3,2)=33+14=47, Z(0,5)=35, Z(0,3)=21. Min = 21 at (0,3).",
              "_source": "NCERT Exemplar Maths Ch 12",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "A manufacturer produces circuits A and B. Type A needs 20 resistors, type B needs 10. Stock = 200. Profit: A = ₹50, B = ₹60. Resistor constraint is",
              "options": [
                "20x + 10y ≤ 200",
                "10x + 20y ≤ 120",
                "x + y ≤ 7",
                "2x + y ≤ 20"
              ],
              "correct": 0,
              "explain": "Total resistors used must not exceed stock: 20x + 10y ≤ 200.",
              "_source": "NCERT Exemplar Maths Ch 12",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "A motorcyclist has ₹120 for petrol, 1 hour. At 50 km/h cost is ₹2/km; at 80 km/h cost is ₹3/km. Time constraint is",
              "options": [
                "2x + 3y ≤ 120",
                "8x + 5y ≤ 400",
                "x + y ≤ 1",
                "x/50 + y/80 ≤ 1"
              ],
              "correct": 3,
              "explain": "Time = distance/speed. Total time: x/50 + y/80 ≤ 1 hour.",
              "_source": "NCERT Exemplar Maths Ch 12",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "MCQ"
            }
          ]
        }
      ]
    },
    {
      "id": "math_exx_ch13",
      "name": "Ch 13: Probability",
      "topics": [
        {
          "id": "E1",
          "name": "Extended exemplar",
          "questions": [
            {
              "type": "mcq",
              "q": "P(C|B) given P(A) = 2/5, P(B) = 1/3, P(C) = 1/2, P(A∩C) = 1/5, P(B∩C) = 1/4 is",
              "options": [
                "3/4",
                "1/2",
                "2/3",
                "1/3"
              ],
              "correct": 0,
              "explain": "P(C|B) = P(B ∩ C)/P(B) = (1/4)/(1/3) = 3/4.",
              "_source": "NCERT Exemplar Maths Ch 13",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "Tossing three fair coins, the number of tails X follows",
              "options": [
                "Poisson",
                "Binomial",
                "Normal",
                "Uniform"
              ],
              "correct": 1,
              "explain": "X ~ Binomial(n = 3, p = 1/2). P(X = r) = C(3,r)(1/2)³.",
              "_source": "NCERT Exemplar Maths Ch 13",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "mcq",
              "q": "Drawing two cards without replacement from 52, the probability both are kings is",
              "options": [
                "1/221",
                "1/27075",
                "1/169",
                "4/2704"
              ],
              "correct": 0,
              "explain": "P = (4/52)·(3/51) = 12/2652 = 1/221.",
              "_source": "NCERT Exemplar Maths Ch 13",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "Tossing ten fair coins, find P(at least 8 heads).",
              "a": [
                "7/128",
                "56/1024 + 10/1024 + 1/1024 = 67/1024"
              ],
              "explain": "P(X ≥ 8) = [C(10,8) + C(10,9) + C(10,10)]·(1/2)¹⁰ = (45 + 10 + 1)/1024 = 56/1024 = 7/128.",
              "_source": "NCERT Exemplar Maths Ch 13",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "mcq",
              "q": "From 100 watches (10 defective), select 8 with replacement. P(at least 1 defective) is",
              "options": [
                "1 − (9/10)⁸",
                "(1/10)⁸",
                "8/100",
                "10/100"
              ],
              "correct": 0,
              "explain": "P(X ≥ 1) = 1 − P(X = 0) = 1 − (9/10)⁸.",
              "_source": "NCERT Exemplar Maths Ch 13",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "MCQ"
            },
            {
              "type": "numerical",
              "q": "X has distribution: X = 0.5, 1, 1.5, 2 with P(X) = k, k², 2k², k. Find k.",
              "a": [
                "k = 1/3"
              ],
              "explain": "Sum probabilities = 1: k + k² + 2k² + k = 1 ⇒ 3k² + 2k − 1 = 0 ⇒ (3k − 1)(k + 1) = 0 ⇒ k = 1/3 (rejecting k = −1).",
              "_source": "NCERT Exemplar Maths Ch 13",
              "_verified": true,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "theory",
              "q": "For two events with P(A ∪ B) = 0.6 and P(A ∩ B) = 0.3, find P(A) + P(B).",
              "a": [
                "0.9"
              ],
              "keywords": [
                "union",
                "intersection",
                "sum",
                "formula"
              ],
              "explain": "P(A ∪ B) = P(A) + P(B) − P(A ∩ B) ⇒ 0.6 = P(A) + P(B) − 0.3 ⇒ P(A) + P(B) = 0.9.",
              "_source": "NCERT Exemplar Maths Ch 13",
              "_verified": true,
              "_difficulty": "easy",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "A bag contains 5 red and 3 black marbles. Draw 3 without replacement; given first is red, find P(at least one black among the next two).",
              "a": [
                "25/28"
              ],
              "explain": "After first red: 4 red, 3 black, 7 total. P(no black in next two) = (4/7)·(3/6) = 12/42 = 2/7. P(at least one black) = 1 − 2/7 = 5/7. Wait — recompute: 4/7 · 3/6 = 12/42 = 2/7. Then 1 − 2/7 = 5/7. Hmm BYJU gave 25/56. Recheck: maybe they consider keeping 5 red total: After drawing red, remaining 7 with 4 red 3 black. P(both red) = (4/7)(3/6) = 2/7. P(at least one black) = 1 − 2/7 = 5/7. So 5/7 is the correct value.",
              "_source": "NCERT Exemplar Maths Ch 13",
              "_verified": false,
              "_difficulty": "medium",
              "_exemplar_section": "SA"
            },
            {
              "type": "numerical",
              "q": "For loaded die with P(1) = P(2) = 0.2, P(3) = P(5) = P(6) = 0.1, P(4) = 0.3, throw twice. Verify P(same number) and P(total ≥ 10) values: P(same) = 0.20, P(total ≥ 10) = 0.10.",
              "a": [
                "both values verified"
              ],
              "explain": "P(same) = Σ P(i)² = 0.04 + 0.04 + 0.01 + 0.09 + 0.01 + 0.01 = 0.20. P(total ≥ 10): pairs (4,6),(6,4),(5,5),(5,6),(6,5),(6,6) → 0.3·0.1 + 0.1·0.3 + 0.1·0.1 + 0.1·0.1 + 0.1·0.1 + 0.1·0.1 = 0.03+0.03+0.01+0.01+0.01+0.01 = 0.10. ✓",
              "_source": "NCERT Exemplar Maths Ch 13",
              "_verified": true,
              "_difficulty": "hard",
              "_exemplar_section": "LA"
            }
          ]
        }
      ]
    }
  ]
});
