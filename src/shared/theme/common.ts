/**
 * Shared Styles - Common style patterns used across screens
 * 
 * Use these to reduce duplication and maintain consistency
 */

import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// =============================================================================
// COMMON LAYOUT STYLES
// =============================================================================

export const CommonStyles = StyleSheet.create({
  // Full screen container
  container: {
    flex: 1,
  },
  
  // Centered content
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Row layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Row with space between
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Full width
  fullWidth: {
    width: '100%',
  },
});

// =============================================================================
// CARD STYLES
// =============================================================================

export const CardStyles = StyleSheet.create({
  // Basic card
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  
  // Card with border
  cardBordered: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  
  // Glass card (for dark backgrounds)
  glassCard: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});

// =============================================================================
// BUTTON STYLES
// =============================================================================

export const ButtonStyles = StyleSheet.create({
  // Primary button
  primary: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  
  // Secondary button
  secondary: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  
  // Icon button
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Text button
  textButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

// =============================================================================
// FILTER CHIP STYLES
// =============================================================================

export const ChipStyles = StyleSheet.create({
  // Basic filter chip
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 36,
    alignItems: 'center',
  },
  
  // Chip container row
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

// =============================================================================
// HEADER STYLES
// =============================================================================

export const HeaderStyles = StyleSheet.create({
  // Standard header container
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  // Header with back button
  headerWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  
  // Back button
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// =============================================================================
// MODAL STYLES
// =============================================================================

export const ModalStyles = StyleSheet.create({
  // Overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Bottom sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  
  // Center modal
  centerModal: {
    width: SCREEN_WIDTH - 48,
    maxHeight: SCREEN_HEIGHT * 0.8,
    borderRadius: 24,
    padding: 24,
  },
});

// =============================================================================
// LIST ITEM STYLES
// =============================================================================

export const ListStyles = StyleSheet.create({
  // List item
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  
  // List item with border
  itemBordered: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
});

// =============================================================================
// AVATAR STYLES
// =============================================================================

export const AvatarStyles = StyleSheet.create({
  small: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medium: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Export dimensions
export const Dimensions_ = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallScreen: SCREEN_WIDTH < 375,
};
