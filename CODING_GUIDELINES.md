# MRCE Attend-Me - Development Guidelines

## 📁 Directory Structure

```
src/
├── components/          # Shared, reusable components
│   ├── ui/              # Basic UI primitives (Button, Input, Toast)
│   └── [Component].tsx
├── config/              # App configuration
├── constants/           # Design tokens, Theme, Colors
│   ├── Theme.ts         # ⭐ Master theme file
│   └── Colors.ts        # Color exports
├── contexts/            # React Context providers
├── hooks/               # Global hooks
│   ├── useColors.ts     # ⭐ Theme-aware colors hook
│   └── index.ts
├── navigation/          # Navigation setup
├── screens/             # Feature-based screen folders
│   └── [feature]/
│       ├── index.ts           # Barrel export
│       ├── [Screen].tsx       # Main screen component
│       ├── components/        # Feature-specific components
│       │   ├── index.ts
│       │   └── [Component].tsx
│       └── hooks/             # Feature-specific hooks (optional)
├── services/            # API, BLE, external services
├── store/               # State management (if needed)
├── styles/              # Shared style utilities
└── types/               # TypeScript types
```

---

## 🎨 Theme & Colors

### Always Use `useColors()` Hook

```tsx
// ✅ GOOD - Uses global theme
import { useColors } from "../../hooks";

const MyComponent = () => {
  const colors = useColors();
  return <View style={{ backgroundColor: colors.background }} />;
};

// ❌ BAD - Inline color definition
const colors = {
  background: isDark ? "#0A0A0A" : "#F8FAFC",
  // ... 20 more lines
};
```

### Available Hooks

| Hook                | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `useColors()`       | Theme-aware colors (background, text, borders)   |
| `useGradients()`    | LinearGradient color arrays                      |
| `useStatusColors()` | Attendance status colors (present, absent, etc.) |

---

## 📏 File Size Guidelines

| Target       | Max Lines | Action                         |
| ------------ | --------- | ------------------------------ |
| Screen files | 400       | Extract components if larger   |
| Components   | 200       | Split into sub-components      |
| Hooks        | 150       | Single responsibility          |
| Styles       | 200       | Use shared styles if repeating |

---

## 🏗 Component Structure

```tsx
/**
 * ComponentName - Brief description
 * Purpose and usage notes
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { useColors } from "../../hooks";

interface ComponentNameProps {
  // Props interface
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2,
}) => {
  const colors = useColors();

  // Logic

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* JSX */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Static styles only (no colors)
  },
});

export default ComponentName;
```

---

## 📦 Barrel Exports

Every folder should have an `index.ts`:

```typescript
// screens/dashboard/components/index.ts
export { SessionCard } from "./SessionCard";
export { FilterBar } from "./FilterBar";
export { DateStrip } from "./DateStrip";
```

---

## 🎛 Shared Styles

Import from `src/styles` for common patterns:

```tsx
import { CardStyles, ButtonStyles, ChipStyles } from "../../styles";

// Use in StyleSheet
const styles = StyleSheet.create({
  ...CardStyles.card,
  myCard: {
    ...CardStyles.glassCard,
    marginBottom: 20,
  },
});
```

### Available Style Sets

| Style Set      | Contains                                   |
| -------------- | ------------------------------------------ |
| `CommonStyles` | container, centered, row, rowBetween       |
| `CardStyles`   | card, cardBordered, glassCard              |
| `ButtonStyles` | primary, secondary, iconButton, textButton |
| `ChipStyles`   | chip, chipRow                              |
| `HeaderStyles` | header, headerWithBack, backButton         |
| `ModalStyles`  | overlay, bottomSheet, centerModal          |
| `ListStyles`   | item, itemBordered                         |
| `AvatarStyles` | small, medium, large                       |

---

## 🚫 Avoid

1. **Inline color objects** - Use `useColors()` hook
2. **Files > 500 lines** - Split into smaller pieces
3. **Magic numbers** - Use `Theme.ts` tokens (Spacing, Radius)
4. **Duplicate styles** - Extract to shared components
5. **Deep import paths** - Use barrel exports

---

## ✅ Best Practices

1. **One component = One file** (for reusable components)
2. **Feature folders** contain related screens/components
3. **Hooks prefix**: `use[Name]` (e.g., `useColors`, `useAttendance`)
4. **Theme-aware components** via `useColors()` hook
5. **TypeScript interfaces** for all props
