/**
 * Layout & Spacing Constants
 */

import { scale, verticalScale, moderateScale } from '../utils/responsive';

export const Layout = {
    // Screen padding
    screenPadding: scale(16),
    screenPaddingLarge: scale(24),

    // Border radius
    radius: {
        xs: moderateScale(4),
        sm: moderateScale(8),
        md: moderateScale(12),
        lg: moderateScale(16),
        xl: moderateScale(24),
        full: 9999,
    },

    // Spacing scale (4px base)
    spacing: {
        xs: scale(4),
        sm: scale(8),
        md: scale(12),
        lg: scale(16),
        xl: scale(24),
        '2xl': scale(32),
        '3xl': scale(48),
        '4xl': scale(64),
    },

    // Component sizes
    button: {
        height: verticalScale(48),
        paddingHorizontal: scale(24),
    },

    input: {
        height: verticalScale(52),
        paddingHorizontal: scale(16),
    },

    card: {
        padding: scale(16),
        shadow: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: verticalScale(2) },
            shadowOpacity: 0.08,
            shadowRadius: moderateScale(8),
            elevation: 3,
        },
    },

    // Dock navigation
    dock: {
        height: verticalScale(72),
        iconSize: moderateScale(24),
        activeScale: 1.15,
    },

    // Header
    header: {
        height: verticalScale(56),
    },
};

export default Layout;
