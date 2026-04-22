'use client'
// components/Tests/ReadingTest.jsx
//
// ✅ Skrin bilan AYNAN bir xil:
//   - Chap: passage + highlight toolbar
//   - O'ng: MCQ radio (circle), T/F/NG, Gap Fill questions
//   - Pastda: Part 1 (0/13) | Part 2 (0/13) | Part 3 active + Q numbers
//   - Yuqori: READING | timer | Move to writing
// ✅ 3 Passage, 40 savol (13+13+14)
// ✅ Highlight: sariq, yashil, qizil + erase
// ✅ Result: Band score + per-passage breakdown
// ✅ onComplete() → test selectorga qaytadi

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Clock, Eraser, ChevronLeft, ChevronRight, CheckCircle2, Loader2, ArrowLeft, Search, Target, Layers, BookOpen, Brain } from 'lucide-react'

// ─── PASSAGES DATA ────────────────────────────────────────────────────────────
const PASSAGES = [
  {
    id: 0,
    label: 'Part 1',
    title: 'The Coral Triangle',
    subtitle: 'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
    text: [
      { type: 'intro', text: 'The Coral Triangle is a marine area in the Pacific Ocean, roughly the size of the continental United States. It spans six countries: Indonesia, Malaysia, the Philippines, Papua New Guinea, the Solomon Islands and Timor-Leste. Scientists have called it the "Amazon of the seas" for its extraordinary biodiversity.' },
      { type: 'para', label: 'A', text: 'The Coral Triangle holds the world\'s greatest diversity of coral species — over 600 of the world\'s roughly 800 known species — and supports more than 2,000 species of reef fish. It is a globally significant nursery ground for tuna and other commercially important fish species. Six of the world\'s seven species of marine turtles nest on its beaches.' },
      { type: 'para', label: 'B', text: 'More than 120 million people live in the Coral Triangle region and depend on its resources for food, income, and cultural identity. Many coastal and island communities rely on the sea for the majority of their protein intake. The fishing industry in the region generates billions of dollars annually, sustaining both subsistence fishers and large commercial operations.' },
      { type: 'para', label: 'C', text: 'Despite its ecological richness, the Coral Triangle faces serious threats. Overfishing — including the use of destructive methods such as blast fishing and cyanide fishing — has degraded many reefs. Coastal development has destroyed mangrove forests and seagrass beds that serve as nursery habitats. Climate change is causing ocean temperatures to rise and ocean acidification to increase, both of which bleach and kill corals.' },
      { type: 'para', label: 'D', text: 'In 2009, the governments of the six Coral Triangle nations signed the Coral Triangle Initiative on Coral Reefs, Fisheries, and Food Security (CTI-CFF). This multilateral partnership was created to address the challenges facing the region through a coordinated regional approach. The initiative established targets for expanding marine protected areas, improving fisheries management, and developing adaptation strategies for climate change.' },
      { type: 'para', label: 'E', text: 'Scientists and conservationists argue that protecting the Coral Triangle is not only an environmental imperative but also an economic one. Studies suggest that the ecosystem services provided by the region — including fish production, coastal protection, and tourism — are worth hundreds of billions of dollars. Investing in its conservation, they contend, yields far greater returns than the short-term gains from overexploitation.' },
    ],
    qFrom: 1, qTo: 13,
    questions: [
      { id: 1, type: 'MCQ', text: 'Why do scientists call the Coral Triangle the "Amazon of the seas"?', options: ['A. Its size is similar to the Amazon rainforest.', 'B. It contains extraordinary biodiversity.', 'C. It is located near the Amazon River.', 'D. It is the oldest marine ecosystem.'], answer: null },
      { id: 2, type: 'MCQ', text: 'According to paragraph A, how many reef fish species does the Coral Triangle support?', options: ['A. Over 600', 'B. Roughly 800', 'C. More than 2,000', 'D. Over 120 million'], answer: null },
      { id: 3, type: 'MCQ', text: 'What is the primary source of protein for many coastal communities in the region?', options: ['A. Agricultural products', 'B. Marine resources', 'C. Imported food', 'D. Freshwater fish'], answer: null },
      { id: 4, type: 'TFN', text: 'Blast fishing is one of the destructive methods used in the Coral Triangle.', answer: null },
      { id: 5, type: 'TFN', text: 'The CTI-CFF was signed before climate change began affecting the region.', answer: null },
      { id: 6, type: 'TFN', text: 'The Coral Triangle Initiative includes targets for marine protected areas.', answer: null },
      { id: 7, type: 'TFN', text: 'The economic value of the Coral Triangle ecosystem is considered irrelevant by scientists.', answer: null },
      { id: 8, type: 'MATCH', text: 'Match each paragraph (A–E) with its main focus. Paragraph A:', options: ['Biodiversity of marine species', 'Human dependence on marine resources', 'Threats to the ecosystem', 'International conservation efforts', 'Economic arguments for conservation'], answer: null },
      { id: 9, type: 'MATCH', text: 'Paragraph B:', options: ['Biodiversity of marine species', 'Human dependence on marine resources', 'Threats to the ecosystem', 'International conservation efforts', 'Economic arguments for conservation'], answer: null },
      { id: 10, type: 'GAP', text: 'The Coral Triangle spans ________ countries in the Pacific Ocean.', answer: null, hint: 'Write ONE word or number' },
      { id: 11, type: 'GAP', text: 'Ocean ________ caused by climate change bleaches and kills corals.', answer: null, hint: 'Write ONE word' },
      { id: 12, type: 'GAP', text: 'The Coral Triangle Initiative was signed in the year ________.', answer: null, hint: 'Write ONE number' },
      { id: 13, type: 'MCQ', text: 'What is the main argument of paragraph E?', options: ['A. Conservation is too expensive.', 'B. Overexploitation is unavoidable.', 'C. Protection is both environmental and economically rational.', 'D. Tourism is more valuable than fishing.'], answer: null },
    ]
  },
  {
    id: 1,
    label: 'Part 2',
    title: 'The Psychology of Procrastination',
    subtitle: 'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
    text: [
      { type: 'intro', text: 'Procrastination — voluntarily delaying an intended course of action despite knowing one will be worse off for the delay — is a surprisingly complex psychological phenomenon. Despite popular belief, it is not simply laziness or poor time management.' },
      { type: 'para', label: 'A', text: 'Researchers have found that procrastination is fundamentally an emotion regulation problem, not a time management problem. When people procrastinate, they are typically avoiding negative emotions — anxiety, self-doubt, boredom, resentment, insecurity — that are associated with the task. Putting off the task provides immediate mood relief, even though it compounds problems in the long run.' },
      { type: 'para', label: 'B', text: 'Chronic procrastinators show distinct patterns in brain activity. Studies using functional MRI have found larger amygdalae in procrastinators — the region associated with processing emotions and threats. The connection between the amygdala and the dorsal anterior cingulate cortex, which helps translate intentions into actions, is also weaker in procrastinators, making it harder for them to regulate negative emotional responses and take action.' },
      { type: 'para', label: 'C', text: 'Self-compassion has emerged as one of the most effective antidotes to procrastination. Counterintuitively, being kind to oneself after procrastinating — rather than self-critical — reduces the likelihood of procrastinating again. Studies show that students who forgave themselves for procrastinating before an exam were less likely to procrastinate before the next one. The mechanism appears to be that self-forgiveness removes the negative emotions that drive avoidance.' },
      { type: 'para', label: 'D', text: 'Environmental design is another powerful intervention. Reducing friction for desired behaviours and increasing friction for avoidance behaviours can significantly alter outcomes. This might mean placing the book you need to read on your pillow, turning off notifications, or working in a library rather than at home. Implementation intentions — specific plans such as "I will do X at time Y in place Z" — have also been shown to reduce procrastination substantially.' },
      { type: 'para', label: 'E', text: 'The relationship between perfectionism and procrastination is complex. While many people assume perfectionists procrastinate because they fear not meeting their high standards, the research is more nuanced. It is specifically maladaptive perfectionism — where self-worth is contingent on performance — that predicts procrastination. Adaptive perfectionists, who hold high standards but respond positively to mistakes, tend not to procrastinate.' },
    ],
    qFrom: 14, qTo: 26,
    questions: [
      { id: 14, type: 'MCQ', text: 'According to the introduction, procrastination is best described as:', options: ['A. A form of laziness', 'B. A time management failure', 'C. A voluntary delay despite negative consequences', 'D. An involuntary habit'], answer: null },
      { id: 15, type: 'MCQ', text: 'What do researchers primarily identify as the cause of procrastination?', options: ['A. Poor planning skills', 'B. Emotional avoidance', 'C. Low intelligence', 'D. Lack of motivation'], answer: null },
      { id: 16, type: 'MCQ', text: 'According to paragraph B, what is different about the brains of chronic procrastinators?', options: ['A. Smaller prefrontal cortex', 'B. Larger amygdalae and weaker connections to action-regulation areas', 'C. Higher levels of dopamine', 'D. Overactive anterior cingulate cortex'], answer: null },
      { id: 17, type: 'TFN', text: 'Self-criticism is the most effective way to overcome procrastination.', answer: null },
      { id: 18, type: 'TFN', text: 'Students who forgave themselves for procrastinating were less likely to procrastinate again.', answer: null },
      { id: 19, type: 'TFN', text: 'Environmental design involves making desired behaviours more difficult.', answer: null },
      { id: 20, type: 'TFN', text: 'All perfectionists are prone to procrastination.', answer: null },
      { id: 21, type: 'TFN', text: 'Implementation intentions specify when and where a task will be completed.', answer: null },
      { id: 22, type: 'GAP', text: 'Procrastination is fundamentally an ________ regulation problem.', answer: null, hint: 'ONE word from the passage' },
      { id: 23, type: 'GAP', text: 'The brain region associated with processing emotions and threats is called the ________.', answer: null, hint: 'ONE word' },
      { id: 24, type: 'GAP', text: '________ perfectionism, where self-worth depends on performance, predicts procrastination.', answer: null, hint: 'ONE word from the passage' },
      { id: 25, type: 'MCQ', text: 'What does paragraph D suggest about working in a library?', options: ['A. It increases distractions', 'B. It reduces environmental friction for work', 'C. It is only suitable for students', 'D. It worsens procrastination'], answer: null },
      { id: 26, type: 'MCQ', text: 'What is the main idea of paragraph E?', options: ['A. All perfectionists procrastinate.', 'B. Perfectionism always helps performance.', 'C. Only maladaptive perfectionism links to procrastination.', 'D. Adaptive perfectionists never make mistakes.'], answer: null },
    ]
  },
  {
    id: 2,
    label: 'Part 3',
    title: 'What We Get Wrong About Vitamins',
    subtitle: 'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
    text: [
      { type: 'intro', text: 'If there\'s one thing about nutrition we think we know for sure, it\'s that vitamins are good for us. In reality, however, most of us know nearly nothing about vitamins. And our faith in vitamin supplements or pills, combined with our current beliefs about nutrition and health, is doing us harm.' },
      { type: 'para', label: 'A', text: 'Discovered barely a century ago, vitamins were a revolutionary breakthrough in nutritional science, providing cures and ways of preventing some of the world\'s most terrifying diseases. But it wasn\'t long before vitamins moved from the labs of scientists to become supplements that could be added to food or taken independently. By the end of World War Two, vitamins were available in forms not found in nature. The scientific mainstream, yet far from expressing perfectly reasonable scepticism over these products, the public asked for more.' },
      { type: 'para', label: 'B', text: 'In the 21st century, we\'re such believers in vitamins\' inherent goodness that we don\'t really realise to which scientists still don\'t truly comprehend how vitamins work in our bodies, or how much of each vitamin we require. We\'re not aware that vitamins (and our enthusiasm for them) are what opened the door for the array of supposed wonder nutrients that intrigue and confuse us today.' },
      { type: 'para', label: 'C', text: 'We don\'t notice the ways the food marketers and dietary supplement makers use synthetic vitamins to add an appearance of health to otherwise unhealthy products; nor do we acknowledge the extent to which we use vitamins and these other vitamin-inspired nutrients to give ourselves permission to overeat foods of all kinds. And we certainly don\'t recognise that by believing in the idea that isolated dietary chemicals hold the keys to good health, our obsession with vitamins is making us less healthy.' },
      { type: 'para', label: 'D', text: 'One assumption about vitamins is definitely true: we do indeed need them. The 13 dietary chemicals that we call vitamins affect each one of us every minute of every day, helping us to think and speak and move our muscles, extract calories from what we eat, even see the words on this page. Deficiencies in these vitamins cause serious illnesses and even death. Our need for them is no more avoidable than our need for air.' },
      { type: 'para', label: 'E', text: 'But the very power of vitamins makes them a double-edged sword. Their ability to save lives has promoted the idea that they can do the impossible in all of us, regardless of whether we\'re actually deficient in them. This has led to beliefs in vitamins that are based more on faith than fact. When we seek out vitamins today, it\'s not because we\'re worried about conditions caused by actual vitamin deficiencies. We think that by making up for our bad eating habits, vitamins can save us from ourselves. It is now generally accepted that vitamins will help give us longer and healthier lives.' },
    ],
    qFrom: 27, qTo: 40,
    questions: [
      { id: 27, type: 'MCQ', text: 'The author mentions that vitamins were discovered "barely a century ago" in order to:', options: ['A. show how important timing is in scientific discoveries.', 'B. suggest that scientists started researching them then.', 'C. illustrate how quickly awareness of them has become widespread.', 'D. suggest that we are healthier now than in the past.'], answer: null },
      { id: 28, type: 'MCQ', text: 'What does the writer imply about food marketing and industries in the fourth paragraph?', options: ['A. They mislead the public into buying unhealthy food.', 'B. They were the driving forces behind scientific progress.', 'C. They believe that vitamins improve food quality.', 'D. They are currently working to discover new vitamins.'], answer: null },
      { id: 29, type: 'MCQ', text: 'Why does the writer refer to vitamin A in the fifth paragraph?', options: ['A. To correct a common misunderstanding about vitamins.', 'B. To question why some people are reluctant to take vitamins.', 'C. To exemplify that vitamins are a necessity for human health.', 'D. To illustrate that some vitamins are less important than others.'], answer: null },
      { id: 30, type: 'MCQ', text: 'What is the writer doing in the last paragraph?', options: ['A. Questioning the history of vitamin development.', 'B. Explaining why vitamin supplements can be difficult to manufacture.', 'C. Outlining the chemical make-up of some vitamin supplements.', 'D. Illustrating how we view vitamins differently to other substances.'], answer: null },
      { id: 31, type: 'TFN', text: 'Scientists fully understand how vitamins work in the human body.', answer: null },
      { id: 32, type: 'TFN', text: 'Vitamins were originally discovered as a treatment for serious diseases.', answer: null },
      { id: 33, type: 'TFN', text: 'The author suggests that taking vitamin supplements always improves health.', answer: null },
      { id: 34, type: 'TFN', text: 'Vitamin deficiencies can cause death.', answer: null },
      { id: 35, type: 'TFN', text: 'People today take vitamins primarily because they are worried about deficiency diseases.', answer: null },
      { id: 36, type: 'GAP', text: 'The author compares our need for vitamins to our need for ________.', answer: null, hint: 'ONE word from the passage' },
      { id: 37, type: 'GAP', text: 'Vitamins were originally moved from ________ to become commercial supplements.', answer: null, hint: 'Write a short phrase' },
      { id: 38, type: 'GAP', text: 'The author describes vitamins as a "double-edged ________".', answer: null, hint: 'ONE word' },
      { id: 39, type: 'MCQ', text: 'What is the main argument of the passage as a whole?', options: ['A. Vitamins are always beneficial and should be taken daily.', 'B. Our misplaced faith in vitamins may actually harm our health.', 'C. Vitamin supplements should be banned from supermarkets.', 'D. Scientists have recently solved all questions about vitamins.'], answer: null },
      { id: 40, type: 'MCQ', text: 'The tone of the passage can best be described as:', options: ['A. Enthusiastic and promotional', 'B. Neutral and purely factual', 'C. Critical and analytical', 'D. Confused and uncertain'], answer: null },
    ]
  }
]

