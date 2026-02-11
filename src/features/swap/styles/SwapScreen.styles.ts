/**
 * SwapScreen Styles
 * Premium Zen UI matching HomeScreen design
 */

import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale, normalizeFont } from '../../../utils/responsive';

export const swapStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: verticalScale(16),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(8),
  },
  pageTitle: {
    fontSize: normalizeFont(28),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: normalizeFont(14),
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginTop: verticalScale(2),
  },
  backBtn: {
    width: scale(44),
    height: scale(44),
    borderRadius: moderateScale(14),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Mode Tabs
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: scale(20),
    marginTop: verticalScale(8),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: moderateScale(14),
    padding: scale(4),
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  activeTabText: {
    color: '#0D4A4A',
  },
  
  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(16),
    paddingBottom: verticalScale(100),
  },
  
  // Section
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: normalizeFont(13),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(4),
  },
  
  // Class Card
  classCard: {
    flexDirection: 'row',
    borderRadius: moderateScale(16),
    borderWidth: 0.5,
    marginBottom: verticalScale(10),
    overflow: 'hidden',
  },
  classStrip: {
    width: scale(4),
  },
  classContent: {
    flex: 1,
    padding: scale(14),
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: normalizeFont(16),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  classMeta: {
    fontSize: normalizeFont(13),
    fontWeight: '500',
  },
  classTime: {
    fontSize: normalizeFont(13),
    fontWeight: '600',
  },
  classCheck: {
    width: scale(28),
    height: scale(28),
    borderRadius: moderateScale(14),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Search
  searchContainer: {
    marginBottom: verticalScale(16),
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(14),
    borderWidth: 1,
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    gap: scale(10),
  },
  searchInput: {
    flex: 1,
    fontSize: normalizeFont(15),
    fontWeight: '500',
  },
  
  // Faculty List
  facultyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(14),
    borderRadius: moderateScale(14),
    borderWidth: 0.5,
    marginBottom: verticalScale(8),
    gap: scale(12),
  },
  facultyAvatar: {
    width: scale(44),
    height: scale(44),
    borderRadius: moderateScale(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  facultyInitial: {
    fontSize: normalizeFont(18),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  facultyInfo: {
    flex: 1,
  },
  facultyName: {
    fontSize: normalizeFont(15),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  facultyDept: {
    fontSize: normalizeFont(13),
    fontWeight: '500',
  },
  facultyCheck: {
    width: scale(24),
    height: scale(24),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Action Button
  actionBtn: {
    marginHorizontal: scale(16),
    marginVertical: verticalScale(20),
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(8),
  },
  actionBtnText: {
    fontSize: normalizeFont(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  
  // Pending Requests
  requestCard: {
    borderRadius: moderateScale(16),
    borderWidth: 0.5,
    padding: scale(16),
    marginBottom: verticalScale(12),
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(12),
  },
  requestBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
  },
  requestBadgeText: {
    fontSize: normalizeFont(11),
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  requestTitle: {
    fontSize: normalizeFont(16),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  requestMeta: {
    fontSize: normalizeFont(13),
    fontWeight: '500',
    marginBottom: verticalScale(2),
  },
  requestActions: {
    flexDirection: 'row',
    gap: scale(10),
    marginTop: verticalScale(12),
  },
  requestBtn: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  requestBtnText: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(60),
  },
  emptyEmoji: {
    fontSize: normalizeFont(48),
    marginBottom: verticalScale(16),
  },
  emptyTitle: {
    fontSize: normalizeFont(18),
    fontWeight: '700',
    marginBottom: verticalScale(6),
  },
  emptySubtitle: {
    fontSize: normalizeFont(14),
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: scale(40),
  },
  
  // Loading
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(40),
  },
  loadingText: {
    fontSize: normalizeFont(14),
    fontWeight: '500',
    marginTop: verticalScale(12),
  },
});

export default swapStyles;
