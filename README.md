# QuickAssistant

A production-ready React Native application built with Expo, TypeScript, Redux Toolkit, and RTK Query.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run ios
npm run android
```

## Project Structure

```
src/
├── api/           # RTK Query API definitions
├── components/    # Reusable UI components
├── config/        # App configuration & constants
├── hooks/         # Custom React hooks
├── navigation/    # React Navigation setup
├── screens/       # Screen components
├── services/      # Storage, analytics services
├── state/         # Redux store, slices, selectors
├── theme/         # Colors, typography, spacing
├── types/         # TypeScript definitions
└── utils/         # Helper functions
```

## Adding New Features

### Adding a New Screen

1. Create the screen file in `src/screens/[Category]/`:

```tsx
// src/screens/Settings/SettingsScreen.tsx
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@theme';
import { Typography } from '@components/common';

const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Typography variant="h2">Settings</Typography>
    </SafeAreaView>
  );
};

export default SettingsScreen;
```

2. Add navigation type in `src/types/navigation.types.ts`:

```tsx
export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined; // Add new screen
};
```

3. Register in navigator (`src/navigation/MainNavigator.tsx`):

```tsx
import SettingsScreen from '@screens/Settings/SettingsScreen';

<Tab.Screen name="Settings" component={SettingsScreen} />;
```

### Adding a New API Endpoint

1. Add types in `src/types/api.types.ts`:

```tsx
export interface Product {
  id: string;
  name: string;
  price: number;
}
```

2. Create or extend an API file in `src/api/`:

```tsx
// src/api/productApi.ts
import { baseApi } from './baseApi';
import type { Product } from '@app-types/api.types';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const { useGetProductsQuery, useCreateProductMutation } = productApi;
```

3. Add tag type in `src/api/baseApi.ts`:

```tsx
tagTypes: ['User', 'Auth', 'Product'],
```

4. Use in a component:

```tsx
import { useGetProductsQuery } from '@api/productApi';

const { data: products, isLoading, error } = useGetProductsQuery();
```

### Adding a New Redux Slice

1. Create slice in `src/state/slices/`:

```tsx
// src/state/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

2. Add to store in `src/state/store.ts`:

```tsx
import cartReducer from './slices/cartSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  cart: cartReducer, // Add here
  [baseApi.reducerPath]: baseApi.reducer,
});
```

3. Create selectors in `src/state/selectors/cartSelectors.ts`:

```tsx
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector(selectCartState, (cart) => cart.items);

export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);
```

### Adding a New Component

Create in `src/components/common/` or `src/components/[category]/`:

```tsx
// src/components/common/Badge.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Theme } from '@theme';
import { Typography } from './Typography';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'info' }) => {
  const { theme } = useTheme();
  const backgroundColor = theme.colors[variant];

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Typography variant="caption" style={{ color: '#fff' }}>
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
```

Export from `src/components/common/index.ts`:

```tsx
export { Badge } from './Badge';
```

### Adding a Custom Hook

```tsx
// src/hooks/useAuth.ts
import { useAppSelector, useAppDispatch } from '@state';
import { selectUser, selectIsAuthenticated } from '@state/selectors/authSelectors';
import { logout } from '@state/slices/authSlice';
import { useLogoutMutation } from '@api/authApi';
import { storageService } from '@services/storage';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [logoutApi] = useLogoutMutation();

  const signOut = async () => {
    await logoutApi();
    await storageService.clearAuthData();
    dispatch(logout());
  };

  return { user, isAuthenticated, signOut };
};
```

## Path Aliases

Use these imports instead of relative paths:

| Alias           | Path               |
| --------------- | ------------------ |
| `@api`          | `src/api`          |
| `@components/*` | `src/components/*` |
| `@config`       | `src/config`       |
| `@hooks`        | `src/hooks`        |
| `@navigation`   | `src/navigation`   |
| `@screens/*`    | `src/screens/*`    |
| `@services/*`   | `src/services/*`   |
| `@state`        | `src/state`        |
| `@theme`        | `src/theme`        |
| `@app-types`    | `src/types`        |
| `@utils`        | `src/utils`        |

## Available Scripts

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run type-check # TypeScript validation
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run format     # Format with Prettier
```

## Theme Usage

Access theme in any component:

```tsx
import { useTheme } from '@theme';

const MyComponent = () => {
  const { theme, toggleTheme, themeMode } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={theme.typography.h1}>Hello</Text>
    </View>
  );
};
```

Available theme properties:

- `theme.colors` - Color palette (adapts to light/dark)
- `theme.spacing` - Spacing scale (xs, sm, md, lg, xl)
- `theme.typography` - Text styles (h1, h2, body, caption, etc.)
- `theme.borderRadius` - Border radius values
- `theme.shadows` - Shadow/elevation styles
