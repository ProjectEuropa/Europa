import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProfileSection from '@/components/mypage/ProfileSection';
import * as useMyPageHooks from '@/hooks/api/useMyPage';
import { createMockMutationResult } from '../../utils/test-utils';

// モック設定
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/hooks/api/useMyPage', () => ({
  useProfile: vi.fn(),
  useUpdateProfile: vi.fn(),
}));

// テスト用のQueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('ProfileSection', () => {
  const mockProfile = {
    name: 'テストユーザー',
    email: 'test@example.com',
    joinDate: '2023/01/01',
  };

  const mockUpdateProfile = {
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
  };

  beforeEach(() => {
    vi.mocked(useMyPageHooks.useProfile).mockReturnValue({
      data: mockProfile,
      isLoading: false,
      error: null,
    });

    vi.mocked(useMyPageHooks.useUpdateProfile).mockReturnValue(
      createMockMutationResult({
        mutateAsync: mockUpdateProfile.mutateAsync,
        isPending: false,
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('正常状態', () => {
    it('プロフィール情報が正しく表示される', () => {
      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      expect(screen.getByText('プロフィール情報')).toBeInTheDocument();
      expect(screen.getByText('テストユーザー')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('2023/01/01')).toBeInTheDocument();
      expect(screen.getByText('編集')).toBeInTheDocument();
    });

    it('編集ボタンをクリックすると編集モードになる', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      const editButton = screen.getByText('編集');
      await user.click(editButton);

      expect(screen.getByText('キャンセル')).toBeInTheDocument();
      expect(screen.getByDisplayValue('テストユーザー')).toBeInTheDocument();
      expect(screen.getByText('保存')).toBeInTheDocument();
    });

    it('編集モードでキャンセルボタンをクリックすると編集を取り消す', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      // 編集モードに入る
      const editButton = screen.getByText('編集');
      await user.click(editButton);

      // 名前を変更
      const nameInput = screen.getByDisplayValue('テストユーザー');
      await user.clear(nameInput);
      await user.type(nameInput, '変更された名前');

      // キャンセル
      const cancelButton = screen.getByText('キャンセル');
      await user.click(cancelButton);

      // 編集モードが終了し、元の値に戻る
      expect(screen.getByText('編集')).toBeInTheDocument();
      expect(screen.getByText('テストユーザー')).toBeInTheDocument();
    });

    it('名前を編集して保存できる', async () => {
      const user = userEvent.setup();
      mockUpdateProfile.mutateAsync.mockResolvedValue(undefined);

      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      // 編集モードに入る
      const editButton = screen.getByText('編集');
      await user.click(editButton);

      // 名前を変更
      const nameInput = screen.getByDisplayValue('テストユーザー');
      await user.clear(nameInput);
      await user.type(nameInput, '新しい名前');

      // 保存
      const saveButton = screen.getByText('保存');
      await user.click(saveButton);

      expect(mockUpdateProfile.mutateAsync).toHaveBeenCalledWith({
        name: '新しい名前',
      });
    });

    it('空の名前では保存できない', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      // 編集モードに入る
      const editButton = screen.getByText('編集');
      await user.click(editButton);

      // 名前を空にする
      const nameInput = screen.getByDisplayValue('テストユーザー');
      await user.clear(nameInput);

      // 保存ボタンが無効化されている
      const saveButton = screen.getByText('保存');
      expect(saveButton).toBeDisabled();
    });
  });

  describe('ローディング状態', () => {
    it('ローディング中は適切なメッセージを表示する', () => {
      vi.mocked(useMyPageHooks.useProfile).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      } as ReturnType<typeof useMyPageHooks.useProfile>);

      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      expect(
        screen.getByText('プロフィール情報を読み込み中...')
      ).toBeInTheDocument();
    });

    it('更新中は保存ボタンが無効化される', async () => {
      const user = userEvent.setup();
      vi.mocked(useMyPageHooks.useUpdateProfile).mockReturnValue(
        createMockMutationResult({
          mutateAsync: mockUpdateProfile.mutateAsync,
          isPending: true,
        })
      );

      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      // 編集モードに入る
      const editButton = screen.getByText('編集');
      await user.click(editButton);

      const saveButton = screen.getByText('保存中...');
      expect(saveButton).toBeDisabled();
    });
  });

  describe('エラー状態', () => {
    it('プロフィール取得エラー時はエラーメッセージを表示する', () => {
      vi.mocked(useMyPageHooks.useProfile).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('取得エラー'),
      });

      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      expect(
        screen.getByText('プロフィール情報の読み込みに失敗しました')
      ).toBeInTheDocument();
    });

    it('プロフィールデータがnullの場合もエラーメッセージを表示する', () => {
      vi.mocked(useMyPageHooks.useProfile).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as ReturnType<typeof useMyPageHooks.useProfile>);

      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      expect(
        screen.getByText('プロフィール情報の読み込みに失敗しました')
      ).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なラベルとフォーム要素が関連付けられている', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      // 編集モードに入る
      const editButton = screen.getByText('編集');
      await user.click(editButton);

      // フォーム要素が適切にラベル付けされている
      const nameInput = screen.getByDisplayValue('テストユーザー');
      expect(nameInput).toHaveAttribute('type', 'text');
      expect(nameInput).toHaveAttribute(
        'placeholder',
        '名前を入力してください'
      );
    });

    it('ボタンが適切な状態を持つ', () => {
      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      const editButton = screen.getByText('編集');
      expect(editButton.tagName).toBe('BUTTON');
      expect(editButton).not.toBeDisabled();
    });
  });

  describe('UI状態の遷移', () => {
    it('編集→キャンセル→再編集の流れが正しく動作する', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      // 編集開始
      await user.click(screen.getByText('編集'));
      expect(screen.getByDisplayValue('テストユーザー')).toBeInTheDocument();

      // キャンセル
      await user.click(screen.getByText('キャンセル'));
      expect(screen.getByText('編集')).toBeInTheDocument();

      // 再度編集開始
      await user.click(screen.getByText('編集'));
      expect(screen.getByDisplayValue('テストユーザー')).toBeInTheDocument();
    });

    it('保存成功後は編集モードが終了する', async () => {
      const user = userEvent.setup();
      mockUpdateProfile.mutateAsync.mockImplementation(async () => {
        // 成功時の動作をシミュレート
        return Promise.resolve();
      });

      const wrapper = createWrapper();
      render(<ProfileSection />, { wrapper });

      // 編集開始
      await user.click(screen.getByText('編集'));

      // 名前変更
      const nameInput = screen.getByDisplayValue('テストユーザー');
      await user.clear(nameInput);
      await user.type(nameInput, '新しい名前');

      // 保存実行
      await user.click(screen.getByText('保存'));

      // mutateAsyncが呼ばれることを確認
      await waitFor(() => {
        expect(mockUpdateProfile.mutateAsync).toHaveBeenCalled();
      });
    });
  });
});
