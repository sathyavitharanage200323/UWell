// Mock data for the Welfare Officer module.
// Replace with API calls when backend is connected.

export const welfareOfficer = {
  id: 'wo-1',
  name: 'Sarah Mitchell',
  firstName: 'Sarah',
  role: 'Student Welfare Officer',
  department: 'University Counseling & Welfare',
  email: 'sarah.mitchell@university.edu',
  phone: '+1 (555) 019-2834',
  officeLocation: 'Room 105, Student Services Building',
  avatarInitials: 'SM'
};

export const dashboardStats = [
  { id: 'upcoming', label: 'Upcoming Appointments', value: 3, icon: 'calendar-outline', tint: 'coral' },
  { id: 'counselors', label: 'Available Counselors', value: 5, icon: 'people-outline', tint: 'green' },
  { id: 'completed', label: 'Completed Sessions', value: 12, icon: 'checkmark-circle-outline', tint: 'blue' },
  { id: 'pending', label: 'Pending Requests', value: 4, icon: 'time-outline', tint: 'orange' }
];

export const todayServiceActivity = [
  { id: 'tsa-1', studentName: 'Student A', service: 'Academic Adjustment', time: '09:30 AM', status: 'In Progress' },
  { id: 'tsa-2', studentName: 'Student B', service: 'Stress Management', time: '11:00 AM', status: 'Scheduled' },
  { id: 'tsa-3', studentName: 'Student C', service: 'Crisis Resolution', time: '02:15 PM', status: 'Completed' }
];

export const availableCounselors = [
  { id: 'c-1', name: 'Dr. Maria Santos', specialization: 'Academic Counseling', status: 'Available' },
  { id: 'c-2', name: 'Dr. James Lee', specialization: 'Mental Wellbeing', status: 'In Session' },
  { id: 'c-3', name: 'Prof. Sarah Jenkins', specialization: 'Stress & Anxiety Specialist', status: 'Available' }
];

export const liveSessionsToday = [
  { id: 'ls-1', student: 'Student C', counselor: 'Dr. Maria Santos', time: '10:30 AM', status: 'Scheduled' },
  { id: 'ls-2', student: 'Student F', counselor: 'Dr. James Lee', time: '01:00 PM', status: 'In Session' }
];

export const upcomingServiceDemand = [
  { id: 'ud-1', day: 'Today', sessions: 3, dateLabel: 'Jan 26' },
  { id: 'ud-2', day: 'Tomorrow', sessions: 5, dateLabel: 'Jan 27' },
  { id: 'ud-3', day: 'Wednesday', sessions: 2, dateLabel: 'Jan 28' }
];

export const welfareAppointments = [
  { id: 'apt-1', studentName: 'Student D', counselorName: 'Dr. James Lee', service: 'Stress Counseling', date: 'Tue Jan 27', time: '10:00 AM', status: 'Upcoming' },
  { id: 'apt-2', studentName: 'Student G', counselorName: 'Dr. Maria Santos', service: 'Academic Crisis', date: 'Tue Jan 27', time: '02:00 PM', status: 'Upcoming' },
  { id: 'apt-3', studentName: 'Student H', counselorName: 'Prof. Sarah Jenkins', service: 'Anxiety Support', date: 'Wed Jan 28', time: '09:30 AM', status: 'Upcoming' },
  { id: 'apt-4', studentName: 'Student I', counselorName: 'Dr. Maria Santos', service: 'Routine Welfare Follow-up', date: 'Fri Jan 23', time: '03:00 PM', status: 'Completed' },
  { id: 'apt-5', studentName: 'Student J', counselorName: 'Dr. James Lee', service: 'Emergency Crisis Intervention', date: 'Thu Jan 22', time: '11:00 AM', status: 'Cancelled' }
];

