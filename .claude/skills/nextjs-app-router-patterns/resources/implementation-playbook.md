# Next.js App Router Patterns Implementation Playbook

This file contains detailed patterns, checklists, and code samples referenced by the skill.

## Project Context (Europa)

> [!IMPORTANT]
> **Backend Service**: This project uses **Hono v4 + Cloudflare Workers** for backend services (refer to `CLAUDE.md` API Design Rules).
> **Route Handlers**: Next.js Route Handlers (`app/api/...`) should generally be avoided unless specifically required for Next.js internal features. Always prioritize `/api/v2/` endpoints hosted on the Hono backend.

> [!WARNING]
> **Static Export**: This project uses `output: 'export'` in `next.config.ts`.
> The following patterns are **incompatible** and will break the build:
> - Pattern 3 (Server Actions): `addToCart`, `checkout` functions
> - Pattern 1/Caching: `next: { revalidate }`, `next: { tags }`
> - Pattern 6 (Streaming): Suspense with async Server Components
>
> Use TanStack Query for client-side data fetching with skeleton loading instead.

## When to Use This Skill

- Building new Next.js applications with App Router
- Migrating from Pages Router to App Router
- Implementing Server Components and streaming
- Setting up parallel and intercepting routes
- Optimizing data fetching and caching
- Building full-stack features with Server Actions (only when using App Router with static export / Europa constraint)

## Core Concepts

### 1. Rendering Modes

| Mode | Where | When to Use |
|------|-------|-------------|
| **Server Components** | Server only | Data fetching, heavy computation, secrets |
| **Client Components** | Browser | Interactivity, hooks, browser APIs |
| **Static** | Build time | Content that rarely changes |
| **Dynamic** | Request time | Personalized or real-time data |
| **Streaming** | Progressive | Large pages, slow data sources |

### 2. File Conventions

```text
app/
├── layout.tsx       # Shared UI wrapper
├── page.tsx         # Route UI
├── loading.tsx      # Loading UI (Suspense)
├── error.tsx        # Error boundary
├── not-found.tsx    # 404 UI
├── route.ts         # API endpoint
├── template.tsx     # Re-mounted layout
├── default.tsx      # Parallel route fallback
└── opengraph-image.tsx  # OG image generation
```

## Quick Start

> [!WARNING]
> 🚫 **このプロジェクトでは使用不可**: Next.js の ISR (`next: { revalidate }`) は `output: 'export'` と非互換です。
>
> 詳細は [Next.js 公式ドキュメント: Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching) を参照してください。
> このプロジェクトでは TanStack Query を使用したクライアントサイドフェッチを推奨します。

## Patterns

### Pattern 1: Server Components with Data Fetching

> [!WARNING]
> 🚫 **このプロジェクトでは使用不可**: `next: { tags }` によるキャッシュは `output: 'export'` と非互換です。
>
> 詳細は [Next.js 公式ドキュメント: Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) を参照してください。
> このプロジェクトでは TanStack Query を使用したクライアントサイドフェッチを推奨します。

### Pattern 2: Client Components with 'use client'

> [!IMPORTANT]
> **Project Europa**: Server Actions は使用不可のため、API クライアントを使用した実装を推奨します。

```typescript
// components/products/AddToCartButton.tsx
'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api' // Client-side API helper

export function AddToCartButton({ productId }: { productId: string }) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setError(null)
    setIsPending(true)
    
    try {
      // Use client-side API call instead of Server Action
      await apiClient.post('/api/v2/cart', { productId })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="btn-primary"
      >
        {isPending ? 'Adding...' : 'Add to Cart'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
```

### Pattern 3: Server Actions

> [!WARNING]
> 🚫 **このプロジェクトでは使用不可**: Server Actions (`'use server'`) は `output: 'export'` と非互換です。
> このプロジェクトでは Hono バックエンドの API を使用してください。

### Pattern 4: Parallel Routes

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <div className="dashboard-grid">
      <main>{children}</main>
      <aside className="analytics-panel">{analytics}</aside>
      <aside className="team-panel">{team}</aside>
    </div>
  )
}

