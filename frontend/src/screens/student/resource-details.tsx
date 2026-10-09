import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAudioPlayer } from 'expo-audio';

const CORAL = '#EF806B';
const CREAM = '#FFF9F3';
const DARK = '#4A3833';
const MUTED = '#8A7770';
const SOFT_TEXT = '#806F68';
const WHITE = '#FFFFFF';
const BORDER = '#F0E2DC';
const SAGE = '#DDEBD2';
const SAGE_DARK = '#7FA66D';

/* =========================================================
   RESOURCE CONTENT
========================================================= */

const resourceContent: Record<
  string,
  {
    title: string;
    category: string;
    description: string;
    tips: string[];
  }
> = {
  '1': {
    title: 'Stress Management',
    category: 'Stress & Wellbeing',
    description:
      'Stress is a common part of university life. Learning simple ways to manage stress can help you feel more balanced and focused.',
    tips: [
      'Take short breaks between study sessions.',
      'Practice slow and deep breathing.',
      'Organize your tasks and avoid leaving everything until the last minute.',
      'Get enough sleep and stay hydrated.',
      'Talk to someone you trust when you feel overwhelmed.',
    ],
  },

  '2': {
    title: 'Better Sleep',
    category: 'Sleep & Recovery',
    description:
      'Good sleep supports your mental wellbeing, concentration, memory, and overall academic performance.',
    tips: [
      'Try to keep a regular sleep schedule.',
      'Avoid using your phone immediately before sleeping.',
      'Create a calm and comfortable sleeping environment.',
      'Avoid excessive caffeine late in the day.',
      'Give yourself enough time to rest before an important day.',
    ],
  },

  '3': {
    title: 'Deep Breathing',
    category: 'Relaxation Technique',
    description:
      'Deep breathing is a simple relaxation technique that can help you slow down and manage feelings of stress or anxiety.',
    tips: [
      'Sit comfortably and relax your shoulders.',
      'Slowly breathe in through your nose.',
      'Hold your breath for a few seconds.',
      'Slowly breathe out through your mouth.',
      'Repeat the process several times.',
    ],
  },

  'break': {
    title: 'Take a Short Break',
    category: 'Relaxation Technique',
    description:
      'Taking short, intentional breaks from study or screen time helps your brain recover and improves your focus and mood.',
    tips: [
      'Step away from your desk for 5–10 minutes every hour.',
      'Go outside for some fresh air if possible.',
      'Do a light stretch or walk around.',
      'Avoid scrolling social media during your break.',
      'Use your break to hydrate or have a healthy snack.',
    ],
  },

  'hydrated': {
    title: 'Stay Hydrated',
    category: 'Self Care',
    description:
      'Drinking enough water throughout the day supports your concentration, energy levels, and overall mental wellbeing.',
    tips: [
      'Aim to drink at least 6–8 glasses of water a day.',
      'Keep a water bottle at your desk as a reminder.',
      'Drink a glass of water when you wake up.',
      'Reduce sugary drinks and excessive caffeine.',
      'Eat fruits and vegetables that have high water content.',
    ],
  },

  'support': {
    title: 'Talk to Someone',
    category: 'Support & Connection',
    description:
      'Talking about how you feel can help reduce stress and anxiety. You do not have to face difficulties alone.',
    tips: [
      'Reach out to a trusted friend, family member, or classmate.',
      'Consider speaking with a counselor through UWell.',
      'Share how you are feeling instead of keeping it inside.',
      'Remember that asking for help is a sign of strength.',
      'Join a student support group or wellness activity on campus.',
    ],
  },

  '4': {
    title: 'Mental Health Tips',
    category: 'Mental Wellbeing',
    description:
      'Small daily habits can support your mental wellbeing and help you manage the challenges of university life.',
    tips: [
      'Make time for activities you enjoy.',
      'Stay connected with friends and supportive people.',
      'Take regular breaks from academic work.',
      'Be kind and patient with yourself.',
      'Ask for professional support when you need it.',
    ],
  },

  '5': {
    title: 'Managing Academic Pressure',
    category: 'Academic Wellbeing',
    description:
      'Assignments, exams, deadlines, and academic expectations can sometimes feel overwhelming. Managing your workload can reduce unnecessary pressure.',
    tips: [
      'Break large assignments into smaller tasks.',
      'Create a realistic study schedule.',
      'Prioritize important deadlines.',
      'Take short breaks while studying.',
      'Talk to a lecturer, friend, or counselor if pressure becomes difficult to manage.',
    ],
  },

  '6': {
    title: 'Talk to Someone',
    category: 'Support & Connection',
    description:
      'You do not have to deal with everything alone. Talking with someone you trust can provide emotional support and a different perspective.',
    tips: [
      'Choose someone you feel comfortable talking to.',
      'Explain how you have been feeling honestly.',
      'Let the person know if you simply need someone to listen.',
      'Stay connected with supportive friends or family members.',
      'Consider speaking with a counselor if you need professional support.',
    ],
  },
};

/* =========================================================
   UWELL LOGO
========================================================= */

function UWellLogo() {
  return (
    <View style={styles.logoCircle}>
      <View style={[styles.logoLeaf, styles.logoLeafLeft]} />
      <View style={[styles.logoLeaf, styles.logoLeafRight]} />

      <Text style={styles.logoHeart}>♡</Text>

      <View style={styles.logoStem} />
    </View>
  );
}

/* =========================================================
   BACK ICON
========================================================= */

function BackIcon() {
  return (
    <Text style={styles.backArrow}>
      ‹
    </Text>
  );
}

/* =========================================================
   RESOURCE ICON
========================================================= */