export const appointmentDetailsMap = {
  'apt-1': {
    studentRef: 'Student E',
    counselor: 'Dr. James Lee',
    serviceType: 'Personal Counseling',
    duration: '45 minutes',
    location: 'Room 204, Student Services Building',
    notes: 'Session notes will be available after the appointment. Both counsel officers and designated staff can access notes securely post-evaluation.'
  },
  'apt-2': {
    studentRef: 'Student G',
    counselor: 'Dr. Maria Santos',
    serviceType: 'Academic Crisis',
    duration: '45 minutes',
    location: 'Room 204, Student Services Building',
    notes: 'Urgent academic intervention session. Follow up within 48 hours.'
  },
  'apt-3': {
    studentRef: 'Student H',
    counselor: 'Prof. Sarah Jenkins',
    serviceType: 'Anxiety Support',
    duration: '50 minutes',
    location: 'Room 202, Student Services Building',
    notes: 'Continued anxiety support. Reviewing coping strategies from previous session.'
  },
  'apt-4': {
    studentRef: 'Student I',
    counselor: 'Dr. Maria Santos',
    serviceType: 'Routine Welfare Follow-up',
    duration: '30 minutes',
    location: 'Room 204, Student Services Building',
    notes: 'Routine welfare check completed. No further action required.'
  },
  'apt-5': {
    studentRef: 'Student J',
    counselor: 'Dr. James Lee',
    serviceType: 'Emergency Crisis Intervention',
    duration: '60 minutes',
    location: 'Emergency Unit',
    notes: 'Session cancelled by counselor. Emergency protocol stand-down.'
  }
};

export const supportDirectories = [
  {
    id: 'sd-1',
    category: 'counseling',
    title: 'Counseling Service',
    description: 'Professional counseling for personal and academic concerns.',
    icon: 'chatbubble-ellipses-outline',
    urgent: false,
    tag: 'LICENSED CLINICAL SUPPORT',
    about: 'Our fully-certified counseling service focuses on providing students with direct, confidential access to licensed psychologists, welfare workers, and crisis counselors during stressful semesters.',
    servicesOffered: [
      'Individual Counseling Programs',
      'Group Therapy & Stress Management',
      'Crisis Intervention Protocols',
      'Peer Support Programs & Outreach',
      'Confidential Psychiatric Referrals'
    ],
    contact: {
      phone: '+1 (555) 019-2834',
      email: 'counseling.center@university.edu',
      hours: 'Monday – Friday, 8:30 AM – 5:00 PM',
      leadOfficer: 'Dr. Evelyn Martinez (Lead Counselor)'
    },
    location: 'Room 105, Student Services Building (Adjacent to Main Library)'
  },
  {
    id: 'sd-2',
    category: 'academic',
    title: 'Academic Support',
    description: 'Tutoring, study skills, and academic advising.',
    icon: 'school-outline',
    urgent: false,
    tag: 'ACADEMIC EXCELLENCE & ADVISORY',
    about: 'Dedicated academic guidance helping students navigate coursework challenges, exam preparations, time allocation, academic probation recovery, and study strategy enhancements.',
    servicesOffered: [
      'One-on-One Peer Tutoring',
      'Study Skills & Time Management Workshops',
      'Academic Probation Coaching',
      'Exam Preparation & Review Sessions',
      'Specialized Learning Accommodation Services'
    ],
    contact: {
      phone: '+1 (555) 019-4455',
      email: 'academic.support@university.edu',
      hours: 'Monday – Saturday, 8:00 AM – 6:00 PM',
      leadOfficer: 'Prof. David Miller (Academic Support Coordinator)'
    },
    location: 'Building B, 2nd Floor, Academic Commons Desk'
  },
  {
    id: 'sd-3',
    category: 'welfare',
    title: 'Student Welfare Support',
    description: 'Financial aid, housing assistance, and wellbeing programs.',
    icon: 'home-outline',
    urgent: false,
    tag: 'STUDENT WELLBEING & WELFARE',
    about: 'Primary hub for student wellbeing. Assisting students with hardship subsidies, campus hostel accommodation, community wellbeing initiatives, and disability assistance.',
    servicesOffered: [
      'Emergency Student Hardship Grants',
      'Hostel & Off-Campus Accommodation Mediation',
      'Meal Assistance Vouchers & Food Security',
      'Health Insurance Guidance',
      'Disability Access & Adaptive Equipment Support'
    ],
    contact: {
      phone: '+1 (555) 019-3322',
      email: 'student.welfare@university.edu',
      hours: 'Monday – Friday, 9:00 AM – 4:30 PM',
      leadOfficer: 'Jon Wick (Senior Welfare Officer)'
    },
    location: 'Block C, Ground Floor, Welfare Office 04'
  },
  {
    id: 'sd-4',
    category: 'emergency',
    title: 'Emergency Support',
    description: 'Crisis hotline and immediate assistance resources.',
    icon: 'alert-circle-outline',
    urgent: true,
    tag: '24/7 CRISIS RESPONSE & SAFETY',
    about: 'Immediate emergency support hotline for students experiencing acute psychological crisis, safety concerns, medical emergencies, or severe distress on or off campus.',
    servicesOffered: [
      '24/7 Crisis Hotline & Suicide Prevention Support',
      'Emergency Medical & First Aid Response',
      'Campus Security Safety Escort',
      'Trauma & Crisis De-escalation Intervention',
      'Urgent Temporary Safe Haven Housing'
    ],
    contact: {
      phone: '+1 (555) 911-HELP / 1990',
      email: 'crisis.response@university.edu',
      hours: '24 Hours / 7 Days a week (Always Open)',
      leadOfficer: 'Emergency Response Unit & Campus Safety'
    },
    location: 'Campus Security & Health Centre, Gate 1 Emergency Entrance'
  }
];

