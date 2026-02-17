// testDataGenerator.js
export const generateListeningQuestions = (testNumber) => {
    const questions = []

    // Section 1 (10 questions)
    for (let i = 1; i <= 10; i++) {
        questions.push({
            id: i,
            type: i <= 5 ? 'multiple-choice' : 'form-completion',
            question: getListeningQuestion(i, testNumber),
            options: i <= 5 ? getMCQOptions(testNumber, i) : null,
            correctAnswer: i <= 5 ? Math.floor(Math.random() * 4) : getFormAnswer(i, testNumber),
            audioTimestamp: (i - 1) * 45,
            explanation: getListeningExplanation(i, testNumber)
        })
    }

    // ... qolgan section'lar uchun

    return questions
}

export const generateReadingPassages = (testNumber) => {
    const passages = []
    const topics = [
        'Climate Change and Its Effects',
        'The History of Telecommunications',
        'Psychological Theories of Learning',
        'Renewable Energy Technologies',
        'Ancient Civilizations'
    ]

    for (let i = 0; i < 3; i++) {
        passages.push({
            id: i + 1,
            title: `Passage ${i + 1}: ${topics[(testNumber + i) % topics.length]}`,
            content: generatePassageContent(testNumber, i),
            wordCount: 800 + Math.floor(Math.random() * 200),
            difficulty: ['Medium', 'Hard', 'Very Hard'][i],
            questions: generateReadingQuestionsForPassage(testNumber, i + 1)
        })
    }

    return passages
}

export const generateWritingTasks = (testNumber) => {
    return [
        {
            type: 'Academic Writing Task 1',
            question: getTask1Question(testNumber),
            chartData: generateChartData(testNumber),
            minWords: 150,
            usefulPhrases: getTask1Phrases(testNumber)
        },
        {
            type: 'Academic Writing Task 2',
            question: getTask2Question(testNumber),
            essayQuestion: getEssayPrompt(testNumber),
            minWords: 250,
            usefulPhrases: getTask2Phrases(testNumber)
        }
    ]
}

export const generateSpeakingQuestions = (testNumber) => {
    return [
        {
            part: 1,
            question: getPart1Question(testNumber),
            followUpQuestions: getFollowUpQuestions(testNumber, 1),
            tips: [
                'Give detailed answers',
                'Use personal examples',
                'Speak naturally and fluently'
            ],
            sampleAnswer: getSampleAnswer(testNumber, 1),
            analysisPoints: getAnalysisPoints(1)
        },
        // ... Part 2 and 3
    ]
}