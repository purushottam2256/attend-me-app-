/**
 * Card Component
 * Glass card with frosted blur effect
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Layout } from '../../constants';
import { moderateScale } from '../../utils/responsive';

type CardVariant = 'default' | 'glass' | 'elevated';

interface CardProps {
    children: React.ReactNode;
    variant?: CardVariant;
    style?: ViewStyle;
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    style,
    noPadding = false,
}) => {
    if (variant === 'glass') {
        return (
            <BlurView intensity={80} tint="light" style={[styles.glass, style]}>
                <View style={[styles.glassContent, !noPadding && styles.padding]}>
                    {children}
                </View>
            </BlurView>
        );
    }

    return (
        <View
            style={[
                styles.base,
                variant === 'elevated' && styles.elevated,
                !noPadding && styles.padding,
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: Colors.neutral.card,
        borderRadius: Layout.radius.lg,
        ...Layout.card.shadow,
    },

    elevated: {
        shadowOpacity: 0.12,
        shadowRadius: moderateScale(12),
        elevation: 5,
    },

    glass: {
        borderRadius: Layout.radius.lg,
        overflow: 'hidden',
        backgroundColor: Colors.glass.white,
    },

    glassContent: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },

    padding: {
        padding: Layout.card.padding,
    },
});

export default Card;
