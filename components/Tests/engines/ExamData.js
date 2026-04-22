// Shared sample exam data for all 5 engine types

export const READING_PASSAGE = {
  title: "The Future of Urban Transportation",
  text: `The rapid growth of cities worldwide has created an urgent need for more efficient and sustainable transportation systems. As urban populations continue to expand, traditional modes of transport are struggling to meet demand while simultaneously contributing to significant environmental challenges.

Electric vehicles (EVs) have emerged as one of the most promising solutions to the environmental problems associated with urban transport. Unlike conventional petrol and diesel engines, EVs produce zero direct emissions, significantly reducing air pollution in densely populated areas. However, the widespread adoption of electric vehicles faces several obstacles, including high upfront costs, limited charging infrastructure, and concerns about battery range.

Public transportation systems represent another crucial element in the push for sustainable urban mobility. Cities with extensive metro, bus rapid transit (BRT), and light rail networks consistently demonstrate lower per-capita carbon emissions compared to car-dependent metropolitan areas. Singapore, Tokyo, and Amsterdam are frequently cited as models of effective public transport integration, where a significant majority of daily commuters rely on public transit rather than private vehicles.

The concept of Mobility as a Service (MaaS) is gaining traction as a comprehensive approach to urban transportation. MaaS platforms integrate various transport modes — including ride-sharing, bike-sharing, public transit, and car rental — into a single, seamless digital service. Users can plan, book, and pay for multi-modal journeys through a unified application, reducing the friction typically associated with switching between different transport providers.

Autonomous vehicles (AVs) represent perhaps the most transformative potential development in urban transportation. While fully autonomous vehicles remain largely in testing phases, partial autonomy features such as adaptive cruise control, lane-keeping assistance, and automated parking are already commonplace in modern vehicles. Proponents argue that widespread AV adoption could reduce traffic accidents by up to 90%, optimize traffic flow, and dramatically improve accessibility for elderly and disabled populations.

Infrastructure investment remains a critical challenge for cities pursuing transportation modernisation. Many urban areas, particularly in the developing world, face significant backlogs of maintenance on existing road and rail infrastructure. Prioritising new technologies over fundamental infrastructure repair creates a tension that urban planners must carefully navigate. The most successful cities have adopted integrated master plans that address both maintenance of existing systems and investment in emerging transportation technologies.`,
  source: "Adapted from Urban Mobility Journal, 2024"
};

export const IELTS_QUESTIONS = [
  { id:1, type:'true_false_ng', text:'Electric vehicles produce no emissions at all.', answer:'False' },
  { id:2, type:'true_false_ng', text:'Singapore is mentioned as a model for public transport.', answer:'True' },
  { id:3, type:'true_false_ng', text:'MaaS platforms require separate payments for each transport mode.', answer:'False' },
  { id:4, type:'true_false_ng', text:'Autonomous vehicles are currently used by most commuters.', answer:'Not Given' },
  { id:5, type:'multiple_choice', text:'What is identified as a main obstacle to EV adoption?', options:['High fuel costs','Limited charging infrastructure','Lack of government support','Poor vehicle performance'], answer:'B' },
  { id:6, type:'multiple_choice', text:'Which city is NOT mentioned as a model for public transport?', options:['Singapore','Tokyo','Amsterdam','London'], answer:'D' },
  { id:7, type:'multiple_choice', text:'What percentage reduction in accidents could AVs potentially achieve?', options:['50%','70%','90%','100%'], answer:'C' },
  { id:8, type:'short_answer', text:'What does "MaaS" stand for?', answer:'Mobility as a Service' },
  { id:9, type:'short_answer', text:'Name one example of partial AV autonomy mentioned in the passage.', answer:'adaptive cruise control / lane-keeping assistance / automated parking' },
  { id:10, type:'short_answer', text:'What do cities with extensive metro networks have lower levels of?', answer:'per-capita carbon emissions' },
  { id:11, type:'multiple_choice', text:'What is described as a "critical challenge" for cities?', options:['EV adoption','Infrastructure investment','AV development','MaaS integration'], answer:'B' },
  { id:12, type:'multiple_choice', text:'The passage describes the relationship between new technology and infrastructure repair as:', options:['complementary','a partnership','a tension','an opportunity'], answer:'C' },
  { id:13, type:'true_false_ng', text:'The most successful cities ignore maintenance of existing systems.', answer:'False' },
];

