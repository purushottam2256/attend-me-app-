/**
 * HistoryScreen Styles
 * Feature-based styles for the History screen
 */

import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale, normalizeFont } from '../../../utils/responsive';

// Constant values
export const DATE_TILE_WIDTH = scale(56);

export const historyStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: verticalScale(8),
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
  calendarBtn: {
    width: scale(44),
    height: scale(44),
    borderRadius: moderateScale(14),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: scale(8),
  },
  dateStripContainer: {
    paddingVertical: verticalScale(12),
  },
  dateStripContent: {
    paddingHorizontal: scale(16),
    gap: scale(10),
  },
  dateTile: {
    width: DATE_TILE_WIDTH,
    height: verticalScale(72),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  dayText: {
    fontSize: normalizeFont(11),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: verticalScale(4),
  },
  dateText: {
    fontSize: normalizeFont(20),
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    bottom: verticalScale(8),
    width: scale(6),
    height: scale(6),
    borderRadius: moderateScale(3),
  },
  todayDot: {
    position: 'absolute',
    bottom: verticalScale(8),
    width: scale(4),
    height: scale(4),
    borderRadius: moderateScale(2),
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(16),
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(60),
  },
  loadingText: {
    fontSize: normalizeFont(14),
    fontWeight: '500',
    marginTop: verticalScale(12),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(60),
  },
  emptyEmoji: {
    fontSize: normalizeFont(48),
    marginBottom: verticalScale(16),
  },
  emptyTitle: {
    fontSize: normalizeFont(20),
    fontWeight: '700',
    marginBottom: verticalScale(6),
  },
  emptySubtitle: {
    fontSize: normalizeFont(14),
    fontWeight: '500',
    textAlign: 'center',
  },
  noClassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginTop: verticalScale(16),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
  },
  noClassBadgeText: {
    fontSize: normalizeFont(12),
    fontWeight: '600',
  },
  sessionCard: {
    borderRadius: moderateScale(16),
    borderWidth: 0.5,
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    overflow: 'hidden',
  },
  healthStrip: {
    width: scale(4),
  },
  cardContent: {
    flex: 1,
    padding: scale(16),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(12),
  },
  subjectInfo: {
    flex: 1,
  },
  subject: {
    fontSize: normalizeFont(16),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  meta: {
    fontSize: normalizeFont(13),
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: scale(8),
  },
  statBox: {
    flex: 1,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  statValue: {
    fontSize: normalizeFont(18),
    fontWeight: '700',
  },
  statLabel: {
    fontSize: normalizeFont(11),
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  expandPanel: {
    paddingTop: verticalScale(16),
  },
  percentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  percentLabel: {
    fontSize: normalizeFont(13),
    fontWeight: '500',
  },
  percentValue: {
    fontSize: normalizeFont(18),
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: scale(8),
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(14),
    borderRadius: moderateScale(10),
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: normalizeFont(13),
    fontWeight: '600',
  },
  expandIndicator: {
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  dock: {
    position: 'absolute',
    left: '25%',
    right: '25%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(32),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
    borderRadius: moderateScale(20),
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(12),
    elevation: 8,
  },
  dockItem: {
    padding: scale(8),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(24),
  },
  modal: {
    width: '100%',
    maxWidth: scale(340),
    borderRadius: moderateScale(24),
    padding: scale(24),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  modalTitle: {
    fontSize: normalizeFont(20),
    fontWeight: '700',
  },
  yearRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(24),
    marginBottom: verticalScale(20),
  },
  yearText: {
    fontSize: normalizeFont(22),
    fontWeight: '700',
    minWidth: scale(60),
    textAlign: 'center',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
    marginBottom: verticalScale(24),
  },
  monthTile: {
    width: '30%',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  monthText: {
    fontSize: normalizeFont(14),
    fontWeight: '600',
  },
  confirmBtn: {
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(14),
    alignItems: 'center',
  },
  confirmText: {
    fontSize: normalizeFont(15),
    fontWeight: '700',
    color: '#000',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
  },
  filterGroup: {
    flex: 1,
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: normalizeFont(11),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: verticalScale(8),
  },
  filterChips: {
    flexDirection: 'row',
    gap: scale(6),
  },
  filterChipPremium: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    minWidth: scale(32),
    alignItems: 'center',
  },
  filterDivider: {
    width: scale(1),
    height: verticalScale(40),
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: scale(12),
  },
  filterContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    gap: scale(8),
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  filterLabel: {
    fontSize: normalizeFont(12),
    fontWeight: '600',
    width: scale(55),
  },
  filterChip: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(12),
  },
  simpleFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    gap: scale(8),
  },
  simpleFilterLabel: {
    fontSize: normalizeFont(11),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  simpleFilterChips: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: scale(6),
    flex: 1,
  },
  simpleChip: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(8),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  filterSep: {
    width: scale(1),
    height: verticalScale(16),
    marginHorizontal: scale(4),
  },
  parallelFilter: {
    flexDirection: 'row',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    gap: scale(16),
  },
  filterHalf: {
    flex: 1,
    alignItems: 'center',
  },
  filterHalfLabel: {
    fontSize: normalizeFont(10),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: verticalScale(6),
  },
  filterHalfChips: {
    flexDirection: 'row',
    gap: scale(4),
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  filterPill: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
    backgroundColor: 'rgba(255,255,255,0.08)',
    minWidth: scale(26),
    alignItems: 'center',
  },
  filterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    marginHorizontal: scale(12),
    marginTop: verticalScale(8),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  filterBoxLabel: {
    fontSize: normalizeFont(11),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: scale(10),
    minWidth: scale(50),
  },
  filterBoxChips: {
    flexDirection: 'row',
    gap: scale(6),
    paddingRight: scale(12),
  },
  filterBoxChip: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    minWidth: scale(36),
    alignItems: 'center',
  },
  // New styles from inline refactoring
  headerBackButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: moderateScale(14),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    marginLeft: scale(12),
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  percentageBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(8),
    marginLeft: scale(8),
  },
  percentageText: {
    fontSize: normalizeFont(14),
    fontWeight: '700',
  },
  substitutionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  substitutionText: {
    fontSize: normalizeFont(11),
    marginLeft: scale(4),
  },
  labBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  labText: {
    fontSize: normalizeFont(11),
    marginLeft: scale(4),
    fontWeight: '600',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    gap: scale(8),
  },
  pendingText: {
    marginLeft: scale(4),
    fontSize: normalizeFont(10),
    fontWeight: '700',
  },
  deletePendingBtn: {
    padding: scale(2),
  },
});

export default historyStyles;
