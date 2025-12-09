// import {User, ThumbsUp,Zap,Shield } from "lucide-react"

export const MOCK_USERS = [
  { id: 'user-001', name: 'Almaz Birtukan',password:"almaz1234", email: 'almaz@bdu.edu.et', role: 'student', points: 1250, bio: '4th year CS student, focusing on AI and Machine Learning.', badges: ['bg-6','bg-7', 'bg-8'] }, 
  { id: 'user-003', name: 'Nib Men',password:"nib1234", email: 'nibretu@gmail.com', role: 'admin', points: 5800, bio: 'Lead moderator and faculty advisor in the EE department.', avatar: 'https://res.cloudinary.com/dahvdgqbf/image/upload/v1761065606/stgjwl3pw1cyausmzsys.png', badges: ['bg-1', 'bg-2'] },
  { id: 'user-004', name: 'Sara Genet',password:"sara1234", email: 'sara@gmail.com', role: 'student', points: 75, bio: 'Just started my journey in Business and Economics.', avatar: 'https://placehold.co/100x100/D2B4DE/003366?text=SG', badges: ['bg-1', 'bg-2','bg-3', 'bg-4','bg-5', 'bg-6','bg-7'] },
  { id: 'user-005', name: 'Sara Alem',password:"saraa1234", email: 'alem@bdu.edu.et', role: 'student', points: 75, bio: 'Just started my journey in Business and Economics.', avatar: 'https://placehold.co/100x100/D2B4DE/003366?text=SG', badges: ['bg-2','bg-3', 'bg-4','bg-5',] },
  { id: 'user-006', name: 'Me Abe',password:"mememe1234", email: 'me@bdu.edu.et', role: 'student', points: 75, bio: 'Just started my journey in Business and Economics.', avatar: 'https://placehold.co/100x100/D2B4DE/003366?text=SG', badges: ['bg-6','bg-7', 'bg-8'] },
  { id: 'user-007', name: 'Y Yen',password:"yyyyy1234", email: 'y@bdu.edu.et', role: 'student', points: 75, bio: 'Just started my journey in Business and Economics.', avatar: 'https://placehold.co/100x100/D2B4DE/003366?text=SG', badges: ['bg-6','bg-7', 'bg-8'] },
  { id: 'user-008', name: 'Sue Get',password:"suee1234", email: 'sue@bdu.edu.et', role: 'student', points: 75, bio: 'Just started my journey in Business and Economics.', avatar: 'https://placehold.co/100x100/D2B4DE/003366?text=SG', badges: ['bg-3', 'bg-4','bg-5',] },
];

export const MOCK_CATEGORIES = [
  { id: 'cat-cs', name: 'Computer Science', icon: '💻', count: 450 },
  { id: 'cat-ee', name: 'Electrical Engineering', icon: '⚡', count: 320 },
  { id: 'cat-bus', name: 'Business & Economics', icon: '📈', count: 180 },
  { id: 'cat-law', name: 'Law & Governance', icon: '⚖️', count: 95 },
  { id: 'cat-soc', name: 'Social Sciences', icon: '🌍', count: 50 },
];

