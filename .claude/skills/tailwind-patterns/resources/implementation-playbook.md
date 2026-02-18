# Tailwind CSS v4 Implementation Playbook

Detailed patterns and best practices for Tailwind CSS v4.

## Project Context (Europa)

> [!NOTE]
> This project uses **Tailwind CSS v4** with CSS-native configuration. Avoid legacy `tailwind.config.js` patterns.

## Patterns

### 1. Theme Configuration
Use `@theme` in your CSS entry point:
```css
@theme {
  --color-brand: oklch(0.6 0.2 250);
}
```

### 2. Container Queries
Use `@container` and `@md:` etc. for component-level responsiveness.

## Best Practices
- Use semantic tokens (primary, surface) instead of raw color utilities.
- Leverage the Oxide engine's performance by avoiding complex runtime class generation.