function ResourceIcon({
  title,
}: {
  title: string;
}) {
  if (title === 'Deep Breathing') {
    return (
      <View style={styles.resourceIllustration}>
        <View style={styles.breathOuter} />
        <View style={styles.breathInner} />
      </View>
    );
  }

  if (title === 'Better Sleep') {
    return (
      <View style={styles.resourceIllustration}>
        <View style={styles.resourceMoon} />
        <View style={styles.resourceMoonCut} />
        <Text style={styles.resourceZ}>
          z
        </Text>
      </View>
    );
  }

  if (title === 'Talk to Someone') {
    return (
      <View style={styles.resourceIllustration}>
        <View style={styles.resourceChat} />
        <View style={styles.resourceChatDotOne} />
        <View style={styles.resourceChatDotTwo} />
        <View style={styles.resourceChatDotThree} />
      </View>
    );
  }

  if (title === 'Managing Academic Pressure') {
    return (
      <View style={styles.resourceIllustration}>
        <View style={styles.bookPageLeft} />
        <View style={styles.bookPageRight} />
        <View style={styles.bookCenter} />
      </View>
    );
  }

  return (
    <View style={styles.resourceIllustration}>
      <View style={styles.resourceLeafLeft} />
      <View style={styles.resourceLeafRight} />
      <View style={styles.resourceLeafStem} />
    </View>
  );
}

/* =========================================================
   ACTIVITY SELECTOR
========================================================= */

