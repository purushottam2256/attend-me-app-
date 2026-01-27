/**
 * Button Component
 * Primary button with haptic feedback, loading state, and variants
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, Layout } from '../../constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    style,
    textStyle,
}) => {
    const handlePress = async () => {
        if (disabled || loading) return;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    const buttonStyles = [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`text_${variant}`],
        styles[`text_${size}`],
        textStyle,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={handlePress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? Colors.neutral.white : Colors.primary.main}
                    size="small"
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && icon}
                    <Text style={textStyles}>{title}</Text>
                    {icon && iconPosition === 'right' && icon}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Layout.radius.md,
        gap: Layout.spacing.sm,
    },

    // Variants
    primary: {
        backgroundColor: Colors.primary.main,
    },
    secondary: {
        backgroundColor: Colors.primary.lightest,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.primary.main,
    },
    ghost: {
        backgroundColor: 'transparent',
    },

    // Sizes
    size_sm: {
        height: 36,
        paddingHorizontal: Layout.spacing.md,
    },
    size_md: {
        height: Layout.button.height,
        paddingHorizontal: Layout.button.paddingHorizontal,
    },
    size_lg: {
        height: 56,
        paddingHorizontal: Layout.spacing['2xl'],
    },

    // States
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },

    // Text base
    text: {
        fontFamily: Fonts.family.semiBold,
    },

    // Text variants
    text_primary: {
        color: Colors.neutral.white,
    },
    text_secondary: {
        color: Colors.primary.main,
    },
    text_outline: {
        color: Colors.primary.main,
    },
    text_ghost: {
        color: Colors.primary.main,
    },

    // Text sizes
    text_sm: {
        fontSize: Fonts.size.sm,
    },
    text_md: {
        fontSize: Fonts.size.md,
    },
    text_lg: {
        fontSize: Fonts.size.lg,
    },
});

export default Button;
