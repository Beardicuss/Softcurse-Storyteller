import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cyberpunk } from '@/constants/colors';
import { stories } from '@/mocks/stories';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import CyberGrid from '@/components/CyberGrid';

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const story = stories.find((s) => s.id === id);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  if (!story) {
    return (
      <View style={[styles.root, styles.center]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Story not found</Text>
      </View>
    );
  }

  const title = story.title[language];
  const content = story.content[language];

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      <CyberGrid />

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
          testID="back-button"
        >
          <ArrowLeft size={20} color={cyberpunk.cyan} strokeWidth={2} />
        </TouchableOpacity>
        <LanguageToggle />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.storyHeader,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.emoji}>{story.emoji}</Text>
          <LinearGradient
            colors={[cyberpunk.cyan, cyberpunk.neonBlue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.titleUnderline}
          />
          <Text style={styles.storyTitle}>{title}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.contentCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.cardBorderTop} />
          <Text style={styles.storyContent}>{content}</Text>
          <View style={styles.cardBorderBottom} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: cyberpunk.bg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: cyberpunk.magenta,
    fontSize: 16,
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: cyberpunk.borderGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  storyHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 14,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    borderRadius: 2,
    marginBottom: 14,
  },
  storyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: cyberpunk.cyan,
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 8,
  },
  contentCard: {
    backgroundColor: cyberpunk.bgGlass,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardBorderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0, 255, 255, 0.15)',
  },
  cardBorderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0, 136, 255, 0.15)',
  },
  storyContent: {
    fontSize: 16,
    color: cyberpunk.textPrimary,
    lineHeight: 26,
    letterSpacing: 0.2,
  },
});
