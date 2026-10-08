# 🧠 UWell

### Mental Health Check-In & Counselor Booking Mobile Application

> **IT3060 – Human Computer Interaction**  
> BSc (Hons) in Information Technology  
> Year 3 – Semester 2 – 2026  
> Sri Lanka Institute of Information Technology (SLIIT)

---

## 📌 About the Project

**UWell** is a mobile application designed to provide university students
with easier access to mental health and counseling support.

The application allows students to complete mental health check-ins,
find counselors, view counselor availability, book counseling sessions,
manage appointments, and access wellness resources.

The application is being developed based on the requirements identified
in **Milestone 01** and the high-fidelity prototype developed in
**Milestone 02**.

Milestone 03 focuses on implementing the prototype as a **working,
runnable mobile application**, followed by functional and usability
testing.

---

# 🎯 Project Objectives

The main objectives of UWell are:

- Provide students with an accessible mental health check-in feature.
- Help students find available university counselors.
- Allow students to book counseling appointments.
- Allow users to manage their appointments.
- Provide wellness and mental health resources.
- Support counselors in managing their availability and appointments.
- Support welfare officers with counseling-related information.
- Provide management with counseling-service usage information.
- Provide role-based access to different application features.
- Maintain appropriate privacy and security for user information.

---

# 👥 User Roles

UWell contains four main user roles.

## 👨‍🎓 Student

Students can:

- Register and log in.
- Complete mood check-ins.
- View check-in results.
- Find counselors.
- View counselor profiles.
- View counselor availability.
- Book appointments.
- View appointment details.
- Access wellness resources.
- Manage their profile.

---

## 👨‍⚕️ Counselor

Counselors can:

- Log in to the application.
- View appointments.
- Manage availability.
- View relevant student session information.
- Manage their profile.

---

## 👩‍💼 Welfare Officer

Welfare officers can:

- View counseling services.
- View appointment information.
- Access relevant student support information.
- Manage counseling-related information.

---

## 🏢 University Management

Management users can:

- View counseling-service summaries.
- View appointment information.
- View usage information.
- Access relevant reports.
- Manage their profile and security settings.

---

### 🌿 Overall Git Structure

```text
main
│
└── develop
    │
    ├── feature/student-module
    ├── feature/counselor-module
    ├── feature/welfare-module
    └── feature/management-module
```

---

# 🛠️ Technical Implementation

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Native Stack & Bottom Tabs)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Date Handling**: date-fns
- **Icons**: react-native-vector-icons

## Project Structure

```text
UWell/
├── android/                    # Android native files
├── ios/                        # iOS native files
├── src/
│   ├── assets/                 # Images, icons, fonts
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── components/             # Reusable components
│   │   ├── common/             # Button, Input, Card, Header, Loading
│   │   └── navigation/         # BottomTab, NavigationHeader
│   ├── navigation/             # Navigation stacks
│   │   ├── AuthNavigator.jsx
│   │   ├── StudentNavigator.jsx
│   │   ├── CounselorNavigator.jsx
│   │   ├── WelfareNavigator.jsx
│   │   └── ManagementNavigator.jsx
│   ├── screens/                # Screen components
│   │   ├── auth/               # Welcome, Login, Register
│   │   ├── student/            # 11 student screens
│   │   ├── counselor/          # 7 counselor screens
│   │   ├── welfare/            # 8 welfare screens
│   │   └── management/         # 6 management screens
│   ├── services/               # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── studentService.js
│   │   ├── counselorService.js
│   │   ├── welfareService.js
│   │   └── managementService.js
│   ├── context/                # React Context
│   │   ├── AuthContext.jsx
│   │   └── AppContext.jsx
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.js
│   │   └── useApi.js
│   ├── utils/                  # Utility functions
│   │   ├── validation.js
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   └── helpers.js
│   ├── theme/                  # Theme configuration
│   │   ├── colors.js
│   │   ├── typography.js
│   │   └── spacing.js
│   └── data/                   # Mock data
│       └── mockData.js
├── tests/                      # Test files
│   ├── functional/
│   ├── usability/
│   └── components/
├── App.jsx                     # Main entry point
├── package.json                # Dependencies
├── app.json                    # Expo configuration
└── .gitignore                  # Git ignore rules
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UWell
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on desired platform**
   ```bash
   # For iOS
   npm run ios

   # For Android
   npm run android

   # For Web
   npm run web
   ```

## Configuration

### API Configuration

Update the API base URL in `src/utils/constants.js`:

```javascript
export const API_BASE_URL = 'https://your-api-url.com/v1';
```

### Environment Variables

Create a `.env` file in the root directory for environment-specific configurations.

## Testing

### Running Tests

```bash
npm test
```

### Test Structure

- **Functional Tests**: Located in `tests/functional/`
- **Usability Tests**: Located in `tests/usability/`
- **Component Tests**: Located in `tests/components/`

## Features by Role

### Student Features
- Mood check-in with visual feedback
- Counselor search and filtering
- Real-time availability viewing
- Appointment booking flow
- Session history tracking
- Resource library access

### Counselor Features
- Dashboard with appointment overview
- Availability management
- Student session tracking
- Message center
- Profile management

### Welfare Officer Features
- System-wide dashboard
- Appointment oversight
- Student information access
- Service management
- Reporting capabilities

### Management Features
- Usage analytics dashboard
- Appointment monitoring
- Report generation
- Privacy and security settings
- System configuration

## Development Guidelines

### Code Style
- Follow React Native best practices
- Use functional components with hooks
- Maintain consistent naming conventions
- Add comments for complex logic

### Component Structure
- Keep components focused and reusable
- Separate presentation from business logic
- Use theme constants for styling
- Implement proper error handling

### State Management
- Use Context API for global state
- Keep local state in components when appropriate
- Avoid prop drilling where possible

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is developed for academic purposes as part of the IT3060 course at SLIIT.

---

**Course**: IT3060 – Human Computer Interaction  
**Institution**: Sri Lanka Institute of Information Technology (SLIIT)  
**Year**: 2026  
**Semester**: 2
