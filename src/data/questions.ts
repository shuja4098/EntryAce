import { MCQ } from '../types';

export interface Chapter {
  id: string;
  name: string;
  subject: string;
  universityId: 'NED' | 'FAST' | 'ALL';
  questionCount: number;
}

export const CHAPTERS: Chapter[] = [
  // NED Mathematics
  { id: 'math-calculus', name: 'Calculus & Analytic Geometry', subject: 'Mathematics', universityId: 'NED', questionCount: 15 },
  { id: 'math-vectors', name: 'Vectors & Matrices', subject: 'Mathematics', universityId: 'NED', questionCount: 12 },
  { id: 'math-trig', name: 'Trigonometry & Functions', subject: 'Mathematics', universityId: 'NED', questionCount: 10 },
  { id: 'math-complex', name: 'Complex Numbers & Equations', subject: 'Mathematics', universityId: 'NED', questionCount: 8 },

  // FAST Mathematics
  { id: 'fast-algebra', name: 'Basic & Advanced Algebra', subject: 'Mathematics', universityId: 'FAST', questionCount: 14 },
  { id: 'fast-calculus', name: 'Calculus & Functions', subject: 'Mathematics', universityId: 'FAST', questionCount: 12 },
  { id: 'fast-geometry', name: 'Coordinate Geometry', subject: 'Mathematics', universityId: 'FAST', questionCount: 10 },

  // NED Physics
  { id: 'phy-vectors', name: 'Vectors & Equilibrium', subject: 'Physics', universityId: 'NED', questionCount: 12 },
  { id: 'phy-motion', name: 'Motion, Work & Energy', subject: 'Physics', universityId: 'NED', questionCount: 15 },
  { id: 'phy-em', name: 'Electromagnetism & Circuits', subject: 'Physics', universityId: 'NED', questionCount: 14 },
  { id: 'phy-waves', name: 'Waves, Sound & Optics', subject: 'Physics', universityId: 'NED', questionCount: 10 },

  // NED Chemistry
  { id: 'chem-kinetics', name: 'Chemical Kinetics & Equilibrium', subject: 'Chemistry', universityId: 'NED', questionCount: 10 },
  { id: 'chem-atomic', name: 'Atomic Structure & Bonding', subject: 'Chemistry', universityId: 'NED', questionCount: 12 },
  { id: 'chem-organic', name: 'Organic Reactions & Hydrocarbons', subject: 'Chemistry', universityId: 'NED', questionCount: 15 },

  // NED & FAST English
  { id: 'eng-vocab', name: 'Vocabulary & Synonyms', subject: 'English', universityId: 'ALL', questionCount: 15 },
  { id: 'eng-grammar', name: 'Sentence Correction & Prepositions', subject: 'English', universityId: 'ALL', questionCount: 12 },
  { id: 'eng-comp', name: 'Reading Comprehension', subject: 'English', universityId: 'ALL', questionCount: 10 },

  // NED & FAST IQ
  { id: 'iq-series', name: 'Number & Letter Series', subject: 'IQ', universityId: 'ALL', questionCount: 12 },
  { id: 'iq-analytic', name: 'Analytical & Spatial Reasoning', subject: 'IQ', universityId: 'ALL', questionCount: 15 },
  { id: 'iq-logic', name: 'Logical Deduction & Coding', subject: 'IQ', universityId: 'ALL', questionCount: 10 },
];

