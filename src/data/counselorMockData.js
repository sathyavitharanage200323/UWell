export const initialCounselorProfile = {
  id: 'c1',
  name: 'Dr. Evelyn Martinez, PhD',
  title: 'Senior Student Cognitive Psychologist',
  role: 'CLINICAL STAFF',
  rating: 4.9,
  sessionsReviewed: 148,
  qualification: 'PhD in Clinical Psychology, Stanford',
  specialization: 'Cognitive Behavioral Therapy (CBT)',
  clinicalFocus: [
    'Academic Burnout',
    'ADHD Management',
    'Anxiety Disorder',
    'Social Adjustment'
  ],
  officeLocation: 'Clinic Hall B, Room 302',
  email: 'e.martinez@university.edu',
  avatarInitials: 'EM',
  bio: 'Dedicated senior psychologist with over 10 years of experience supporting university students through academic, emotional, and social challenges.'
};

export const initialPerformanceStats = {
  activeCases: 42,
  thisWeekSessions: 18,
  pendingRequests: 5,
  summary: 'Your afternoon is fully booked with student check-ins.'
};

export const initialAppointments = [
  {
    id: 'app-1',
    studentId: 'stu-1',
    studentName: 'Sarah Jenkins',
    studentCourse: '2nd Year CS',
    sessionType: 'CBT · Video Session',
    date: 'Today',
    time: '2:00 PM',
    location: 'Video Session',
    status: 'Confirmed',
    notes: 'Student experiencing exam anxiety. Practiced breathing exercises in last session.',
    avatarInitials: 'SJ'
  },
  {
    id: 'app-2',
    studentId: 'stu-3',
    studentName: 'Clara Oswald',
    studentCourse: 'Graduate Student',
    sessionType: 'Academic Stress · Office',
    date: 'Today',
    time: '3:30 PM',
    location: 'Office 302',
    status: 'Confirmed',
    notes: 'Thesis preparation stress and time management consultation.',
    avatarInitials: 'CO'
  },
  {
    id: 'app-3',
    studentId: 'stu-4',
    studentName: 'Arthur Dent',
    studentCourse: '1st Year Undergraduate',
    sessionType: 'Initial Consultation',
    date: 'Oct 12',
    time: '10:00 AM',
    location: 'In-Person Room 304',
    status: 'Pending',
    notes: 'Requested initial assessment for social adjustment.',
    avatarInitials: 'AD'
  },
  {
    id: 'app-4',
    studentId: 'stu-2',
    studentName: 'Marcus Brody',
    studentCourse: '3rd Year Psychology',
    sessionType: 'Follow-up Session',
    date: 'Oct 14',
    time: '11:00 AM',
    location: 'Office 302',
    status: 'Confirmed',
    notes: 'Reviewing weekly sleep hygiene progress.',
    avatarInitials: 'MB'
  }
];