function getActivityType(title: string) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('breathing')) {
    return 'breathing';
  }

  if (lowerTitle.includes('short break')) {
    return 'break';
  }

  if (lowerTitle.includes('hydrated')) {
    return 'hydration';
  }

  if (lowerTitle.includes('sleep')) {
    return 'sleep';
  }

  if (lowerTitle.includes('move your body')) {
    return 'movement';
  }

  if (lowerTitle.includes('talk to someone')) {
    return 'support';
  }

  if (lowerTitle.includes('stress')) {
    return 'breathing';
  }

  return 'wellness';
}

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function ResourceDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as {
    id?: string; title?: string; category?: string;
  } || {};
  const { id, title, category } = params;

  const resource = resourceContent[id || '1'];

  

  const displayTitle =
    title || resource?.title || 'Wellness Resource';

  const displayCategory =
    category ||
    resource?.category ||
    'Mental Wellbeing';

  const displayDescription =
    resource?.description ||
    'Explore this resource to support your mental wellbeing.';

  const displayTips =
    resource?.tips || [];

  const activityType =
    getActivityType(displayTitle);

  const [activityStarted, setActivityStarted] =
    useState(false);

  const [activityCompleted, setActivityCompleted] =
    useState(false);

  const [breathingPhase, setBreathingPhase] =
    useState<'inhale' | 'exhale'>('inhale');

  const [breathingSeconds, setBreathingSeconds] =
    useState(4);

  const [breathingCycle, setBreathingCycle] =
    useState(1);

  const [isPaused, setIsPaused] =
    useState(false);

  const [hydrationDone, setHydrationDone] =
    useState(false);

  const [movementStep, setMovementStep] =
    useState(0);

  const [supportChoice, setSupportChoice] =
    useState('');

  const breathingScale =
    useRef(new Animated.Value(0.72)).current;

  const fadeAnim =
    useRef(new Animated.Value(0)).current;

  const slideAnim =
    useRef(new Animated.Value(15)).current;

 // Calm ambient breathing music — always loaded, only plays during breathing activity
 const breathingPlayer = useAudioPlayer(
   { uri: 'https://cdn.pixabay.com/audio/2022/03/15/audio_d86fd5aad4.mp3' }
 );

 // Set looping so music plays continuously during breathing
 useEffect(() => {
   if (breathingPlayer) {
     breathingPlayer.loop = true;
   }
 }, [breathingPlayer]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 550,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* =======================================================
     BREATHING TIMER
  ======================================================= */

  useEffect(() => {
    if (
      activityType !== 'breathing' ||
      !activityStarted ||
      activityCompleted ||
      isPaused
    ) {
      return;
    }

    const timer = setInterval(() => {
      setBreathingSeconds((current) => {
        if (current > 1) {
          return current - 1;
        }

        if (breathingPhase === 'inhale') {
          setBreathingPhase('exhale');

          Animated.timing(breathingScale, {
            toValue: 0.72,
            duration: 6000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }).start();

          return 6;
        }

        if (breathingCycle >= 3) {
          breathingPlayer.pause();
          breathingPlayer.seekTo(0);
          setActivityCompleted(true);
          setActivityStarted(false);
          return 0;
        }

        setBreathingCycle((cycle) => cycle + 1);
        setBreathingPhase('inhale');

        Animated.timing(breathingScale, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();

        return 4;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    activityType,
    activityStarted,
    activityCompleted,
    isPaused,
    breathingPhase,
    breathingCycle,
  ]);

  /* =======================================================
     START ACTIVITY
  ======================================================= */

  const startActivity = () => {
    setActivityCompleted(false);
    setActivityStarted(true);
    setIsPaused(false);

    if (activityType === 'breathing') {
      setBreathingPhase('inhale');
      setBreathingSeconds(4);
      setBreathingCycle(1);

      breathingScale.setValue(0.72);

      Animated.timing(breathingScale, {
        toValue: 1,
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();

      breathingPlayer.seekTo(0);
      breathingPlayer.play();
    }

    if (activityType === 'movement') {
      setMovementStep(0);
    }

    if (activityType === 'hydration') {
      setHydrationDone(false);
    }

    if (activityType === 'support') {
      setSupportChoice('');
    }
  };

  const resetActivity = () => {
    setActivityStarted(false);
    setActivityCompleted(false);
    setIsPaused(false);
    setBreathingPhase('inhale');
    setBreathingSeconds(4);
    setBreathingCycle(1);
    setMovementStep(0);
    setHydrationDone(false);
    setSupportChoice('');
    breathingScale.setValue(0.72);
    breathingPlayer.pause();
    breathingPlayer.seekTo(0);
  };

  /* =======================================================
     ACTIVITY CONTENT
  ======================================================= */

  const renderActivity = () => {
    if (activityType === 'breathing') {
      return (
        <BreathingActivity
          started={activityStarted}
          completed={activityCompleted}
          phase={breathingPhase}
          seconds={breathingSeconds}
          cycle={breathingCycle}
          scale={breathingScale}
          paused={isPaused}
          onStart={startActivity}
          onPause={() => {
            setIsPaused((value) => {
              const nextValue = !value;
              if (nextValue) {
                breathingPlayer.pause();
              } else {
                breathingPlayer.play();
              }
              return nextValue;
            });
          }}
          onReset={resetActivity}
        />
      );
    }

    if (activityType === 'break') {
      return (
        <BreakActivity
          started={activityStarted}
          completed={activityCompleted}
          onStart={startActivity}
          onComplete={() => {
            setActivityCompleted(true);
            setActivityStarted(false);
          }}
          onReset={resetActivity}
        />
      );
    }

    if (activityType === 'hydration') {
      return (
        <HydrationActivity
          done={hydrationDone}
          onStart={startActivity}
          onComplete={() => {
            setHydrationDone(true);
            setActivityCompleted(true);
          }}
          onReset={resetActivity}
        />
      );
    }

    if (activityType === 'sleep') {
      return (
        <SleepActivity
          started={activityStarted}
          completed={activityCompleted}
          onStart={startActivity}
          onComplete={() => {
            setActivityCompleted(true);
            setActivityStarted(false);
          }}
          onReset={resetActivity}
        />
      );
    }

    if (activityType === 'movement') {
      return (
        <MovementActivity
          started={activityStarted}
          completed={activityCompleted}
          step={movementStep}
          onStart={startActivity}
          onNext={() => {
            if (movementStep >= 2) {
              setActivityCompleted(true);
              setActivityStarted(false);
            } else {
              setMovementStep((value) => value + 1);
            }
          }}
          onReset={resetActivity}
        />
      );
    }

    if (activityType === 'support') {
      return (
        <SupportActivity
          choice={supportChoice}
          completed={activityCompleted}
          onStart={startActivity}
          onChoose={(choice) => {
            setSupportChoice(choice);
            setActivityCompleted(true);
          }}
          onReset={resetActivity}
        />
      );
    }

    return (
      <SimpleActivity
        started={activityStarted}
        completed={activityCompleted}
        onStart={startActivity}
        onComplete={() => {
          setActivityCompleted(true);
          setActivityStarted(false);
        }}
        onReset={resetActivity}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>

          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon />
          </Pressable>

          <UWellLogo />

          <View style={styles.headerSpace} />

        </View>

        <Animated.View
          style={[
            styles.content,
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

          {/* =================================================
              HERO
          ================================================= */}

          <View style={styles.heroCard}>

            <View style={styles.heroIconCircle}>
              <ResourceIcon title={displayTitle} />
            </View>

            <Text style={styles.title}>
              {displayTitle}
            </Text>

            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {displayCategory}
              </Text>
            </View>

          </View>

          {/* =================================================
              ABOUT
          ================================================= */}

          <View style={styles.section}>

            <Text style={styles.sectionTitle}>
              About This Resource
            </Text>

            <Text style={styles.description}>
              {displayDescription}
            </Text>

          </View>

          {/* =================================================
              HELPFUL TIPS
          ================================================= */}

          <View style={styles.section}>

            <View style={styles.sectionHeadingRow}>

              <Text style={styles.sectionTitle}>
                Helpful Tips
              </Text>

              <View style={styles.tipCount}>
                <Text style={styles.tipCountText}>
                  {displayTips.length}
                </Text>
              </View>

            </View>

            {displayTips.map((tip, index) => (
              <View
                key={`${tip}-${index}`}
                style={styles.tipCard}
              >

                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>
                    {index + 1}
                  </Text>
                </View>

                <Text style={styles.tipText}>
                  {tip}
                </Text>

              </View>
            ))}

          </View>

          {/* =================================================
              INTERACTIVE ACTIVITY
          ================================================= */}

          {renderActivity()}

          {/* =================================================
              COUNSELOR SUPPORT
          ================================================= */}

          <View style={styles.supportCard}>

            <View style={styles.supportIcon}>
              <Text style={styles.supportHeart}>
                ♡
              </Text>
            </View>

            <View style={styles.supportContent}>

              <Text style={styles.supportTitle}>
                Need More Support?
              </Text>

              <Text style={styles.supportText}>
                If you feel that you need additional support,
                you can find a counselor through UWell.
              </Text>

              <Pressable
                style={styles.counselorButton}
                onPress={() =>
                  navigation.getParent()?.navigate('Counselors')
                }
              >

                <Text style={styles.counselorButtonText}>
                  Find a Counselor
                </Text>

                <Text style={styles.counselorArrow}>
                  ›
                </Text>

              </Pressable>

            </View>

          </View>

          {/* =================================================
              HOME
          ================================================= */}

          <Pressable
            style={styles.homeButton}
            onPress={() => navigation.getParent()?.navigate('Home')}
          >

            <Text style={styles.homeButtonText}>
              Back to Home
            </Text>

            <Text style={styles.homeArrow}>
              ›
            </Text>

          </Pressable>

          <Text style={styles.footerText}>
            Be kind to yourself. Small steps matter.
          </Text>

        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   4:6 BREATHING ACTIVITY
========================================================= */

function BreathingActivity({
  started,
  completed,
  phase,
  seconds,
  cycle,
  scale,
  paused,
  onStart,
  onPause,
  onReset,
}: {
  started: boolean;
  completed: boolean;
  phase: 'inhale' | 'exhale';
  seconds: number;
  cycle: number;
  scale: Animated.Value;
  paused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}) {
  return (
    <View style={styles.activityCard}>

      <Text style={styles.activityLabel}>
        GUIDED ACTIVITY
      </Text>

      <Text style={styles.activityTitle}>
        4:6 Breathing
      </Text>

      <Text style={styles.activitySubtitle}>
        Calm your breathing with a longer exhale.
      </Text>

      {completed ? (
        <View style={styles.completedArea}>

          <View style={styles.completedCircle}>
            <Text style={styles.completedCheck}>
              ✓
            </Text>
          </View>

          <Text style={styles.completedTitle}>
            Well done
          </Text>

          <Text style={styles.completedText}>
            You completed 3 breathing cycles.
            Take a moment to notice how you feel.
          </Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={onReset}
          >
            <Text style={styles.secondaryButtonText}>
              Practice Again
            </Text>
          </Pressable>

        </View>
      ) : !started ? (
        <View style={styles.activityStartArea}>

          <View style={styles.breathPreview}>
            <View style={styles.previewInner} />
          </View>

          <Text style={styles.activityInstruction}>
            Follow the circle and breathe slowly.
          </Text>

          <Pressable
            style={styles.startButton}
            onPress={onStart}
          >
            <Text style={styles.startButtonText}>
              Start Breathing
            </Text>

            <Text style={styles.startArrow}>
              ›
            </Text>
          </Pressable>

        </View>
      ) : (
        <View style={styles.breathingActiveArea}>

          <Text style={styles.cycleText}>
            Cycle {cycle} of 3
          </Text>

          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [
                  {
                    scale,
                  },
                ],
              },
            ]}
          >

            <View style={styles.breathingCircleInner} />

            <Text style={styles.phaseText}>
              {phase === 'inhale'
                ? 'INHALE'
                : 'EXHALE'}
            </Text>

            <Text style={styles.secondsText}>
              {seconds}s
            </Text>

          </Animated.View>

          <Text style={styles.breathHint}>
            {phase === 'inhale'
              ? 'Slowly breathe in...'
              : 'Slowly breathe out...'}
          </Text>

          <View style={styles.activityControls}>

            <Pressable
              style={styles.pauseButton}
              onPress={onPause}
            >
              <Text style={styles.pauseButtonText}>
                {paused ? 'Resume' : 'Pause'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.resetButton}
              onPress={onReset}
            >
              <Text style={styles.resetButtonText}>
                Stop
              </Text>
            </Pressable>

          </View>

        </View>
      )}

    </View>
  );
}

/* =========================================================
   SHORT BREAK ACTIVITY
========================================================= */

function BreakActivity({
  started,
  completed,
  onStart,
  onComplete,
  onReset,
}: {
  started: boolean;
  completed: boolean;
  onStart: () => void;
  onComplete: () => void;
  onReset: () => void;
}) {
  const [seconds, setSeconds] = useState(120);

  useEffect(() => {
    if (!started || completed) return;

    const timer = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          onComplete();
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, completed]);

  const start = () => {
    setSeconds(120);
    onStart();
  };

  const reset = () => {
    setSeconds(120);
    onReset();
  };

  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return (
    <View style={styles.activityCard}>

      <Text style={styles.activityLabel}>
        QUICK RESET
      </Text>

      <Text style={styles.activityTitle}>
        2-Minute Break
      </Text>

      <Text style={styles.activitySubtitle}>
        Step away from your screen and give your mind a reset.
      </Text>

      {completed ? (
        <View style={styles.completedArea}>

          <View style={styles.completedCircle}>
            <Text style={styles.completedCheck}>
              ✓
            </Text>
          </View>

          <Text style={styles.completedTitle}>
            Break complete
          </Text>

          <Text style={styles.completedText}>
            Take a gentle breath and return when you feel ready.
          </Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={reset}
          >
            <Text style={styles.secondaryButtonText}>
              Start Again
            </Text>
          </Pressable>

        </View>
      ) : !started ? (
        <View style={styles.activityStartArea}>

          <View style={styles.timerCircle}>
            <Text style={styles.timerNumber}>
              2:00
            </Text>

            <Text style={styles.timerLabel}>
              minutes
            </Text>
          </View>

          <Text style={styles.activityInstruction}>
            Relax your shoulders, look away from the screen,
            and take a comfortable breath.
          </Text>

          <Pressable
            style={styles.startButton}
            onPress={start}
          >
            <Text style={styles.startButtonText}>
              Start 2-Minute Break
            </Text>

            <Text style={styles.startArrow}>
              ›
            </Text>
          </Pressable>

        </View>
      ) : (
        <View style={styles.breathingActiveArea}>

          <View style={styles.timerCircleActive}>

            <Text style={styles.timerNumberActive}>
              {minutes}:{remaining
                .toString()
                .padStart(2, '0')}
            </Text>

            <Text style={styles.timerLabelActive}>
              take a moment
            </Text>

          </View>

          <Text style={styles.breathHint}>
            Relax • Stretch • Look away
          </Text>

          <Pressable
            style={styles.resetButtonWide}
            onPress={reset}
          >
            <Text style={styles.resetButtonText}>
              Stop
            </Text>
          </Pressable>

        </View>
      )}

    </View>
  );
}

/* =========================================================
   HYDRATION ACTIVITY
========================================================= */

function HydrationActivity({
  done,
  onStart,
  onComplete,
  onReset,
}: {
  done: boolean;
  onStart: () => void;
  onComplete: () => void;
  onReset: () => void;
}) {
  return (
    <View style={styles.activityCard}>

      <Text style={styles.activityLabel}>
        SELF CARE CHECK
      </Text>

      <Text style={styles.activityTitle}>
        Hydration Check
      </Text>

      <Text style={styles.activitySubtitle}>
        A simple reminder to give your body some water.
      </Text>

      {done ? (
        <View style={styles.completedArea}>

          <View style={styles.waterCompletedCircle}>
            <Text style={styles.waterCompletedIcon}>
              ✓
            </Text>
          </View>

          <Text style={styles.completedTitle}>
            Nice choice
          </Text>

          <Text style={styles.completedText}>
            Keep a bottle nearby and remember to drink
            regularly throughout the day.
          </Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={onReset}
          >
            <Text style={styles.secondaryButtonText}>
              Check Again
            </Text>
          </Pressable>

        </View>
      ) : (
        <View style={styles.hydrationArea}>

          <View style={styles.waterGlass}>

            <View style={styles.waterLevel} />

            <View style={styles.waterShineOne} />
            <View style={styles.waterShineTwo} />

          </View>

          <Text style={styles.hydrationQuestion}>
            Have you had some water recently?
          </Text>

          <View style={styles.choiceRow}>

            <Pressable
              style={styles.choiceButton}
              onPress={() => {
                onStart();
                onComplete();
              }}
            >
              <Text style={styles.choiceText}>
                Yes, I have
              </Text>
            </Pressable>

            <Pressable
              style={styles.choiceButtonSecondary}
              onPress={() => {
                onStart();
                onComplete();
              }}
            >
              <Text style={styles.choiceTextSecondary}>
                Not yet
              </Text>
            </Pressable>

          </View>

        </View>
      )}

    </View>
  );
}

/* =========================================================
   SLEEP ACTIVITY
========================================================= */

function SleepActivity({
  started,
  completed,
  onStart,
  onComplete,
  onReset,
}: {
  started: boolean;
  completed: boolean;
  onStart: () => void;
  onComplete: () => void;
  onReset: () => void;
}) {
  const steps = [
    'Put your phone away for a moment.',
    'Take three slow breaths.',
    'Relax your shoulders and jaw.',
  ];

  const [step, setStep] = useState(0);

  const start = () => {
    setStep(0);
    onStart();
  };

  const next = () => {
    if (step >= steps.length - 1) {
      onComplete();
      return;
    }

    setStep((value) => value + 1);
  };

  const reset = () => {
    setStep(0);
    onReset();
  };

  return (
    <View style={styles.activityCard}>

      <Text style={styles.activityLabel}>
        WIND-DOWN
      </Text>

      <Text style={styles.activityTitle}>
        Sleep Wind-Down
      </Text>

      <Text style={styles.activitySubtitle}>
        A short routine to help you prepare for rest.
      </Text>

      {completed ? (
        <View style={styles.completedArea}>

          <View style={styles.sleepCompletedCircle}>
            <Text style={styles.sleepCompletedIcon}>
              z
            </Text>
          </View>

          <Text style={styles.completedTitle}>
            Ready to rest
          </Text>

          <Text style={styles.completedText}>
            Give yourself permission to slow down and rest.
          </Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={reset}
          >
            <Text style={styles.secondaryButtonText}>
              Do Again
            </Text>
          </Pressable>

        </View>
      ) : !started ? (
        <View style={styles.activityStartArea}>

          <View style={styles.sleepVisual}>
            <View style={styles.sleepMoon} />
            <View style={styles.sleepMoonCut} />

            <Text style={styles.sleepZOne}>
              z
            </Text>

            <Text style={styles.sleepZTwo}>
              z
            </Text>
          </View>

          <Text style={styles.activityInstruction}>
            Take a few minutes to slow down before sleep.
          </Text>

          <Pressable
            style={styles.startButton}
            onPress={start}
          >
            <Text style={styles.startButtonText}>
              Start Wind-Down
            </Text>

            <Text style={styles.startArrow}>
              ›
            </Text>
          </Pressable>

        </View>
      ) : (
        <View style={styles.sleepActiveArea}>

          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>
              {step + 1}
            </Text>

            <Text style={styles.stepOf}>
              / 3
            </Text>
          </View>

          <Text style={styles.sleepStepText}>
            {steps[step]}
          </Text>

          <Pressable
            style={styles.startButton}
            onPress={next}
          >
            <Text style={styles.startButtonText}>
              {step === 2 ? 'Complete' : 'Next Step'}
            </Text>

            <Text style={styles.startArrow}>
              ›
            </Text>
          </Pressable>

          <Pressable
            style={styles.smallReset}
            onPress={reset}
          >
            <Text style={styles.smallResetText}>
              Reset
            </Text>
          </Pressable>

        </View>
      )}

    </View>
  );
}

/* =========================================================
   MOVEMENT ACTIVITY
========================================================= */

function MovementActivity({
  started,
  completed,
  step,
  onStart,
  onNext,
  onReset,
}: {
  started: boolean;
  completed: boolean;
  step: number;
  onStart: () => void;
  onNext: () => void;
  onReset: () => void;
}) {
  const steps = [
    'Roll your shoulders slowly 5 times.',
    'Stretch your arms gently above your head.',
    'Take a short walk around your space.',
  ];

  return (
    <View style={styles.activityCard}>

      <Text style={styles.activityLabel}>
        MOVE & RESET
      </Text>

      <Text style={styles.activityTitle}>
        2-Minute Movement
      </Text>

      <Text style={styles.activitySubtitle}>
        Gentle movement can help you feel refreshed.
      </Text>

      {completed ? (
        <View style={styles.completedArea}>

          <View style={styles.completedCircle}>
            <Text style={styles.completedCheck}>
              ✓
            </Text>
          </View>

          <Text style={styles.completedTitle}>
            Great job
          </Text>

          <Text style={styles.completedText}>
            You completed your short movement activity.
          </Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={onReset}
          >
            <Text style={styles.secondaryButtonText}>
              Move Again
            </Text>
          </Pressable>

        </View>
      ) : !started ? (
        <View style={styles.activityStartArea}>

          <View style={styles.movementVisual}>

            <View style={styles.movementHead} />

            <View style={styles.movementBody} />

            <View style={styles.movementArmLeft} />
            <View style={styles.movementArmRight} />

            <View style={styles.movementLegLeft} />
            <View style={styles.movementLegRight} />

          </View>

          <Text style={styles.activityInstruction}>
            Three simple movements. No equipment needed.
          </Text>

          <Pressable
            style={styles.startButton}
            onPress={onStart}
          >
            <Text style={styles.startButtonText}>
              Start Activity
            </Text>

            <Text style={styles.startArrow}>
              ›
            </Text>
          </Pressable>

        </View>
      ) : (
        <View style={styles.movementActiveArea}>

          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>
              {step + 1}
            </Text>

            <Text style={styles.stepOf}>
              / 3
            </Text>
          </View>

          <Text style={styles.movementStepText}>
            {steps[step]}
          </Text>

          <Pressable
            style={styles.startButton}
            onPress={onNext}
          >
            <Text style={styles.startButtonText}>
              {step === 2 ? 'Complete' : 'Done — Next'}
            </Text>

            <Text style={styles.startArrow}>
              ›
            </Text>
          </Pressable>

          <Pressable
            style={styles.smallReset}
            onPress={onReset}
          >
            <Text style={styles.smallResetText}>
              Reset
            </Text>
          </Pressable>

        </View>
      )}

    </View>
  );
}

/* =========================================================
   TALK TO SOMEONE ACTIVITY
========================================================= */

function SupportActivity({
  choice,
  completed,
  onStart,
  onChoose,
  onReset,
}: {
  choice: string;
  completed: boolean;
  onStart: () => void;
  onChoose: (choice: string) => void;
  onReset: () => void;
}) {
  const [started, setStarted] =
    useState(false);

  const start = () => {
    setStarted(true);
    onStart();
  };

  const reset = () => {
    setStarted(false);
    onReset();
  };

  return (
    <View style={styles.activityCard}>

      <Text style={styles.activityLabel}>
        CONNECTION CHECK
      </Text>

      <Text style={styles.activityTitle}>
        Reach Out Activity
      </Text>

      <Text style={styles.activitySubtitle}>
        Think of one person you would feel comfortable
        talking to today.
      </Text>

      {completed ? (
        <View style={styles.completedArea}>

          <View style={styles.supportCompletedCircle}>
            <Text style={styles.supportCompletedIcon}>
              ♡
            </Text>
          </View>

          <Text style={styles.completedTitle}>
            Good first step
          </Text>

          <Text style={styles.completedText}>
            You identified someone you can connect with.
            Reaching out does not have to be a big conversation.
          </Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={reset}
          >
            <Text style={styles.secondaryButtonText}>
              Choose Again
            </Text>
          </Pressable>

        </View>
      ) : !started ? (
        <View style={styles.activityStartArea}>

          <View style={styles.connectionVisual}>

            <View style={styles.personOne} />
            <View style={styles.personTwo} />

            <View style={styles.connectionBubble}>
              <Text style={styles.connectionHeart}>
                ♡
              </Text>
            </View>

          </View>

          <Pressable
            style={styles.startButton}
            onPress={start}
          >
            <Text style={styles.startButtonText}>
              Start Activity
            </Text>

            <Text style={styles.startArrow}>
              ›
            </Text>
          </Pressable>

        </View>
      ) : (
        <View style={styles.supportChoiceArea}>

          <Text style={styles.choiceQuestion}>
            Who could you talk to?
          </Text>

          {[
            'A trusted friend',
            'A family member',
            'A counselor',
          ].map((item) => (
            <Pressable
              key={item}
              style={styles.supportChoiceButton}
              onPress={() => onChoose(item)}
            >
              <Text style={styles.supportChoiceText}>
                {item}
              </Text>

              <Text style={styles.supportChoiceArrow}>
                ›
              </Text>
            </Pressable>
          ))}

          <Pressable
            style={styles.smallReset}
            onPress={reset}
          >
            <Text style={styles.smallResetText}>
              Reset
            </Text>
          </Pressable>

        </View>
      )}

    </View>
  );
}

/* =========================================================
   SIMPLE ACTIVITY
========================================================= */

function SimpleActivity({
  started,
  completed,
  onStart,
  onComplete,
  onReset,
}: {
  started: boolean;
  completed: boolean;
  onStart: () => void;
  onComplete: () => void;
  onReset: () => void;
}) {
  return (
    <View style={styles.activityCard}>

      <Text style={styles.activityLabel}>
        WELLBEING PRACTICE
      </Text>

      <Text style={styles.activityTitle}>
        Small Wellbeing Step
      </Text>

      <Text style={styles.activitySubtitle}>
        Take a short moment to do something kind for yourself.
      </Text>

      {completed ? (
        <View style={styles.completedArea}>

          <View style={styles.completedCircle}>
            <Text style={styles.completedCheck}>
              ✓
            </Text>
          </View>

          <Text style={styles.completedTitle}>
            Completed
          </Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={onReset}
          >
            <Text style={styles.secondaryButtonText}>
              Do Again
            </Text>
          </Pressable>

        </View>
      ) : !started ? (
        <Pressable
          style={styles.startButton}
          onPress={onStart}
        >
          <Text style={styles.startButtonText}>
            Start Activity
          </Text>

          <Text style={styles.startArrow}>
            ›
          </Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.startButton}
          onPress={onComplete}
        >
          <Text style={styles.startButtonText}>
            Mark as Complete
          </Text>

          <Text style={styles.startArrow}>
            ✓
          </Text>
        </Pressable>
      )}

    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CREAM,
  },

  container: {
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  content: {
    flex: 1,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    height: 57,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  backButton: {
    width: 82,
    height: 42,
    justifyContent: 'center',
  },

  backArrow: {
    color: DARK,
    fontSize: 32,
    lineHeight: 32,
  },

  headerSpace: {
    width: 82,
  },

  /* =======================================================
     LOGO
  ======================================================= */

  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',

    shadowColor: CORAL,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },

  logoLeaf: {
    position: 'absolute',
    width: 9,
    height: 17,
    backgroundColor: WHITE,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 9,
  },

  logoLeafLeft: {
    transform: [{ rotate: '-38deg' }],
    left: 13,
    top: 13,
  },

  logoLeafRight: {
    transform: [{ rotate: '38deg' }],
    right: 13,
    top: 13,
  },

  logoHeart: {
    position: 'absolute',
    color: CORAL,
    fontSize: 14,
    fontWeight: '700',
    top: 16,
    zIndex: 5,
  },

  logoStem: {
    position: 'absolute',
    width: 2,
    height: 11,
    backgroundColor: WHITE,
    bottom: 10,
    borderRadius: 2,
  },

  /* =======================================================
     HERO
  ======================================================= */

  heroCard: {
    backgroundColor: '#F8DED7',
    borderRadius: 25,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#F1D2CB',

    shadowColor: '#C9AFA7',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 11,
    elevation: 2,
  },

  heroIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  resourceIllustration: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  /* BREATH ICON */

  breathOuter: {
    width: 37,
    height: 37,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#8FB19A',
  },

  breathInner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CFE1D2',
  },

  /* MOON */

  resourceMoon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A58DB8',
  },

  resourceMoonCut: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: WHITE,
    top: 1,
    left: 12,
  },

  resourceZ: {
    position: 'absolute',
    color: '#A58DB8',
    fontSize: 14,
    fontWeight: '800',
    right: 0,
    top: 0,
  },

  /* CHAT */

  resourceChat: {
    width: 36,
    height: 27,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: CORAL,
  },

  resourceChatDotOne: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: CORAL,
    left: 9,
    top: 12,
  },

  resourceChatDotTwo: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: CORAL,
    left: 18,
    top: 12,
  },

  resourceChatDotThree: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: CORAL,
    left: 27,
    top: 12,
  },

  /* BOOK */

  bookPageLeft: {
    position: 'absolute',
    width: 20,
    height: 30,
    backgroundColor: '#FFF9F3',
    left: 1,
    transform: [{ rotate: '-5deg' }],
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },

  bookPageRight: {
    position: 'absolute',
    width: 20,
    height: 30,
    backgroundColor: '#FFF9F3',
    right: 1,
    transform: [{ rotate: '5deg' }],
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },

  bookCenter: {
    position: 'absolute',
    width: 2,
    height: 29,
    backgroundColor: CORAL,
  },

  /* LEAVES */

  resourceLeafLeft: {
    position: 'absolute',
    width: 17,
    height: 28,
    borderRadius: 17,
    backgroundColor: '#8EAD78',
    left: 5,
    top: 7,
    transform: [{ rotate: '-35deg' }],
  },

  resourceLeafRight: {
    position: 'absolute',
    width: 17,
    height: 28,
    borderRadius: 17,
    backgroundColor: '#AFC99D',
    right: 5,
    top: 7,
    transform: [{ rotate: '35deg' }],
  },

  resourceLeafStem: {
    position: 'absolute',
    width: 2,
    height: 28,
    backgroundColor: '#718B63',
    bottom: 0,
  },

  title: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
    color: DARK,
    textAlign: 'center',
    marginBottom: 10,
  },

  categoryBadge: {
    backgroundColor: WHITE,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#80645C',
  },

  /* =======================================================
     SECTIONS
  ======================================================= */

  section: {
    marginBottom: 21,
  },

  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK,
  },

  tipCount: {
    marginLeft: 8,
    minWidth: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#FCE5DF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tipCountText: {
    color: CORAL,
    fontSize: 10,
    fontWeight: '800',
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    color: SOFT_TEXT,
  },

  /* =======================================================
     TIPS
  ======================================================= */

  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 17,
    padding: 13,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: '#C9B5AE',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 1,
  },

  numberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FCE5DF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  numberText: {
    fontSize: 12,
    fontWeight: '800',
    color: CORAL,
  },

  tipText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#62534D',
  },

  /* =======================================================
     ACTIVITY CARD
  ======================================================= */

  activityCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 18,
    marginBottom: 21,
    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: '#C9B5AE',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.07,
    shadowRadius: 11,
    elevation: 2,
  },

  activityLabel: {
    color: CORAL,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 5,
  },

  activityTitle: {
    color: DARK,
    fontSize: 20,
    fontWeight: '800',
  },

  activitySubtitle: {
    color: MUTED,
    fontSize: 11.5,
    lineHeight: 17,
    marginTop: 4,
  },

  activityStartArea: {
    alignItems: 'center',
    marginTop: 18,
  },

  activityInstruction: {
    color: SOFT_TEXT,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 13,
    marginBottom: 15,
    paddingHorizontal: 10,
  },

  startButton: {
    height: 46,
    minWidth: 190,
    paddingHorizontal: 16,
    borderRadius: 23,
    backgroundColor: CORAL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: CORAL,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.17,
    shadowRadius: 7,
    elevation: 2,
  },

  startButtonText: {
    color: WHITE,
    fontSize: 12.5,
    fontWeight: '800',
  },

  startArrow: {
    color: WHITE,
    fontSize: 21,
    marginLeft: 8,
    marginTop: -2,
  },

  /* =======================================================
     BREATHING
  ======================================================= */

  breathPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#B8CDBB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewInner: {
    width: 57,
    height: 57,
    borderRadius: 29,
    backgroundColor: '#DDEBD2',
  },

  breathingActiveArea: {
    alignItems: 'center',
    marginTop: 15,
  },

  cycleText: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 10,
  },

  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E4EEE2',
    borderWidth: 2,
    borderColor: '#AFC7B1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  breathingCircleInner: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#CFE1D2',
  },

  phaseText: {
    color: '#52725A',
    fontSize: 13,
    fontWeight: '800',
    zIndex: 2,
    letterSpacing: 1,
  },

  secondsText: {
    color: '#52725A',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
    zIndex: 2,
  },

  breathHint: {
    color: SOFT_TEXT,
    fontSize: 12,
    marginTop: 13,
    marginBottom: 15,
  },

  activityControls: {
    flexDirection: 'row',
    gap: 9,
  },

  pauseButton: {
    height: 40,
    minWidth: 90,
    borderRadius: 20,
    backgroundColor: '#FCE5DF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pauseButtonText: {
    color: CORAL,
    fontSize: 11,
    fontWeight: '800',
  },

  resetButton: {
    height: 40,
    minWidth: 70,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9DCD6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resetButtonText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: '700',
  },

  /* =======================================================
     COMPLETED
  ======================================================= */

  completedArea: {
    alignItems: 'center',
    marginTop: 18,
  },

  completedCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: SAGE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  completedCheck: {
    color: SAGE_DARK,
    fontSize: 27,
    fontWeight: '800',
  },

  completedTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },

  completedText: {
    color: SOFT_TEXT,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 14,
  },

  secondaryButton: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#FCE5DF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: CORAL,
    fontSize: 11,
    fontWeight: '800',
  },

  /* =======================================================
     TIMER
  ======================================================= */

  timerCircle: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: '#FCE5DF',
    borderWidth: 2,
    borderColor: '#F3C9C0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timerNumber: {
    color: CORAL,
    fontSize: 23,
    fontWeight: '800',
  },

  timerLabel: {
    color: MUTED,
    fontSize: 9,
    marginTop: 1,
  },

  timerCircleActive: {
    width: 145,
    height: 145,
    borderRadius: 73,
    backgroundColor: '#FCE5DF',
    borderWidth: 2,
    borderColor: '#F1BFB5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  timerNumberActive: {
    color: CORAL,
    fontSize: 29,
    fontWeight: '800',
  },

  timerLabelActive: {
    color: MUTED,
    fontSize: 10,
    marginTop: 3,
  },

  resetButtonWide: {
    height: 40,
    paddingHorizontal: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9DCD6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* =======================================================
     HYDRATION
  ======================================================= */

  hydrationArea: {
    alignItems: 'center',
    marginTop: 17,
  },

  waterGlass: {
    width: 62,
    height: 78,
    borderWidth: 2,
    borderColor: '#86A8A8',
    borderTopWidth: 0,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },

  waterLevel: {
    position: 'absolute',
    width: '100%',
    height: 47,
    backgroundColor: '#C9DEDF',
    bottom: 0,
  },

  waterShineOne: {
    position: 'absolute',
    width: 5,
    height: 25,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.7)',
    left: 15,
    top: 30,
  },

  waterShineTwo: {
    position: 'absolute',
    width: 4,
    height: 17,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
    left: 25,
    top: 39,
  },

  hydrationQuestion: {
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 13,
  },

  choiceRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },

  choiceButton: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  choiceButtonSecondary: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FCE5DF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  choiceText: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '800',
  },

  choiceTextSecondary: {
    color: CORAL,
    fontSize: 11,
    fontWeight: '800',
  },

  waterCompletedCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#E2ECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  waterCompletedIcon: {
    color: '#789A9A',
    fontSize: 27,
    fontWeight: '800',
  },

  /* =======================================================
     SLEEP
  ======================================================= */

  sleepVisual: {
    width: 105,
    height: 90,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sleepMoon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D9CDE2',
  },

  sleepMoonCut: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: WHITE,
    left: 48,
    top: 7,
  },

  sleepZOne: {
    position: 'absolute',
    color: '#927AA4',
    fontSize: 17,
    fontWeight: '800',
    right: 3,
    top: 3,
  },

  sleepZTwo: {
    position: 'absolute',
    color: '#B19ABC',
    fontSize: 11,
    fontWeight: '800',
    right: 17,
    top: 21,
  },

  sleepActiveArea: {
    alignItems: 'center',
    marginTop: 17,
  },

  stepCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E7E0EC',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  stepNumber: {
    color: '#8C789D',
    fontSize: 25,
    fontWeight: '800',
  },

  stepOf: {
    color: '#9D8CAB',
    fontSize: 11,
    marginTop: 9,
  },

  sleepStepText: {
    color: DARK,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 15,
    paddingHorizontal: 8,
  },

  smallReset: {
    marginTop: 10,
    paddingVertical: 5,
  },

  smallResetText: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
  },

  sleepCompletedCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#E7E0EC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sleepCompletedIcon: {
    color: '#8C789D',
    fontSize: 26,
    fontWeight: '800',
  },

  /* =======================================================
     MOVEMENT
  ======================================================= */

  movementVisual: {
    width: 90,
    height: 105,
    position: 'relative',
    alignItems: 'center',
  },

  movementHead: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: '#AFC99D',
    position: 'absolute',
    top: 2,
  },

  movementBody: {
    width: 10,
    height: 35,
    borderRadius: 6,
    backgroundColor: '#81965F',
    position: 'absolute',
    top: 20,
  },

  movementArmLeft: {
    width: 7,
    height: 31,
    borderRadius: 5,
    backgroundColor: '#81965F',
    position: 'absolute',
    top: 21,
    left: 28,
    transform: [{ rotate: '35deg' }],
  },

  movementArmRight: {
    width: 7,
    height: 31,
    borderRadius: 5,
    backgroundColor: '#81965F',
    position: 'absolute',
    top: 21,
    right: 28,
    transform: [{ rotate: '-35deg' }],
  },

  movementLegLeft: {
    width: 7,
    height: 34,
    borderRadius: 5,
    backgroundColor: '#81965F',
    position: 'absolute',
    top: 50,
    left: 34,
    transform: [{ rotate: '18deg' }],
  },

  movementLegRight: {
    width: 7,
    height: 34,
    borderRadius: 5,
    backgroundColor: '#81965F',
    position: 'absolute',
    top: 50,
    right: 34,
    transform: [{ rotate: '-18deg' }],
  },

  movementActiveArea: {
    alignItems: 'center',
    marginTop: 17,
  },

  movementStepText: {
    color: DARK,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 15,
    paddingHorizontal: 7,
  },

  /* =======================================================
     SUPPORT
  ======================================================= */

  connectionVisual: {
    width: 105,
    height: 80,
    position: 'relative',
    alignItems: 'center',
  },

  personOne: {
    position: 'absolute',
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#E6B4AA',
    left: 16,
    top: 15,
  },

  personTwo: {
    position: 'absolute',
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#AFC99D',
    right: 16,
    top: 15,
  },

  connectionBubble: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#FCE5DF',
    alignItems: 'center',
    justifyContent: 'center',
    top: 2,
    left: 35,
  },

  connectionHeart: {
    color: CORAL,
    fontSize: 17,
    fontWeight: '800',
  },

  supportChoiceArea: {
    marginTop: 17,
  },

  choiceQuestion: {
    color: DARK,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 11,
  },

  supportChoiceButton: {
    height: 43,
    borderRadius: 22,
    backgroundColor: '#FCE5DF',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  supportChoiceText: {
    color: DARK,
    fontSize: 11,
    fontWeight: '700',
  },

  supportChoiceArrow: {
    color: CORAL,
    fontSize: 20,
  },

  supportCompletedCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FCE5DF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  supportCompletedIcon: {
    color: CORAL,
    fontSize: 28,
    fontWeight: '800',
  },

  /* =======================================================
     SUPPORT CARD
  ======================================================= */

  supportCard: {
    flexDirection: 'row',
    backgroundColor: '#F4EEE8',
    borderRadius: 21,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#EEE2DB',
  },

  supportIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SAGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  supportHeart: {
    color: CORAL,
    fontSize: 25,
    fontWeight: '800',
  },

  supportContent: {
    flex: 1,
  },

  supportTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: DARK,
    marginBottom: 5,
  },

  supportText: {
    fontSize: 11,
    lineHeight: 17,
    color: SOFT_TEXT,
    marginBottom: 12,
  },

  counselorButton: {
    height: 41,
    backgroundColor: CORAL,
    borderRadius: 21,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  counselorButtonText: {
    color: WHITE,
    fontSize: 11.5,
    fontWeight: '800',
  },

  counselorArrow: {
    color: WHITE,
    fontSize: 21,
    marginLeft: 7,
    marginTop: -2,
  },

  /* =======================================================
     HOME
  ======================================================= */

  homeButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  homeButtonText: {
    color: CORAL,
    fontSize: 13,
    fontWeight: '800',
  },

  homeArrow: {
    color: CORAL,
    fontSize: 22,
    marginLeft: 8,
    marginTop: -2,
  },

  footerText: {
    color: '#A18F88',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 12,
  },
});