import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { cyberpunk } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

interface CyberCardProps {
  emoji: string;
  title: string;
  index: number;
  onPress: () => void;
}

function CyberCardComponent({ emoji, title, index, onPress }: CyberCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000 + index * 400,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000 + index * 400,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [glowAnim, index]);

  const handlePressIn = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 5,
    }).start();
  }, [scaleAnim]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        testID={`story-card-${index}`}
      >
        <LinearGradient
          colors={[cyberpunk.cyan, cyberpunk.neonBlue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={styles.cardInner}>
            <Animated.View style={[styles.glowOverlay, { opacity: glowOpacity }]} />
            <View style={styles.cardContent}>
              <Text style={styles.emoji}>{emoji}</Text>
              <View style={styles.divider} />
              <Text style={styles.title} numberOfLines={4}>
                {title}
              </Text>
            </View>
            <View style={styles.cornerTL} />
            <View style={styles.cornerBR} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default React.memo(CyberCardComponent);

const styles = StyleSheet.create({
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 16,
  },
  gradientBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    padding: 2,
  },
  cardInner: {
    flex: 1,
    backgroundColor: cyberpunk.bgCard,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 255, 255, 0.03)',
  },
  cardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  divider: {
    width: 30,
    height: 2,
    backgroundColor: cyberpunk.cyan,
    borderRadius: 1,
    marginBottom: 10,
    opacity: 0.5,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: cyberpunk.textPrimary,
    textAlign: 'center',
    lineHeight: 18,
  },
  cornerTL: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 12,
    height: 12,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: cyberpunk.cyanGlow,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 12,
    height: 12,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: cyberpunk.cyanGlow,
  },
});
