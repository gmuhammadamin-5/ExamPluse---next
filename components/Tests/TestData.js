// TestData.js

// Yordamchi funksiyalar (Content Generatsiya)
const generateListeningQuestions = (testNumber) => {
  // Savollar logikasi (qisqartirildi, joy tejash uchun)
  return Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    question: `Sample Question ${i + 1} for Test ${testNumber}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 0
  }));
};

const generateReadingContent = (testNumber) => {
  return [
    { id: 1, title: 'Passage 1', content: 'Text content...', questions: [] },
    { id: 2, title: 'Passage 2', content: 'Text content...', questions: [] },
    { id: 3, title: 'Passage 3', content: 'Text content...', questions: [] }
  ];
};

const generateWritingTasks = (testNumber) => ([
  { task: 1, type: 'chart', description: 'Describe chart' },
  { task: 2, type: 'essay', question: 'Write an essay' }
]);

const generateSpeakingQuestions = (testNumber) => ([
  { part: 1, questions: [] },
  { part: 2, cueCard: {} },
  { part: 3, questions: [] }
]);

const generateListeningAnswers = (id) => ({});
const generateReadingAnswers = (id) => ({});

// ================= ASOSIY GENERATSIYA =================
export const generateMockTests = () => {
  const tests = []
  
  // 1. STANDARD MOCK TESTS (1-20) - ESKILARI
  for (let testNumber = 1; testNumber <= 20; testNumber++) {
    tests.push({
      id: testNumber,
      type: 'mock', // <--- MOCK TYPE
      title: `IELTS Academic Mock Test ${testNumber}`,
      date: new Date().toISOString().split('T')[0],
      difficulty: ['Easy', 'Medium', 'Hard'][testNumber % 3],
      sections: {
        listening: { duration: 30, questions: 40, audioFile: `/audio/mock/test${testNumber}.mp3`, sections: 4 },
        reading: { duration: 60, questions: 40, passages: 3, difficulty: 'Medium' },
        writing: { duration: 60, tasks: 2 },
        speaking: { duration: 11, parts: 3 }
      },
      listening: generateListeningQuestions(testNumber),
      reading: generateReadingContent(testNumber),
      writing: generateWritingTasks(testNumber),
      speaking: generateSpeakingQuestions(testNumber),
      answerKeys: { listening: {}, reading: {} }
    })
  }

  // 2. CAMBRIDGE OFFICIAL TESTS (Books 16-18)
  const books = [16, 17, 18];
  let cambridgeId = 100;

  books.forEach(book => {
    for (let t = 1; t <= 4; t++) {
      cambridgeId++;
      tests.push({
        id: cambridgeId,
        type: 'cambridge', // <--- CAMBRIDGE TYPE
        title: `Cambridge IELTS ${book} Academic Test ${t}`,
        date: 'Official',
        difficulty: 'Hard',
        sections: {
          listening: { duration: 30, questions: 40, audioFile: `/audio/cambridge/b${book}t${t}.mp3`, sections: 4 },
          reading: { duration: 60, questions: 40, passages: 3, difficulty: 'Hard' },
          writing: { duration: 60, tasks: 2 },
          speaking: { duration: 11, parts: 3 }
        },
        listening: generateListeningQuestions(cambridgeId),
        reading: generateReadingContent(cambridgeId),
        writing: generateWritingTasks(cambridgeId),
        speaking: generateSpeakingQuestions(cambridgeId),
        answerKeys: { listening: {}, reading: {} }
      });
    }
  });

  // 3. SKILL PRACTICE (Listening, Reading, etc.)
  const skills = ['Listening', 'Reading', 'Writing', 'Speaking'];
  let skillId = 500;

  skills.forEach(skill => {
    for (let i = 1; i <= 5; i++) {
      skillId++;
      tests.push({
        id: skillId,
        type: 'skill', // <--- SKILL TYPE
        skillCategory: skill.toLowerCase(),
        title: `Intensive ${skill} Practice Vol. ${i}`,
        date: 'Practice',
        difficulty: 'Medium',
        sections: {
          listening: { duration: 30, questions: 40, audioFile: `/audio/skills/${skill}${i}.mp3`, sections: 4 },
          reading: { duration: 60, questions: 40, passages: 3, difficulty: 'Medium' },
          writing: { duration: 60, tasks: 2 },
          speaking: { duration: 11, parts: 3 }
        },
        listening: generateListeningQuestions(skillId),
        reading: generateReadingContent(skillId),
        writing: generateWritingTasks(skillId),
        speaking: generateSpeakingQuestions(skillId),
        answerKeys: { listening: {}, reading: {} }
      });
    }
  });
  
  return tests
}

export const mockTestData = generateMockTests()

export const getTestById = (id) => {
  const tests = generateMockTests()
  return tests.find(test => test.id == id) || tests[0]
}

export const calculateBandScore = (correct, total) => {
  const percentage = (correct / total) * 100
  if (percentage >= 90) return 9.0
  if (percentage >= 80) return 8.0
  if (percentage >= 70) return 7.0
  if (percentage >= 60) return 6.0
  if (percentage >= 50) return 5.0
  return 4.0
}