export const QUESTION_BANK: MCQ[] = [
  // --- MATHEMATICS (NED) ---
  {
    id: 'math-1',
    universityId: 'NED',
    subject: 'Mathematics',
    topic: 'Calculus & Analytic Geometry',
    question: 'Find the derivative of f(x) = x³ · e^(2x) with respect to x.',
    options: [
      { id: 'a', text: '3x² e^(2x)' },
      { id: 'b', text: 'x² e^(2x) (3 + 2x)' },
      { id: 'c', text: '2x³ e^(2x)' },
      { id: 'd', text: '6x² e^(2x)' }
    ],
    correctOptionId: 'b',
    explanation: 'Using the product rule d/dx [u · v] = u\'v + uv\':\nd/dx [x³ · e^(2x)] = 3x² · e^(2x) + x³ · 2e^(2x) = x² e^(2x) (3 + 2x).',
    difficulty: 'medium'
  },
  {
    id: 'math-2',
    universityId: 'NED',
    subject: 'Mathematics',
    topic: 'Calculus & Analytic Geometry',
    question: 'Evaluate the definite integral ∫₀^(π/2) sin³(x) cos(x) dx.',
    options: [
      { id: 'a', text: '1/4' },
      { id: 'b', text: '1/2' },
      { id: 'c', text: '1/3' },
      { id: 'd', text: '1' }
    ],
    correctOptionId: 'a',
    explanation: 'Let u = sin(x), then du = cos(x) dx. When x = 0, u = 0; when x = π/2, u = 1.\nIntegral becomes ∫₀¹ u³ du = [u⁴ / 4]₀¹ = 1/4.',
    difficulty: 'medium'
  },
  {
    id: 'math-3',
    universityId: 'NED',
    subject: 'Mathematics',
    topic: 'Vectors & Matrices',
    question: 'If vector A = 2i + 3j - k and B = i - j + 2k, find the dot product A · B.',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '-3' },
      { id: 'c', text: '7' },
      { id: 'd', text: '-1' }
    ],
    correctOptionId: 'b',
    explanation: 'A · B = (2)(1) + (3)(-1) + (-1)(2) = 2 - 3 - 2 = -3.',
    difficulty: 'easy'
  },
  {
    id: 'math-4',
    universityId: 'NED',
    subject: 'Mathematics',
    topic: 'Trigonometry & Functions',
    question: 'Find the maximum value of f(θ) = 3 sin(θ) + 4 cos(θ).',
    options: [
      { id: 'a', text: '7' },
      { id: 'b', text: '5' },
      { id: 'c', text: '12' },
      { id: 'd', text: '1' }
    ],
    correctOptionId: 'b',
    explanation: 'The expression a sin(θ) + b cos(θ) has maximum value √(a² + b²) = √(3² + 4²) = √25 = 5.',
    difficulty: 'easy'
  },

  // --- MATHEMATICS (FAST) ---
  {
    id: 'fast-math-1',
    universityId: 'FAST',
    subject: 'Mathematics',
    topic: 'Basic & Advanced Algebra',
    question: 'If log₂(x) + log₂(x - 2) = 3, solve for x.',
    options: [
      { id: 'a', text: 'x = 4' },
      { id: 'b', text: 'x = -2' },
      { id: 'c', text: 'x = 2' },
      { id: 'd', text: 'x = 8' }
    ],
    correctOptionId: 'a',
    explanation: 'log₂(x(x - 2)) = 3 => x(x - 2) = 2³ = 8 => x² - 2x - 8 = 0 => (x - 4)(x + 2) = 0. Since log argument must be positive, x = 4.',
    difficulty: 'medium'
  },
  {
    id: 'fast-math-2',
    universityId: 'FAST',
    subject: 'Mathematics',
    topic: 'Calculus & Functions',
    question: 'Find lim (x → 0) [(1 - cos(2x)) / x²].',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: '2' },
      { id: 'd', text: '4' }
    ],
    correctOptionId: 'c',
    explanation: 'Recall 1 - cos(2x) = 2 sin²(x). Thus lim (x→0) 2 (sin(x)/x)² = 2(1)² = 2.',
    difficulty: 'medium'
  },

  // --- PHYSICS (NED) ---
  {
    id: 'phy-1',
    universityId: 'NED',
    subject: 'Physics',
    topic: 'Vectors & Equilibrium',
    question: 'Two forces of equal magnitude F act at an angle of 60° to each other. What is the magnitude of their resultant force?',
    options: [
      { id: 'a', text: 'F' },
      { id: 'b', text: '√2 F' },
      { id: 'c', text: '√3 F' },
      { id: 'd', text: '2F' }
    ],
    correctOptionId: 'c',
    explanation: 'R = √(F² + F² + 2F² cos(60°)) = √(2F² + 2F² (0.5)) = √(3F²) = √3 F.',
    difficulty: 'easy'
  },
  {
    id: 'phy-2',
    universityId: 'NED',
    subject: 'Physics',
    topic: 'Motion, Work & Energy',
    question: 'A body of mass 2 kg is projected vertically upwards with a velocity of 20 m/s. What is its kinetic energy at maximum height?',
    options: [
      { id: 'a', text: '400 J' },
      { id: 'b', text: '200 J' },
      { id: 'c', text: '0 J' },
      { id: 'd', text: '100 J' }
    ],
    correctOptionId: 'c',
    explanation: 'At maximum height, the vertical velocity becomes zero (v = 0). Therefore, Kinetic Energy = ½ m v² = 0 J.',
    difficulty: 'easy'
  },
  {
    id: 'phy-3',
    universityId: 'NED',
    subject: 'Physics',
    topic: 'Electromagnetism & Circuits',
    question: 'A wire of resistance R is stretched so that its length becomes double while volume remains constant. What is the new resistance?',
    options: [
      { id: 'a', text: '2R' },
      { id: 'b', text: '4R' },
      { id: 'c', text: 'R/2' },
      { id: 'd', text: 'R/4' }
    ],
    correctOptionId: 'b',
    explanation: 'R = ρ L / A. When length L becomes 2L, area A becomes A/2 (since volume V = A·L is constant). New R\' = ρ (2L) / (A/2) = 4 (ρ L / A) = 4R.',
    difficulty: 'medium'
  },

  // --- CHEMISTRY (NED) ---
  {
    id: 'chem-1',
    universityId: 'NED',
    subject: 'Chemistry',
    topic: 'Chemical Kinetics & Equilibrium',
    question: 'For a first-order reaction, if the initial concentration is doubled, how does the half-life (t₁/₂) change?',
    options: [
      { id: 'a', text: 'It is doubled' },
      { id: 'b', text: 'It is halved' },
      { id: 'c', text: 'It remains unchanged' },
      { id: 'd', text: 'It quadruples' }
    ],
    correctOptionId: 'c',
    explanation: 'For first-order reactions, t₁/₂ = 0.693 / k. The half-life is completely independent of initial reactant concentration.',
    difficulty: 'easy'
  },
  {
    id: 'chem-2',
    universityId: 'NED',
    subject: 'Chemistry',
    topic: 'Atomic Structure & Bonding',
    question: 'Which of the following molecules has a linear geometry according to VSEPR theory?',
    options: [
      { id: 'a', text: 'H₂O' },
      { id: 'b', text: 'CO₂' },
      { id: 'c', text: 'SO₂' },
      { id: 'd', text: 'NH₃' }
    ],
    correctOptionId: 'b',
    explanation: 'CO₂ has two double bonds and no lone pairs on the central carbon atom (sp hybridization), giving it a 180° linear shape.',
    difficulty: 'easy'
  },

  // --- ENGLISH (NED & FAST) ---
  {
    id: 'eng-1',
    universityId: 'NED',
    subject: 'English',
    topic: 'Vocabulary & Synonyms',
    question: 'Choose the word that is most nearly SYNONYMOUS to "METICULOUS":',
    options: [
      { id: 'a', text: 'Careless' },
      { id: 'b', text: 'Punctilious & Painstaking' },
      { id: 'c', text: 'Hastily performed' },
      { id: 'd', text: 'Superficial' }
    ],
    correctOptionId: 'b',
    explanation: 'Meticulous means showing great attention to detail; very careful and precise (synonyms: painstaking, thorough, punctilious).',
    difficulty: 'easy'
  },
  {
    id: 'eng-2',
    universityId: 'NED',
    subject: 'English',
    topic: 'Sentence Correction & Prepositions',
    question: 'Fill in the blank: "The candidate was accustomed _____ working under immense pressure."',
    options: [
      { id: 'a', text: 'with' },
      { id: 'b', text: 'to' },
      { id: 'c', text: 'for' },
      { id: 'd', text: 'in' }
    ],
    correctOptionId: 'b',
    explanation: 'The adjective "accustomed" takes the fixed preposition "to" followed by a gerund or noun (e.g., accustomed to working).',
    difficulty: 'easy'
  },

  // --- IQ (NED & FAST) ---
  {
    id: 'iq-1',
    universityId: 'NED',
    subject: 'IQ',
    topic: 'Number & Letter Series',
    question: 'Find the missing number in the sequence: 3, 7, 15, 31, 63, ?',
    options: [
      { id: 'a', text: '127' },
      { id: 'b', text: '125' },
      { id: 'c', text: '128' },
      { id: 'd', text: '130' }
    ],
    correctOptionId: 'a',
    explanation: 'Pattern: Each term is multiplied by 2 and then add 1 (n × 2 + 1).\n63 × 2 + 1 = 126 + 1 = 127.',
    difficulty: 'easy'
  },
  {
    id: 'iq-2',
    universityId: 'FAST',
    subject: 'IQ',
    topic: 'Logical Deduction & Coding',
    question: 'In a certain code language, "PYTHON" is coded as "QZUIPO". How is "ENTRY" coded in that language?',
    options: [
      { id: 'a', text: 'FOUSZ' },
      { id: 'b', text: 'FMUSZ' },
      { id: 'c', text: 'DNSQX' },
      { id: 'd', text: 'FOUUZ' }
    ],
    correctOptionId: 'a',
    explanation: 'Each letter is shifted forward by +1 in the alphabet:\nE -> F, N -> O, T -> U, R -> S, Y -> Z = FOUSZ.',
    difficulty: 'easy'
  },

  // --- MORE MATH (NED & FAST) ---
  {
    id: 'math-5',
    universityId: 'NED',
    subject: 'Mathematics',
    topic: 'Calculus & Analytic Geometry',
    question: 'Find the radius of curvature at the point (0,0) for the curve y = x³ - 3x² + 2x.',
    options: [
      { id: 'a', text: '5√5 / 6' },
      { id: 'b', text: '5√5 / 3' },
      { id: 'c', text: '√5 / 6' },
      { id: 'd', text: '2√5 / 3' }
    ],
    correctOptionId: 'a',
    explanation: 'Formula for radius of curvature ρ = [1 + (y\')²]^(3/2) / |y\'\'|. Here y\'(0) = 2, y\'\'(0) = -6. Therefore ρ = (1 + 4)^(3/2) / |-6| = 5√5 / 6.',
    difficulty: 'hard'
  },
  {
    id: 'math-6',
    universityId: 'FAST',
    subject: 'Mathematics',
    topic: 'Basic & Advanced Algebra',
    question: 'How many terms are in the expansion of (2x + 3y - z)^8 ?',
    options: [
      { id: 'a', text: '9' },
      { id: 'b', text: '28' },
      { id: 'c', text: '45' },
      { id: 'd', text: '36' }
    ],
    correctOptionId: 'c',
    explanation: 'Number of terms in the expansion of (x₁ + x₂ + ... + xₖ)^n is ⁽ⁿ⁺ᵏ⁻¹⁾C⁽ᵏ⁻¹⁾. Here n=8, k=3 => ⁽⁸⁺³⁻¹⁾C⁽³⁻¹⁾ = ¹⁰C₂ = (10 × 9)/2 = 45.',
    difficulty: 'medium'
  },
  {
    id: 'math-7',
    universityId: 'NED',
    subject: 'Mathematics',
    topic: 'Vectors & Matrices',
    question: 'If matrix A is symmetric and matrix B is skew-symmetric, then A · B - B · A is always:',
    options: [
      { id: 'a', text: 'Symmetric matrix' },
      { id: 'b', text: 'Skew-symmetric matrix' },
      { id: 'c', text: 'Identity matrix' },
      { id: 'd', text: 'Null matrix' }
    ],
    correctOptionId: 'a',
    explanation: '(AB - BA)ᵀ = (AB)ᵀ - (BA)ᵀ = BᵀAᵀ - AᵀBᵀ = (-B)(A) - (A)(-B) = -BA + AB = AB - BA. Since transpose equals itself, it is symmetric.',
    difficulty: 'hard'
  },
  {
    id: 'math-8',
    universityId: 'FAST',
    subject: 'Mathematics',
    topic: 'Calculus & Functions',
    question: 'If f(x) = e^(x²), find f\'\'(x).',
    options: [
      { id: 'a', text: '2 e^(x²)' },
      { id: 'b', text: '4x² e^(x²)' },
      { id: 'c', text: '2 e^(x²) (1 + 2x²)' },
      { id: 'd', text: '4x e^(x²)' }
    ],
    correctOptionId: 'c',
    explanation: 'f\'(x) = 2x e^(x²). By product rule, f\'\'(x) = 2 e^(x²) + 2x(2x e^(x²)) = 2 e^(x²) (1 + 2x²).',
    difficulty: 'medium'
  },
  {
    id: 'math-9',
    universityId: 'NED',
    subject: 'Mathematics',
    topic: 'Complex Numbers & Equations',
    question: 'Find the modulus of z = (1 + i√3) / (1 + i).',
    options: [
      { id: 'a', text: '√2' },
      { id: 'b', text: '2' },
      { id: 'c', text: '1/√2' },
      { id: 'd', text: '1' }
    ],
    correctOptionId: 'a',
    explanation: '|z| = |1 + i√3| / |1 + i| = √(1² + (√3)²) / √(1² + 1²) = √4 / √2 = 2 / √2 = √2.',
    difficulty: 'easy'
  },
  {
    id: 'math-10',
    universityId: 'NED',
    subject: 'Mathematics',
    topic: 'Trigonometry & Functions',
    question: 'What is the period of the function f(x) = sin(4x) + cos(2x)?',
    options: [
      { id: 'a', text: 'π/2' },
      { id: 'b', text: 'π' },
      { id: 'c', text: '2π' },
      { id: 'd', text: 'π/4' }
    ],
    correctOptionId: 'b',
    explanation: 'Period of sin(4x) is 2π/4 = π/2. Period of cos(2x) is 2π/2 = π. LCM of π/2 and π is π.',
    difficulty: 'medium'
  },

  // --- MORE PHYSICS (NED & FAST) ---
  {
    id: 'phy-4',
    universityId: 'NED',
    subject: 'Physics',
    topic: 'Motion, Work & Energy',
    question: 'A projectile is fired at an angle of 45° with an initial velocity of 20 m/s (g = 10 m/s²). Find its horizontal range.',
    options: [
      { id: 'a', text: '20 m' },
      { id: 'b', text: '40 m' },
      { id: 'c', text: '80 m' },
      { id: 'd', text: '10 m' }
    ],
    correctOptionId: 'b',
    explanation: 'R = v₀² sin(2θ) / g = (20² × sin(90°)) / 10 = (400 × 1) / 10 = 40 meters.',
    difficulty: 'easy'
  },
  {
    id: 'phy-5',
    universityId: 'NED',
    subject: 'Physics',
    topic: 'Electromagnetism & Circuits',
    question: 'An ideal transformer has 500 primary turns and 50 secondary turns. If the input primary voltage is 220V AC, what is the output voltage?',
    options: [
      { id: 'a', text: '22V' },
      { id: 'b', text: '2200V' },
      { id: 'c', text: '110V' },
      { id: 'd', text: '44V' }
    ],
    correctOptionId: 'a',
    explanation: 'Vs / Vp = Ns / Np => Vs = 220 × (50 / 500) = 220 × 0.1 = 22 Volts.',
    difficulty: 'easy'
  },
  {
    id: 'phy-6',
    universityId: 'NED',
    subject: 'Physics',
    topic: 'Waves, Sound & Optics',
    question: 'If the intensity of a sound wave is increased by a factor of 100, by how many decibels (dB) does the sound level increase?',
    options: [
      { id: 'a', text: '10 dB' },
      { id: 'b', text: '20 dB' },
      { id: 'c', text: '100 dB' },
      { id: 'd', text: '50 dB' }
    ],
    correctOptionId: 'b',
    explanation: 'Δβ = 10 log₁₀(I₂ / I₁) = 10 log₁₀(100) = 10 × 2 = 20 dB.',
    difficulty: 'medium'
  },
  {
    id: 'phy-7',
    universityId: 'FAST',
    subject: 'Physics',
    topic: 'Motion, Work & Energy',
    question: 'An object of mass m moves in a circle of radius r with uniform speed v. What is the work done by the centripetal force during one full revolution?',
    options: [
      { id: 'a', text: '2πr · (mv²/r)' },
      { id: 'b', text: '½ m v²' },
      { id: 'c', text: '0 J' },
      { id: 'd', text: 'm v²' }
    ],
    correctOptionId: 'c',
    explanation: 'Centripetal force is always perpendicular to instantaneous displacement vector (F ⊥ d => θ = 90°). W = F d cos(90°) = 0 J.',
    difficulty: 'easy'
  },
  {
    id: 'phy-8',
    universityId: 'NED',
    subject: 'Physics',
    topic: 'Electromagnetism & Circuits',
    question: 'Two point charges +q and -q are separated by distance d. The electric potential at the midpoint between them is:',
    options: [
      { id: 'a', text: 'Zero' },
      { id: 'b', text: '2kq / d' },
      { id: 'c', text: '4kq / d' },
      { id: 'd', text: 'kq / (2d)' }
    ],
    correctOptionId: 'a',
    explanation: 'V = V₁ + V₂ = k(+q)/(d/2) + k(-q)/(d/2) = 0.',
    difficulty: 'easy'
  },

  // --- MORE CHEMISTRY (NED) ---
  {
    id: 'chem-3',
    universityId: 'NED',
    subject: 'Chemistry',
    topic: 'Organic Reactions & Hydrocarbons',
    question: 'Which reagent is used in Lucas Test to distinguish between primary, secondary, and tertiary alcohols?',
    options: [
      { id: 'a', text: 'Anhydrous ZnCl₂ + Conc. HCl' },
      { id: 'b', text: 'KMnO₄ + NaOH' },
      { id: 'c', text: 'AgNO₃ + NH₄OH' },
      { id: 'd', text: 'FeCl₃ Solution' }
    ],
    correctOptionId: 'a',
    explanation: 'Lucas reagent is a solution of anhydrous zinc chloride (ZnCl₂) in concentrated hydrochloric acid (HCl).',
    difficulty: 'medium'
  },
  {
    id: 'chem-4',
    universityId: 'NED',
    subject: 'Chemistry',
    topic: 'Chemical Kinetics & Equilibrium',
    question: 'For the reaction N₂ (g) + 3H₂ (g) ⇌ 2NH₃ (g) + Heat, according to Le Chatelier\'s principle, maximum yield of NH₃ is obtained at:',
    options: [
      { id: 'a', text: 'High pressure and low temperature' },
      { id: 'b', text: 'Low pressure and high temperature' },
      { id: 'c', text: 'High pressure and high temperature' },
      { id: 'd', text: 'Low pressure and low temperature' }
    ],
    correctOptionId: 'a',
    explanation: 'The forward reaction is exothermic and reduces gaseous moles (4 moles -> 2 moles). Hence high pressure and lower temperature favor forward reaction.',
    difficulty: 'medium'
  },
  {
    id: 'chem-5',
    universityId: 'NED',
    subject: 'Chemistry',
    topic: 'Atomic Structure & Bonding',
    question: 'Which quantum number determines the spatial orientation of an atomic orbital?',
    options: [
      { id: 'a', text: 'Principal quantum number (n)' },
      { id: 'b', text: 'Azimuthal quantum number (l)' },
      { id: 'c', text: 'Magnetic quantum number (m)' },
      { id: 'd', text: 'Spin quantum number (s)' }
    ],
    correctOptionId: 'c',
    explanation: 'Magnetic quantum number (m) describes the 3D spatial orientation of the orbital in space relative to a magnetic field.',
    difficulty: 'easy'
  },

  // --- MORE ENGLISH (NED & FAST) ---
  {
    id: 'eng-3',
    universityId: 'ALL',
    subject: 'English',
    topic: 'Vocabulary & Synonyms',
    question: 'Choose the ANTONYM of the word "EPHEMERAL":',
    options: [
      { id: 'a', text: 'Fleeting' },
      { id: 'b', text: 'Transient' },
      { id: 'c', text: 'Perpetual & Eternal' },
      { id: 'd', text: 'Momentary' }
    ],
    correctOptionId: 'c',
    explanation: 'Ephemeral means lasting for a very short time. Its opposite is perpetual, permanent, or eternal.',
    difficulty: 'easy'
  },
  {
    id: 'eng-4',
    universityId: 'ALL',
    subject: 'English',
    topic: 'Sentence Correction & Prepositions',
    question: 'Identify the grammatically correct sentence:',
    options: [
      { id: 'a', text: 'Neither the teacher nor the students was present.' },
      { id: 'b', text: 'Neither the teacher nor the students were present.' },
      { id: 'c', text: 'Neither the teacher nor the students is present.' },
      { id: 'd', text: 'Neither teacher nor students has been present.' }
    ],
    correctOptionId: 'b',
    explanation: 'When subjects are joined by "neither... nor", the verb agrees with the subject closest to it ("students" -> plural verb "were").',
    difficulty: 'medium'
  },
  {
    id: 'eng-5',
    universityId: 'ALL',
    subject: 'English',
    topic: 'Reading Comprehension',
    question: 'What does the idiom "To burn the midnight oil" mean?',
    options: [
      { id: 'a', text: 'To waste fuel carelessly' },
      { id: 'b', text: 'To work or study late into the night' },
      { id: 'c', text: 'To cause an accidental fire' },
      { id: 'd', text: 'To sleep early before an exam' }
    ],
    correctOptionId: 'b',
    explanation: 'To burn the midnight oil means to study or perform diligent work late into the night.',
    difficulty: 'easy'
  },

  // --- MORE IQ & ANALYTICAL (NED & FAST) ---
  {
    id: 'iq-3',
    universityId: 'ALL',
    subject: 'IQ',
    topic: 'Number & Letter Series',
    question: 'Find the next pair of letters in the series: AZ, CX, EV, GT, ?',
    options: [
      { id: 'a', text: 'IR' },
      { id: 'b', text: 'HS' },
      { id: 'c', text: 'JQ' },
      { id: 'd', text: 'KP' }
    ],
    correctOptionId: 'a',
    explanation: 'First letters: A(+2) -> C(+2) -> E(+2) -> G(+2) -> I.\nSecond letters: Z(-2) -> X(-2) -> V(-2) -> T(-2) -> R.\nResult: IR.',
    difficulty: 'easy'
  },
  {
    id: 'iq-4',
    universityId: 'FAST',
    subject: 'IQ',
    topic: 'Analytical & Spatial Reasoning',
    question: 'Pointing to a photograph, Ali said, "He is the son of the only daughter of my father\'s mother." How is Ali related to the man in the photo?',
    options: [
      { id: 'a', text: 'Brother' },
      { id: 'b', text: 'Cousin' },
      { id: 'c', text: 'Uncle' },
      { id: 'd', text: 'Father' }
    ],
    correctOptionId: 'b',
    explanation: 'Ali\'s father\'s mother = Ali\'s grandmother. Only daughter of grandmother = Ali\'s aunt. Son of aunt = Ali\'s cousin.',
    difficulty: 'medium'
  },
  {
    id: 'iq-5',
    universityId: 'ALL',
    subject: 'IQ',
    topic: 'Logical Deduction & Coding',
    question: 'If 5 workers take 5 days to complete 5 tasks, how many days will 100 workers take to complete 100 tasks?',
    options: [
      { id: 'a', text: '100 days' },
      { id: 'b', text: '5 days' },
      { id: 'c', text: '25 days' },
      { id: 'd', text: '1 day' }
    ],
    correctOptionId: 'b',
    explanation: 'Formula: (Workers₁ × Days₁) / Tasks₁ = (Workers₂ × Days₂) / Tasks₂.\n(5 × 5)/5 = (100 × D₂)/100 => 5 = D₂. So it takes 5 days.',
    difficulty: 'medium'
  },
  {
    id: 'iq-6',
    universityId: 'FAST',
    subject: 'IQ',
    topic: 'Number & Letter Series',
    question: 'Which number does NOT belong in the set: 2, 3, 5, 7, 11, 13, 15, 17?',
    options: [
      { id: 'a', text: '13' },
      { id: 'b', text: '15' },
      { id: 'c', text: '17' },
      { id: 'd', text: '9' }
    ],
    correctOptionId: 'b',
    explanation: 'All other numbers in the set are prime numbers. 15 is a composite number (3 × 5).',
    difficulty: 'easy'
  }
];
