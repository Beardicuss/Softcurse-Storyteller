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

const STAR_COUNT = 15;

const stars = Array.from({ length: STAR_COUNT }, () => ({
  x: Math.random() * width,
  y: Math.random() * height,
  size: Math.random() * 2.5 + 0.5,
}));

export default function LaunchScreen() {
  const router = useRouter();

  const fadeIn = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(40)).current;
  const buttonGlow = useRef(new Animated.Value(0.4)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;
  const starPulse = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.spring(titleSlide, { toValue: 0, tension: 30, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonGlow, { toValue: 0.8, duration: 1500, useNativeDriver: true }),
        Animated.timing(buttonGlow, { toValue: 0.4, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(starPulse, { toValue: 0.8, duration: 2000, useNativeDriver: true }),
        Animated.timing(starPulse, { toValue: 0.3, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
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

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-5, 85],
  });

  const scanOpacity = scanAnim.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 0.7, 0.7, 0],
  });

  const glyphTexts = [
    '0x89F2 EXEC PROTOCOL',
    'SYS.QUANTUM.INIT()',
    '01011010 01000001 01010000',
    'HOLO-CONN INITIALIZED',
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.gridPlane}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 50 }]} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLineV, { left: i * (width / 9) }]} />
        ))}
      </View>

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
              opacity: starPulse,
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
            <Text
              key={i}
              style={[
                styles.glyphText,
                {
                  top: i < 2 ? -30 - i * 16 : undefined,
                  bottom: i >= 2 ? -30 - (i - 2) * 16 : undefined,
                  left: i % 2 === 0 ? 10 : undefined,
                  right: i % 2 !== 0 ? 10 : undefined,
                },
              ]}
            >
              {text}
            </Text>
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
                    transform: [{ translateY: scanTranslateY }],
                    opacity: scanOpacity,
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
          {Array.from({ length: 15 }).map((_, i) => (
            <View key={`wave-${i}`} style={styles.waveBar} />
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
  gridPlane: {
    position: 'absolute',
    width: width,
    height: height,
    top: height * 0.4,
    opacity: 0.2,
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
    fontWeight: '700' as const,
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
    height: 8,
    backgroundColor: cyberpunk.cyanGlow,
    marginHorizontal: 2,
    borderRadius: 1,
  },
});
