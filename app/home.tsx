import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen } from 'lucide-react-native';
import { cyberpunk } from '@/constants/colors';
import { stories } from '@/mocks/stories';
import { useLanguage } from '@/contexts/LanguageContext';
import CyberCard from '@/components/CyberCard';
import CyberGrid from '@/components/CyberGrid';
import LanguageToggle from '@/components/LanguageToggle';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(titleSlide, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, titleSlide]);

  const handleCardPress = (storyId: string) => {
    router.push(`/story/${storyId}` as never);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <CyberGrid />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: titleSlide }] },
          ]}
        >
          <View style={styles.titleRow}>
            <BookOpen size={22} color={cyberpunk.cyan} strokeWidth={2} />
            <Text style={styles.appTitle}>
              {language === 'geo' ? 'ალტერნატიული მითოლოგია' : 'Альтернативная мифология'}
            </Text>
          </View>
          <Text style={styles.subtitle}>
            {language === 'geo'
              ? 'აირჩიეთ მითი წასაკითხად'
              : 'Выберите миф для чтения'}
          </Text>
          <View style={styles.toggleContainer}>
            <LanguageToggle />
          </View>
        </Animated.View>

        <View style={styles.grid}>
          {stories.map((story, index) => (
            <CyberCard
              key={story.id}
              emoji={story.emoji}
              title={story.title[language]}
              index={index}
              onPress={() => handleCardPress(story.id)}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>by Dante Berezinsky</Text>
          <View style={styles.footerLine} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: cyberpunk.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: cyberpunk.cyan,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: cyberpunk.textMuted,
    marginBottom: 16,
    marginLeft: 32,
  },
  toggleContainer: {
    alignSelf: 'flex-start',
    marginLeft: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 12,
  },
  footerLine: {
    height: 1,
    width: 40,
    backgroundColor: cyberpunk.cyanDim,
  },
  footerText: {
    fontSize: 11,
    color: cyberpunk.textMuted,
    letterSpacing: 1,
  },
});