export const TOEFL_QUESTIONS = [
  { id:1, type:'multiple_choice', text:'What is the main purpose of this passage?', options:['To criticise electric vehicles','To compare transportation systems globally','To describe challenges and solutions in urban transport','To argue for autonomous vehicles'], answer:'C' },
  { id:2, type:'multiple_choice', text:'The word "traction" in paragraph 4 is closest in meaning to:', options:['speed','acceptance','funding','criticism'], answer:'B' },
  { id:3, type:'multiple_choice', text:'According to the passage, which statement about MaaS is accurate?', options:['It focuses only on private vehicles','It integrates multiple transport modes into one platform','It has been adopted by all major cities','It replaces public transportation entirely'], answer:'B' },
  { id:4, type:'prose_insertion', text:'Where would the following sentence best fit in paragraph 5? "Despite these benefits, significant regulatory and technical hurdles must still be overcome."', options:['After sentence 1','After sentence 2','After sentence 3','After sentence 4'], answer:'C' },
  { id:5, type:'multiple_choice', text:'What can be inferred about cities in the developing world?', options:['They have more advanced transportation systems','They face greater infrastructure challenges','They have more electric vehicles','They use MaaS platforms more often'], answer:'B' },
];

export const CAMBRIDGE_QUESTIONS = [
  { id:1, type:'multiple_choice', text:'Which best describes the author\'s attitude towards urban transportation challenges?', options:['Pessimistic — the problems are insurmountable','Balanced — acknowledging both challenges and solutions','Enthusiastic — technology will solve everything','Critical — governments are failing to act'], answer:'B' },
  { id:2, type:'open_cloze', text:'EVs produce zero direct _______, reducing air pollution significantly.', answer:'emissions' },
  { id:3, type:'open_cloze', text:'MaaS platforms allow users to plan, book, and _______ for multi-modal journeys.', answer:'pay' },
  { id:4, type:'gapped_text', text:'Cities with extensive transit networks _______ demonstrate lower carbon emissions.', options:['never','consistently','rarely','barely'], answer:'consistently' },
  { id:5, type:'multiple_choice', text:'What does the passage suggest about AV technology?', options:['It is already fully deployed','It is entirely theoretical','Partial features already exist in modern cars','It has been rejected by governments'], answer:'C' },
  { id:6, type:'multiple_choice', text:'The phrase "backlogs of maintenance" implies that cities:', options:['have no transport problems','owe money to transport companies','have accumulated unresolved infrastructure work','recently upgraded their systems'], answer:'C' },
];

export const WRITING_TASKS = {
  IELTS: {
    task1: { prompt: 'The graph below shows the percentage of people using different modes of transport to travel to work in a European city between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', minWords: 150, time: 20 },
    task2: { prompt: 'Some people believe that private cars should be banned from city centres in order to reduce traffic congestion and pollution. Others argue that this would have a negative impact on the economy and people\'s freedom of movement. Discuss both views and give your own opinion.', minWords: 250, time: 40 },
  },
  TOEFL: {
    integrated: {
      reading: 'Researchers have proposed several theories about why bee populations have declined sharply over the past two decades. The most compelling evidence points to the widespread use of neonicotinoid pesticides, which interfere with bees\' navigation systems and reproductive cycles. Studies conducted across North America and Europe have found consistently higher bee mortality rates in agricultural areas where these chemicals are applied.',
      prompt: 'Summarise the main points in the reading passage and explain how the lecture casts doubt on these points. Do not express personal opinion.',
      minWords: 150, time: 20
    },
    discussion: {
      prompt: 'Your professor is asking students to share their thoughts on the following question: "Should universities make attendance at lectures mandatory or leave it to students to decide?" Post your response to the discussion.',
      post1: { author: 'Andrew K.', text: 'I think mandatory attendance is essential. Many students lack the self-discipline to attend consistently, which ultimately affects their academic performance. Universities need structure.' },
      post2: { author: 'Sophia L.', text: 'I disagree. University should prepare students for the real world, where time management is your own responsibility. Optional attendance teaches accountability.' },
      minWords: 100, time: 10
    },
  },
  SAT: null,
  CAMBRIDGE: {
    task1: { prompt: 'Write a review of a transport service you have used recently for a travel website. Include information about the service quality, value for money, and whether you would recommend it to others.', minWords: 220, time: 45 },
    task2: { prompt: 'Your local government is considering banning cars from the town centre. Write a letter to the local newspaper giving your views on this proposal and explaining how it would affect different groups of people.', minWords: 220, time: 45 },
  },
};

