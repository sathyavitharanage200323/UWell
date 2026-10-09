import React from 'react';

export interface User {
  id?: string | number;
  _id?: string;
  studentId?: string;
  staffId?: string;
  employeeId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  role?: string;
  faculty?: string;
  degreeProgram?: string;
  yearOfStudy?: string;
  phone?: string;
  counselorId?: string | number;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: any) => Promise<void>;
  isStudent: boolean;
  isCounselor: boolean;
  isWelfare: boolean;
  isManagement: boolean;
}

export declare const AuthProvider: React.FC<{ children: React.ReactNode }>;
export declare const useAuth: () => AuthContextType;
