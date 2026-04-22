"use client";
import React, { createContext, useState, useContext } from 'react'

const AIContext = createContext()

export const AIProvider = ({ children }) => {
  const [aiRecommendations, setAiRecommendations] = useState([])
  const [writingFeedback, setWritingFeedback] = useState(null)
  const [speakingAnalysis, setSpeakingAnalysis] = useState(null)
  const [conversationHistory, setConversationHistory] = useState([])
  const [isAILoading, setIsAILoading] = useState(false)

  const evaluateWriting = async (text, taskType = 'task2') => {
    setIsAILoading(true)
    try {
      // Simulate API call to AI service
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            score: 6.5,
            band: 'Competent User',
            feedback: {
              taskResponse: "Yaxshi mavzuni tushunish, ammo ko'proq aniq misollar keltirish kerak.",
              coherence: "Aniq paragraflar bilan yaxshi tuzilgan essay.",
              lexicalResource: "Yaxshi lug'at boyligi, biroz takrorlanishlar bor.",
              grammar: "Tushunishga xalaqit bermaydigan mayda grammatik xatolar."
            },
            suggestions: [
              "Ko'proq akademik lug'at ishlating",
              "Aniqroq misollar keltiring",
              "Gap tuzilmalarini xilma-xil qiling",
              "Mayda xatolarni tuzatish uchun qayta o'qib chiqing"
            ],
            estimatedBand: 6.5,
            wordCount: text.split(/\s+/).length,
            commonErrors: [
              "Article usage",
              "Preposition choices",
              "Verb tense consistency"
            ]
          })
        }, 2000)
      })

      setWritingFeedback(response)
      return response
    } catch (error) {
      console.error('Writing evaluation error:', error)
      throw error
    } finally {
      setIsAILoading(false)
    }
  }

  const evaluateSpeaking = async (audioBlob) => {
    setIsAILoading(true)
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            fluency: 7.0,
            pronunciation: 6.5,
            vocabulary: 6.0,
            grammar: 7.0,
            overall: 6.5,
            feedback: {
              strengths: [
                "Diskurs belgilarini yaxshi ishlatish",
                "Mos keladigan tezlik va ritm",
                "Umuman aniq talaffuz"
              ],
              improvements: [
                "So'z urg'usi va intonatsiya ustida ishlash",
                "Murakkab gap tuzilmalarini ishlatish",
                "Lug'at boyligini kengaytirish"
              ]
            },
            pronunciationTips: [
              "Word stress patterns",
              "Intonation in questions",
              "Linking sounds"
            ]
          })
        }, 3000)
      })

      setSpeakingAnalysis(response)
      return response
    } catch (error) {
      console.error('Speaking evaluation error:', error)
      throw error
    } finally {
      setIsAILoading(false)
    }
  }

  const getAIRecommendations = async (userProgress) => {
    const recommendations = [
      {
        id: 1,
        type: 'study_plan',
        priority: 'high',
        title: 'Grammatikani Takomillashtirish',
        description: 'Murakkab gap tuzilmalari va zamonlar ustida ishlash',
        action: 'Grammatika Kursini Boshlash',
        estimatedTime: '2 hafta',
        icon: '📚',
        progress: 0
      },
      {
        id: 2,
        type: 'practice',
        priority: 'medium',
        title: 'Lug\'at Boyligi',
        description: 'Kuniga 10 ta yangi akademik so\'z o\'rganing',
        action: 'Lug\'at Quruvchini Boshlash',
        estimatedTime: '4 hafta',
        icon: '📖',
        progress: 0
      },
      {
        id: 3,
        type: 'test_practice',
        priority: 'high',
        title: 'Vaqt Boshqaruvi',
        description: 'Reading testda tezroq o\'qish mashqlari',
        action: 'Mashqni Boshlash',
        estimatedTime: '1 hafta',
        icon: '⏱️',
        progress: 0
      }
    ]

    setAiRecommendations(recommendations)
    return recommendations
  }

  const chatWithAI = async (message) => {
    setIsAILoading(true)
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          const responses = {
            'writing': `✍️ **Writing Task 2 Maslahatlari:**

🎯 **Essay Structure:**
• Kirish: Hook + Background + Thesis statement
• Asosiy qism: Topic sentence + Misollar + Izoh
• Xulosa: Thesisni takrorlash + Xulosa + Yakuniy fikr

📝 **Maslahatlar:**
• Akademik lug'at ishlating ("Furthermore", "Consequently")
• Murakkab gap tuzilmalarini qo'shing
• Butun essay davomida rasmiy uslubni saqlang
• Vaqtni taqsimlang: Task 2 uchun 40 daqiqa`,

            'speaking': `🎤 **Speaking Part 2 Maslahatlari:**

⏱️ **Vaqt Boshqaruvi:**
• 1 daqiqa tayyorlanish - mind map yarating
• 2 daqiqa gapirish - barcha punktlarni yoriting
• To'liq 2 daqiqadan foydalaning

🗣️ **Struktura:**
• Kirish: Savolga qisqa javob
• Asosiy fikrlar: 2-3 ta asosiy g'oya misollar bilan
• Xulosa: Fikrlaringizni umumlashtiring

🌟 **Fluency Maslahatlari:**
• Diskurs belgilarini ishlating: "Well,", "Actually,", "In my experience..."
• Mayda xatolardan xavotirlanmang - gapirishni davom eting!
• Oddiy IELTS mavzulari bilan mashq qiling`,

            'default': `🤖 **IELTS Umumiy Maslahatlari:**

🎯 **Umumiy Maslahatlar:**
• Har kuni muntazam mashq qiling
• Zaif tomonlaringizga e'tibor bering
• Haqiqiy IELTS materiallaridan foydalaning
• Mashq paytida vaqtni nazorat qiling

📊 **Ballash:**
• Har bir bo'lim 0-9 ball bilan baholanadi
• Umumiy ball to'rt bo'limning o'rtachasi
• Band 7+ kuchli Ingliz tili ko'nikmalarini talab qiladi

🔄 **O'qish Rejasi:**
• Kunlik: 30 daqiqa lug'at o'rganish
• Haftalik: 2 ta to'liq amaliy test
• Oylik: Progressni ko'rib chiqish va maqsadlarni sozlash

💪 **Motivatsiya:** Muntazam mashq yaxshilanishga olib kelishini unutmang! Siz buni qila olasiz!`
          }

          const lowerMessage = message.toLowerCase()
          if (lowerMessage.includes('writing') || lowerMessage.includes('yozish')) {
            resolve(responses.writing)
          } else if (lowerMessage.includes('speaking') || lowerMessage.includes('gapirish')) {
            resolve(responses.speaking)
          } else {
            resolve(responses.default)
          }
        }, 1500)
      })

      const newMessage = {
        id: Date.now(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      }

      setConversationHistory(prev => [...prev, newMessage])
      return response
    } catch (error) {
      console.error('AI chat error:', error)
      throw error
    } finally {
      setIsAILoading(false)
    }
  }

  return (
    <AIContext.Provider value={{
      aiRecommendations,
      writingFeedback,
      speakingAnalysis,
      conversationHistory,
      isAILoading,
      evaluateWriting,
      evaluateSpeaking,
      getAIRecommendations,
      chatWithAI,
      setConversationHistory
    }}>
      {children}
    </AIContext.Provider>
  )
}

export const useAI = () => useContext(AIContext)