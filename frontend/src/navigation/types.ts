import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type StudentTabParamList = {
  Home: undefined;
  Mood: undefined;
  Counselors: undefined;
  Sessions: undefined;
  Resources: undefined;
};

export type StudentStackParamList = {
  Home: undefined;
  MoodCheckIn: undefined;
  MoodResult: { mood: string; level: number };
  Resources: undefined;
  CounselorList: undefined;
  CounselorProfile: { counselorId: string };
  Availability: { counselorId: string; counselorName?: string; appointmentId?: string };
  AppointmentDetails: { appointmentId: number };
  ReviewBooking: {
    counselorId: string;
    counselorName?: string;
    date: string;
    time: string;
    sessionType?: string;
    notes?: string;
    appointmentId?: string;
  };
  BookingConfirmed: { appointmentId: number };
  MySessions: undefined;
};

export type WelfareTabParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  Students: undefined;
  Services: undefined;
  Profile: undefined;
};

export type WelfareStackParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  AppointmentDetails: { appointmentId: number };
  Students: undefined;
  StudentDetails: { studentId: number };
  Services: undefined;
  ServiceDetails: { serviceId: number };
  Profile: undefined;
};

export type CounselorTabParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  Students: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type CounselorStackParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  StudentList: undefined;
  StudentSession: { studentId: number };
  Messages: undefined;
  StudentChat: { studentId: number };
  Availability: undefined;
  VideoSession: { appointmentId: number };
  Profile: undefined;
  EditProfile: undefined;
};

export type ManagementTabParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  Usage: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type ManagementStackParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  UsageReport: undefined;
  UsageDetails: { reportId: number };
  Profile: undefined;
  PrivacySecurity: undefined;
  Settings: undefined;
};

export type StudentNavigationProp = BottomTabNavigationProp<StudentTabParamList>;
export type WelfareNavigationProp = BottomTabNavigationProp<WelfareTabParamList>;
export type CounselorNavigationProp = BottomTabNavigationProp<CounselorTabParamList>;
export type ManagementNavigationProp = BottomTabNavigationProp<ManagementTabParamList>;

export type StudentStackNavigationProp = NativeStackNavigationProp<StudentStackParamList>;
export type WelfareStackNavigationProp = NativeStackNavigationProp<WelfareStackParamList>;
export type CounselorStackNavigationProp = NativeStackNavigationProp<CounselorStackParamList>;
export type ManagementStackNavigationProp = NativeStackNavigationProp<ManagementStackParamList>;