// ─── CORRECT ANSWERS for auto-marking ────────────────────────────────────────
const CORRECT = {
  1: 'B', 2: 'C', 3: 'B', 4: 'TRUE', 5: 'FALSE', 6: 'TRUE', 7: 'FALSE',
  8: 'A', 9: 'B', 10: 'six', 11: 'acidification', 12: '2009', 13: 'C',
  14: 'C', 15: 'B', 16: 'B', 17: 'FALSE', 18: 'TRUE', 19: 'FALSE', 20: 'FALSE',
  21: 'TRUE', 22: 'emotion', 23: 'amygdala', 24: 'Maladaptive', 25: 'B', 26: 'C',
  27: 'C', 28: 'A', 29: 'C', 30: 'D', 31: 'FALSE', 32: 'TRUE', 33: 'FALSE', 34: 'TRUE',
  35: 'FALSE', 36: 'air', 37: 'labs', 38: 'sword', 39: 'B', 40: 'C'
}

// ─── BAND SCORE TABLE ─────────────────────────────────────────────────────────
const getBand = (correct) => {
  if (correct >= 39) return 9.0
  if (correct >= 37) return 8.5
  if (correct >= 35) return 8.0
  if (correct >= 33) return 7.5
  if (correct >= 30) return 7.0
  if (correct >= 27) return 6.5
  if (correct >= 23) return 6.0
  if (correct >= 19) return 5.5
  if (correct >= 15) return 5.0
  if (correct >= 13) return 4.5
  return 4.0
}

