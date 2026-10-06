export const mockUsers = {
  students: [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@university.edu',
      studentId: 'STU001',
      role: 'student',
      counselorId: 1,
      joinDate: '2024-08-15',
      totalSessions: 8,
      lastSession: '2024-09-28',
      currentMood: 'Good'
    },
    {
      id: 2,
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@university.edu',
      studentId: 'STU002',
      role: 'student',
      counselorId: 2,
      joinDate: '2024-08-20',
      totalSessions: 5,
      lastSession: '2024-09-25',
      currentMood: 'Fair'
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@university.edu',
      studentId: 'STU003',
      role: 'student',
      counselorId: 3,
      joinDate: '2024-08-10',
      totalSessions: 12,
      lastSession: '2024-09-20',
      currentMood: 'Poor'
    }
  ],
  counselors: [
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@university.edu',
      role: 'counselor',
      specialization: 'Anxiety & Depression',
      rating: 4.9,
      experience: '10 years',
      education: 'Ph.D. in Clinical Psychology',
      bio: 'Dr. Johnson specializes in helping students manage anxiety and depression using evidence-based approaches.',
      languages: ['English', 'Spanish'],
      totalStudents: 15,
      totalSessions: 156
    },
    {
      id: 2,
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@university.edu',
      role: 'counselor',
      specialization: 'Stress Management',
      rating: 4.8,
      experience: '8 years',
      education: 'Ph.D. in Counseling Psychology',
      bio: 'Dr. Chen focuses on stress management techniques and academic pressure.',
      languages: ['English', 'Mandarin'],
      totalStudents: 12,
      totalSessions: 134
    },
    {
      id: 3,
      firstName: 'Emily',
      lastName: 'Williams',
      email: 'emily.williams@university.edu',
      role: 'counselor',
      specialization: 'Relationship Counseling',
      rating: 4.7,
      experience: '12 years',
      education: 'Ph.D. in Clinical Psychology',
      bio: 'Dr. Williams helps students navigate relationship challenges and social anxiety.',
      languages: ['English'],
      totalStudents: 18,
      totalSessions: 189
    }
  ],
  welfare: [
    {
      id: 1,
      firstName: 'Welfare',
      lastName: 'Team',
      email: 'welfare@university.edu',
      role: 'welfare',
      department: 'Student Welfare Services',
      location: 'Student Center, Room 201'
    }
  ],
  management: [
    {
      id: 1,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@university.edu',
      role: 'management',
      department: 'IT Services'
    }
  ]
};

export const mockAppointments = [
  {
    id: 1,
    studentId: 1,
    counselorId: 1,
    date: '2024-09-30',
    time: '14:00',
    status: 'confirmed',
    type: 'individual',
    notes: 'Student requested help with anxiety management'
  },
  {
    id: 2,
    studentId: 2,
    counselorId: 2,
    date: '2024-09-30',
    time: '15:00',
    status: 'confirmed',
    type: 'individual',
    notes: 'Follow-up session'
  },
  {
    id: 3,
    studentId: 3,
    counselorId: 3,
    date: '2024-10-01',
    time: '10:00',
    status: 'pending',
    type: 'individual',
    notes: 'Initial consultation'
  }
];

export const mockServices = [
  {
    id: 1,
    name: 'Individual Counseling',
    description: 'One-on-one sessions with professional counselors for personalized mental health support.',
    icon: '👤',
    active: true,
    counselors: 12,
    duration: '50 minutes',
    price: 'Free for students'
  },
  {
    id: 2,
    name: 'Group Therapy',
    description: 'Support groups for shared experiences and peer support.',
    icon: '👥',
    active: true,
    counselors: 5,
    duration: '90 minutes',
    price: 'Free for students'
  },
  {
    id: 3,
    name: 'Stress Management Workshop',
    description: 'Weekly workshops on stress reduction techniques.',
    icon: '🧘',
    active: true,
    counselors: 3,
    duration: '60 minutes',
    price: 'Free for students'
  },
  {
    id: 4,
    name: 'Crisis Intervention',
    description: '24/7 emergency support for urgent situations.',
    icon: '🆘',
    active: true,
    counselors: 8,
    duration: 'Variable',
    price: 'Free for students'
  }
];

export const mockResources = [
  {
    id: 1,
    title: 'Managing Stress',
    category: 'Self-Care',
    icon: '🧘',
    description: 'Learn effective techniques to manage daily stress',
    content: 'Stress management tips and strategies...'
  },
  {
    id: 2,
    title: 'Sleep Hygiene',
    category: 'Health',
    icon: '😴',
    description: 'Tips for better sleep and improved well-being',
    content: 'Sleep improvement strategies...'
  },
  {
    id: 3,
    title: 'Building Resilience',
    category: 'Personal Growth',
    icon: '💪',
    description: 'Develop mental strength to overcome challenges',
    content: 'Resilience building exercises...'
  },
  {
    id: 4,
    title: 'Mindfulness Basics',
    category: 'Meditation',
    icon: '🧠',
    description: 'Introduction to mindfulness practices',
    content: 'Mindfulness meditation guide...'
  }
];

export const mockMoodHistory = [
  { date: '2024-09-28', mood: 'Good', level: 4, notes: 'Feeling better after session' },
  { date: '2024-09-25', mood: 'Fair', level: 3, notes: 'Some anxiety about exams' },
  { date: '2024-09-20', mood: 'Good', level: 4, notes: 'Productive day' },
  { date: '2024-09-15', mood: 'Poor', level: 2, notes: 'Feeling overwhelmed' },
  { date: '2024-09-10', mood: 'Fair', level: 3, notes: 'Managing stress' }
];