export const MOCK_ANSWERS = [
  { id: 'a-001', questionId: 'q-001', authorId: 'user-002', body: 'This is a fantastic question. For BDU, DL for predictive models is easier to implement with existing administrative data. RL, while more powerful for dynamic optimization, requires high-frequency, clean interaction data which is often missing. I recommend starting with DL.', likes: 30, dislikes: 0, date: '2025-10-25T11:30:00Z' },
  { id: 'a-002', questionId: 'q-001', authorId: 'user-003', body: 'I disagree. RL is the future. Use a simple simulated environment first to test your Q-learning agent. You can then try to integrate it with the real data.', likes: 5, dislikes: 1, date: '2025-10-25T12:00:00Z' },
  { id: 'a-003', questionId: 'q-003', authorId: 'user-001', body: 'The research board highly prioritizes relevance to local/national development goals and clear methodology. Make sure your budget justification is solid and transparent!', likes: 45, dislikes: 2, date: '2025-10-27T10:00:00Z' },
  { id: 'a-004', questionId: 'q-003', authorId: 'user-002', body: 'The research board highly prioritizes relevance to local/national development goals and clear methodology. Make sure your budget justification is solid and transparent!', likes: 45, dislikes: 2, date: '2025-10-27T10:00:00Z' },
];

 export const MOCK_MESSAGES = [
  { id: 'msg-001', conversationId: 'conv-001', senderId: 'user-002', receiverId: 'user-001', body: 'I saw your question on Deep Learning. Can we chat about some potential datasets?', date: '2025-10-28T10:00:00Z', read: false },
  { id: 'msg-002', conversationId: 'conv-001', senderId: 'user-001', receiverId: 'user-002', body: 'Absolutely! I am free later this afternoon. Let me know what time works best.', date: '2025-10-28T10:05:00Z', read: false },
  { id: 'msg-003', conversationId: 'conv-002', senderId: 'user-003', receiverId: 'user-001', body: 'Thanks for the quick response on the grant proposal. Very helpful!', date: '2025-10-28T11:00:00Z', read: true },
  {id: 'msg-003', conversationId: 'conv-003', senderId: 'user-003', receiverId: 'user-002', body: 'Absolutely! I am free later this afternoon. Let me know what time works best.', date: '2025-10-28T10:05:00Z', read: false},
  {id: 'msg-004', conversationId: 'conv-003', senderId: 'user-004', receiverId: 'user-002', body: 'Absolutely! I am free later this afternoon. Let me know what time works best.', date: '2025-10-28T10:05:00Z', read: true},
  {id: 'msg-005', conversationId: 'conv-005', senderId: 'user-005', receiverId: 'user-002', body: 'Absolutely! I am free later this afternoon. Let me know what time works best.', date: '2025-10-28T10:05:00Z', read: true},
  {id: 'msg-006', conversationId: 'conv-006', senderId: 'user-006', receiverId: 'user-002', body: 'Absolutely! I am free later this afternoon. Let me know what time works best.', date: '2025-10-28T10:05:00Z', read: false },
  {id: 'msg-007', conversationId: 'conv-007', senderId: 'user-007', receiverId: 'user-002', body: 'Absolutely! I am free later this afternoon. Let me know what time works best.', date: '2025-10-28T10:05:00Z', read: false} ,
  {id: 'msg-008', conversationId: 'conv-008', senderId: 'user-008', receiverId: 'user-002', body: 'Absolutely! I am free later this afternoon. Let me know what time works best.', date: '2025-10-28T10:05:00Z', read: false},
]; 

export const MOCK_BADGES = [
  { id:'bg-1', name: 'Active User', icon:'zap', description: 'Awarded for 7-day login streak.' },
  { id:'bg-2', name: 'Top Answer', icon: 'crown', description: 'Awarded when one answer receives 25 likes.' },
  { id:'bg-3', name: 'Liked Answer', icon: 'thumbs-up' , description: 'Awarded when one answer receives 10 likes.' },
  { id:'bg-4', name: 'Deep Thinker', icon: 'brain' , description: 'Awarded after asking 5 questions.' },
  { id:'bg-5', name: 'Curious', icon: 'search' , description: 'Awarded after asking 1 question.' },
  { id:'bg-6', name: 'Expert Helper', icon: 'trophy' , description: 'Awarded after submitting 10 answers.' },
  { id:'bg-7', name: 'Contributor', icon: 'star' , description: 'Awarded after submitting 5 answers.' },
  { id:'bg-8', name: 'Beginner Helper', icon: 'sparkles' , description: 'Awarded after submitting 1 answer.' },
];

export const MOCK_TAGS = [
   {"id": 1, "name": "Java" },
    {"id" : 2,"name": "HTML"}, 
    {"id":3, "name":"CSS" },
    {"id":4,"name":"React"},
    {"id":5,"name":"Django"},
]
 