// ─── SCORE CIRCLE ─────────────────────────────────────────────────────────────


// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ReadingTest = ({ test, onComplete, onExit }) => {
  const [activePassage, setActivePassage] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(60 * 60)
  const [phase, setPhase] = useState('test') // 'test' | 'marking' | 'result'
  const [results, setResults] = useState(null)
  const [activeColor, setActiveColor] = useState("#007bff")
  const passageRef = useRef(null)

  // Timer
  useEffect(() => {
    if (phase !== 'test') return
    if (timeLeft <= 0) { handleFinish(); return }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [phase, timeLeft])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    return `${m} minute${m !== 1 ? 's' : ''} left`
  }
  const timeColor = timeLeft < 300 ? '#ef4444' : timeLeft < 600 ? '#f59e0b' : '#1e293b'

  // Highlight
  const applyHighlight = useCallback(() => {
    const sel = window.getSelection()
    if (!sel.rangeCount || sel.isCollapsed) return
    const range = sel.getRangeAt(0)
    if (!passageRef.current?.contains(range.commonAncestorContainer)) return
    const span = document.createElement('span')
    span.style.backgroundColor = activeColor
    span.style.borderRadius = '3px'
    span.className = 'rt-hl'
    try { range.surroundContents(span) } catch (e) { }
    sel.removeAllRanges()
  }, [activeColor])

  const clearHighlights = () => {
    document.querySelectorAll('.rt-hl').forEach(m => {
      const p = m.parentNode
      while (m.firstChild) p.insertBefore(m.firstChild, m)
      p.removeChild(m)
    })
  }

  const setAnswer = (qId, val) => setAnswers(p => ({ ...p, [qId]: val }))

  const handleFinish = async () => {
    setPhase('marking')
    await new Promise(r => setTimeout(r, 1200))

    let totalCorrect = 0
    const perPassage = PASSAGES.map(pass => {
      let correct = 0
      pass.questions.forEach(q => {
        const userAns = (answers[q.id] || '').toString().trim().toLowerCase()
        const rightAns = (CORRECT[q.id] || '').toString().trim().toLowerCase()
        if (userAns === rightAns) correct++
      })
      totalCorrect += correct
      return { label: pass.label, title: pass.title, correct, total: pass.questions.length }
    })

    const band = getBand(totalCorrect)
    setResults({ totalCorrect, band, perPassage })
    setPhase('result')
    // Save to backend
    try {
      const token = localStorage.getItem('access_token')
      if (token) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/results`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ exam_type: test?.exam_type || 'IELTS', section: 'reading', score: Math.round(band * 11.1), max_score: 100, band_score: band, answers: { total_correct: totalCorrect } })
        }).catch(() => {})
      }
    } catch {}
  }

  const passage = PASSAGES[activePassage]

  // Count answered per passage
  const answeredCount = (pIdx) =>
    PASSAGES[pIdx].questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== '').length

  // ── MARKING ──
  if (phase === 'marking') return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans,sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#007bff,#00bfff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 32px rgba(0,123,255,0.3)', animation: 'wt-spin 1s linear infinite' }}>
          <Loader2 size={36} color="white" />
        </div>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 26, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>Marking your answers...</h2>
        <p style={{ color: '#64748b', fontSize: 15 }}>Calculating your Reading band score</p>
        <style>{`@keyframes wt-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )

  // ── RESULT — EnhancedWritingTest bilan AYNAN bir xil style ──────────────────
  if (phase === 'result') {
    const band = results.band
    const pct = (band / 9) * 100

    const criteria = [
      {
        name: 'Passage 1',
        score: +(results.perPassage[0].correct / results.perPassage[0].total * 9).toFixed(1),
        icon: <Target size={15} />, color: '#007bff', bgColor: '#e6f3ff',
        tip: results.perPassage[0].correct >= 10 ? `${results.perPassage[0].correct}/13 correct — excellent.` : `${results.perPassage[0].correct}/13 — work on identifying key details.`
      },
      {
        name: 'Passage 2',
        score: +(results.perPassage[1].correct / results.perPassage[1].total * 9).toFixed(1),
        icon: <Layers size={15} />, color: "#007bff", bgColor: "#e6f3ff",
        tip: results.perPassage[1].correct >= 10 ? `${results.perPassage[1].correct}/13 correct — strong T/F/NG skills.` : `${results.perPassage[1].correct}/13 — practise TRUE vs NOT GIVEN.`
      },
      {
        name: 'Passage 3',
        score: +(results.perPassage[2].correct / results.perPassage[2].total * 9).toFixed(1),
        icon: <BookOpen size={15} />, color: '#10b981', bgColor: '#f0fdf4',
        tip: results.perPassage[2].correct >= 10 ? `${results.perPassage[2].correct}/14 correct — great critical reading.` : `${results.perPassage[2].correct}/14 — focus on writer opinion questions.`
      },
      {
        name: 'Overall Accuracy',
        score: band,
        icon: <Brain size={15} />, color: band >= 7 ? '#10b981' : band >= 6 ? '#007bff' : '#f59e0b',
        bgColor: band >= 7 ? '#f0fdf4' : band >= 6 ? '#e6f3ff' : '#fffbeb',
        tip: band >= 7 ? 'University-level reading ability.' : band >= 6 ? 'Developing well — keep practising.' : 'Daily academic reading recommended.'
      },
    ]

    const feedbackItems = [
      results.totalCorrect >= 30
        ? `✅ ${results.totalCorrect}/40 correct — Band ${band}. Strong comprehension across all three passages.`
        : results.totalCorrect >= 20
          ? `⚠️ ${results.totalCorrect}/40 correct — Band ${band}. Focus on skimming for main ideas and scanning for detail.`
          : `⚠️ ${results.totalCorrect}/40 correct — Band ${band}. Practise reading academic texts daily to build speed and comprehension.`,

      results.perPassage[0].correct < 9
        ? `⚠️ Passage 1 (${results.perPassage[0].correct}/13): Work on identifying supporting details and matching information to paragraphs.`
        : `✅ Passage 1 (${results.perPassage[0].correct}/13): Good performance on factual and matching questions.`,

      results.perPassage[1].correct < 9
        ? `⚠️ Passage 2 (${results.perPassage[1].correct}/13): Practise True/False/Not Given — NOT GIVEN means the text neither confirms nor denies the statement.`
        : `✅ Passage 2 (${results.perPassage[1].correct}/13): Strong performance on T/F/NG and gap-fill questions.`,

      results.perPassage[2].correct < 9
        ? `⚠️ Passage 3 (${results.perPassage[2].correct}/14): Work on understanding the writer's purpose in longer argumentative texts.`
        : `✅ Passage 3 (${results.perPassage[2].correct}/14): Excellent comprehension of complex academic writing.`,
    ]

    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 20px', fontFamily: 'Inter,sans-serif' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          .wt-result { background:rgba(255,255,255,0.92); backdrop-filter:blur(24px); padding:40px; border-radius:36px; width:100%; max-width:860px; box-shadow:0 30px 80px rgba(0,123,255,0.12); border:1px solid white; overflow-y:auto; max-height:95vh; position:relative; }
          .wt-rd-hdr { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:26px; }
          .wt-rd-title { font-size:28px; font-weight:800; color:#1e293b; }
          .wt-rd-sub { color:#64748b; font-size:14px; margin-top:4px; }
          .wt-rd-badge { background:#e6f3ff; color:#007bff; padding:6px 14px; border-radius:10px; font-weight:800; font-size:12px; }
          .wt-score-row { display:grid; grid-template-columns:175px 1fr; gap:18px; margin-bottom:16px; }
          .wt-score-card { background:white; padding:20px; border-radius:20px; border:1px solid #f1f5f9; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; }
          .wt-score-lbl { font-size:11px; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:12px; }
          .wt-circle-wrap { position:relative; width:128px; height:128px; }
          .wt-circle-svg { display:block; width:100%; height:100%; }
          .wt-circle-bg { fill:none; stroke:#f1f5f9; stroke-width:2.8; }
          .wt-circle-fg { fill:none; stroke-width:2.8; stroke-linecap:round; animation:wt-prog 1.2s ease-out forwards; }
          @keyframes wt-prog { from { stroke-dasharray:0 100; } }
          .wt-circle-inner { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; }
          .wt-big { font-size:38px; font-weight:900; color:#1e293b; line-height:1; display:block; }
          .wt-small { font-size:13px; color:#94a3b8; font-weight:600; }
          .wt-crit-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
          .wt-crit-card { background:white; padding:16px 18px; border-radius:16px; border:1px solid #f1f5f9; }
          .wt-crit-hdr { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
          .wt-crit-ico { width:32px; height:32px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
          .wt-crit-name { font-size:11px; font-weight:800; color:#475569; }
          .wt-crit-score { font-size:20px; font-weight:900; color:#1e293b; margin-bottom:6px; }
          .wt-bar-bg { height:6px; background:#f1f5f9; border-radius:4px; overflow:hidden; }
          .wt-bar-fill { height:100%; border-radius:4px; transition:width 1.2s ease; }
          .wt-crit-tip { font-size:11px; color:#64748b; margin-top:6px; line-height:1.4; }
          .wt-feedback { background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:20px; margin-bottom:22px; }
          .wt-fb-hdr { display:flex; align-items:center; gap:8px; color:#007bff; font-weight:700; margin-bottom:14px; font-size:14px; }
          .wt-fb-item { display:flex; gap:10px; margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid #f1f5f9; align-items:flex-start; }
          .wt-fb-item:last-child { margin-bottom:0; padding-bottom:0; border-bottom:none; }
          .wt-fb-dot { width:20px; height:20px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; margin-top:1px; }
          .wt-fb-txt { font-size:14px; color:#334155; line-height:1.75; }
          .wt-actions { display:flex; gap:14px; }
          .wt-btn { flex:1; padding:15px; border-radius:15px; font-weight:700; font-size:15px; border:none; cursor:pointer; display:flex; justify-content:center; align-items:center; gap:8px; transition:0.2s; font-family:'Inter',sans-serif; }
          .wt-btn.primary { background:linear-gradient(135deg,#007bff,#007bff); color:white; box-shadow:0 8px 20px rgba(0,123,255,0.25); }
          .wt-btn.primary:hover { transform:translateY(-2px); box-shadow:0 14px 30px rgba(0,123,255,0.4); }
          .wt-btn.secondary { background:white; color:#64748b; border:2px solid #f1f5f9; }
          .wt-btn.secondary:hover { background:#f8fafc; color:#1e293b; }
          @media(max-width:640px){.wt-result{padding:24px 18px;border-radius:24px;}.wt-score-row{grid-template-columns:1fr;}.wt-crit-grid{grid-template-columns:1fr;}.wt-actions{flex-direction:column;}}
        `}</style>

        <div className="wt-result">
          {/* Header */}
          <div className="wt-rd-hdr">
            <div>
              <h2 className="wt-rd-title">Analysis Report</h2>
              <p className="wt-rd-sub">IELTS Reading Assessment · 3 Passages · 40 Questions</p>
            </div>
            <div className="wt-rd-badge">READING</div>
          </div>

          {/* Overall score circle + 4 criteria grid */}
          <div className="wt-score-row">
            <div className="wt-score-card">
              <p className="wt-score-lbl">Overall Band</p>
              <div className="wt-circle-wrap">
                <svg viewBox="0 0 36 36" className="wt-circle-svg">
                  <path className="wt-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="wt-circle-fg"
                    stroke={band >= 7 ? '#10b981' : band >= 6 ? '#007bff' : '#f59e0b'}
                    strokeDasharray={`${pct}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="wt-circle-inner">
                  <span className="wt-big" style={{ color: band >= 7 ? '#10b981' : band >= 6 ? '#007bff' : '#f59e0b' }}>{band}</span>
                  <span className="wt-small">/9.0</span>
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{results.totalCorrect}/40 correct</div>
            </div>

            <div className="wt-crit-grid">
              {criteria.map((cr, i) => (
                <div key={i} className="wt-crit-card">
                  <div className="wt-crit-hdr">
                    <div className="wt-crit-ico" style={{ background: cr.bgColor, color: cr.color }}>{cr.icon}</div>
                    <span className="wt-crit-name">{cr.name}</span>
                  </div>
                  <div className="wt-crit-score">
                    {cr.score}<span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>/9</span>
                  </div>
                  <div className="wt-bar-bg">
                    <div className="wt-bar-fill" style={{ width: `${(cr.score / 9) * 100}%`, background: cr.color }} />
                  </div>
                  <p className="wt-crit-tip">{cr.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="wt-feedback">
            <div className="wt-fb-hdr"><Search size={15} /><span>Detailed Feedback</span></div>
            {feedbackItems.map((text, i) => {
              const isGood = text.startsWith('✅')
              return (
                <div key={i} className="wt-fb-item">
                  <div className="wt-fb-dot" style={{ background: isGood ? '#dcfce7' : '#fff7ed', color: isGood ? '#16a34a' : '#d97706' }}>
                    {isGood ? '✓' : '!'}
                  </div>
                  <span className="wt-fb-txt">{text}</span>
                </div>
              )
            })}
          </div>

          {/* Action buttons */}
          <div className="wt-actions">
            <button className="wt-btn secondary" onClick={onExit}>← Back to Home</button>
            <button className="wt-btn primary" onClick={onComplete}>
              <CheckCircle2 size={16} /> Back to Test Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── TEST INTERFACE ────────────────────────────────────────────────────────────
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'DM Sans,sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        /* Radio circle — skrin kabi */
        .rt-radio { display:flex; align-items:flex-start; gap:12px; padding:9px 14px; border-radius:12px; cursor:pointer; transition:background 0.15s; margin-bottom:6px; }
        .rt-radio:hover { background:rgba(0,123,255,0.05); }
        .rt-radio input[type=radio] { display:none; }
        .rt-radio-circle { width:18px; height:18px; border-radius:50%; border:2px solid #cbd5e1; flex-shrink:0; margin-top:2px; display:flex; align-items:center; justify-content:center; transition:all 0.18s; }
        .rt-radio.selected .rt-radio-circle { border-color:#007bff; background:#007bff; }
        .rt-radio.selected .rt-radio-circle::after { content:''; width:7px; height:7px; border-radius:50%; background:white; }
        .rt-radio-text { font-size:14px; color:#334155; font-weight:500; line-height:1.55; }
        .rt-radio.selected .rt-radio-text { color:#1e293b; font-weight:600; }

        /* TFN buttons */
        .rt-tfn { padding:10px 20px; border-radius:10px; border:1.5px solid #e2e8f0; background:white; font-weight:700; font-size:13px; cursor:pointer; transition:all 0.18s; font-family:'DM Sans',sans-serif; }
        .rt-tfn:hover { border-color:#007bff; color:#007bff; }
        .rt-tfn.sel-true { background:#dcfce7; border-color:#86efac; color:#16a34a; }
        .rt-tfn.sel-false { background:#fee2e2; border-color:#fca5a5; color:#dc2626; }
        .rt-tfn.sel-ng { background:#fef9c3; border-color:#fde047; color:#854d0e; }

        /* Gap fill */
        .rt-gap { width:100%; padding:11px 16px; border:1.5px solid #e2e8f0; border-radius:12px; font-size:14px; font-weight:500; color:#1e293b; font-family:'DM Sans',sans-serif; outline:none; background:white; transition:all 0.2s; }
        .rt-gap:focus { border-color:#007bff; box-shadow:0 0 0 3px rgba(0,123,255,0.1); }

        /* Q number nav — skrin kabi */
        .rt-qnum { width:32px; height:32px; border-radius:8px; border:1.5px solid #e2e8f0; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.15s; background:white; color:#64748b; }
        .rt-qnum:hover { border-color:#007bff; color:#007bff; }
        .rt-qnum.answered { background:#007bff; color:white; border-color:#007bff; }
        .rt-qnum.current { background:#007bff; color:white; border-color:#007bff; box-shadow:0 3px 10px rgba(0,123,255,0.3); }

        /* Passage text */
        .rt-passage-intro { font-style:italic; font-weight:600; color:#334155; font-size:14px; line-height:1.75; margin-bottom:20px; padding:16px 18px; background:rgba(240,248,255,0.6); border-radius:12px; border-left:3px solid #007bff; }
        .rt-passage-para { font-size:15px; line-height:1.85; color:#1e293b; font-weight:400; margin-bottom:18px; }
        .rt-para-label { font-weight:800; color:#007bff; margin-right:6px; }

        /* Scrollbars */
        .rt-scroll::-webkit-scrollbar { width:5px; }
        .rt-scroll::-webkit-scrollbar-track { background:transparent; }
        .rt-scroll::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:10px; }
        .rt-scroll::-webkit-scrollbar-thumb:hover { background:#cbd5e1; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, height: 52, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={onExit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '6px', borderRadius: 8, display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
            onMouseOver={e => e.currentTarget.style.color = '#475569'}
            onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
            <ArrowLeft size={18} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', letterSpacing: 1.5, textTransform: 'uppercase' }}>Reading</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: timeLeft < 300 ? '#ef4444' : '#475569', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Clock size={15} color={timeLeft < 300 ? '#ef4444' : '#94a3b8'} /> {formatTime(timeLeft)}
          </div>
          <button onClick={handleFinish} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 7 }}
            onMouseOver={e => { e.currentTarget.style.background = '#0062cc'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseOut={e => { e.currentTarget.style.background = '#007bff'; e.currentTarget.style.transform = 'translateY(0)' }}>
            Move to Writing <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── INSTRUCTION BAR ── */}
      <div style={{ background: 'white', borderBottom: '1px solid #e8edf2', padding: '10px 28px', flexShrink: 0, fontSize: 13, color: '#475569', fontWeight: 500 }}>
        <strong style={{ color: '#1e293b' }}>{passage.label}</strong> &nbsp;{passage.subtitle.replace(/^Part \d+\. /, '')}
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* LEFT — Passage */}
        <div ref={passageRef} className="rt-scroll" onMouseUp={applyHighlight}
          style={{ overflowY: 'auto', padding: '24px 28px', background: 'white', borderRight: '1px solid #e8edf2' }}>

          {/* Highlight toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', padding: '8px 16px', borderRadius: 50, border: '1.5px solid rgba(0,123,255,0.12)', width: 'fit-content', marginBottom: 22, boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
            {[['#fef08a', 'Yellow'], ['#bbf7d0', 'Green'], ['#fecaca', 'Red']].map(([c, label]) => (
              <div key={c} title={label} onClick={() => setActiveColor(c)} style={{ width: 22, height: 22, borderRadius: '50%', background: c, cursor: 'pointer', border: `2.5px solid ${activeColor === c ? '#1e293b' : 'transparent'}`, transform: activeColor === c ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.15s' }} />
            ))}
            <div style={{ width: 1, height: 18, background: '#e2e8f0', margin: '0 4px' }} />
            <div onClick={clearHighlights} title="Clear highlights" style={{ cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', transition: 'color 0.18s', padding: '2px' }}
              onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
              onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
              <Eraser size={16} />
            </div>
          </div>

          {/* Passage title */}
          <div style={{ fontSize: 11, fontWeight: 800, color: '#007bff', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Reading Passage {activePassage + 1}</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 22, fontWeight: 900, color: '#1e293b', marginBottom: 16, letterSpacing: -0.3 }}>{passage.title}</h2>

          {/* Passage text */}
          {passage.text.map((block, i) => (
            block.type === 'intro'
              ? <p key={i} className="rt-passage-intro">{block.text}</p>
              : <p key={i} className="rt-passage-para">
                <span className="rt-para-label">{block.label}</span>{block.text}
              </p>
          ))}
        </div>

        {/* RIGHT — Questions */}
        <div className="rt-scroll" style={{ overflowY: 'auto', padding: '24px 28px', background: '#f8f9fb' }}>

          {/* Questions group header */}
          {passage.questions.reduce((groups, q) => {
            // Group questions by type for headers
            const groupKey = q.type === 'MCQ' ? 'MCQ' : q.type === 'TFN' ? 'TFN' : q.type === 'GAP' ? 'GAP' : 'MATCH'
            return groups
          }, [])}

          {/* Render questions with group headers */}
          {(() => {
            let lastType = null
            return passage.questions.map((q, qi) => {
              const showHeader = q.type !== lastType
              lastType = q.type
              return (
                <div key={q.id}>
                  {showHeader && (
                    <div style={{ marginBottom: 14, marginTop: qi === 0 ? 0 : 28 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>
                        Questions {passage.questions.filter((_, i) => i <= qi).find(x => x.type === q.type)?.id} –{' '}
                        {passage.questions.filter(x => x.type === q.type).slice(-1)[0]?.id}
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                        {q.type === 'MCQ' && 'Choose the correct letter, A, B, C, or D.'}
                        {q.type === 'TFN' && 'Do the following statements agree with the information given in the passage? Write TRUE, FALSE, or NOT GIVEN.'}
                        {q.type === 'GAP' && 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.'}
                        {q.type === 'MATCH' && 'Match each paragraph with the correct statement.'}
                      </div>
                      <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '12px 0' }} />
                    </div>
                  )}

                  <div style={{ marginBottom: 26 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 12, lineHeight: 1.55 }}>
                      <span style={{ fontWeight: 900, color: '#007bff', marginRight: 6 }}>{q.id}.</span>
                      {q.text}
                    </div>

                    {/* MCQ — radio circles like screenshot */}
                    {q.type === 'MCQ' && (
                      <div>
                        {q.options.map((opt, oi) => {
                          const letter = opt.split('.')[0]
                          const selected = answers[q.id] === letter
                          return (
                            <div key={oi} className={`rt-radio ${selected ? 'selected' : ''}`}
                              onClick={() => setAnswer(q.id, letter)}>
                              <div className="rt-radio-circle" />
                              <span className="rt-radio-text">{opt}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* T/F/NG */}
                    {q.type === 'TFN' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['TRUE', 'FALSE', 'NOT GIVEN'].map(opt => (
                          <button key={opt} className={`rt-tfn ${answers[q.id] === opt ? `sel-${opt.toLowerCase().replace(' given', 'g').replace(' ', '-').replace('not-g', 'ng')}` : ''}`}
                            onClick={() => setAnswer(q.id, opt)}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* MATCH — radio */}
                    {q.type === 'MATCH' && (
                      <div>
                        {q.options.map((opt, oi) => {
                          const letter = String.fromCharCode(65 + oi)
                          const selected = answers[q.id] === letter
                          return (
                            <div key={oi} className={`rt-radio ${selected ? 'selected' : ''}`}
                              onClick={() => setAnswer(q.id, letter)}>
                              <div className="rt-radio-circle" />
                              <span className="rt-radio-text">{letter}. {opt}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* GAP FILL */}
                    {q.type === 'GAP' && (
                      <div>
                        <input className="rt-gap"
                          placeholder={q.hint || 'Your answer...'}
                          value={answers[q.id] || ''}
                          onChange={e => setAnswer(q.id, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          })()}
        </div>
      </div>

      {/* ── BOTTOM BAR — skrin kabi: Part 1 (0/13) | Part 2 (0/13) | Part 3 [27 28 29...] ── */}
      <div style={{ background: 'white', borderTop: '1px solid #e8edf2', padding: '10px 20px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0, zIndex: 10 }}>
        {PASSAGES.map((p, pi) => {
          const isActive = pi === activePassage
          const answered = answeredCount(pi)
          const total = p.questions.length
          return (
            <div key={pi} style={{ display: 'flex', alignItems: 'center' }}>
              {/* Part label + answered count — clicking switches passage */}
              <button onClick={() => setActivePassage(pi)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, fontFamily: 'DM Sans,sans-serif', transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,123,255,0.05)' }}
                onMouseOut={e => e.currentTarget.style.background = 'none'}>
                <span style={{ fontSize: 13, fontWeight: 800, color: isActive ? '#007bff' : '#94a3b8' }}>{p.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#007bff' : '#94a3b8' }}>{answered} of {total}</span>
              </button>

              {/* If active — show question number squares */}
              {isActive && (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 4 }}>
                  {p.questions.map((q) => {
                    const isAnswered = answers[q.id] !== undefined && answers[q.id] !== ''
                    return (
                      <button key={q.id} className={`rt-qnum ${isAnswered ? 'answered' : ''}`}
                        onClick={() => {
                          // scroll to question
                          const el = document.getElementById(`rt-q-${q.id}`)
                          el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }}>
                        {q.id}
                      </button>
                    )
                  })}
                </div>
              )}

              {pi < PASSAGES.length - 1 && (
                <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 8px' }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReadingTest