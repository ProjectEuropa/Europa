# 設計書

## 概要

Project Europaのフロントエンドリファクタリングは、現在のNext.js 15 + React 19アプリケーションの構造とアーキテクチャを改善し、保守性、拡張性、パフォーマンス、開発者体験を向上させることを目的としています。

現在のアプリケーションは基本的な機能は動作していますが、以下の課題があります：
- コンポーネントの再利用性が低い
- 状態管理が分散している
- 型安全性が不十分
- テストが不足している
- パフォーマンス最適化が不十分

## アーキテクチャ

### 全体アーキテクチャ

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # 再利用可能コンポーネント
│   │   ├── ui/                # 基本UIコンポーネント
│   │   ├── features/          # 機能固有コンポーネント
│   │   └── layout/            # レイアウトコンポーネント
│   ├── hooks/                 # カスタムフック
│   ├── lib/                   # ユーティリティ・設定
│   ├── stores/                # 状態管理
│   ├── types/                 # TypeScript型定義
│   ├── utils/                 # ヘルパー関数
│   └── __tests__/             # テストファイル
├── public/                    # 静的アセット
└── docs/                      # ドキュメント
```

### レイヤー構造

1. **プレゼンテーション層**: UIコンポーネント、ページ
2. **ビジネスロジック層**: カスタムフック、状態管理
3. **データアクセス層**: API クライアント、データ変換
4. **インフラ層**: 設定、ユーティリティ

## コンポーネントとインターフェース

### コンポーネント階層

#### 1. 基本UIコンポーネント (`components/ui/`)
- **Button**: 統一されたボタンコンポーネント
- **Input**: フォーム入力コンポーネント
- **Modal**: モーダルダイアログ
- **Loading**: ローディング表示
- **Toast**: 通知表示

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

#### 2. 機能固有コンポーネント (`components/features/`)
- **auth/**: 認証関連コンポーネント
  - `LoginForm`
  - `RegisterForm`
  - `PasswordResetForm`
- **search/**: 検索機能コンポーネント
  - `SearchForm`
  - `SearchResults`
  - `SearchFilters`
- **upload/**: アップロード機能コンポーネント
  - `FileUpload`
  - `UploadProgress`
  - `UploadHistory`
- **events/**: イベント管理コンポーネント
  - `EventList`
  - `EventForm`
  - `EventCalendar`
- **sumdownload/**: 一括ダウンロード機能コンポーネント
  - `SumDownloadForm`
  - `SumDownloadTable`
  - `SumDownloadPagination`
  - `SumDownloadProgress`

#### 3. レイアウトコンポーネント (`components/layout/`)
- **Header**: ナビゲーションヘッダー
- **Footer**: フッター
- **Sidebar**: サイドバーメニュー
- **PageLayout**: ページ共通レイアウト

### 状態管理アーキテクチャ

#### Zustand を使用したグローバル状態管理

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// stores/searchStore.ts
interface SearchState {
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  loading: boolean;
  setQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  search: () => Promise<void>;
}
```

#### React Query を使用したサーバー状態管理

```typescript
// hooks/api/useTeams.ts
export const useTeams = (params: SearchParams) => {
  return useQuery({
    queryKey: ['teams', params],
    queryFn: () => searchTeams(params.keyword, params.page),
    staleTime: 5 * 60 * 1000, // 5分
  });
};

// hooks/api/useUploadTeam.ts
export const useUploadTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uploadTeamFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('アップロードが完了しました');
    },
  });
};
```

### フォーム管理

React Hook Form + Zod を使用した型安全なフォーム管理：

```typescript
// schemas/authSchemas.ts
export const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
});

// components/features/auth/LoginForm.tsx
const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const loginMutation = useLogin();
  
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email')}
        error={errors.email?.message}
        label="メールアドレス"
      />
      <Input
        {...register('password')}
        type="password"
        error={errors.password?.message}
        label="パスワード"
      />
      <Button
        type="submit"
        loading={loginMutation.isPending}
        variant="primary"
      >
        ログイン
      </Button>
    </form>
  );
};
```

## データモデル

### 型定義の統一

```typescript
// types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

// types/file.ts
export interface TeamFile {
  id: number;
  name: string;
  ownerName: string;
  comment: string;
  tags: string[];
  downloadableAt: string;
  createdAt: string;
}

export interface MatchFile {
  id: number;
  name: string;
  ownerName: string;
  comment: string;
  tags: string[];
  downloadableAt: string;
  createdAt: string;
}

export interface SumDownloadRequest {
  checkedId: number[];
}

export interface SumDownloadFormData {
  searchQuery: string;
  selectedItems: number[];
}

// types/api.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}
```

### API クライアントの改善

```typescript
// lib/api/client.ts
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL!;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
  
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers = {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new ApiError(response.status, await response.json());
    }
    
    return response.json();
  }
  
  private getToken(): string | null {
    return typeof window !== 'undefined' 
      ? localStorage.getItem('token') 
      : null;
  }
}

export const apiClient = new ApiClient();
```

## エラーハンドリング

### エラー境界の実装

```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // エラー報告サービスに送信
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

### グローバルエラーハンドリング

```typescript
// hooks/useErrorHandler.ts
export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        // 認証エラー
        toast.error('ログインが必要です');
        router.push('/login');
      } else if (error.status >= 500) {
        // サーバーエラー
        toast.error('サーバーエラーが発生しました');
      } else {
        // その他のAPIエラー
        toast.error(error.message);
      }
    } else {
      // 予期しないエラー
      console.error('Unexpected error:', error);
      toast.error('予期しないエラーが発生しました');
    }
  }, []);
  
  return { handleError };
};
```

## テスト戦略

### テスト構成

1. **単体テスト**: コンポーネント、フック、ユーティリティ関数
2. **統合テスト**: ページ全体、ユーザーフロー
3. **E2Eテスト**: 主要な機能フロー

### テストツール

- **Vitest**: テストランナー（高速、ESM対応、Vite互換）
  - Jestより高速な実行速度
  - ESMネイティブサポート
  - TypeScript設定の共有
  - Next.js 15 + Turbopackとの親和性
- **React Testing Library**: コンポーネントテスト
- **MSW**: APIモック
- **Playwright**: E2Eテスト

```typescript
// __tests__/components/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LoginForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn();
    render(<LoginForm onSubmit={mockLogin} />);
    
    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('パスワード'), 'password123');
    await user.click(screen.getByRole('button', { name: 'ログイン' }));
    
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
  
  it('should show validation errors', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    await user.click(screen.getByRole('button', { name: 'ログイン' }));
    
    expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
  });
});
```

## パフォーマンス最適化

### コード分割

```typescript
// app/search/page.tsx
import { lazy, Suspense } from 'react';

const SearchResults = lazy(() => import('@/components/features/search/SearchResults'));

export default function SearchPage() {
  return (
    <div>
      <SearchForm />
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
```

### メモ化の活用

```typescript
// components/features/search/SearchResults.tsx
const SearchResults = memo(({ results, loading }: SearchResultsProps) => {
  const memoizedResults = useMemo(() => {
    return results.map(result => ({
      ...result,
      formattedDate: formatDate(result.createdAt),
    }));
  }, [results]);
  
  if (loading) return <SearchResultsSkeleton />;
  
  return (
    <div>
      {memoizedResults.map(result => (
        <SearchResultItem key={result.id} result={result} />
      ))}
    </div>
  );
});
```

### 画像最適化

```typescript
// components/ui/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export const OptimizedImage = ({ src, alt, width, height, priority }: OptimizedImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};
```

## アクセシビリティ

### ARIA属性の適用

```typescript
// components/ui/Modal.tsx
export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={isOpen ? 'block' : 'hidden'}
    >
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <h2 id="modal-title">{title}</h2>
        <div id="modal-description">{children}</div>
        <button
          onClick={onClose}
          aria-label="モーダルを閉じる"
        >
          ×
        </button>
      </div>
    </div>
  );
};
```

### キーボードナビゲーション

```typescript
// hooks/useKeyboardNavigation.ts
export const useKeyboardNavigation = (items: HTMLElement[]) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, items.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          event.preventDefault();
          items[focusedIndex]?.click();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, focusedIndex]);
  
  return focusedIndex;
};
```

## 開発ツール設定

### Biomeの採用理由

- **高速性**: ESLint + Prettierより大幅に高速（Rustで実装）
- **統一性**: リンティングとフォーマットが一つのツールで完結
- **設定の簡素化**: 複雑な設定ファイルの組み合わせが不要
- **TypeScript対応**: ネイティブでTypeScriptをサポート
- **アクセシビリティ**: a11yルールが組み込まれている

### Biome設定

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "a11y": { "recommended": true },
      "style": {
        "useConst": "error",
        "useTemplate": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "semicolons": "always",
      "trailingCommas": "es5",
      "quoteStyle": "single"
    }
  }
}
```

### Husky設定

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json}": ["biome check --write"]
  }
}
```

## 一括ダウンロード機能の設計

### コンポーネント構成

#### SumDownloadForm
検索とフィルタリング機能を提供するコンポーネント

```typescript
// components/features/sumdownload/SumDownloadForm.tsx
interface SumDownloadFormProps {
  searchType: 'team' | 'match';
  onSearch: (query: string) => void;
  loading?: boolean;
}

const SumDownloadForm = ({ searchType, onSearch, loading }: SumDownloadFormProps) => {
  const { register, handleSubmit } = useForm<{ query: string }>({
    resolver: zodResolver(sumDownloadSearchSchema),
  });
  
  const onSubmit = (data: { query: string }) => {
    onSearch(data.query);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('query')}
        placeholder={`${searchType === 'team' ? 'チーム名' : 'マッチ名'}で検索`}
        disabled={loading}
      />
      <Button type="submit" loading={loading}>
        検索
      </Button>
    </form>
  );
};
```

#### SumDownloadTable
データ一覧とチェックボックス選択機能を提供するコンポーネント

```typescript
// components/features/sumdownload/SumDownloadTable.tsx
interface SumDownloadTableProps {
  data: (TeamFile | MatchFile)[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  loading?: boolean;
}

const SumDownloadTable = ({ data, selectedIds, onSelectionChange, loading }: SumDownloadTableProps) => {
  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(checked ? data.map(item => item.id) : []);
  };
  
  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              checked={selectedIds.length === data.length && data.length > 0}
              onCheckedChange={handleSelectAll}
              disabled={loading}
            />
          </TableHead>
          <TableHead>ファイル名</TableHead>
          <TableHead>オーナー</TableHead>
          <TableHead>アップロード日</TableHead>
          <TableHead>ダウンロード可能日</TableHead>
          <TableHead>コメント</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Checkbox
                checked={selectedIds.includes(item.id)}
                onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                disabled={loading}
              />
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.ownerName}</TableCell>
            <TableCell>{formatDate(item.createdAt)}</TableCell>
            <TableCell>{formatDate(item.downloadableAt)}</TableCell>
            <TableCell>
              <div>{item.comment}</div>
              <div className="flex gap-1 mt-1">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

### カスタムフック

#### useSumDownload
一括ダウンロード機能の状態管理とAPI呼び出しを管理

```typescript
// hooks/useSumDownload.ts
export const useSumDownload = (searchType: 'team' | 'match') => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // 検索クエリ
  const searchResult = searchType === 'team' 
    ? useSumDLTeamSearch({ keyword: searchQuery, page: currentPage })
    : useSumDLMatchSearch({ keyword: searchQuery, page: currentPage });
  
  // ダウンロードミューテーション
  const downloadMutation = useMutation({
    mutationFn: (ids: number[]) => sumDownload(ids),
    onSuccess: () => {
      toast.success('ダウンロードが開始されました');
      setSelectedIds([]);
    },
    onError: (error) => {
      toast.error('ダウンロードに失敗しました');
      console.error('Download error:', error);
    },
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSelectedIds([]);
  };
  
  const handleDownload = () => {
    if (selectedIds.length === 0) {
      toast.error('ダウンロードするアイテムを選択してください');
      return;
    }
    downloadMutation.mutate(selectedIds);
  };
  
  return {
    data: searchQuery.data?.data || [],
    loading: searchQuery.isLoading,
    error: searchQuery.error,
    selectedIds,
    setSelectedIds,
    currentPage,
    setCurrentPage,
    totalPages: searchQuery.data?.lastPage || 1,
    handleSearch,
    handleDownload,
    isDownloading: downloadMutation.isPending,
  };
};
```

### API関数の改善

```typescript
// lib/api/sumdownload.ts
export const sumDLSearchTeam = async (
  keyword: string, 
  page: number = 1
): Promise<PaginatedResponse<TeamFile>> => {
  const response = await apiClient.get<PaginatedResponse<TeamFile>>(
    `/api/v1/search/team/sumdownload?keyword=${encodeURIComponent(keyword)}&page=${page}`
  );
  return response.data;
};

export const sumDLSearchMatch = async (
  keyword: string, 
  page: number = 1
): Promise<PaginatedResponse<MatchFile>> => {
  const response = await apiClient.get<PaginatedResponse<MatchFile>>(
    `/api/v1/search/match/sumdownload?keyword=${encodeURIComponent(keyword)}&page=${page}`
  );
  return response.data;
};

export const sumDownload = async (checkedIds: number[]): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/sumDownload`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ checkedId: checkedIds }),
    }
  );
  
  if (!response.ok) {
    throw new Error('ダウンロードに失敗しました');
  }
  
  // ZIPファイルのダウンロード処理
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  // Content-Dispositionヘッダーからファイル名を取得
  const disposition = response.headers.get('content-disposition');
  let filename = `${Date.now()}_bulk_download.zip`; // フォールバック用のファイル名

  if (disposition) {
    const filenameMatch = /filename=\"?([^\"]+)\"?/.exec(disposition);
    if (filenameMatch && filenameMatch[1]) {
      filename = decodeURIComponent(filenameMatch[1]);
    }
  }

  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
```

### バリデーションスキーマ

```typescript
// schemas/sumdownload.ts
export const sumDownloadSearchSchema = z.object({
  query: z.string().min(0).max(100),
});

export const sumDownloadSchema = z.object({
  checkedId: z
    .array(z.number())
    .min(1, '少なくとも1つのアイテムを選択してください')
    .max(50, '一度に選択できるアイテムは50個までです'),
});

export type SumDownloadSearchFormData = z.infer<typeof sumDownloadSearchSchema>;
export type SumDownloadFormData = z.infer<typeof sumDownloadSchema>;
```

この設計により、保守性、拡張性、パフォーマンス、アクセシビリティ、開発者体験のすべてが向上したフロントエンドアプリケーションを構築できます。
