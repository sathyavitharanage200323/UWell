import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState('Student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ------------------------------------
  // Roles
  // ------------------------------------

  const roles = [
    {
      label: 'Student',
      icon: '○',
    },
    {
      label: 'Counselor',
      icon: '♡',
    },
    {
      label: 'Student Affairs / Welfare Officer',
      icon: '✦',
    },
    {
      label: 'University Management',
      icon: '▦',
    },
  ];

  const selectedRoleData =
    roles.find((role) => role.label === selectedRole) ||
    roles[0];

  // ------------------------------------
  // Animations
  // ------------------------------------

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const slideAnim = useRef(
    new Animated.Value(18)
  ).current;

  const logoScale = useRef(
    new Animated.Value(0.92)
  ).current;

  const dropdownAnim = useRef(
    new Animated.Value(0)
  ).current;

  const buttonScale = useRef(
    new Animated.Value(1)
  ).current;

  // ------------------------------------
  // Entrance animation
  // ------------------------------------

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),

      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ------------------------------------
  // Dropdown animation
  // ------------------------------------

  const toggleDropdown = () => {
    const nextValue = dropdownOpen ? 0 : 1;

    setDropdownOpen(!dropdownOpen);

    Animated.spring(dropdownAnim, {
      toValue: nextValue,
      friction: 7,
      tension: 50,
      useNativeDriver: false,
    }).start();
  };

  const selectRole = (role: string) => {
    setSelectedRole(role);

    setDropdownOpen(false);

    Animated.spring(dropdownAnim, {
      toValue: 0,
      friction: 7,
      tension: 50,
      useNativeDriver: false,
    }).start();
  };

  // ------------------------------------
  // Login
  // ------------------------------------

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter your email and password.'
      );
      return;
    }

    // Student flow
    if (selectedRole === 'Student') {
      try {
        const normalizedEmail =
          email.trim().toLowerCase();

        const wellbeingKey =
          `wellbeingCompleted:${normalizedEmail}`;

        const wellbeingCompleted =
          await AsyncStorage.getItem(
            wellbeingKey
          );

        if (wellbeingCompleted === 'true') {
          // Returning student
          router.replace('/home');
        } else {
          // First-time student
          router.push({
            pathname: '/wellbeing-check',
            params: {
              email: normalizedEmail,
            },
          });
        }
      } catch (error) {
        console.log(
          'Error checking wellbeing completion:',
          error
        );

        router.push({
          pathname: '/wellbeing-check',
          params: {
            email: email.trim().toLowerCase(),
          },
        });
      }

      return;
    }

    // Other roles
    Alert.alert(
      'Coming Next',
      `${selectedRole} login will be connected to the backend next.`
    );
  };

  // ------------------------------------
  // Login button animation
  // ------------------------------------

  const handleLoginPress = () => {
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.97,
        friction: 5,
        useNativeDriver: true,
      }),

      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      handleLogin();
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* =================================
            Background Decorations
        ================================= */}

        <View style={styles.topDecoration} />

        <View style={styles.bottomDecoration} />

        {/* =================================
            Header / UWell Logo
        ================================= */}

        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
        >
          {/* Same UWell icon as Welcome */}

          <Animated.View
            style={[
              styles.logoCircle,
              {
                transform: [
                  {
                    scale: logoScale,
                  },
                ],
              },
            ]}
          >
            {/* Left leaf */}

            <View
              style={[
                styles.logoLeaf,
                styles.logoLeafLeft,
              ]}
            />

            {/* Right leaf */}

            <View
              style={[
                styles.logoLeaf,
                styles.logoLeafRight,
              ]}
            />

            {/* Heart */}

            <Text style={styles.logoHeart}>
              ♡
            </Text>

            {/* Stem */}

            <View style={styles.logoStem} />
          </Animated.View>

          <Text style={styles.appName}>
            UWell
          </Text>

          <Text style={styles.tagline}>
            Student Wellness
          </Text>
        </Animated.View>

        {/* =================================
            Welcome Text
        ================================= */}

        <Animated.View
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
        >
          <Text style={styles.title}>
            Welcome back
          </Text>

          <Text style={styles.subtitle}>
            Continue your wellbeing journey
            {'\n'}
            with UWell.
          </Text>
        </Animated.View>

        {/* =================================
            Login Form
        ================================= */}

        <Animated.View
          style={[
            styles.form,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
        >
          {/* ---------------------------------
              Role
          ---------------------------------- */}

          <Text style={styles.label}>
            Sign in as
          </Text>

          <Pressable
            style={[
              styles.dropdownButton,
              dropdownOpen &&
                styles.dropdownButtonActive,
            ]}
            onPress={toggleDropdown}
          >
            <View style={styles.roleLeft}>
              <View style={styles.roleIconCircle}>
                <Text style={styles.roleIcon}>
                  {selectedRoleData.icon}
                </Text>
              </View>

              <Text style={styles.selectedRoleText}>
                {selectedRole}
              </Text>
            </View>

            <Text
              style={[
                styles.dropdownArrow,
                dropdownOpen &&
                  styles.dropdownArrowOpen,
              ]}
            >
              ⌄
            </Text>
          </Pressable>

          {/* Dropdown Options */}

          <Animated.View
            style={[
              styles.dropdownMenu,
              {
                maxHeight: dropdownAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 250],
                }),

                opacity: dropdownAnim,

                marginTop: dropdownAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 7],
                }),
              },
            ]}
          >
            {roles.map((role) => {
              const isSelected =
                selectedRole === role.label;

              return (
                <Pressable
                  key={role.label}
                  style={[
                    styles.roleOption,
                    isSelected &&
                      styles.roleOptionSelected,
                  ]}
                  onPress={() =>
                    selectRole(role.label)
                  }
                >
                  <View
                    style={[
                      styles.optionIconCircle,
                      isSelected &&
                        styles.optionIconCircleSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionIcon,
                        isSelected &&
                          styles.optionIconSelected,
                      ]}
                    >
                      {role.icon}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.roleOptionText,
                      isSelected &&
                        styles.roleOptionTextSelected,
                    ]}
                  >
                    {role.label}
                  </Text>

                  {isSelected && (
                    <Text style={styles.checkMark}>
                      ✓
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </Animated.View>

          {/* ---------------------------------
              Email
          ---------------------------------- */}

          <Text style={styles.label}>
            University Email
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconBox}>
              <Text style={styles.inputIcon}>
                @
              </Text>
            </View>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="student@university.edu"
              placeholderTextColor="#B19E96"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* ---------------------------------
              Password
          ---------------------------------- */}

          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconBox}>
              <Text style={styles.inputIcon}>
                •
              </Text>
            </View>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#B19E96"
              style={styles.input}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Pressable
              style={styles.eyeButton}
              onPress={() =>
                setShowPassword(!showPassword)
              }
            >
              <Text style={styles.eyeText}>
                {showPassword ? '○' : '◉'}
              </Text>
            </Pressable>
          </View>

          {/* ---------------------------------
              Forgot Password
          ---------------------------------- */}

          <Pressable
            style={styles.forgotButton}
            onPress={() => {}}
          >
            <Text style={styles.forgotText}>
              Forgot password?
            </Text>
          </Pressable>

          {/* ---------------------------------
              Login Button
          ---------------------------------- */}

          <Animated.View
            style={{
              transform: [
                {
                  scale: buttonScale,
                },
              ],
            }}
          >
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed &&
                  styles.loginButtonPressed,
              ]}
              onPress={handleLoginPress}
            >
              <Text style={styles.loginText}>
                Log In
              </Text>

              <View style={styles.arrowCircle}>
                <Text style={styles.arrow}>
                  ›
                </Text>
              </View>
            </Pressable>
          </Animated.View>

          {/* ---------------------------------
              Register
          ---------------------------------- */}

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={() =>
                router.push('/register')
              }
            >
              <Text style={styles.registerLink}>
                {' '}Register
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* =================================
            Privacy
        ================================= */}

        <Animated.View
          style={[
            styles.privacyContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.lockIcon}>
            🔒
          </Text>

          <Text style={styles.privacyText}>
            Your privacy and confidentiality matter to us.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  // ====================================
  // Screen
  // ====================================

  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  container: {
    flexGrow: 1,

    backgroundColor: '#FFF9F3',

    paddingHorizontal: 20,

    paddingTop: 14,

    paddingBottom: 28,

    position: 'relative',

    overflow: 'hidden',
  },

  // ====================================
  // Background Decorations
  // ====================================

  topDecoration: {
    position: 'absolute',

    width: 150,
    height: 150,

    borderRadius: 75,

    backgroundColor: '#FBE9E1',

    top: -85,
    right: -70,

    opacity: 0.6,
  },

  bottomDecoration: {
    position: 'absolute',

    width: 145,
    height: 145,

    borderRadius: 73,

    backgroundColor: '#EDF3EC',

    bottom: -82,
    left: -72,

    opacity: 0.7,
  },

  // ====================================
  // Header
  // ====================================

  header: {
    alignItems: 'center',

    marginTop: 2,
  },

  logoCircle: {
    width: 54,
    height: 54,

    borderRadius: 27,

    backgroundColor: '#EF806B',

    alignItems: 'center',
    justifyContent: 'center',

    position: 'relative',

    shadowColor: '#EF806B',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.14,

    shadowRadius: 7,

    elevation: 3,
  },

  logoLeaf: {
    position: 'absolute',

    width: 10,
    height: 19,

    backgroundColor: '#FFFFFF',

    borderTopLeftRadius: 10,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 10,

    opacity: 0.95,
  },

  logoLeafLeft: {
    transform: [
      {
        rotate: '-38deg',
      },
    ],

    left: 14,
    top: 14,
  },

  logoLeafRight: {
    transform: [
      {
        rotate: '38deg',
      },
    ],

    right: 14,
    top: 14,
  },

  logoHeart: {
    position: 'absolute',

    color: '#EF806B',

    fontSize: 15,

    fontWeight: '700',

    zIndex: 5,

    top: 17,
  },

  logoStem: {
    position: 'absolute',

    width: 2,
    height: 12,

    backgroundColor: '#FFFFFF',

    bottom: 11,

    borderRadius: 2,
  },

  appName: {
    fontSize: 27,

    fontWeight: '800',

    color: '#4A3833',

    marginTop: 6,
  },

  tagline: {
    fontSize: 10.5,

    color: '#A18479',

    letterSpacing: 1,

    marginTop: 1,
  },

  // ====================================
  // Welcome Text
  // ====================================

  welcomeSection: {
    alignItems: 'center',

    marginTop: 22,

    marginBottom: 18,
  },

  title: {
    fontSize: 27,

    lineHeight: 33,

    fontWeight: '800',

    color: '#4A3833',

    textAlign: 'center',
  },

  subtitle: {
    fontSize: 12.5,

    lineHeight: 19,

    color: '#806F68',

    textAlign: 'center',

    marginTop: 6,
  },

  // ====================================
  // Form
  // ====================================

  form: {
    width: '100%',
  },

  label: {
    color: '#66544D',

    fontSize: 11.5,

    fontWeight: '700',

    marginBottom: 7,

    marginTop: 5,
  },

  // ====================================
  // Role Dropdown
  // ====================================

  dropdownButton: {
    height: 52,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,

    borderColor: '#E8DCD6',

    borderRadius: 15,

    paddingHorizontal: 12,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  dropdownButtonActive: {
    borderColor: '#EF806B',

    backgroundColor: '#FFFCFA',
  },

  roleLeft: {
    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,
  },

  roleIconCircle: {
    width: 31,
    height: 31,

    borderRadius: 16,

    backgroundColor: '#FFF0EA',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 9,
  },

  roleIcon: {
    color: '#EF806B',

    fontSize: 15,

    fontWeight: '700',
  },

  selectedRoleText: {
    color: '#5D4942',

    fontSize: 12.5,

    fontWeight: '600',
  },

  dropdownArrow: {
    color: '#9A8780',

    fontSize: 20,

    lineHeight: 21,

    marginTop: -4,

    marginLeft: 8,
  },

  dropdownArrowOpen: {
    color: '#EF806B',

    transform: [
      {
        rotate: '180deg',
      },
    ],
  },

  dropdownMenu: {
    overflow: 'hidden',

    backgroundColor: '#FFFFFF',

    borderRadius: 15,

    borderWidth: 1,

    borderColor: '#F0E3DD',

    paddingHorizontal: 7,

    shadowColor: '#BFA89C',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,

    shadowRadius: 8,

    elevation: 3,
  },

  roleOption: {
    minHeight: 48,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 7,

    borderRadius: 11,

    marginVertical: 3,
  },

  roleOptionSelected: {
    backgroundColor: '#FFF1EC',
  },

  optionIconCircle: {
    width: 29,
    height: 29,

    borderRadius: 15,

    backgroundColor: '#F8F1ED',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 9,
  },

  optionIconCircleSelected: {
    backgroundColor: '#FAD9D0',
  },

  optionIcon: {
    color: '#A18C83',

    fontSize: 14,
  },

  optionIconSelected: {
    color: '#EF806B',

    fontWeight: '700',
  },

  roleOptionText: {
    flex: 1,

    color: '#6F5D56',

    fontSize: 11.5,
  },

  roleOptionTextSelected: {
    color: '#D66F5D',

    fontWeight: '700',
  },

  checkMark: {
    color: '#EF806B',

    fontSize: 15,

    fontWeight: '700',

    marginRight: 4,
  },

  // ====================================
  // Input
  // ====================================

  inputContainer: {
    height: 52,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,

    borderColor: '#E8DCD6',

    borderRadius: 15,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 8,

    marginBottom: 13,
  },

  inputIconBox: {
    width: 32,
    height: 32,

    borderRadius: 11,

    backgroundColor: '#FFF0EA',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 8,
  },

  inputIcon: {
    color: '#EF806B',

    fontSize: 15,

    fontWeight: '700',
  },

  input: {
    flex: 1,

    height: 50,

    color: '#4A3833',

    fontSize: 12.5,

    paddingHorizontal: 2,
  },

  eyeButton: {
    width: 34,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',
  },

  eyeText: {
    color: '#A18D85',

    fontSize: 14,
  },

  // ====================================
  // Forgot Password
  // ====================================

  forgotButton: {
    alignSelf: 'flex-end',

    marginTop: -3,

    marginBottom: 17,

    paddingVertical: 3,
  },

  forgotText: {
    color: '#D66F5D',

    fontSize: 10.5,

    fontWeight: '600',
  },

  // ====================================
  // Login Button
  // ====================================

  loginButton: {
    height: 52,

    backgroundColor: '#EF806B',

    borderRadius: 17,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    shadowColor: '#EF806B',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.15,

    shadowRadius: 7,

    elevation: 3,
  },

  loginButtonPressed: {
    opacity: 0.88,
  },

  loginText: {
    color: '#FFFFFF',

    fontSize: 15,

    fontWeight: '700',
  },

  arrowCircle: {
    width: 25,
    height: 25,

    borderRadius: 13,

    backgroundColor: 'rgba(255,255,255,0.20)',

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 9,
  },

  arrow: {
    color: '#FFFFFF',

    fontSize: 21,

    lineHeight: 22,

    fontWeight: '400',

    textAlign: 'center',

    marginTop: -1,
  },

  // ====================================
  // Register
  // ====================================

  registerContainer: {
    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    marginTop: 16,
  },

  registerText: {
    color: '#8F7C74',

    fontSize: 10.5,
  },

  registerLink: {
    color: '#D66F5D',

    fontSize: 10.5,

    fontWeight: '700',
  },

  // ====================================
  // Privacy
  // ====================================

  privacyContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 17,

    paddingHorizontal: 8,
  },

  lockIcon: {
    fontSize: 9.5,

    marginRight: 5,
  },

  privacyText: {
    fontSize: 9.5,

    color: '#9A8780',

    textAlign: 'center',
  },
});