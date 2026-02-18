# React Patterns Implementation Playbook

Detailed patterns and best practices for React 19 development.

## Project Context (Europa)

> [!IMPORTANT]
> **Zustand Usage**:
> - To avoid SSR hydration mismatches, use the hydration guard pattern below when accessing persisted stores in Client Components:
> 
> ```typescript
> const store = useStore() // Always call hook at top level
> const [isHydrated, setIsHydrated] = useState(false)
> 
> useEffect(() => setIsHydrated(true), [])
> 
> if (!isHydrated) {
>   return <Skeleton className="h-10 w-full" /> // Avoid CLS with skeleton
> }
> ```

## Patterns

### 1. Modern Hooks (React 19)
- Use `useActionState` for form handling.
- Use `useOptimistic` for immediate UI feedback.

### 2. Composition
- Prefer Compound Components for complex UI widgets (Tabs, Accordions).

## Best Practices
- Keep components small and focused.
- Colocate state as close to its usage as possible.
