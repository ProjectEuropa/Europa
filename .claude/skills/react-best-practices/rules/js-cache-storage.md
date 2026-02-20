---
title: Cache Storage API Calls
impact: LOW-MEDIUM
impactDescription: reduces expensive I/O
tags: javascript, localStorage, storage, caching, performance
---

## Cache Storage API Calls

> 💡 **NOTE**: このルールの内容は `AGENTS.md` の「7.5 Cache Storage API Calls」と同期しています。修正の際は両方のファイルを更新して乖離を防いでください。

`localStorage`, `sessionStorage`, and `document.cookie` are synchronous and expensive. Cache reads in memory.

**Incorrect (reads storage on every call):**

```typescript
function getTheme() {
  return localStorage.getItem('theme') ?? 'light'
}
// Called 10 times = 10 storage reads
```

**Correct (Map cache):**

```typescript
const storageCache = new Map<string, string | null>()

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key))
  }
  return storageCache.get(key)
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
  storageCache.set(key, value)  // keep cache in sync
}
```

Use a Map (not a hook) so it works everywhere: utilities, event handlers, not just React components.

**Cookie caching:**

> ⚠️ **注意**: `document.cookie` は `HttpOnly` フラグ付き Cookie には**アクセス不可**です。
> 認証トークンの取得には `fetch` の `credentials: 'include'` を使用してください。
>
> ⚠️ **SSR 注意**: 以下の関数はクライアントサイド専用です。必要に応じて `document` のガード句を追加しています。

```typescript
let cookieCache: Record<string, string> | null = null

function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined
  if (!cookieCache) {
    cookieCache = Object.fromEntries(
      document.cookie.split('; ').map(c => {
        const idx = c.indexOf('=')
        if (idx === -1) return [c, '']
        
        const rawName = c.slice(0, idx)
        const rawValue = c.slice(idx + 1)
        
        let decodedName = rawName
        let decodedValue = rawValue
        
        try { decodedName = decodeURIComponent(rawName) } catch { /* keep raw */ }
        try { decodedValue = decodeURIComponent(rawValue) } catch { /* keep raw */ }
        
        return [decodedName, decodedValue]
      })
    )
  }
  return cookieCache[name]
}

function setCookie(name: string, value: string, options = '') {
  if (typeof document === 'undefined') return
  // Normalize options to ensure it starts with '; ' if provided
  const opts = options && !options.startsWith(';') ? `; ${options}` : options
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${opts}`
  cookieCache = null  // keep cache in sync
}
```

**Important (invalidate on external changes):**

If storage can change externally (another tab, server-set cookies), invalidate cache:

```typescript
window.addEventListener('storage', (e) => {
  if (e.key) storageCache.delete(e.key)
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    storageCache.clear()
    cookieCache = null
  }
})
```