export const counselingServiceDetails = supportDirectories[0];

export const welfareNotifications = [
  { id: 'n-1', type: 'request', title: 'New Appointment Request', message: 'Student D requested an emergency counseling slot.', timestamp: '10m ago', unread: true },
  { id: 'n-2', type: 'completed', title: 'Session Completed', message: 'Your crisis resolution session with Student C is marked complete.', timestamp: '45m ago', unread: true },
  { id: 'n-3', type: 'schedule', title: 'Schedule Change', message: 'Dr. James Lee updated his availability for tomorrow.', timestamp: '2h ago', unread: false },
  { id: 'n-4', type: 'system', title: 'System Update', message: 'New data security controls are active. Review updated policy.', timestamp: '5h ago', unread: false },
  { id: 'n-5', type: 'reminder', title: 'Student Follow-up Reminder', message: 'Check in with Student B regarding academic accommodation.', timestamp: '1d ago', unread: false }
];

export const privacySecurityData = {
  dataAccessLevel: {
    label: 'Welfare Access',
    description: 'You can view appointment schedules, service referrals, and general welfare notes. You cannot access detailed counseling session notes or clinical diagnoses.'
  },
  confidentiality: {
    signedDate: 'Jan 12, 2026',
    renewalDate: 'Jan 12, 2027',
    active: true
  },
  twoFactorEnabled: true,
  sessionTimeout: '15 minutes'
};

export const privacyInformation = [
  { id: 'pi-1', title: 'Student Data Protection', body: 'All student interactions are handled in accordance with university data protection policies and relevant legislation. Case details must never be stored on personal devices.' },
  { id: 'pi-2', title: 'Role-Based Access Control', body: 'Welfare Officers have limited access appropriate to their role. You cannot view clinical psychiatric notes or medical diagnoses. All file queries are fully logged and auditable.' },
  { id: 'pi-3', title: 'Data Retention', body: 'Non-clinical case logs are archived for 5 years post-graduation and automatically deleted. Active cases are reviewed quarterly.' },
  { id: 'pi-4', title: 'Reporting Obligations', body: 'Confidentiality is maintained unless there is a clear, imminent risk of harm to the student or others. Safeguarding overrides standard clinical privacy rules.' },
  { id: 'pi-5', title: 'Your Responsibilities', body: '• Maintain absolute confidentiality of student records\n• Report urgent safety concerns through proper channels\n• Follow authorized university data handling procedures\n• Complete annual mandatory privacy refresher training' }
];