# カレンダーアイコン視認性改善 - 設計書

## 概要

アップロード画面の「ダウンロード可能日時」フィールドにおけるカレンダーアイコンの視認性問題を解決するための設計。現在のdatetime-local入力フィールドの実装を改善し、ユーザビリティとアクセシビリティを向上させる。

## アーキテクチャ

### 現在の実装分析

現在のFileUploadFormコンポーネントでは以下の実装になっている：

```tsx
<input
  id="downloadDate"
  type="datetime-local"
  value={formData.downloadDate}
  onChange={(e) => updateFormData({ downloadDate: e.target.value })}
  style={{
    // ダークテーマスタイル
    colorScheme: 'dark',
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
  }}
/>
```

### 問題の特定

1. **ネイティブアイコンの非表示**: `WebkitAppearance: 'none'`によりネイティブのカレンダーアイコンが非表示
2. **ダークテーマでの視認性**: ダークテーマでネイティブアイコンが見えにくい
3. **カスタムアイコンの不在**: ネイティブアイコンを非表示にしているが、代替のカスタムアイコンが提供されていない

## コンポーネント設計

### 1. DateTimeInput コンポーネント

新しい専用コンポーネントを作成し、カレンダーアイコンの視認性を改善する。

```tsx
interface DateTimeInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  'aria-describedby'?: string;
}
```

### 2. アイコン表示戦略

#### オプション A: カスタムアイコンオーバーレイ
- ネイティブ入力フィールドの上にカスタムカレンダーアイコンを配置
- アイコンクリックでネイティブピッカーを開く
- 完全なカスタマイズ可能

#### オプション B: ネイティブアイコン復活 + スタイル調整
- `WebkitAppearance: 'none'`を削除
- ダークテーマ対応のためのcolorScheme調整
- ブラウザ間の一貫性に課題

#### 推奨: オプション A（カスタムアイコンオーバーレイ）

## データモデル

### DateTimeInputState
```tsx
interface DateTimeInputState {
  value: string;
  isOpen: boolean;
  isFocused: boolean;
  hasError: boolean;
}
```

## インターフェース設計

### 1. 視覚的レイアウト

```
┌─────────────────────────────────────────────────────┐
│ 📅 ダウンロード可能日時                                │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ 年/月/日 --:--                            📅   │ │
│ └─────────────────────────────────────────────────┘ │
│ 設定しない場合は即座にダウンロード可能になります        │
└─────────────────────────────────────────────────────┘
```

### 2. インタラクション設計

1. **通常状態**: カレンダーアイコンが右端に表示
2. **ホバー状態**: アイコンの色が変化（#00c8ff）
3. **フォーカス状態**: 入力フィールドの境界線がハイライト
4. **アクティブ状態**: ネイティブピッカーが開く

### 3. スタイル仕様

```css
.datetime-input-container {
  position: relative;
  width: 100%;
}

.datetime-input {
  width: 100%;
  padding: 12px 48px 12px 16px; /* 右側にアイコンスペース */
  background: #020824;
  border: 1px solid #1E3A5F;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  color-scheme: dark;
}

.datetime-input:focus {
  border-color: #00c8ff;
  outline: none;
}

.calendar-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #b0c4d8;
  pointer-events: none;
  transition: color 0.2s;
}

.datetime-input:hover + .calendar-icon,
.datetime-input:focus + .calendar-icon {
  color: #00c8ff;
}
```

## エラーハンドリング

### バリデーション

1. **日時形式チェック**: 有効なdatetime-local形式かチェック
2. **過去日時チェック**: 現在時刻より前の日時は警告表示
3. **最大日時チェック**: 合理的な未来日時の範囲内かチェック

### エラー表示

```tsx
{error && (
  <p className="error-message">
    有効な日時を入力してください
  </p>
)}
```

## テスト戦略

### 1. ユニットテスト

- DateTimeInputコンポーネントの基本機能
- アイコン表示の確認
- 値の変更処理
- エラー状態の表示

### 2. インテグレーションテスト

- FileUploadFormとの統合
- フォーム送信時の値の取得
- バリデーション連携

### 3. E2Eテスト

- ブラウザでのネイティブピッカー動作
- モバイルデバイスでの操作性
- アクセシビリティ機能

### 4. 視覚的回帰テスト

- アイコンの表示確認
- ダークテーマでのコントラスト
- レスポンシブデザイン

## アクセシビリティ対応

### ARIA属性

```tsx
<input
  type="datetime-local"
  aria-label="ダウンロード可能日時"
  aria-describedby="datetime-help"
  role="textbox"
/>
<span id="datetime-help" className="sr-only">
  日時を設定しない場合は即座にダウンロード可能になります
</span>
```

### キーボードナビゲーション

- Tab: フィールドにフォーカス
- Enter/Space: ネイティブピッカーを開く
- Escape: ピッカーを閉じる

## パフォーマンス考慮事項

### 最適化戦略

1. **アイコンの軽量化**: SVGアイコンの使用
2. **レンダリング最適化**: React.memoの適用
3. **スタイル最適化**: CSS-in-JSの最小化

### メモリ使用量

- 追加のDOMノード: 最小限（アイコン用の1要素のみ）
- イベントリスナー: 必要最小限
- 状態管理: ローカル状態のみ使用

## ブラウザ互換性

### サポート対象

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### フォールバック戦略

- 古いブラウザ: テキスト入力として動作
- datetime-local非対応: 通常のtext inputにフォールバック
- アイコン非表示: 機能は維持、視覚的な改善のみ失われる

## 実装優先度

### Phase 1: 基本実装
1. DateTimeInputコンポーネント作成
2. カスタムアイコンオーバーレイ実装
3. 基本スタイリング

### Phase 2: 機能強化
1. バリデーション追加
2. エラーハンドリング改善
3. アクセシビリティ対応

### Phase 3: 最適化
1. パフォーマンス最適化
2. テストカバレッジ向上
3. ドキュメント整備