// app/dashboard/@analytics/page.tsx
export default async function AnalyticsSlot() {
  const stats = await getAnalytics()
  return <AnalyticsChart data={stats} />
}

// app/dashboard/@analytics/loading.tsx
export default function AnalyticsLoading() {
  return <ChartSkeleton />
}

// app/dashboard/@team/page.tsx
export default async function TeamSlot() {
  const members = await getTeamMembers()
  return <TeamList members={members} />
}
```

### Pattern 5: Intercepting Routes (Modal Pattern)

```typescript
// File structure for photo modal
// app/
// ├── @modal/
// │   ├── (.)photos/[id]/page.tsx  # Intercept
// │   └── default.tsx
// ├── photos/
// │   └── [id]/page.tsx            # Full page
// └── layout.tsx

// app/@modal/(.)photos/[id]/page.tsx
import { Modal } from '@/components/Modal'
import { PhotoDetail } from '@/components/PhotoDetail'

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const photo = await getPhoto(id)

  return (
    <Modal>
      <PhotoDetail photo={photo} />
    </Modal>
  )
}

// app/photos/[id]/page.tsx - Full page version
export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const photo = await getPhoto(id)

  return (
    <div className="photo-page">
      <PhotoDetail photo={photo} />
      <RelatedPhotos photoId={id} />
    </div>
  )
}

// app/layout.tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  )
}
```

### Pattern 6: Streaming with Suspense

> [!WARNING]
> 🚫 **このプロジェクトでは使用不可**: async Server Components による Streaming は `output: 'export'` と非互換です。Client Component + TanStack Query で実装してください。

### Pattern 7: Route Handlers (API Routes)

> [!WARNING]
> **DO NOT USE NEXT.JS ROUTE HANDLERS**
>
> This project uses Hono v4 + Cloudflare Workers for all backend logic.
> Do not implement API endpoints in `app/api/...`.
> Refer to `CLAUDE.md` for API Design Rules.

### Pattern 8: Metadata and SEO

```typescript
// app/products/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) return {}

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { slug: true } })
  return products.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  return <ProductDetail product={product} />
}
```

## Caching Strategies

### Compatible with output: 'export' (Static Export)

```typescript
// No cache (always fresh)
fetch(url, { cache: 'no-store' })

// Cache forever (static)
fetch(url, { cache: 'force-cache' })
```

### Not compatible with output: 'export' / Server-only

> [!WARNING]
> The following strategies are **incompatible** with static export (`output: 'export'`).
> - `next: { revalidate }`
> - `next: { tags }`
> - `revalidateTag`, `revalidatePath`

```typescript
// ISR - revalidate after 60 seconds (Incompatible)
fetch(url, { next: { revalidate: 60 } })

// Tag-based invalidation (Incompatible)
fetch(url, { next: { tags: ['products'] } })

// Invalidate via Server Action (Incompatible)
'use server'
import { revalidateTag, revalidatePath } from 'next/cache'

export async function updateProduct(id: string, data: ProductData) {
  await db.product.update({ where: { id }, data })
  revalidateTag('products')
  revalidatePath('/products')
}
```

## Best Practices

### Do's
- **Start with Server Components** - Add 'use client' only when needed
- **Colocate data fetching** - Fetch data where it's used
- **Use Suspense boundaries** - Enable streaming for slow data
- **Leverage parallel routes** - Independent loading states
- **Use Server Actions** - For mutations with progressive enhancement (only when using App Router with static export / Europa constraint)

### Don'ts
- **Don't pass non-serializable data** - Server → Client boundary limitations (e.g., functions, class instances, Date objects)
- **Don't use hooks in Server Components** - No useState, useEffect
- **Don't use raw fetch() in Client Components** - Use Server Components or a data-fetching library (like React Query / SWR)
- **Don't over-nest layouts** - Each layout adds to the component tree
- **Don't ignore loading states** - Always provide loading.tsx or Suspense

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components (Next.js)](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Data Fetching, Caching, and Revalidating](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