export const SPEAKING_PARTS = {
  IELTS: [
    { part: 1, type: 'intro', title: 'Part 1 — Introduction', questions: ['Can you tell me your full name?','Where are you from?','What do you do — are you a student or do you work?','Do you enjoy using public transport? Why or why not?','How do you usually travel to school or work?'], prepTime: 0, speakTime: 30 },
    { part: 2, type: 'cue_card', title: 'Part 2 — Individual Long Turn', topic: 'Describe a journey you have taken that you found particularly memorable.', bullets: ['Where you went','How you travelled','Who you were with','Why it was memorable'], prepTime: 60, speakTime: 120 },
    { part: 3, type: 'discussion', title: 'Part 3 — Two-way Discussion', questions: ['How do you think transportation will change in the next 20 years?','Do you think governments should invest more in public transport? Why?','What are the advantages and disadvantages of autonomous vehicles for society?'], prepTime: 0, speakTime: 45 },
  ],
  TOEFL: [
    { task: 1, type: 'independent', title: 'Task 1 — Independent', prompt: 'Some people prefer to travel by public transport, while others prefer to drive their own car. Which do you prefer and why? Give specific reasons and examples.', prepTime: 15, responseTime: 45 },
    { task: 2, type: 'campus', title: 'Task 2 — Campus Situation', prompt: 'The university is considering removing parking spaces to build a new cycling centre. The man disagrees with this decision. Summarise the man\'s opinion and explain the reasons he gives.', prepTime: 30, responseTime: 60 },
    { task: 3, type: 'academic', title: 'Task 3 — Academic Course Content', prompt: 'The professor describes two examples of sustainable urban transport. Using points from the lecture, explain how these examples illustrate the concept discussed in the reading.', prepTime: 30, responseTime: 60 },
    { task: 4, type: 'academic_lecture', title: 'Task 4 — Academic Lecture', prompt: 'Using the points and examples from the lecture, explain how cities are adapting their infrastructure to address the challenges of urban transportation growth.', prepTime: 20, responseTime: 60 },
  ],
  CEFR: [
    { type: 'read_aloud', title: 'Read Aloud', sentence: 'The development of sustainable urban transportation is one of the most pressing challenges facing modern city planners today.', prepTime: 20, recordTime: 20 },
    { type: 'speak_photo', title: 'Speak About the Photo', prompt: 'Describe what you see in this image in as much detail as possible.', imageDescription: 'A busy city street with cyclists, electric buses, and pedestrians. A tram is visible in the background. Solar panels are mounted on bus stops.', prepTime: 20, recordTime: 90 },
    { type: 'interactive_speaking', title: 'Interactive Speaking', aiPrompt: 'Tell me, what do you think is the most important factor in choosing your daily mode of transport?', recordTime: 35 },
  ],
};

export const SAT_QUESTIONS = [
  {
    id: 1, module: 'reading_writing',
    passage: 'A study published in the Journal of Urban Planning found that cities implementing comprehensive cycling infrastructure saw a 34% reduction in downtown traffic congestion within five years. The researchers noted, however, that the correlation between cycling uptake and congestion reduction was strongest in cities where cycling lanes were physically separated from vehicle traffic.',
    question: 'Which choice best states the main purpose of the text?',
    options: ['To argue that all cities should build cycling infrastructure','To present findings about the relationship between cycling infrastructure and traffic congestion','To criticise cities that have not invested in cycling','To explain why separated cycling lanes are always better'],
    answer: 'B'
  },
  {
    id: 2, module: 'reading_writing',
    passage: 'Archaeologists excavating a site near ancient Rome discovered what appears to be one of the world\'s earliest traffic management systems. Stone markers positioned at regular intervals along the road appear to have served as directional guides, while wider sections at intersections seem designed to allow vehicles travelling in opposite directions to pass each other safely.',
    question: 'What can reasonably be inferred from the text?',
    options: ['Ancient Romans invented the modern traffic light','Traffic management has been a human concern for thousands of years','Roman roads were superior to modern roads','Archaeologists found a complete map of Roman roads'],
    answer: 'B'
  },
  {
    id: 3, module: 'math',
    question: 'A city\'s metro system carries 240,000 passengers per day. If ridership is expected to increase by 15% each year for the next 3 years, approximately how many passengers per day will use the metro after 3 years?',
    options: ['276,000','312,000','364,000','414,000'],
    answer: 'C',
    type: 'math'
  },
  {
    id: 4, module: 'math',
    question: 'An electric bus travels 280 miles on a single charge. If the bus completes 3 full routes per day and each route is 42 miles, how many full days can the bus operate before needing to recharge?',
    options:['1','2','3','4'],
    answer: 'B',
    type: 'math'
  },
];
