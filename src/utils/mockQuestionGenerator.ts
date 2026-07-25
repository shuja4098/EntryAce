import { MCQ } from '../types';
import { QUESTION_BANK } from '../data/questions';

export interface MockTestConfig {
  university: 'NED' | 'FAST';
  subject: string; // 'All' | 'Mathematics' | 'Physics' | 'Chemistry' | 'English' | 'IQ'
  questionCount: number; // 20 | 50 | 100
  difficulty: string; // 'All' | 'easy' | 'medium' | 'hard'
}

// Helper to shuffle array randomly
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Procedurally generate additional realistic past-paper MCQs for NED & FAST if needed
function generateSyntheticQuestion(
  uni: 'NED' | 'FAST',
  subject: string,
  index: number
): MCQ {
  const topicsMap: Record<string, string[]> = {
    Mathematics: ['Calculus & Analytic Geometry', 'Vectors & Matrices', 'Trigonometry & Functions', 'Basic & Advanced Algebra'],
    Physics: ['Motion, Work & Energy', 'Electromagnetism & Circuits', 'Vectors & Equilibrium', 'Waves, Sound & Optics'],
    Chemistry: ['Chemical Kinetics & Equilibrium', 'Atomic Structure & Bonding', 'Organic Reactions & Hydrocarbons'],
    English: ['Vocabulary & Synonyms', 'Sentence Correction & Prepositions', 'Reading Comprehension'],
    IQ: ['Number & Letter Series', 'Analytical & Spatial Reasoning', 'Logical Deduction & Coding']
  };

  const topicList = topicsMap[subject] || ['General Concept'];
  const topic = topicList[index % topicList.length];

  if (subject === 'Mathematics') {
    const a = (index % 5) + 2;
    const b = (index % 4) + 3;
    return {
      id: `gen-math-${uni}-${index}`,
      universityId: uni,
      subject: 'Mathematics',
      topic,
      question: `Evaluate the derivative of f(x) = ${a}x³ + ${b}x² - ${index + 1}x + 7 at x = 1.`,
      options: [
        { id: 'a', text: `${3 * a + 2 * b - (index + 1)}` },
        { id: 'b', text: `${3 * a + b}` },
        { id: 'c', text: `${a * b - index}` },
        { id: 'd', text: `${6 * a + 2 * b}` }
      ],
      correctOptionId: 'a',
      explanation: `f'(x) = 3(${a})x² + 2(${b})x - ${index + 1}. Substituting x = 1 gives 3(${a}) + 2(${b}) - (${index + 1}) = ${3 * a + 2 * b - (index + 1)}.`,
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard'
    };
  }

  if (subject === 'Physics') {
    const mass = (index % 5) + 1;
    const accel = (index % 4) + 2;
    return {
      id: `gen-phy-${uni}-${index}`,
      universityId: uni,
      subject: 'Physics',
      topic,
      question: `A force acts on a body of mass ${mass} kg producing an acceleration of ${accel} m/s². What is the magnitude of the net force?`,
      options: [
        { id: 'a', text: `${mass * accel} N` },
        { id: 'b', text: `${mass + accel} N` },
        { id: 'c', text: `${mass * accel * 2} N` },
        { id: 'd', text: `${Math.round(mass / accel)} N` }
      ],
      correctOptionId: 'a',
      explanation: `According to Newton's Second Law of Motion: F = m · a = ${mass} kg × ${accel} m/s² = ${mass * accel} N.`,
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard'
    };
  }

  if (subject === 'Chemistry') {
    return {
      id: `gen-chem-${uni}-${index}`,
      universityId: uni,
      subject: 'Chemistry',
      topic,
      question: `Which hybridisation is present in the central atom of methane (CH₄) and water (H₂O)?`,
      options: [
        { id: 'a', text: 'sp³ in both CH₄ and H₂O' },
        { id: 'b', text: 'sp² in CH₄ and sp³ in H₂O' },
        { id: 'c', text: 'sp³ in CH₄ and sp² in H₂O' },
        { id: 'd', text: 'sp in CH₄ and sp³ in H₂O' }
      ],
      correctOptionId: 'a',
      explanation: 'Both CH₄ (4 bonding pairs) and H₂O (2 bonding pairs + 2 lone pairs) have 4 electron domains, corresponding to sp³ hybridisation.',
      difficulty: 'easy'
    };
  }

  if (subject === 'English') {
    const vocabList = [
      { word: 'CANDID', syn: 'Frank & Outspoken', ant: 'Deceitful' },
      { word: 'PRUDENT', syn: 'Wise & Cautious', ant: 'Reckless' },
      { word: 'LUCID', syn: 'Clear & Intelligible', ant: 'Vague' },
      { word: 'TENACIOUS', syn: 'Persistent & Firm', ant: 'Yielding' },
    ];
    const item = vocabList[index % vocabList.length];
    return {
      id: `gen-eng-${uni}-${index}`,
      universityId: uni,
      subject: 'English',
      topic,
      question: `Choose the word most nearly SYNONYMOUS to "${item.word}":`,
      options: [
        { id: 'a', text: item.syn },
        { id: 'b', text: item.ant },
        { id: 'c', text: 'Irrelevant' },
        { id: 'd', text: 'Superficial' }
      ],
      correctOptionId: 'a',
      explanation: `The word "${item.word}" means ${item.syn}.`,
      difficulty: 'easy'
    };
  }

  // Default IQ
  const n = (index % 6) + 2;
  return {
    id: `gen-iq-${uni}-${index}`,
    universityId: uni,
    subject: 'IQ',
    topic,
    question: `What is the missing number in the sequence: ${n}, ${n * 2}, ${n * 4}, ${n * 8}, ?`,
    options: [
      { id: 'a', text: `${n * 16}` },
      { id: 'b', text: `${n * 12}` },
      { id: 'c', text: `${n * 10}` },
      { id: 'd', text: `${n * 32}` }
    ],
    correctOptionId: 'a',
    explanation: `Pattern: Multiply each term by 2. Thus, ${n * 8} × 2 = ${n * 16}.`,
    difficulty: 'easy'
  };
}

export function generateMockQuestions(config: MockTestConfig): MCQ[] {
  // Filter questions matching university
  let pool = QUESTION_BANK.filter(
    (q) => q.universityId === config.university || q.universityId === 'ALL'
  );

  // Filter by subject if specified
  if (config.subject !== 'All') {
    pool = pool.filter((q) => q.subject.toLowerCase() === config.subject.toLowerCase());
  }

  // Filter by difficulty if specified
  if (config.difficulty !== 'All') {
    const diffPool = pool.filter((q) => q.difficulty === config.difficulty);
    if (diffPool.length > 0) {
      pool = diffPool;
    }
  }

  // Shuffle pool randomly
  let result = shuffleArray(pool);

  // If pool has fewer questions than requested config.questionCount, expand with synthetic questions
  if (result.length < config.questionCount) {
    const needed = config.questionCount - result.length;
    const subjects = config.subject === 'All' 
      ? ['Mathematics', 'Physics', 'Chemistry', 'English', 'IQ']
      : [config.subject];

    for (let i = 0; i < needed; i++) {
      const sub = subjects[i % subjects.length];
      result.push(generateSyntheticQuestion(config.university, sub, i + 1));
    }
  }

  // Slice exactly to questionCount and shuffle again
  return shuffleArray(result.slice(0, config.questionCount));
}
