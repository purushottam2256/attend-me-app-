/**
 * Layout & Spacing Constants
 */

export const Layout = {
    // Screen padding
    screenPadding: 16,
    screenPaddingLarge: 24,

    // Border radius
    radius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
    },

    // Spacing scale (4px base)
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        '2xl': 32,
        '3xl': 48,
        '4xl': 64,
    },

    // Component sizes
    button: {
        height: 48,
        paddingHorizontal: 24,
    },

    input: {
        height: 52,
        paddingHorizontal: 16,
    },

    card: {
        padding: 16,
        shadow: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
        },
    },

    // Dock navigation
    dock: {
        height: 72,
        iconSize: 24,
        activeScale: 1.15,
    },

    // Header
    header: {
        height: 56,
    },
};

export default Layout;
