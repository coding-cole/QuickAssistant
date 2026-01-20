# React Native Application Setup Prompt

Use this prompt with Claude Code to set up a production-ready React Native application with best practices, proper architecture, and separation of concerns.

---

## The Prompt

```
Please set up a complete React Native application with the following structure and best practices:

## Project Structure
Create a well-organized folder structure:

```

src/
├── api/ # API calls and services
│ ├── client.ts # API client configuration (axios/fetch)
│ ├── endpoints.ts # API endpoint constants
│ └── services/ # Service modules (auth, user, etc.)
├── assets/ # Static assets
│ ├── images/
│ ├── fonts/
│ └── animations/ # Lottie files, etc.
├── components/ # Reusable components
│ ├── common/ # Common UI components (Button, Input, Card)
│ ├── forms/ # Form-specific components
│ └── layouts/ # Layout components
├── config/ # App configuration
│ ├── constants.ts # App constants
│ └── env.ts # Environment variables
├── hooks/ # Custom React hooks
├── navigation/ # Navigation configuration
│ ├── AppNavigator.tsx
│ ├── AuthNavigator.tsx
│ └── types.ts
├── screens/ # Screen components
│ ├── Auth/
│ ├── Home/
│ └── Profile/
├── services/ # Business logic services
│ ├── storage/ # AsyncStorage utilities
│ ├── notifications/ # Push notification services
│ └── analytics/ # Analytics services
├── state/ # State management (Redux)
│ ├── store.ts # Redux store configuration
│ ├── slices/ # Redux Toolkit slices
│ └── selectors/ # Reselect selectors
├── theme/ # Theme configuration
│ ├── colors.ts # Color palette
│ ├── spacing.ts # Spacing constants
│ ├── typography.ts # Typography styles
│ ├── shadows.ts # Shadow styles
│ └── index.ts # Theme export
├── types/ # TypeScript types and interfaces
│ ├── api.types.ts
│ ├── navigation.types.ts
│ └── models/
├── utils/ # Utility functions
│ ├── validation.ts
│ ├── formatters.ts
│ └── helpers.ts
└── App.tsx # Root component

```

## Theme System
Set up a comprehensive theme system in `src/theme/`:

**colors.ts:**
- Define primary, secondary, accent colors
- Text colors (primary, secondary, disabled)
- Background colors
- Status colors (success, error, warning, info)
- Border colors
- Support light and dark mode

**spacing.ts:**
- Define consistent spacing scale (xs, sm, md, lg, xl, xxl)
- Padding and margin constants
- Border radius constants

**typography.ts:**
- Font families
- Font sizes scale
- Font weights
- Line heights
- Text styles (heading1, heading2, body, caption, etc.)

**shadows.ts:**
- Define elevation/shadow styles for different levels
- Platform-specific shadow configurations

## Configuration Files

**Package.json dependencies to include:**
- React Navigation (@react-navigation/native, @react-navigation/stack, @react-navigation/bottom-tabs)
- State management (Redux Toolkit + React Redux)
- Form handling (React Hook Form + Yup for validation)
- API client (Axios)
- Storage (@react-native-async-storage/async-storage)
- UI libraries (react-native-reanimated, react-native-gesture-handler)
- Vector icons (@expo/vector-icons or react-native-vector-icons)
- Date handling (date-fns)
- Environment variables (@react-native-dotenv or react-native-config)

**TypeScript configuration:**
- Strict mode enabled
- Path aliases configured (@components, @screens, @theme, etc.)
- Include proper type definitions

**ESLint and Prettier:**
- Set up ESLint with React Native config
- Configure Prettier for consistent formatting
- Add pre-commit hooks with Husky

## Best Practices to Implement

1. **Component Structure:**
   - Use functional components with hooks
   - Implement proper prop typing with TypeScript
   - Create atomic design components (atoms, molecules, organisms)
   - Use memo for expensive components

2. **Code Organization:**
   - One component per file
   - Co-locate tests with components (ComponentName.test.tsx)
   - Export from index files for cleaner imports

3. **State Management:**
   - Use Redux Toolkit with slices
   - Implement proper action creators and reducers
   - Use selectors (Reselect) for derived state
   - Keep local state in components when appropriate
   - Use Redux Thunk or RTK Query for async operations

4. **Styling:**
   - Use StyleSheet.create for all styles
   - Never use inline styles
   - Create reusable style utilities
   - Use theme constants for all colors, spacing, fonts

5. **Performance:**
   - Implement FlatList/SectionList for long lists
   - Use React.memo, useMemo, useCallback appropriately
   - Lazy load heavy components
   - Optimize images (use proper dimensions, formats)

6. **Error Handling:**
   - Implement error boundaries
   - Add try-catch blocks for async operations
   - Create user-friendly error messages
   - Log errors to analytics/crash reporting

7. **Navigation:**
   - Type-safe navigation with TypeScript
   - Implement deep linking
   - Handle back button behavior
   - Add navigation guards for auth routes

8. **API Integration:**
   - Create service layer for API calls
   - Implement request/response interceptors
   - Add loading and error states
   - Cache responses when appropriate

9. **Testing:**
   - Set up Jest and React Native Testing Library
   - Create test utilities and mocks
   - Add example tests for components and hooks

10. **Accessibility:**
    - Add accessibility labels
    - Implement proper touch targets (44x44pt minimum)
    - Support screen readers
    - Test with accessibility tools

## Example Component Template
Create an example component that demonstrates:
- Proper TypeScript typing
- Theme usage
- Component composition
- Responsive design
- Accessibility

## Environment Setup
- Create .env.example file
- Set up environment configurations for dev, staging, production
- Document all environment variables

## Scripts to Add (package.json)
- Start metro bundler
- Run on iOS/Android
- Type checking
- Linting
- Testing
- Build for production

Please create all necessary files with proper TypeScript types, implement the folder structure, and provide clear examples of how to use each part of the architecture. Include detailed comments explaining the patterns and best practices used.
```

---

## How to Use This Prompt

1. **Navigate to your project directory:**

   ```bash
   cd ~/your-project-name
   ```

2. **Start Claude Code:**

   ```bash
   claude
   ```

3. **Paste the prompt above** and Claude Code will:
   - Create the entire folder structure
   - Set up all configuration files
   - Generate example components
   - Configure TypeScript, ESLint, Prettier
   - Create theme files with all constants
   - Set up navigation and state management
   - Add helpful documentation

4. **Review and customize** the generated files based on your specific needs

---

## Additional Tips

- **After setup**, ask Claude Code to explain any part of the architecture
- **Request variations** like "use Context API instead of Redux" or "add Firebase integration"
- **Ask for specific features** like "add authentication flow" or "create a custom button component"
- **Get help with testing** by asking "write tests for the Login screen"

---

## Follow-up Prompts You Might Need

After the initial setup, you can ask:

```
"Add a login screen with email/password validation using React Hook Form"
```

```
"Create a custom Button component with different variants (primary, secondary, outlined) using the theme system"
```

```
"Set up React Navigation with authentication flow - show auth screens when logged out, main app when logged in"
```

```
"Add a user profile screen that fetches data from an API and displays it with proper loading and error states"
```

```
"Create a bottom tab navigator with Home, Search, and Profile tabs, each with proper icons from the theme"
```
