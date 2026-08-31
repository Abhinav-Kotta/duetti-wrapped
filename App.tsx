import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/space-grotesk';
import { BrandMark } from './src/components/BrandMark';
import { ProgressRail } from './src/components/ProgressRail';
import { StoryContent } from './src/components/StoryContent';
import { stories } from './src/data';
import { palette, radii, type } from './src/theme';

export default function App() {
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const transition = useRef(new Animated.Value(1)).current;
  const ambient = useRef(new Animated.Value(0)).current;
  const isTransitioning = useRef(false);
  const wheelAccumulator = useRef(0);
  const wheelResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDesktop = width >= 760;
  const compact = height < 720 || width < 370;
  const story = stories[index];
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ambient, { toValue: 1, duration: 5500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(ambient, { toValue: 0, duration: 5500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [ambient]);

  const moveTo = useCallback((nextIndex: number) => {
    if (
      nextIndex < 0 ||
      nextIndex >= stories.length ||
      nextIndex === index ||
      isTransitioning.current
    ) return;

    isTransitioning.current = true;
    const nextDirection = nextIndex > index ? 1 : -1;
    setDirection(nextDirection);
    if (Platform.OS !== 'web') Haptics.selectionAsync();

    transition.stopAnimation();
    transition.setValue(0);
    setIndex(nextIndex);

    requestAnimationFrame(() => {
      Animated.spring(transition, {
        toValue: 1,
        damping: 18,
        mass: 0.8,
        stiffness: 150,
        useNativeDriver: true,
      }).start(() => {
        isTransitioning.current = false;
      });
    });
  }, [index, transition]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        moveTo(index + 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveTo(index - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index, moveTo]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const onWheel = (event: WheelEvent) => {
      const isHorizontalGesture = Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) > 3;
      if (!isHorizontalGesture) return;

      event.preventDefault();
      wheelAccumulator.current += event.deltaX;

      if (wheelResetTimer.current) clearTimeout(wheelResetTimer.current);
      wheelResetTimer.current = setTimeout(() => {
        wheelAccumulator.current = 0;
      }, 180);

      if (Math.abs(wheelAccumulator.current) >= 72) {
        const nextIndex = wheelAccumulator.current > 0 ? index + 1 : index - 1;
        wheelAccumulator.current = 0;
        moveTo(nextIndex);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (wheelResetTimer.current) clearTimeout(wheelResetTimer.current);
    };
  }, [index, moveTo]);

  const panResponder = useMemo(
    () => PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        gesture.numberActiveTouches <= 2 && Math.abs(gesture.dx) > 16,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -55) moveTo(index + 1);
        if (gesture.dx > 55) moveTo(index - 1);
      },
    }),
    [index, moveTo],
  );

  if (!fontsLoaded) return <View style={styles.loading} />;

  const translateX = transition.interpolate({
    inputRange: [0, 1],
    outputRange: [direction * 34, 0],
  });
  const translateY = transition.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  const scale = transition.interpolate({ inputRange: [0, 1], outputRange: [0.985, 1] });
  const tilt = transition.interpolate({
    inputRange: [0, 1],
    outputRange: [`${direction * 4.5}deg`, '0deg'],
  });
  const ambientTranslate = ambient.interpolate({ inputRange: [0, 1], outputRange: [-14, 16] });

  return (
    <View style={[styles.shell, { backgroundColor: isDesktop ? palette.ink : story.background }]}>
      <StatusBar style={story.foreground === palette.white ? 'light' : 'dark'} />
      {isDesktop && (
        <>
          <Animated.View style={[styles.ambientOne, { transform: [{ translateY: ambientTranslate }] }]} />
          <Animated.View style={[styles.ambientTwo, { transform: [{ translateY: Animated.multiply(ambientTranslate, -0.7) }] }]} />
          <View style={styles.desktopMeta}>
            <BrandMark color={palette.white} />
            <View>
              <Text style={styles.desktopLabel}>MUSIC FINANCE INDEX</Text>
              <Text style={styles.desktopSeason}>H2 / 2026</Text>
            </View>
          </View>
        </>
      )}

      <SafeAreaView
        style={[
          styles.stage,
          {
            backgroundColor: story.background,
            borderRadius: isDesktop ? radii.desktop : 0,
            height: isDesktop ? Math.min(height - 42, 860) : height,
            width: isDesktop ? Math.min(480, width - 260) : width,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.inner, compact && styles.innerCompact]}>
          <ProgressRail activeIndex={index} color={story.foreground} />
          <View style={styles.topbar}>
            <BrandMark color={story.foreground} compact />
            <Text style={[styles.eyebrow, { color: story.foreground }]}>{story.eyebrow}</Text>
            <Text style={[styles.counter, { color: story.foreground }]}>{String(index + 1).padStart(2, '0')}</Text>
          </View>

          <Animated.View
            style={[
              styles.content,
              {
                opacity: transition,
                transform: [
                  { perspective: 900 },
                  { translateX },
                  { translateY },
                  { rotate: tilt },
                  { scale },
                ],
              },
            ]}
          >
            <StoryContent story={story} compact={compact} onRestart={() => moveTo(0)} />
          </Animated.View>

          <View style={styles.navRow}>
            <Pressable
              accessibilityLabel="Previous story"
              accessibilityRole="button"
              disabled={index === 0}
              onPress={() => moveTo(index - 1)}
              style={({ pressed }) => [
                styles.navButton,
                { borderColor: story.foreground, opacity: index === 0 ? 0.18 : pressed ? 0.55 : 1 },
              ]}
            >
              <Text style={[styles.navArrow, { color: story.foreground }]}>←</Text>
            </Pressable>
            <Text style={[styles.navHint, { color: story.foreground }]}>
              {index === stories.length - 1 ? 'THAT’S THE REPLAY' : 'NEXT SIGNAL'}
            </Text>
            <Pressable
              accessibilityLabel="Next story"
              accessibilityRole="button"
              disabled={index === stories.length - 1}
              onPress={() => moveTo(index + 1)}
              style={({ pressed }) => [
                styles.navButton,
                { borderColor: story.foreground, opacity: index === stories.length - 1 ? 0.18 : pressed ? 0.55 : 1 },
              ]}
            >
              <Text style={[styles.navArrow, { color: story.foreground }]}>→</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {isDesktop && (
        <View style={styles.desktopNote}>
          <Text style={styles.desktopNoteKicker}>A TRANSPARENCY PROTOTYPE</Text>
          <Text style={styles.desktopNoteBody}>Use ← →, drag, or two-finger swipe{`\n`}to move through the story.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { backgroundColor: palette.paper, flex: 1 },
  shell: { alignItems: 'center', flex: 1, justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  stage: { overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 22 }, shadowOpacity: 0.28, shadowRadius: 50 },
  inner: { flex: 1, paddingBottom: 19, paddingHorizontal: 24, paddingTop: 12 },
  innerCompact: { paddingBottom: 12, paddingHorizontal: 18, paddingTop: 8 },
  topbar: { alignItems: 'center', flexDirection: 'row', height: 54, justifyContent: 'space-between' },
  eyebrow: { flex: 1, fontFamily: type.medium, fontSize: 9, letterSpacing: 1.2, marginHorizontal: 12, textAlign: 'center' },
  counter: { fontFamily: type.medium, fontSize: 10, letterSpacing: 0.6, width: 25 },
  content: { flex: 1, paddingBottom: 12, paddingTop: 8 },
  navRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8 },
  navButton: { alignItems: 'center', borderRadius: 22, borderWidth: 1, height: 42, justifyContent: 'center', width: 42 },
  navArrow: { fontFamily: type.regular, fontSize: 20, lineHeight: 22 },
  navHint: { fontFamily: type.medium, fontSize: 8, letterSpacing: 1.2, opacity: 0.7 },
  ambientOne: { backgroundColor: palette.blue, borderRadius: 190, height: 380, left: -150, opacity: 0.56, position: 'absolute', top: -120, transform: [{ rotate: '-20deg' }], width: 380 },
  ambientTwo: { backgroundColor: palette.lime, borderRadius: 145, bottom: -130, height: 290, opacity: 0.45, position: 'absolute', right: -120, transform: [{ rotate: '20deg' }], width: 290 },
  desktopMeta: { alignItems: 'flex-start', height: 130, justifyContent: 'space-between', left: 36, position: 'absolute', top: 34 },
  desktopLabel: { color: palette.white, fontFamily: type.medium, fontSize: 8, letterSpacing: 1.4 },
  desktopSeason: { color: palette.white, fontFamily: type.display, fontSize: 25, letterSpacing: -1.3, marginTop: 3 },
  desktopNote: { bottom: 38, position: 'absolute', right: 36 },
  desktopNoteKicker: { color: palette.lime, fontFamily: type.medium, fontSize: 8, letterSpacing: 1.3 },
  desktopNoteBody: { color: palette.white, fontFamily: type.regular, fontSize: 12, lineHeight: 17, marginTop: 7, opacity: 0.76 },
});
