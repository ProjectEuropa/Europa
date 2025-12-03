'use client';

import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { DateTimeInput } from '@/components/ui/datetime-input';
import { Icons } from '@/icons';

export interface FileUploadOptions {
  ownerName: string;
  comment: string;
  tags: string[];
  deletePassword?: string;
  downloadDate?: string;
}

export interface FileUploadFormProps {
  title: string;
  subtitle?: string;
  fileType: 'team' | 'match';
  maxFileSize: number; // KB
  specialTags: string[];
  isAuthenticated: boolean;
  defaultOwnerName?: string;
  onSubmit: (file: File, options: FileUploadOptions) => Promise<void>;
  isUploading?: boolean;
}

export const FileUploadForm: React.FC<FileUploadFormProps> = ({
  title,
  subtitle,
  fileType,
  maxFileSize,
  specialTags,
  isAuthenticated,
  defaultOwnerName = '',
  onSubmit,
  isUploading = false,
}) => {
  const [formData, setFormData] = useState<FileUploadOptions>({
    ownerName: defaultOwnerName,
    comment: '',
    tags: [],
    deletePassword: '',
    downloadDate: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSpecialTags, setShowSpecialTags] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const updateFormData = useCallback((updates: Partial<FileUploadOptions>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateAndSetFile = useCallback(
    (file: File) => {
      // ファイル拡張子チェック
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (fileExt !== 'che') {
        toast.error('対応形式（.CHE）のファイルをアップロードしてください');
        return;
      }

      // ファイルサイズチェック
      if (file.size > maxFileSize * 1024) {
        toast.error(`ファイルサイズが制限（${maxFileSize}KB）を超えています`);
        return;
      }

      setSelectedFile(file);
      setFieldErrors(prev => {
        const { file: fileError, ...rest } = prev;
        return rest;
      });
    },
    [maxFileSize]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        validateAndSetFile(file);
      }
    },
    [validateAndSetFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        validateAndSetFile(file);
      }
    },
    [validateAndSetFile]
  );

  const addTag = useCallback(
    (tag: string) => {
      const newTags = tag
        .split(',')
        .map(t => t.trim())
        .filter(t => t && !formData.tags.includes(t));

      if (newTags.length > 0) {
        if (formData.tags.length + newTags.length > 4) {
          toast.error('タグは最大4つまでです');
          return;
        }
        updateFormData({ tags: [...formData.tags, ...newTags] });
        setTagInput('');
      }
    },
    [formData.tags, updateFormData]
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      updateFormData({
        tags: formData.tags.filter(tag => tag !== tagToRemove),
      });
    },
    [formData.tags, updateFormData]
  );

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && tagInput.trim()) {
        e.preventDefault();
        addTag(tagInput.trim());
      }
    },
    [tagInput, addTag]
  );

  const toggleSpecialTag = useCallback(
    (tag: string) => {
      if (formData.tags.includes(tag)) {
        removeTag(tag);
      } else {
        if (formData.tags.length >= 4) {
          toast.error('タグは最大4つまでです');
          return;
        }
        updateFormData({ tags: [...formData.tags, tag] });
      }
    },
    [formData.tags, removeTag, updateFormData]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const errors: Record<string, string[]> = {};

      // ファイルチェック
      if (!selectedFile) {
        errors.file = ['ファイルを選択してください'];
      }

      // コメントチェック（必須）
      if (!formData.comment || !formData.comment.trim()) {
        errors[`${fileType}Comment`] = ['コメントを入力してください'];
      }

      // 未認証ユーザーの場合の追加チェック
      if (!isAuthenticated) {
        if (!formData.ownerName || !formData.ownerName.trim()) {
          errors.ownerName = ['オーナー名を入力してください'];
        }
        if (!formData.deletePassword || !formData.deletePassword.trim()) {
          errors[`${fileType}DeletePassWord`] = ['削除パスワードを入力してください'];
        }
      }

      // エラーがある場合
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        toast.error('入力内容に不備があります。赤枠の項目を確認してください。');
        return;
      }

      setFieldErrors({});
      setShowConfirmDialog(true);
    },
    [selectedFile, formData, isAuthenticated, fileType]
  );

  const executeUpload = useCallback(async () => {
    if (!selectedFile) return;

    setShowConfirmDialog(false);

    try {
      await onSubmit(selectedFile, formData);

      // フォームをリセット
      setFormData({
        ownerName: defaultOwnerName,
        comment: '',
        tags: [],
        deletePassword: '',
        downloadDate: '',
      });
      setSelectedFile(null);
      setTagInput('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.success(
        `${fileType === 'team' ? 'チーム' : 'マッチ'}データがアップロードされました`
      );
    } catch (error: any) {
      if (error?.errors) {
        setFieldErrors(error.errors);
        toast.error('入力内容に不備があります。赤枠の項目を確認してください。');
      } else {
        setFieldErrors({});
        toast.error(
          'アップロード中にエラーが発生しました。もう一度お試しください。'
        );
      }
    }
  }, [selectedFile, formData, onSubmit, defaultOwnerName, fileType]);

  const resetFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        background: '#0a0e1a',
        border: '1px solid #1E3A5F',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* ヘッダーセクション */}
      <div
        style={{
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '1px solid #1E3A5F',
        }}
      >
        {/* タイトル */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: subtitle ? '12px' : '0',
          }}
        >
          <Icons.Upload size={24} color="#00c8ff" />
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#00c8ff',
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>

        {/* サブタイトル */}
        {subtitle && (
          <p
            style={{
              fontSize: '16px',
              color: '#8CB4FF',
              margin: '0 0 24px 36px',
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        )}

        {/* 使用方法の説明 */}
        <div
          style={{
            background: 'rgba(30, 58, 95, 0.3)',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '16px',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#00c8ff',
              margin: '0 0 16px 0',
            }}
          >
            アップロード方法
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                fileType === 'match'
                  ? 'repeat(auto-fit, minmax(200px, 1fr))'
                  : 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              fontSize: '14px',
            }}
          >
            <div>
              <h4
                style={{
                  fontWeight: '600',
                  color: '#b0c4d8',
                  margin: '0 0 8px 0',
                }}
              >
                ファイル要件
              </h4>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  color: '#8CB4FF',
                  lineHeight: 1.6,
                }}
              >
                <li>• ファイル形式: .CHE</li>
                <li>• 最大サイズ: {maxFileSize}KB</li>
                <li>• 1回につき1ファイル</li>
              </ul>
            </div>
            <div>
              <h4
                style={{
                  fontWeight: '600',
                  color: '#b0c4d8',
                  margin: '0 0 8px 0',
                }}
              >
                アップロード方法
              </h4>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  color: '#8CB4FF',
                  lineHeight: 1.6,
                }}
              >
                <li>• ドラッグ&ドロップ</li>
                <li>• クリックしてファイル選択</li>
                <li>• 必要な情報を入力して送信</li>
              </ul>
            </div>
            {fileType === 'match' && specialTags.length > 0 && (
              <div>
                <h4
                  style={{
                    fontWeight: '600',
                    color: '#b0c4d8',
                    margin: '0 0 8px 0',
                  }}
                >
                  スペシャルタグ
                </h4>
                <div style={{ color: '#8CB4FF', lineHeight: 1.6 }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
                    マッチデータ用の特別なタグ：
                  </p>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {specialTags.map(tag => (
                      <li key={tag} style={{ fontSize: '13px' }}>
                        • <span style={{ fontWeight: '500' }}>{tag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* オーナー名 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="ownerName"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#b0c4d8',
            }}
          >
            <Icons.User size={16} color="#00c8ff" />
            オーナー名
          </label>
          <input
            id="ownerName"
            type="text"
            value={formData.ownerName}
            onChange={e => updateFormData({ ownerName: e.target.value })}
            placeholder="あなたの名前を入力"
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#020824',
              border: fieldErrors.ownerName
                ? '2px solid #ef4444'
                : '1px solid #1E3A5F',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => {
              if (!fieldErrors.ownerName) {
                (e.target as HTMLInputElement).style.borderColor = '#00c8ff';
              }
            }}
            onBlur={e => {
              if (!fieldErrors.ownerName) {
                (e.target as HTMLInputElement).style.borderColor = '#1E3A5F';
              }
            }}
          />
          {fieldErrors.ownerName && (
            <p style={{ fontSize: '12px', color: '#ef4444', margin: 0 }}>
              {fieldErrors.ownerName[0]}
            </p>
          )}
        </div>

        {/* コメント */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="comment"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#b0c4d8',
            }}
          >
            <Icons.MessageSquare size={16} color="#00c8ff" />
            コメント
          </label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={e => updateFormData({ comment: e.target.value })}
            placeholder={`${fileType === 'team' ? 'チームの特徴、戦術、強さ、注目ポイントなどを詳しく入力してください。\n例：攻撃的なフォーメーションで、カウンター攻撃が得意なチームです。' : 'マッチの内容、見どころ、結果、印象的なプレーなどを詳しく入力してください。\n例：接戦で最後まで勝敗が分からない熱い試合でした。'}`}
            rows={6}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: '#020824',
              border: fieldErrors[`${fileType}Comment`]
                ? '2px solid #ef4444'
                : '1px solid #1E3A5F',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
              minHeight: '140px',
              maxHeight: '300px',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
              lineHeight: '1.5',
            }}
            onFocus={e => {
              if (!fieldErrors[`${fileType}Comment`]) {
                (e.target as HTMLTextAreaElement).style.borderColor = '#00c8ff';
              }
            }}
            onBlur={e => {
              if (!fieldErrors[`${fileType}Comment`]) {
                (e.target as HTMLTextAreaElement).style.borderColor = '#1E3A5F';
              }
            }}
          />
          {fieldErrors[`${fileType}Comment`] && (
            <p style={{ fontSize: '12px', color: '#ef4444', margin: 0 }}>
              {fieldErrors[`${fileType}Comment`][0]}
            </p>
          )}
        </div>

        {/* タグ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="tagInput"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#b0c4d8',
            }}
          >
            <Icons.Tag size={16} color="#00c8ff" />
            タグ
          </label>

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="tagInput"
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onFocus={() => setShowSpecialTags(true)}
                onBlur={() => setTimeout(() => setShowSpecialTags(false), 200)}
                placeholder="タグを入力（Enterキーで追加）"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#020824',
                  border: '1px solid #1E3A5F',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocusCapture={e => {
                  (e.target as HTMLInputElement).style.borderColor = '#00c8ff';
                }}
                onBlurCapture={e => {
                  (e.target as HTMLInputElement).style.borderColor = '#1E3A5F';
                }}
              />
              <button
                type="button"
                onClick={() => tagInput.trim() && addTag(tagInput.trim())}
                disabled={formData.tags.length >= 4}
                style={{
                  padding: '12px 20px',
                  background: formData.tags.length >= 4 ? '#1E3A5F' : '#020824',
                  border: '1px solid #1E3A5F',
                  borderRadius: '8px',
                  color: formData.tags.length >= 4 ? '#666' : '#b0c4d8',
                  fontSize: '14px',
                  cursor: formData.tags.length >= 4 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (formData.tags.length < 4) {
                    const target = e.target as HTMLButtonElement;
                    target.style.borderColor = '#00c8ff';
                    target.style.color = '#00c8ff';
                  }
                }}
                onMouseLeave={e => {
                  if (formData.tags.length < 4) {
                    const target = e.target as HTMLButtonElement;
                    target.style.borderColor = '#1E3A5F';
                    target.style.color = '#b0c4d8';
                  }
                }}
              >
                追加
              </button>
            </div>

            {/* スペシャルタグドロップダウン */}
            {showSpecialTags && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  zIndex: 10,
                  marginTop: '4px',
                  width: '256px',
                  background: '#0a0e1a',
                  border: '1px solid #1E3A5F',
                  borderRadius: '8px',
                  padding: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                {specialTags.map(tag => (
                  <label
                    key={tag}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      padding: '8px 0',
                      fontSize: '14px',
                      color: '#b0c4d8',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(tag)}
                      onChange={() => toggleSpecialTag(tag)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#00c8ff',
                      }}
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* タグ表示 */}
          {formData.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {formData.tags.map(tag => (
                <div
                  key={tag}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 12px',
                    background: '#1E3A5F',
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: '#b0c4d8',
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#b0c4d8',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLButtonElement).style.color = '#ef4444';
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLButtonElement).style.color = '#b0c4d8';
                    }}
                  >
                    <Icons.X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p style={{ fontSize: '12px', color: '#8CB4FF', margin: 0 }}>
            タグは最大4つまで入力できます。カンマで区切るか、Enterキーで追加します。
          </p>
        </div>

        {/* 削除パスワード（非認証時のみ） */}
        {!isAuthenticated && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              htmlFor="deletePassword"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#b0c4d8',
              }}
            >
              <Icons.Lock size={16} color="#00c8ff" />
              削除パスワード
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="deletePassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.deletePassword}
                onChange={e =>
                  updateFormData({ deletePassword: e.target.value })
                }
                placeholder="削除時に必要なパスワードを設定"
                style={{
                  width: '100%',
                  padding: '12px 50px 12px 16px',
                  background: '#020824',
                  border: fieldErrors[`${fileType}DeletePassWord`]
                    ? '2px solid #ef4444'
                    : '1px solid #1E3A5F',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => {
                  if (!fieldErrors[`${fileType}DeletePassWord`]) {
                    (e.target as HTMLInputElement).style.borderColor =
                      '#00c8ff';
                  }
                }}
                onBlur={e => {
                  if (!fieldErrors[`${fileType}DeletePassWord`]) {
                    (e.target as HTMLInputElement).style.borderColor =
                      '#1E3A5F';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#b0c4d8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLButtonElement).style.color = '#00c8ff';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.color = '#b0c4d8';
                }}
              >
                {showPassword ? (
                  <Icons.EyeOff size={16} />
                ) : (
                  <Icons.Eye size={16} />
                )}
              </button>
            </div>
            {fieldErrors[`${fileType}DeletePassWord`] && (
              <p style={{ fontSize: '12px', color: '#ef4444', margin: 0 }}>
                {fieldErrors[`${fileType}DeletePassWord`][0]}
              </p>
            )}
            <p style={{ fontSize: '12px', color: '#8CB4FF', margin: 0 }}>
              このパスワードは{fileType === 'team' ? 'チーム' : 'マッチ'}
              データを削除する際に必要です。
            </p>
          </div>
        )}

        {/* ファイルアップロード */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#b0c4d8',
            }}
          >
            <Icons.FileText size={16} color="#00c8ff" />
            OKEアップロード
          </label>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".CHE"
            style={{ display: 'none' }}
          />

          <div
            style={{
              border: `2px dashed ${fieldErrors.file
                ? '#ef4444'
                : selectedFile
                  ? '#00c8ff'
                  : dragActive
                    ? '#00c8ff'
                    : '#1E3A5F'
                }`,
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background:
                dragActive || selectedFile
                  ? 'rgba(0, 200, 255, 0.05)'
                  : 'transparent',
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onMouseEnter={e => {
              if (!selectedFile && !dragActive && !fieldErrors.file) {
                (e.target as HTMLDivElement).style.borderColor = '#00c8ff';
                (e.target as HTMLDivElement).style.background =
                  'rgba(0, 200, 255, 0.05)';
              }
            }}
            onMouseLeave={e => {
              if (!selectedFile && !dragActive && !fieldErrors.file) {
                (e.target as HTMLDivElement).style.borderColor = '#1E3A5F';
                (e.target as HTMLDivElement).style.background = 'transparent';
              }
            }}
          >
            {selectedFile ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  alignItems: 'center',
                }}
              >
                <Icons.FileCheck size={48} color="#00c8ff" />
                <div>
                  <p
                    style={{
                      fontWeight: '600',
                      color: '#00c8ff',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {selectedFile.name}
                  </p>
                  <p style={{ fontSize: '14px', color: '#8CB4FF', margin: 0 }}>
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    resetFile();
                  }}
                  style={{
                    padding: '8px 16px',
                    background: '#020824',
                    border: '1px solid #1E3A5F',
                    borderRadius: '6px',
                    color: '#b0c4d8',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLButtonElement).style.borderColor =
                      '#ef4444';
                    (e.target as HTMLButtonElement).style.color = '#ef4444';
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLButtonElement).style.borderColor =
                      '#1E3A5F';
                    (e.target as HTMLButtonElement).style.color = '#b0c4d8';
                  }}
                >
                  ファイルを削除
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  alignItems: 'center',
                }}
              >
                <Icons.Upload size={48} color="#8CB4FF" />
                <div>
                  <p
                    style={{
                      fontWeight: '600',
                      color: '#b0c4d8',
                      margin: '0 0 4px 0',
                    }}
                  >
                    CHEファイルをドラッグ&ドロップ
                  </p>
                  <p style={{ fontSize: '14px', color: '#8CB4FF', margin: 0 }}>
                    またはクリックしてファイルを選択
                  </p>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#8CB4FF',
            }}
          >
            <span>対応形式: .CHE</span>
            <span>最大サイズ: {maxFileSize}KB</span>
          </div>
        </div>

        {/* ダウンロード可能日時 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="downloadDate"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#b0c4d8',
            }}
          >
            <Icons.Calendar size={16} color="#00c8ff" />
            ダウンロード可能日時
          </label>
          <DateTimeInput
            id="downloadDate"
            value={formData.downloadDate || ''}
            onChange={value => updateFormData({ downloadDate: value })}
            aria-describedby="datetime-help"
            aria-label="ダウンロード可能日時"
          />
          <p
            id="datetime-help"
            style={{ fontSize: '12px', color: '#8CB4FF', margin: 0 }}
          >
            設定しない場合は即座にダウンロード可能になります
          </p>
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isUploading || !selectedFile}
          style={{
            width: '100%',
            padding: '16px',
            background: isUploading || !selectedFile ? '#1E3A5F' : '#00c8ff',
            border: 'none',
            borderRadius: '8px',
            color: isUploading || !selectedFile ? '#666' : '#0a0e1a',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isUploading || !selectedFile ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            opacity: isUploading || !selectedFile ? 0.6 : 1,
          }}
          onMouseEnter={e => {
            if (!isUploading && selectedFile) {
              (e.target as HTMLButtonElement).style.background = '#0099cc';
            }
          }}
          onMouseLeave={e => {
            if (!isUploading && selectedFile) {
              (e.target as HTMLButtonElement).style.background = '#00c8ff';
            }
          }}
        >
          {isUploading ? (
            <>
              <div style={{ animation: 'spin 1s linear infinite' }}>
                <Icons.Loader2 size={16} color="currentColor" />
              </div>
              アップロード中...
            </>
          ) : (
            <>
              <Icons.Upload size={16} color="currentColor" />
              アップロード
            </>
          )}
        </button>
      </form>

      {/* 確認ダイアログ */}
      {showConfirmDialog && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '500px',
              margin: '0 16px',
              background: '#0a0e1a',
              border: '1px solid #1E3A5F',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#00c8ff',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Icons.Upload size={20} color="#00c8ff" />
              アップロード確認
            </h3>

            <p
              style={{
                color: '#b0c4d8',
                margin: '0 0 20px 0',
                lineHeight: 1.5,
              }}
            >
              以下の内容で{fileType === 'team' ? 'チーム' : 'マッチ'}
              データをアップロードします。
            </p>

            {/* 入力内容の確認 */}
            <div
              style={{
                background: 'rgba(30, 58, 95, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#00c8ff',
                  margin: '0 0 12px 0',
                }}
              >
                アップロード内容
              </h4>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '14px',
                }}
              >
                {/* ファイル情報 */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#8CB4FF' }}>ファイル名:</span>
                  <span style={{ color: '#b0c4d8', fontWeight: '500' }}>
                    {selectedFile?.name || '未選択'}
                  </span>
                </div>

                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#8CB4FF' }}>ファイルサイズ:</span>
                  <span style={{ color: '#b0c4d8' }}>
                    {selectedFile
                      ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                      : '0 KB'}
                  </span>
                </div>

                {/* オーナー名 */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#8CB4FF' }}>オーナー名:</span>
                  <span style={{ color: '#b0c4d8', fontWeight: '500' }}>
                    {formData.ownerName || '未入力'}
                  </span>
                </div>

                {/* コメント */}
                {formData.comment && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <span style={{ color: '#8CB4FF' }}>コメント:</span>
                    <div
                      style={{
                        color: '#b0c4d8',
                        background: 'rgba(0, 0, 0, 0.2)',
                        padding: '8px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        lineHeight: 1.4,
                        maxHeight: '60px',
                        overflowY: 'auto',
                      }}
                    >
                      {formData.comment}
                    </div>
                  </div>
                )}

                {/* タグ */}
                {formData.tags.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <span style={{ color: '#8CB4FF' }}>タグ:</span>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}
                    >
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            background: '#1E3A5F',
                            color: '#b0c4d8',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 削除パスワード（非認証時のみ） */}
                {!isAuthenticated && formData.deletePassword && (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span style={{ color: '#8CB4FF' }}>削除パスワード:</span>
                    <span style={{ color: '#b0c4d8' }}>設定済み</span>
                  </div>
                )}

                {/* ダウンロード可能日時 */}
                {formData.downloadDate && (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span style={{ color: '#8CB4FF' }}>
                      ダウンロード可能日時:
                    </span>
                    <span style={{ color: '#b0c4d8' }}>
                      {new Date(formData.downloadDate).toLocaleString('ja-JP')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowConfirmDialog(false)}
                style={{
                  padding: '10px 20px',
                  background: '#020824',
                  border: '1px solid #1E3A5F',
                  borderRadius: '6px',
                  color: '#b0c4d8',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLButtonElement).style.borderColor = '#00c8ff';
                  (e.target as HTMLButtonElement).style.color = '#00c8ff';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.borderColor = '#1E3A5F';
                  (e.target as HTMLButtonElement).style.color = '#b0c4d8';
                }}
              >
                キャンセル
              </button>
              <button
                onClick={executeUpload}
                style={{
                  padding: '10px 20px',
                  background: '#00c8ff',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#0a0e1a',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLButtonElement).style.background = '#0099cc';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.background = '#00c8ff';
                }}
              >
                アップロード
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