export const initialStudents = [
  {
    id: 'stu-1',
    name: 'Sarah Jenkins',
    yearCourse: '2nd Year CS',
    sessionsCompleted: 4,
    status: 'Active',
    avatarInitials: 'SJ',
    email: 'sarah.j@university.edu',
    moodHistory: [
      { day: 'Mon', level: 3, label: 'Fair' },
      { day: 'Tue', level: 4, label: 'Good' },
      { day: 'Wed', level: 2, label: 'Poor' },
      { day: 'Thu', level: 4, label: 'Good' },
      { day: 'Fri', level: 5, label: 'Excellent' },
      { day: 'Sat', level: 4, label: 'Good' },
      { day: 'Sun', level: 4, label: 'Good' }
    ],
    diagnosisNotes: 'Mild General Anxiety related to academic deadlines. Responding well to CBT techniques.',
    sessionNotesHistory: 'Discussed ground techniques. Student reports 40% reduction in panic symptoms.'
  },
  {
    id: 'stu-2',
    name: 'Marcus Brody',
    yearCourse: '3rd Year Psychology',
    sessionsCompleted: 3,
    status: 'Active',
    avatarInitials: 'MB',
    email: 'm.brody@university.edu',
    moodHistory: [
      { day: 'Mon', level: 4, label: 'Good' },
      { day: 'Tue', level: 3, label: 'Fair' },
      { day: 'Wed', level: 3, label: 'Fair' },
      { day: 'Thu', level: 4, label: 'Good' },
      { day: 'Fri', level: 4, label: 'Good' },
      { day: 'Sat', level: 5, label: 'Excellent' },
      { day: 'Sun', level: 4, label: 'Good' }
    ],
    diagnosisNotes: 'Sleep disruption and stress management.',
    sessionNotesHistory: 'Provided sleep hygiene checklist. Follow up next week.'
  },
  {
    id: 'stu-3',
    name: 'Clara Oswald',
    yearCourse: 'Graduate Student',
    sessionsCompleted: 8,
    status: 'Completed',
    avatarInitials: 'CO',
    email: 'c.oswald@university.edu',
    moodHistory: [
      { day: 'Mon', level: 5, label: 'Excellent' },
      { day: 'Tue', level: 4, label: 'Good' },
      { day: 'Wed', level: 5, label: 'Excellent' },
      { day: 'Thu', level: 4, label: 'Good' },
      { day: 'Fri', level: 5, label: 'Excellent' },
      { day: 'Sat', level: 5, label: 'Excellent' },
      { day: 'Sun', level: 5, label: 'Excellent' }
    ],
    diagnosisNotes: 'Thesis writing fatigue. Completed 8-session program.',
    sessionNotesHistory: 'Final wrap-up session completed.'
  },
  {
    id: 'stu-4',
    name: 'Arthur Dent',
    yearCourse: '1st Year Undergraduate',
    sessionsCompleted: 1,
    status: 'New',
    avatarInitials: 'AD',
    email: 'a.dent@university.edu',
    moodHistory: [
      { day: 'Mon', level: 2, label: 'Poor' },
      { day: 'Tue', level: 2, label: 'Poor' },
      { day: 'Wed', level: 3, label: 'Fair' },
      { day: 'Thu', level: 3, label: 'Fair' },
      { day: 'Fri', level: 2, label: 'Poor' },
      { day: 'Sat', level: 3, label: 'Fair' },
      { day: 'Sun', level: 3, label: 'Fair' }
    ],
    diagnosisNotes: 'Adjustment disorder symptoms upon starting university.',
    sessionNotesHistory: 'Initial intake completed.'
  }
];

export const initialMessages = [
  {
    id: 'msg-1',
    studentId: 'stu-1',
    studentName: 'Sarah Jenkins',
    avatarInitials: 'SJ',
    lastMessage: 'They helped a lot during my exam week.',
    timestamp: '10:42 AM',
    unread: false,
    chatHistory: [
      {
        id: 'c-1',
        sender: 'student',
        text: 'Hi Dr. Martinez, I wanted to follow up on the breathing exercises you suggested.',
        timestamp: '10:30 AM'
      },
      {
        id: 'c-2',
        sender: 'counselor',
        text: 'Great to hear from you, Sarah! How have they been working for you?',
        timestamp: '10:35 AM'
      },
      {
        id: 'c-3',
        sender: 'student',
        text: 'They helped a lot during my exam week.',
        timestamp: '10:42 AM'
      }
    ]
  },
  {
    id: 'msg-2',
    studentId: 'stu-2',
    studentName: 'Marcus Brody',
    avatarInitials: 'MB',
    lastMessage: 'Thanks for the sleep hygiene tips, Dr. Martinez!',
    timestamp: 'Yesterday',
    unread: false,
    chatHistory: [
      {
        id: 'c-4',
        sender: 'student',
        text: 'Thanks for the sleep hygiene tips, Dr. Martinez!',
        timestamp: 'Yesterday 4:15 PM'
      }
    ]
  },
  {
    id: 'msg-3',
    studentId: 'stu-3',
    studentName: 'Clara Oswald',
    avatarInitials: 'CO',
    lastMessage: 'My thesis proposal was approved yesterday.',
    timestamp: 'Oct 02',
    unread: false,
    chatHistory: [
      {
        id: 'c-5',
        sender: 'student',
        text: 'My thesis proposal was approved yesterday.',
        timestamp: 'Oct 02 2:00 PM'
      }
    ]
  },
  {
    id: 'msg-4',
    studentId: 'stu-4',
    studentName: 'Arthur Dent',
    avatarInitials: 'AD',
    lastMessage: 'Looking forward to our appointment on Thursday.',
    timestamp: 'Oct 01',
    unread: true,
    chatHistory: [
      {
        id: 'c-6',
        sender: 'student',
        text: 'Looking forward to our appointment on Thursday.',
        timestamp: 'Oct 01 9:10 AM'
      }
    ]
  }
];

