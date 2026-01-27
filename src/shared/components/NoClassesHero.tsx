/**
 * NoClassesHero - Full-screen widget for days with no classes
 * Professional centered design with meaningful content
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts';

interface NoClassesHeroProps {
  reason?: 'sunday' | 'saturday' | 'holiday' | 'vacation' | 'no_schedule';
  holidayName?: string;
}

export const NoClassesHero: React.FC<NoClassesHeroProps> = ({
  reason = 'no_schedule',
  holidayName,
}) => {
  const { isDark } = useTheme();

  // Format date
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Get reason-specific content
  const getReasonContent = () => {
    switch (reason) {
      case 'sunday':
        return {
          title: 'It\'s Sunday',
          subtitle: 'No classes scheduled for today',
          emoji: '☀️',
          quote: 'Rest is not idleness, and to lie sometimes on the grass under trees on a summer\'s day, listening to the murmur of the water, or watching the clouds float across the sky, is by no means a waste of time.',
          author: '— John Lubbock',
        };
      case 'saturday':
        return {
          title: 'It\'s Saturday',
          subtitle: 'Weekend — No classes today',
          emoji: '🎉',
          quote: 'Almost everything will work again if you unplug it for a few minutes, including you.',
          author: '— Anne Lamott',
        };
      case 'holiday':
        return {
          title: holidayName || 'Holiday',
          subtitle: 'Institutional holiday today',
          emoji: '🎊',
          quote: 'A little pause refreshes the spirit and makes the work better.',
          author: '',
        };
      case 'vacation':
        return {
          title: 'Vacation',
          subtitle: 'Academic break in progress',
          emoji: '✈️',
          quote: 'Take vacations. Go as many places as you can. You can always make money. You can\'t always make memories.',
          author: '',
        };
      default:
        return {
          title: 'No Classes',
          subtitle: 'Your schedule is clear for today',
          emoji: '📅',
          quote: 'The time you enjoy wasting is not wasted time.',
          author: '— Bertrand Russell',
        };
    }
  };

  const content = getReasonContent();

  // Colors
  const colors = {
    cardBg: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.92)',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
    textPrimary: isDark ? '#FFFFFF' : '#0F172A',
    textSecondary: isDark ? 'rgba(255, 255, 255, 0.65)' : '#64748B',
    textMuted: isDark ? 'rgba(255, 255, 255, 0.4)' : '#94A3B8',
    divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
  };

  return (
    <View style={styles.container}>
      {/* Main card */}
      <View style={[styles.card, { 
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }]}>
        {/* Date */}
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.dateText, { color: colors.textMuted }]}>
            {formatDate()}
          </Text>
        </View>

        {/* Emoji */}
        <Text style={styles.emoji}>{content.emoji}</Text>

        {/* Title */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {content.title}
        </Text>
        
        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {content.subtitle}
        </Text>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        {/* Quote */}
        <Text style={[styles.quote, { color: colors.textSecondary }]}>
          "{content.quote}"
        </Text>
        {content.author && (
          <Text style={[styles.author, { color: colors.textMuted }]}>
            {content.author}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 0.5,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
  divider: {
    width: 40,
    height: 2,
    borderRadius: 1,
    marginBottom: 24,
  },
  quote: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    paddingHorizontal: 8,
  },
  author: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default NoClassesHero;