export const MOCK_QUESTIONS = [
  {
    id: "q-001",
    title: "Deep Learning vs. Reinforcement Learning: Which is more viable for optimizing BDU scheduling?",
    tags: [1,3],
    categoryId: "cat-cs",
    authorId: "user-001",
    body: "I am starting my final year project and am stuck between focusing on a DL-based predictive model or using RL for dynamic schedule optimization...",
    likes: 45,
    dislikes: 5,
    answers: 12,
    date: "2025-10-25T10:00:00Z",
    image: "image.png",
    is_bookmarked: true,
  },

  {
    id: "q-002",
    title: "What is the required clearance distance for 132kV transmission lines in an urban setting?",
    tags: [1,3,2,5],
    categoryId: "cat-ee",
    authorId: "user-003",
    body: "I am reviewing a proposal and need to verify the safety requirements based on Ethiopian Electric Power standards.",
    likes: 12,
    dislikes: 1,
    answers: 3,
    date: "2025-10-26T14:30:00Z",
    image: "image.png",
    is_bookmarked: true,
  },

  {
    id: "q-003",
    title: "Best practices for writing a convincing research proposal for an internal grant?",
    tags: [3,5,2,1],
    categoryId: "cat-bus",
    authorId: "user-003",
    body: "As a faculty member, what elements does the BDU research review board prioritize?",
    likes: 88,
    dislikes: 2,
    answers: 25,
    date: "2025-10-27T09:15:00Z",
    image: "image.png",
    is_bookmarked: false,
  },

  {
    id: "q-004",
    title: "Can a contract be voided based on a change in market conditions (Force Majeure)?",
    tags: [1,3],
    categoryId: "cat-law",
    authorId: "user-001",
    body: "Considering the recent import restrictions, can a supplier legally back out of a fixed-price contract?",
    likes: 5,
    dislikes: 0,
    answers: 1,
    date: "2025-10-28T16:00:00Z",
    image: "image.png",
    is_bookmarked: false,
  }
];



export const MOCK_ANNOUNCEMENTS = [
  {
    id: "ann-001",
    title: "BDU Library System Upgrade Scheduled",
    date: "2025-11-01",
    author: "BDU ICT Directorate",
    image: "/images/announcement/library_upgrade.jpg",
    tags: ["Library", "Maintenance", "System Update"],
    body: `
The Bahir Dar University Library Management System will undergo scheduled maintenance on **Saturday, November 2, 2025**, from **2:00 PM to 10:00 PM**.

During this period:
- Online catalog access will be unavailable
- Book borrowing/return services will be paused
- Digital repository downloads may be temporarily disabled

We encourage all students and staff to plan their research activities accordingly.

Thank you for your understanding.
    `,
  },

  {
    id: "ann-002",
    title: "New Research Grant Cycle Now Open",
    date: "2025-10-29",
    author: "Office of Research & Technology Transfer",
    image: "/images/announcement/research_grant.jpg",
    tags: ["Research", "Grant", "Opportunity"],
    body: `
The new **2025 Research Grant Cycle** is officially open. All academic staff and postgraduate students are invited to submit proposals beginning **November 5, 2025**.

Key details:
- Maximum funding: **120,000 ETB**
- Duration: **6–12 months**
- Areas: Science, Engineering, Social Studies, Education, Health, and Agriculture
- Submission portal will close on **December 15, 2025**

Workshops on proposal writing will be held next week.

For inquiries, contact: **research.office@bdu.edu.et**
    `,
  },

  {
    id: "ann-003",
    title: "Campus Wi-Fi Upgrade Completed",
    date: "2025-10-20",
    author: "Network Infrastructure Team",
    image: "/slides/design3.png",
    tags: ["Network", "WiFi", "Upgrade"],
    body: `
The university has completed a major upgrade to the **BDU Campus Wi-Fi Network**.

Improvements include:
- Speed increased up to **300 Mbps** in main buildings
- Better coverage in libraries and cafeterias
- More stable connectivity during peak hours
- Stronger firewall protections added

If you experience any issues, please report through the ICT help desk portal.
    `,
  },

  {
    id: "ann-004",
    title: "Mid-Semester Make-Up Exams Schedule Published",
    date: "2025-10-15",
    author: "Registrar Office",
    image: "/images/announcement/exam_schedule.jpg",
    tags: ["Exams", "Registrar", "Schedule"],
    body: `
The **Mid-Semester Make-Up Examination Schedule** is now available on the student portal.

Important notes:
- Make-up exams are only for students with approved absence reasons
- Exam halls and invigilators are listed in the portal
- Students must bring ID cards
- Requests for schedule changes will not be accepted

Visit: **portal.bdu.edu.et/exams**
    `,
  },
];
