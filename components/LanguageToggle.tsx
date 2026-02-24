import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { cyberpunk } from '@/constants/colors';
import { useLanguage, Language } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const slideAnim = useRef(new Animated.Value(language === 'geo' ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: language === 'geo' ? 0 : 1,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  }, [language, slideAnim]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 72],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.slider,
          { transform: [{ translateX }] },
        ]}
      />
      <TouchableOpacity
        style={styles.option}
        onPress={() => setLanguage('geo')}
        activeOpacity={0.7}
        testID="lang-geo"
      >
        <Text style={[styles.label, language === 'geo' && styles.activeLabel]}>GEO</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => setLanguage('rus')}
        activeOpacity={0.7}
        testID="lang-rus"
      >
        <Text style={[styles.label, language === 'rus' && styles.activeLabel]}>RUS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    backgroundColor: 'rgba(0, 255, 255, 0.06)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: cyberpunk.borderGlow,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  slider: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: 72,
    height: '100%' as const,
    backgroundColor: 'rgba(0, 255, 255, 0.15)',
    borderRadius: 20,
  },
  option: {
    width: 72,
    paddingVertical: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  label: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: cyberpunk.textMuted,
    letterSpacing: 1.5,
  },
  activeLabel: {
    color: cyberpunk.cyan,
  },
});