export const initialAvailabilitySchedule = [
  {
    id: 'av-1',
    day: 'Monday',
    active: true,
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  },
  {
    id: 'av-2',
    day: 'Tuesday',
    active: true,
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    slots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:30 PM']
  },
  {
    id: 'av-3',
    day: 'Wednesday',
    active: true,
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    slots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM']
  },
  {
    id: 'av-4',
    day: 'Thursday',
    active: false,
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    slots: []
  },
  {
    id: 'av-5',
    day: 'Friday',
    active: true,
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    slots: ['09:00 AM', '10:00 AM', '11:00 AM']
  }
];

// ─── Clinical Focus Areas — rich data for list + detail screens ──────────────
export const initialClinicalFocusAreas = [
  {
    id: 'focus-1',
    key: 'Academic Burnout',
    subtitle: 'Understanding academic pressure and restoring balance.',
    description: 'Support with overwhelming workload, low motivation, and academic pressure.',
    cardColor: '#FDF1EC',
    iconLib: 'Ionicons',
    iconName: 'school-outline',
    accentColor: '#E8836B',
    howWeCanHelp: [
      'Managing academic pressure and workload',
      'Building healthy study routines',
      'Improving motivation and engagement',
      'Preventing emotional exhaustion',
    ],
    commonExperiences: [
      'Feeling overwhelmed by deadlines',
      'Constant tiredness and low energy',
      'Difficulty concentrating',
      'Loss of motivation',
    ],
  },
  {
    id: 'focus-2',
    key: 'ADHD Management',
    subtitle: 'Building focus and structure for academic success.',
    description: 'Strategies for focus, organisation, time management and reducing distractions.',
    cardColor: '#EAF3FF',
    iconLib: 'MaterialCommunityIcons',
    iconName: 'brain',
    accentColor: '#4A90E2',
    howWeCanHelp: [
      'Strategies for sustained focus',
      'Time management and planning tools',
      'Reducing distractions in study environments',
      'Organisation and task prioritisation',
    ],
    commonExperiences: [
      'Struggling to start or finish tasks',
      'Forgetfulness and losing track of time',
      'Impulsive decisions under stress',
      'Difficulty sitting still or staying on topic',
    ],
  },
  {
    id: 'focus-3',
    key: 'Anxiety Disorder',
    subtitle: 'Reducing worry and building healthier coping strategies.',
    description: 'Support for excessive worry, stress, panic, and building healthier coping strategies.',
    cardColor: '#E8F8EF',
    iconLib: 'Feather',
    iconName: 'heart',
    accentColor: '#397052',
    howWeCanHelp: [
      'CBT techniques for managing worry',
      'Breathing and grounding exercises',
      'Identifying anxiety triggers',
      'Building confidence in social situations',
    ],
    commonExperiences: [
      'Excessive worry about exams or the future',
      'Physical symptoms like racing heart',
      'Avoiding situations that feel overwhelming',
      'Difficulty sleeping due to anxious thoughts',
    ],
  },
  {
    id: 'focus-4',
    key: 'Social Adjustment',
    subtitle: 'Guidance for relationships and adapting to university life.',
    description: 'Guidance for relationships, communication and adapting to university life.',
    cardColor: '#F3EEFF',
    iconLib: 'Ionicons',
    iconName: 'people-outline',
    accentColor: '#7C5CBF',
    howWeCanHelp: [
      'Building communication and social skills',
      'Managing homesickness and culture shock',
      'Navigating friendships and peer relationships',
      'Adapting to university independence',
    ],
    commonExperiences: [
      'Feeling lonely or out of place',
      'Difficulty making or keeping friendships',
      'Homesickness or missing familiar routines',
      'Struggling with identity or belonging',
    ],
  },
];
