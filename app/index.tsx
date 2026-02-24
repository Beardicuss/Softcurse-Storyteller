import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { cyberpunk } from '@/constants/colors';

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 40;
const PARTICLE_COUNT = 6;
const WAVE_BAR_COUNT = 15;

function generateStars() {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.6 + 0.2,
  }));
}

export default function LaunchScreen() {
  const router = useRouter();
  const stars = useRef(generateStars()).current;

  const nebulaAnim = useRef(new Animated.Value(0)).current;
  const gridAnim = useRef(new Animated.Value(0)).current;
  const scanAnim = useRef(new Animated.Value(-5)).current;
  const scanOpacity = useRef(new Animated.Value(0)).current;
  const buttonGlow = useRef(new Animated.Value(0.4)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(40)).current;
  const glitchOpacity = useRef(new Animated.Value(0)).current;
  const glitchX = useRef(new Animated.Value(0)).current;

  const particleAnims = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  const waveAnims = useRef(
    Array.from({ length: WAVE_BAR_COUNT }, () => new Animated.Value(5))
  ).current;

  const starAnims = useRef(
    stars.map(() => new Animated.Value(Math.random()))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.spring(titleSlide, { toValue: 0, tension: 30, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(nebulaAnim, { toValue: 1, duration: 15000, useNativeDriver: true }),
        Animated.timing(nebulaAnim, { toValue: 0, duration: 15000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(gridAnim, { toValue: 1, duration: 20000, useNativeDriver: true })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonGlow, { toValue: 0.8, duration: 1500, useNativeDriver: true }),
        Animated.timing(buttonGlow, { toValue: 0.4, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    const scanLoop = () => {
      scanAnim.setValue(-5);
      scanOpacity.setValue(0);
      Animated.sequence([
        Animated.timing(scanOpacity, { toValue: 0.7, duration: 200, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 85, duration: 1600, useNativeDriver: true }),
        Animated.timing(scanOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => setTimeout(scanLoop, 400));
    };
    scanLoop();

    particleAnims.forEach((p, i) => {
      const runParticle = () => {
        p.y.setValue(0);
        p.opacity.setValue(0);
        Animated.sequence([
          Animated.delay(i * 300),
          Animated.parallel([
            Animated.timing(p.opacity, { toValue: 0.8, duration: 200, useNativeDriver: true }),
            Animated.timing(p.y, { toValue: -40, duration: 2500, useNativeDriver: true }),
          ]),
          Animated.timing(p.opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => runParticle());
      };
      runParticle();
    });

    waveAnims.forEach((w, i) => {
      const delay = i <= 7 ? i * 100 : (WAVE_BAR_COUNT - 1 - i) * 100;
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(w, { toValue: 18, duration: 750, useNativeDriver: false }),
          Animated.timing(w, { toValue: 5, duration: 750, useNativeDriver: false }),
        ])
      ).start();
    });

    starAnims.forEach((s) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(s, { toValue: 0.2, duration: 1500 + Math.random() * 2000, useNativeDriver: true }),
          Animated.timing(s, { toValue: 1, duration: 1500 + Math.random() * 2000, useNativeDriver: true }),
        ])
      ).start();
    });

    const glitchLoop = () => {
      Animated.sequence([
        Animated.delay(5000 + Math.random() * 5000),
        Animated.parallel([
          Animated.timing(glitchOpacity, { toValue: 0.8, duration: 50, useNativeDriver: true }),
          Animated.timing(glitchX, { toValue: 5, duration: 50, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(glitchX, { toValue: -5, duration: 50, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(glitchX, { toValue: 2, duration: 50, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(glitchOpacity, { toValue: 0, duration: 50, useNativeDriver: true }),
          Animated.timing(glitchX, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]),
      ]).start(() => glitchLoop());
    };
    glitchLoop();
  }, []);

  const handleLaunch = useCallback(() => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1.02, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start(() => {
      router.replace('/home' as never);
    });
  }, [router, buttonScale]);

  const nebulaScale = nebulaAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const nebulaOpacityVal = nebulaAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.5, 0.4],
  });

  const gridTranslate = gridAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const particlePositions = [
    { left: '30%' as const, top: '70%' as const },
    { left: '40%' as const, top: '60%' as const },
    { left: '60%' as const, top: '80%' as const },
    { left: '70%' as const, top: '70%' as const },
    { left: '50%' as const, top: '75%' as const },
    { left: '65%' as const, top: '65%' as const },
  ];

  const glyphTexts = [
    '0x89F2 EXEC PROTOCOL',
    'SYS.QUANTUM.INIT()',
    '01011010 01000001 01010000',
    'HOLO-CONN INITIALIZED',
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={[
          styles.nebula,
          { transform: [{ scale: nebulaScale }], opacity: nebulaOpacityVal },
        ]}
      />

      <Animated.View
        style={[
          styles.gridPlane,
          { transform: [{ translateY: gridTranslate }] },
        ]}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={`h-${i}`}
            style={[styles.gridLineH, { top: i * 40 }]}
          />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <View
            key={`v-${i}`}
            style={[styles.gridLineV, { left: i * 40 }]}
          />
        ))}
      </Animated.View>

      {stars.map((star, i) => (
        <Animated.View
          key={`star-${i}`}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              opacity: starAnims[i],
            },
          ]}
        />
      ))}

      <Animated.View
        style={[
          styles.centerContent,
          { opacity: fadeIn, transform: [{ translateY: titleSlide }] },
        ]}
      >
        <View style={styles.glyphsContainer}>
          {glyphTexts.map((text, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.glyphText,
                {
                  opacity: fadeIn,
                  top: i < 2 ? -30 - i * 16 : undefined,
                  bottom: i >= 2 ? -30 - (i - 2) * 16 : undefined,
                  left: i % 2 === 0 ? 10 : undefined,
                  right: i % 2 !== 0 ? 10 : undefined,
                },
              ]}
            >
              {text}
            </Animated.Text>
          ))}
        </View>

        <Pressable onPress={handleLaunch} testID="launch-button">
          <Animated.View
            style={[
              styles.buttonOuter,
              { transform: [{ scale: buttonScale }] },
            ]}
          >
            <View style={styles.buttonInner}>
              <Animated.View style={[styles.buttonGlow, { opacity: buttonGlow }]} />

              <View style={styles.holoLines}>
                <View style={[styles.holoLineV, { left: 30 }]} />
                <View style={[styles.holoLineV, { right: 30 }]} />
                <View style={[styles.holoLineH, { top: 15 }]} />
                <View style={[styles.holoLineH, { bottom: 15 }]} />
              </View>

              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: scanAnim }],
                    opacity: scanOpacity,
                  },
                ]}
              />

              {particleAnims.map((p, i) => (
                <Animated.View
                  key={`particle-${i}`}
                  style={[
                    styles.particle,
                    {
                      left: particlePositions[i].left,
                      top: particlePositions[i].top,
                      width: i % 2 === 0 ? 3 : 2,
                      height: i % 2 === 0 ? 3 : 2,
                      borderRadius: 2,
                      opacity: p.opacity,
                      transform: [{ translateY: p.y }],
                    },
                  ]}
                />
              ))}

              <Animated.View
                style={[
                  styles.glitchOverlay,
                  {
                    opacity: glitchOpacity,
                    transform: [{ translateX: glitchX }],
                  },
                ]}
              />

              <View style={styles.cornerAccents}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>

              <Text style={styles.buttonText}>LAUNCH</Text>
            </View>
          </Animated.View>
        </Pressable>

        <View style={styles.waveContainer}>
          {waveAnims.map((w, i) => (
            <Animated.View
              key={`wave-${i}`}
              style={[styles.waveBar, { height: w }]}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: cyberpunk.bg,
    overflow: 'hidden',
  },
  nebula: {
    position: 'absolute',
    width: width * 1.2,
    height: height * 1.2,
    top: -height * 0.1,
    left: -width * 0.1,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web'
      ? {
          backgroundImage: `radial-gradient(ellipse at 30% 30%, rgba(0, 255, 255, 0.12) 0%, transparent 70%), radial-gradient(ellipse at 70% 60%, rgba(0, 136, 255, 0.15) 0%, transparent 70%), radial-gradient(ellipse at 50% 50%, rgba(255, 0, 255, 0.08) 0%, transparent 70%)`,
        }
      : {}),
  },
  gridPlane: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    top: height * 0.4,
    left: -width * 0.5,
    opacity: 0.25,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: cyberpunk.cyanDim,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: cyberpunk.cyanDim,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glyphsContainer: {
    position: 'relative',
    width: 300,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glyphText: {
    position: 'absolute',
    color: cyberpunk.cyanGlow,
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1,
    opacity: 0.5,
  },
  buttonOuter: {
    width: 280,
    height: 80,
    borderRadius: 3,
    padding: 2,
    ...(Platform.OS === 'web'
      ? {
          backgroundImage: `linear-gradient(135deg, ${cyberpunk.cyan}, ${cyberpunk.neonBlue}, ${cyberpunk.magenta})`,
        }
      : {
          backgroundColor: cyberpunk.cyan,
        }),
    shadowColor: cyberpunk.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonInner: {
    flex: 1,
    backgroundColor: 'rgba(2, 2, 2, 0.85)',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 255, 255, 0.06)',
  },
  buttonText: {
    color: cyberpunk.cyan,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  holoLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  holoLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 255, 255, 0.15)',
  },
  holoLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 255, 255, 0.15)',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    ...(Platform.OS === 'web'
      ? {
          backgroundImage: `linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.5) 20%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 0, 255, 0.5) 80%, transparent 100%)`,
        }
      : {
          backgroundColor: 'rgba(0, 255, 255, 0.4)',
        }),
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: cyberpunk.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  glitchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 255, 0.15)',
  },
  cornerAccents: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: 'absolute',
    width: 15,
    height: 15,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: cyberpunk.cyan,
    borderLeftColor: cyberpunk.cyan,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopColor: cyberpunk.cyan,
    borderRightColor: cyberpunk.cyan,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomColor: cyberpunk.magenta,
    borderLeftColor: cyberpunk.magenta,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: cyberpunk.magenta,
    borderRightColor: cyberpunk.magenta,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    height: 20,
  },
  waveBar: {
    width: 2,
    backgroundColor: cyberpunk.cyanGlow,
    marginHorizontal: 2,
    borderRadius: 1,
  },
});
