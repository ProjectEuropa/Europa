'use client';

import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { DateTimeInput } from '@/components/ui/datetime-input';
import { Icons } from '@/icons';
import { fetchTags } from '@/lib/api/files';
import { highlightMatch } from '@/hooks/useSearchSuggestions';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [dragActive, setDragActive] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showTagSelector, setShowTagSelector] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // タグ一覧を取得
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };
    loadTags();
  }, []);

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

  // フィルタリングされたサジェストを取得
  const getFilteredSuggestions = useCallback(() => {
    if (!tagInput.trim()) return [];
    return availableTags
      .filter(tag =>
        tag.toLowerCase().includes(tagInput.toLowerCase()) &&
        !formData.tags.includes(tag)
      )
      .slice(0, 10);
  }, [tagInput, availableTags, formData.tags]);

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const suggestions = getFilteredSuggestions();

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
          addTag(suggestions[selectedSuggestionIndex]);
          setSelectedSuggestionIndex(-1);
        } else if (tagInput.trim()) {
          addTag(tagInput.trim());
        }
      } else if (e.key === 'Escape') {
        setSelectedSuggestionIndex(-1);
        setShowTagSelector(false);
      }
    },
    [tagInput, addTag, selectedSuggestionIndex, getFilteredSuggestions]
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
    <div className="w-full max-w-[1000px] mx-auto bg-[#0a0e1a] border border-[#1E3A5F] rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      {/* ヘッダーセクション */}
      <div className="mb-8 pb-6 border-b border-[#1E3A5F]">
        {/* タイトル */}
        <div className={`flex items-center gap-3 ${subtitle ? 'mb-3' : ''}`}>
          <Icons.Upload size={24} color="#00c8ff" />
          <div className="flex-1">
            <h1 className="text-[28px] font-black text-white mb-1 [text-shadow:0_0_10px_rgba(0,200,255,0.4)]">
              {title}
            </h1>
            <div className="flex items-center gap-2">
              <div className="h-px w-5 bg-[rgba(0,200,255,0.5)]" />
              <p className="text-xs text-[#00c8ff] font-bold tracking-[0.15em] uppercase m-0">
                {fileType === 'team' ? 'TEAM DATA UPLOAD' : 'MATCH DATA UPLOAD'}
              </p>
            </div>
          </div>
        </div>

        {/* サブタイトル */}
        {subtitle && (
          <p className="text-base text-[#8CB4FF] ml-9 mb-6 leading-normal">
            {subtitle}
          </p>
        )}

        {/* 使用方法の説明 */}
        <div className="bg-[rgba(30,58,95,0.3)] rounded-lg p-5 mt-4">
          <h3 className="text-base font-semibold text-[#00c8ff] mb-4">
            アップロード方法
          </h3>
          <div
            className={`grid gap-5 text-sm ${fileType === 'match'
                ? 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]'
                : 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]'
              }`}
          >
            <div>
              <h4 className="font-semibold text-[#b0c4d8] mb-2">
                ファイル要件
              </h4>
              <ul className="list-none p-0 m-0 text-[#8CB4FF] leading-relaxed">
                <li>• ファイル形式: .CHE</li>
                <li>• 最大サイズ: {maxFileSize}KB</li>
                <li>• 1回につき1ファイル</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#b0c4d8] mb-2">
                アップロード方法
              </h4>
              <ul className="list-none p-0 m-0 text-[#8CB4FF] leading-relaxed">
                <li>• ドラッグ&ドロップ</li>
                <li>• クリックしてファイル選択</li>
                <li>• 必要な情報を入力して送信</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* オーナー名 */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="ownerName"
            className="flex items-center gap-2 text-sm font-semibold text-[#b0c4d8]"
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
            className={`w-full px-4 py-3 bg-[#020824] rounded-lg text-white text-sm outline-none transition-colors duration-200 ${fieldErrors.ownerName
                ? 'border-2 border-red-500'
                : 'border border-[#1E3A5F] focus:border-[#00c8ff]'
              }`}
          />
          {fieldErrors.ownerName && (
            <p className="text-xs text-red-500 m-0">
              {fieldErrors.ownerName[0]}
            </p>
          )}
        </div>

        {/* コメント */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="comment"
            className="flex items-center gap-2 text-sm font-semibold text-[#b0c4d8]"
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
            className={`w-full px-5 py-4 bg-[#020824] rounded-lg text-white text-sm outline-none resize-y min-h-[140px] max-h-[300px] font-inherit transition-colors duration-200 leading-relaxed ${fieldErrors[`${fileType}Comment`]
                ? 'border-2 border-red-500'
                : 'border border-[#1E3A5F] focus:border-[#00c8ff]'
              }`}
          />
          {fieldErrors[`${fileType}Comment`] && (
            <p className="text-xs text-red-500 m-0">
              {fieldErrors[`${fileType}Comment`][0]}
            </p>
          )}
        </div>

        {/* タグ */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="tagInput"
            className="flex items-center gap-2 text-sm font-semibold text-[#b0c4d8]"
          >
            <Icons.Tag size={16} color="#00c8ff" />
            タグ
          </label>

          <div className="relative">
            <div className="flex gap-2">
              <input
                id="tagInput"
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onFocus={() => setShowTagSelector(true)}
                onBlur={() => setTimeout(() => setShowTagSelector(false), 200)}
                placeholder="タグを入力（Enterキーで追加）"
                className="flex-1 px-4 py-3 bg-[#020824] border border-[#1E3A5F] rounded-lg text-white text-sm outline-none transition-colors duration-200 focus:border-[#00c8ff]"
              />
              <button
                type="button"
                onClick={() => tagInput.trim() && addTag(tagInput.trim())}
                disabled={formData.tags.length >= 4}
                className={`px-5 py-3 border border-[#1E3A5F] rounded-lg text-sm transition-all duration-200 ${formData.tags.length >= 4
                    ? 'bg-[#1E3A5F] text-gray-500 cursor-not-allowed'
                    : 'bg-[#020824] text-[#b0c4d8] cursor-pointer hover:border-[#00c8ff] hover:text-[#00c8ff]'
                  }`}
              >
                追加
              </button>
            </div>

            {/* タグサジェスチョン（入力中に表示） */}
            {showTagSelector && tagInput.trim() && getFilteredSuggestions().length > 0 && (
              <div className="absolute top-full left-0 z-[20] mt-1 w-full max-w-[500px] bg-[#0a0e1a] border border-[#1E3A5F] rounded-lg max-h-[200px] overflow-y-auto shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <div className="py-1">
                  {getFilteredSuggestions().map((tag, index) => (
                    <button
                      key={tag}
                      type="button"
                      className={`w-full px-4 py-2 text-left text-sm transition-colors duration-150 ${index === selectedSuggestionIndex
                          ? 'bg-[rgba(0,200,255,0.2)] text-[#00c8ff]'
                          : 'text-[#b0c4d8] hover:bg-[rgba(0,200,255,0.1)]'
                        }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addTag(tag);
                        setSelectedSuggestionIndex(-1);
                      }}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    >
                      {highlightMatch(tag, tagInput).map((part, i) => (
                        <span
                          key={i}
                          className={part.isMatch ? 'text-[#00c8ff] font-semibold' : ''}
                        >
                          {part.text}
                        </span>
                      ))}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* タグセレクター（チェックボックス式、入力が空の時に表示） */}
            {showTagSelector && !tagInput.trim() && availableTags.length > 0 && (
              <div className="absolute top-full left-0 z-[10] mt-1 w-full max-w-[500px] bg-[#0a0e1a] border border-[#1E3A5F] rounded-lg max-h-[300px] overflow-y-auto shadow-[0_4px_20px_rgba(0,0,0,0.3)] p-3">
                <div className="mb-2 pb-2 border-b border-[#1E3A5F] text-[#b0c4d8] text-[13px] font-semibold">
                  登録済みタグから選択
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
                  {availableTags.map(tag => (
                    <label
                      key={tag}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-all duration-200 ${formData.tags.includes(tag)
                          ? 'text-[#00c8ff] bg-[rgba(0,200,255,0.1)] hover:bg-[rgba(0,200,255,0.15)]'
                          : formData.tags.length >= 4
                            ? 'text-[#b0c4d8] opacity-50 cursor-not-allowed'
                            : 'text-[#b0c4d8] hover:bg-[rgba(0,200,255,0.15)] cursor-pointer'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag)}
                        disabled={formData.tags.length >= 4 && !formData.tags.includes(tag)}
                        onChange={() => {
                          if (formData.tags.includes(tag)) {
                            removeTag(tag);
                          } else {
                            if (formData.tags.length >= 4) {
                              toast.error('タグは最大4つまでです');
                              return;
                            }
                            updateFormData({ tags: [...formData.tags, tag] });
                          }
                        }}
                        className={`w-4 h-4 accent-[#00c8ff] ${formData.tags.length >= 4 && !formData.tags.includes(tag) ? 'cursor-not-allowed' : 'cursor-pointer'
                          }`}
                      />
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {tag}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* タグ表示 */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-[#1E3A5F] rounded-full text-xs text-[#b0c4d8]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="bg-transparent border-none text-[#b0c4d8] cursor-pointer p-0.5 flex items-center transition-colors duration-200 hover:text-red-500"
                  >
                    <Icons.X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-[#8CB4FF] m-0">
            タグは最大4つまで入力できます。カンマで区切るか、Enterキーで追加します。
          </p>
        </div>

        {/* 削除パスワード（非認証時のみ） */}
        {!isAuthenticated && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="deletePassword"
              className="flex items-center gap-2 text-sm font-semibold text-[#b0c4d8]"
            >
              <Icons.Lock size={16} color="#00c8ff" />
              削除パスワード
            </label>
            <div className="relative">
              <input
                id="deletePassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.deletePassword}
                onChange={e =>
                  updateFormData({ deletePassword: e.target.value })
                }
                placeholder="削除時に必要なパスワードを設定"
                className={`w-full py-3 pl-4 pr-12 bg-[#020824] rounded-lg text-white text-sm outline-none transition-colors duration-200 ${fieldErrors[`${fileType}DeletePassWord`]
                    ? 'border-2 border-red-500'
                    : 'border border-[#1E3A5F] focus:border-[#00c8ff]'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#b0c4d8] cursor-pointer p-1 flex items-center transition-colors duration-200 hover:text-[#00c8ff]"
              >
                {showPassword ? (
                  <Icons.EyeOff size={16} />
                ) : (
                  <Icons.Eye size={16} />
                )}
              </button>
            </div>
            {fieldErrors[`${fileType}DeletePassWord`] && (
              <p className="text-xs text-red-500 m-0">
                {fieldErrors[`${fileType}DeletePassWord`][0]}
              </p>
            )}
            <p className="text-xs text-[#8CB4FF] m-0">
              このパスワードは{fileType === 'team' ? 'チーム' : 'マッチ'}
              データを削除する際に必要です。
            </p>
          </div>
        )}

        {/* ファイルアップロード */}
        <div className="flex flex-col gap-2">
          <label
            className="flex items-center gap-2 text-sm font-semibold text-[#b0c4d8]"
          >
            <Icons.FileText size={16} color="#00c8ff" />
            OKEアップロード
          </label>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".CHE"
            className="hidden"
          />

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${fieldErrors.file
                ? 'border-red-500'
                : selectedFile || dragActive
                  ? 'border-[#00c8ff] bg-[rgba(0,200,255,0.05)]'
                  : 'border-[#1E3A5F] hover:border-[#00c8ff] hover:bg-[rgba(0,200,255,0.05)]'
              }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="flex flex-col gap-4 items-center">
                <Icons.FileCheck size={48} color="#00c8ff" />
                <div>
                  <p className="font-semibold text-[#00c8ff] mb-1">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-[#8CB4FF] m-0">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    resetFile();
                  }}
                  className="px-4 py-2 bg-[#020824] border border-[#1E3A5F] rounded-md text-[#b0c4d8] text-sm cursor-pointer transition-all duration-200 hover:border-red-500 hover:text-red-500"
                >
                  ファイルを削除
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 items-center">
                <Icons.Upload size={48} color="#8CB4FF" />
                <div>
                  <p className="font-semibold text-[#b0c4d8] mb-1">
                    CHEファイルをドラッグ&ドロップ
                  </p>
                  <p className="text-sm text-[#8CB4FF] m-0">
                    またはクリックしてファイルを選択
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between text-xs text-[#8CB4FF]">
            <span>対応形式: .CHE</span>
            <span>最大サイズ: {maxFileSize}KB</span>
          </div>
        </div>

        {/* ダウンロード可能日時 */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="downloadDate"
            className="flex items-center gap-2 text-sm font-semibold text-[#b0c4d8]"
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
            className="text-xs text-[#8CB4FF] m-0"
          >
            設定しない場合は即座にダウンロード可能になります
          </p>
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isUploading || !selectedFile}
          className={`w-full p-4 border-none rounded-lg text-base font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${isUploading || !selectedFile
              ? 'bg-[#1E3A5F] text-gray-500 cursor-not-allowed opacity-60'
              : 'bg-[#00c8ff] text-[#0a0e1a] cursor-pointer hover:bg-[#0099cc]'
            }`}
        >
          {isUploading ? (
            <>
              <div className="animate-spin">
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[50]">
          <div className="w-full max-w-[500px] mx-4 bg-[#0a0e1a] border border-[#1E3A5F] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)] max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#00c8ff] mb-4 flex items-center gap-2">
              <Icons.Upload size={20} color="#00c8ff" />
              アップロード確認
            </h3>

            <p className="text-[#b0c4d8] mb-5 leading-relaxed">
              以下の内容で{fileType === 'team' ? 'チーム' : 'マッチ'}
              データをアップロードします。
            </p>

            {/* 入力内容の確認 */}
            <div className="bg-[rgba(30,58,95,0.3)] rounded-lg p-4 mb-5">
              <h4 className="text-sm font-semibold text-[#00c8ff] mb-3">
                アップロード内容
              </h4>

              <div className="flex flex-col gap-2 text-sm">
                {/* ファイル情報 */}
                <div className="flex justify-between">
                  <span className="text-[#8CB4FF]">ファイル名:</span>
                  <span className="text-[#b0c4d8] font-medium">
                    {selectedFile?.name || '未選択'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8CB4FF]">ファイルサイズ:</span>
                  <span className="text-[#b0c4d8]">
                    {selectedFile
                      ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                      : '0 KB'}
                  </span>
                </div>

                {/* オーナー名 */}
                <div className="flex justify-between">
                  <span className="text-[#8CB4FF]">オーナー名:</span>
                  <span className="text-[#b0c4d8] font-medium">
                    {formData.ownerName || '未入力'}
                  </span>
                </div>

                {/* コメント */}
                {formData.comment && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[#8CB4FF]">コメント:</span>
                    <div className="text-[#b0c4d8] bg-black/20 p-2 rounded text-[13px] leading-snug max-h-[60px] overflow-y-auto">
                      {formData.comment}
                    </div>
                  </div>
                )}

                {/* タグ */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[#8CB4FF]">タグ:</span>
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-[#1E3A5F] text-[#b0c4d8] px-2 py-0.5 rounded-xl text-xs"
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
                    className="flex justify-between"
                  >
                    <span className="text-[#8CB4FF]">削除パスワード:</span>
                    <span className="text-[#b0c4d8]">設定済み</span>
                  </div>
                )}

                {/* ダウンロード可能日時 */}
                {formData.downloadDate && (
                  <div
                    className="flex justify-between"
                  >
                    <span className="text-[#8CB4FF]">
                      ダウンロード可能日時:
                    </span>
                    <span className="text-[#b0c4d8]">
                      {new Date(formData.downloadDate).toLocaleString('ja-JP')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-5 py-2.5 bg-[#020824] border border-[#1E3A5F] rounded-md text-[#b0c4d8] text-sm cursor-pointer transition-all duration-200 hover:border-[#00c8ff] hover:text-[#00c8ff]"
              >
                キャンセル
              </button>
              <button
                onClick={executeUpload}
                className="px-5 py-2.5 bg-[#00c8ff] border-none rounded-md text-[#0a0e1a] text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0099cc]"
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
