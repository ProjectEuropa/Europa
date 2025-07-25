'use client';

import type React from 'react';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Calendar from '@/components/Calendar';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { Icons } from '@/icons';
import { uploadMatchFile } from '@/utils/api';

const MatchUploadPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [ownerName, setOwnerName] = useState('');

  // 認証済みならデフォルトでオーナー名をセット
  useEffect(() => {
    if (user && user.name && !ownerName) {
      setOwnerName(user.name);
    }
  }, [user, ownerName]);
  const [comment, setComment] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [deletePassword, setDeletePassword] = useState('');
  const [showSpecialTags, setShowSpecialTags] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [downloadDate, setDownloadDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // 認証状態はuseAuthフックで判定
  const isAuthenticated = !!user;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    } else if (e.key === ' ' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag: string) => {
    // カンマで区切られた複数のタグを処理
    const newTags = tag
      .split(',')
      .map(t => t.trim())
      .filter(t => t && !tags.includes(t));
    if (tags.length + newTags.length > 4) {
      toast.error('タグは最大4つまでです');
      return;
    }
    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleDateSelect = (date: Date, closeCalendar = false) => {
    // カレンダーから選択された日付と時間をそのまま使用
    // タイムゾーンを考慮したフォーマット（ローカル時間のまま）
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // YYYY-MM-DDThh:mm 形式（datetime-local入力用）
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    setDownloadDate(formattedDate);

    // 日付セルクリック時のみカレンダーを閉じる（時間変更時は閉じない）
    if (closeCalendar) {
      setShowCalendar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setFieldErrors(prev => ({
        ...prev,
        file: ['ファイルを選択してください'],
      }));
      toast.error('ファイルを選択してください');
      return;
    } else {
      setFieldErrors(prev => {
        const { file, ...rest } = prev;
        return rest;
      });
    }

    // ファイルサイズチェック（260KB制限）
    if (selectedFile.size > 260 * 1024) {
      toast.error('ファイルサイズが制限（260KB）を超えています');
      return;
    }

    // ファイル拡張子チェック
    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'che') {
      toast.error('対応形式（.CHE）のファイルをアップロードしてください');
      return;
    }

    // 確認ダイアログを表示
    setShowConfirmDialog(true);
  };

  // アップロード実行関数
  const executeUpload = async () => {
    setShowConfirmDialog(false);
    setIsUploading(true);
    try {
      // ファイルアップロードAPI呼び出し
      await uploadMatchFile(selectedFile!, isAuthenticated, {
        ownerName,
        comment,
        tags,
        deletePassword,
        downloadDate,
      });
      setIsUploading(false);
      toast.success(
        `マッチデータが${isAuthenticated ? '認証済み' : '非認証'}モードでアップロードされました`
      );
      // フォームをリセット
      setOwnerName('');
      setComment('');
      setTagInput('');
      setTags([]);
      setDeletePassword('');
      setDownloadDate('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setIsUploading(false);
      // サーバーバリデーションエラー時のフィールドごとのエラーセット
      if (error && error.errors) {
        try {
          const errJson = error.errors;
          if (errJson) {
            setFieldErrors(errJson);
            toast.error(
              '入力内容に不備があります。赤枠の項目を確認してください。'
            );
            return;
          }
        } catch {}
      }
      setFieldErrors({});
      toast.error(
        'アップロード中にエラーが発生しました。もう一度お試しください。'
      );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'rgb(var(--background-rgb))',
      }}
    >
      <Header />

      <main
        style={{
          flex: '1',
          padding: '20px',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: '#0A1022',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            border: '1px solid #1E3A5F',
          }}
        >
          {/* ヘッダー部分 */}
          <div
            style={{
              background: '#0F1A2E',
              padding: '20px',
              color: '#00c8ff',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderBottom: '1px solid #1E3A5F',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              マッチデータアップロード
            </h1>
          </div>
          {/* フォーム部分 */}
          <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
            {/* オーナー名 */}
            <div
              style={{
                marginBottom: '30px',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#b0c4d8',
                  marginBottom: '8px',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                オーナー名
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                placeholder="あなたの名前を入力"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111A2E',
                  border: fieldErrors.ownerName
                    ? '2px solid #ff5c5c'
                    : '1px solid #1E3A5F',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem',
                }}
              />
              {fieldErrors.ownerName && (
                <div style={{ color: '#ff5c5c', marginTop: 4, fontSize: 13 }}>
                  {fieldErrors.ownerName[0]}
                </div>
              )}
            </div>

            {/* コメント */}
            <div
              style={{
                marginBottom: '30px',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#b0c4d8',
                  marginBottom: '8px',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                コメント
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="マッチの説明や特徴を入力"
                rows={9}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#111A2E',
                  border: fieldErrors.matchComment
                    ? '2px solid #ff5c5c'
                    : '1px solid #1E3A5F',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem',
                  resize: 'vertical',
                }}
              />
              {fieldErrors.matchComment && (
                <div style={{ color: '#ff5c5c', marginTop: 4, fontSize: 13 }}>
                  {fieldErrors.matchComment[0]}
                </div>
              )}
              {/* タグセクション */}
              <div
                style={{
                  marginBottom: '30px',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#b0c4d8',
                    marginBottom: '8px',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                  タグ
                </label>
                <div style={{ position: 'relative', marginBottom: 12 }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <input
                      type="text"
                      ref={tagInputRef}
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagKeyDown}
                      onFocus={() => setShowSpecialTags(true)}
                      onBlur={() =>
                        setTimeout(() => setShowSpecialTags(false), 200)
                      }
                      placeholder="タグを入力（Enterキーで追加）"
                      style={{
                        flex: '1',
                        padding: '12px',
                        background: '#111A2E',
                        border: '1px solid #1E3A5F',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '1rem',
                        width: '100%',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => tagInput.trim() && addTag(tagInput.trim())}
                      style={{
                        padding: '12px',
                        background: '#1E3A5F',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#00c8ff',
                        cursor: tags.length >= 4 ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        fontSize: '1rem',
                        opacity: tags.length >= 4 ? 0.6 : 1,
                      }}
                      disabled={tags.length >= 4}
                    >
                      追加
                    </button>
                  </div>
                  {/* スペシャルタグポップアップ */}
                  {showSpecialTags && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        zIndex: 10,
                        background: '#111A2E',
                        border: '1px solid #00c8ff',
                        borderRadius: 8,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                        padding: '16px 20px',
                        minWidth: 260,
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      {['フルリーグ', 'ハーフリーグ', '上級演習所'].map(tag => (
                        <label
                          key={tag}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            fontSize: '1.08em',
                            color: '#b0c4d8',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={tags.includes(tag)}
                            onChange={e => {
                              if (e.target.checked) {
                                if (tags.length >= 4) {
                                  toast.error('タグは最大4つまでです');
                                  return;
                                }
                                // 追加しようとしているタグが既に含まれていないか再確認し、4つ未満の時のみ追加
                                if (!tags.includes(tag) && tags.length < 4)
                                  setTags(prev => [...prev, tag]);
                              } else {
                                setTags(prev => prev.filter(t => t !== tag));
                              }
                            }}
                            style={{
                              width: 22,
                              height: 22,
                              accentColor: '#00c8ff',
                            }}
                          />
                          {tag}
                        </label>
                      ))}
                    </div>
                  )}
                  {/* タグリスト表示 */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: 10,
                    }}
                  >
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          background: '#1E3A5F',
                          borderRadius: '16px',
                          color: '#00c8ff',
                          fontWeight: 500,
                        }}
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#b0c4d8',
                            cursor: 'pointer',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: tags.length === 4 ? '#00c8ff' : '#b0c4d8',
                      fontWeight: tags.length === 4 ? 700 : 400,
                      marginTop: '4px',
                      transition: 'color 0.2s, font-weight 0.2s',
                    }}
                  >
                    タグは最大4つまで入力できます。スペシャルタグ:
                    フルリーグ、ハーフリーグ、上級演習所
                  </div>
                </div>
              </div>

              {/* 削除パスワード */}
              {!isAuthenticated && (
                <div
                  style={{
                    marginBottom: '30px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#b0c4d8',
                      marginBottom: '8px',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    削除パスワード
                  </label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={deletePassword}
                      onChange={e => setDeletePassword(e.target.value)}
                      placeholder="削除時に必要なパスワードを設定"
                      style={{
                        width: '100%',
                        padding: '12px',
                        paddingRight: '40px', // アイコンの余白を確保
                        background: '#111A2E',
                        border: fieldErrors.matchDeletePassWord
                          ? '2px solid #ff5c5c'
                          : '1px solid #1E3A5F',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '1rem',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0',
                        color: '#00c8ff',
                      }}
                      aria-label={
                        showPassword ? 'パスワードを隠す' : 'パスワードを表示'
                      }
                    >
                      {showPassword ? (
                        <Icons.EyeClosed size={20} />
                      ) : (
                        <Icons.EyeOpen size={20} />
                      )}
                    </button>
                  </div>
                  {fieldErrors.matchDeletePassWord && (
                    <div
                      style={{ color: '#ff5c5c', marginTop: 4, fontSize: 13 }}
                    >
                      {fieldErrors.matchDeletePassWord[0]}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#8CB4FF',
                      marginTop: '4px',
                    }}
                  >
                    このパスワードはマッチデータを削除する際に必要です。忘れないようにしてください。
                  </div>
                </div>
              )}

              {/* OKEファイルアップロード */}
              <div
                style={{
                  marginBottom: '30px',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#b0c4d8',
                    marginBottom: '8px',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  OKEアップロード
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".CHE"
                  style={{ display: 'none' }}
                />
                <div
                  style={{
                    border: fieldErrors.file
                      ? '2px solid #ff5c5c'
                      : '2px dashed #1E3A5F',
                    borderRadius: '12px',
                    padding: '40px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                    background: '#020824',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    minHeight: '200px',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.style.borderColor = '#00c8ff';
                    e.currentTarget.style.background =
                      'rgba(0, 200, 255, 0.05)';
                  }}
                  onDragLeave={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.style.borderColor = '#1E3A5F';
                    e.currentTarget.style.background = '#020824';
                  }}
                  onDrop={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.style.borderColor = '#1E3A5F';
                    e.currentTarget.style.background = '#020824';

                    if (
                      e.dataTransfer.files &&
                      e.dataTransfer.files.length > 0
                    ) {
                      const file = e.dataTransfer.files[0];
                      const fileExt = file.name.split('.').pop()?.toLowerCase();

                      if (fileExt === 'che') {
                        setSelectedFile(file);
                        if (fileInputRef.current) {
                          // This is a hack to make the file input reflect the dropped file
                          const dataTransfer = new DataTransfer();
                          dataTransfer.items.add(file);
                          fileInputRef.current.files = dataTransfer.files;
                        }
                      } else {
                        alert(
                          '対応形式: .CHE のファイルをアップロードしてください'
                        );
                      }
                    }
                  }}
                >
                  {selectedFile ? (
                    // ファイル選択済み表示
                    <>
                      <div
                        style={{
                          color: '#00c8ff',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {selectedFile.name}
                      </div>
                      <div style={{ color: '#8CB4FF' }}>
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </div>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        style={{
                          background: '#111A2E',
                          border: '1px solid #1E3A5F',
                          color: '#00c8ff',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        ファイルを削除
                      </button>
                    </>
                  ) : (
                    // ファイル未選択表示
                    <>
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#00c8ff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <div
                        style={{
                          color: '#00c8ff',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                        }}
                      >
                        CHEファイルをドラッグ＆ドロップ
                      </div>
                      <div style={{ color: '#b0c4d8' }}>
                        またはクリックしてファイルを選択
                      </div>
                    </>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#8CB4FF',
                    marginTop: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>対応形式: .CHE</span>
                  <span>最大サイズ: 260KB</span>
                </div>
              </div>

              {/* ダウンロード可能日時 */}
              <div
                style={{
                  marginBottom: '30px',
                  position: 'relative',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#b0c4d8',
                    marginBottom: '8px',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  ダウンロード可能日時
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="datetime-local"
                    value={downloadDate}
                    onChange={e => setDownloadDate(e.target.value)}
                    style={{
                      flex: '1',
                      padding: '12px',
                      background: '#111A2E',
                      border: '1px solid #1E3A5F',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '1rem',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#00c8ff',
                      cursor: 'pointer',
                      padding: '0 8px',
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        stroke="#00c8ff"
                        strokeWidth="2"
                      />
                      <path d="M3 10H21" stroke="#00c8ff" strokeWidth="2" />
                      <path
                        d="M8 2L8 6"
                        stroke="#00c8ff"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M16 2L16 6"
                        stroke="#00c8ff"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                {showCalendar && (
                  <div
                    onClick={e => e.stopPropagation()}
                    style={{
                      position: 'fixed',
                      zIndex: 1000,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: '#0A1022',
                      border: '2px solid #00c8ff',
                      borderRadius: '8px',
                      padding: '16px',
                      width: '100%',
                      maxWidth: '450px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                      pointerEvents: 'auto',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '10px',
                      }}
                    >
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setShowCalendar(false);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#00c8ff',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                          lineHeight: '1',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '30px',
                          height: '30px',
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <Calendar
                      initialDate={
                        downloadDate ? new Date(downloadDate) : new Date()
                      }
                      onSelect={handleDateSelect}
                      size="small"
                      showTimeSelect={true}
                    />
                  </div>
                )}
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={isUploading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#00c8ff',
                  color: '#020824',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  opacity: isUploading ? 0.7 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {isUploading ? 'アップロード中...' : 'マッチデータアップロード'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />

      {/* アップロード確認ダイアログ */}
      {showConfirmDialog && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowConfirmDialog(false)}
        >
          <div
            style={{
              backgroundColor: '#0A1022',
              border: '2px solid #00c8ff',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '600px',
              width: '90%',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.3rem',
                marginTop: 0,
                marginBottom: '16px',
              }}
            >
              マッチデータアップロードの確認
            </h3>
            <div
              style={{
                color: '#b0c4d8',
                marginBottom: '24px',
                lineHeight: '1.6',
              }}
            >
              <p style={{ marginBottom: '12px' }}>
                以下の内容でマッチデータをアップロードします。よろしいですか？
              </p>

              <div
                style={{
                  background: '#061022',
                  borderRadius: '6px',
                  padding: '16px',
                  fontSize: '0.9rem',
                  marginBottom: '16px',
                }}
              >
                <div style={{ marginBottom: '8px', display: 'flex' }}>
                  <div style={{ width: '120px', color: '#00c8ff' }}>
                    ファイル名:
                  </div>
                  <div style={{ flex: 1 }}>{selectedFile?.name}</div>
                </div>

                <div style={{ marginBottom: '8px', display: 'flex' }}>
                  <div style={{ width: '120px', color: '#00c8ff' }}>
                    オーナー名:
                  </div>
                  <div style={{ flex: 1 }}>{ownerName || '設定なし'}</div>
                </div>

                {comment && (
                  <div style={{ marginBottom: '8px', display: 'flex' }}>
                    <div style={{ width: '120px', color: '#00c8ff' }}>
                      コメント:
                    </div>
                    <div style={{ flex: 1 }}>{comment}</div>
                  </div>
                )}

                {tags.length > 0 && (
                  <div style={{ marginBottom: '8px', display: 'flex' }}>
                    <div style={{ width: '120px', color: '#00c8ff' }}>
                      タグ:
                    </div>
                    <div style={{ flex: 1 }}>
                      {tags.map((tag, i) => (
                        <span
                          key={i}
                          style={{
                            display: 'inline-block',
                            background: 'rgba(0, 200, 255, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            marginRight: '6px',
                            marginBottom: '4px',
                            border: '1px solid rgba(0, 200, 255, 0.3)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {deletePassword && (
                  <div style={{ marginBottom: '8px', display: 'flex' }}>
                    <div style={{ width: '120px', color: '#00c8ff' }}>
                      削除パスワード:
                    </div>
                    <div style={{ flex: 1 }}>設定済み</div>
                  </div>
                )}

                {downloadDate && (
                  <div style={{ marginBottom: '8px', display: 'flex' }}>
                    <div style={{ width: '120px', color: '#00c8ff' }}>
                      ダウンロード日時:
                    </div>
                    <div style={{ flex: 1 }}>
                      {new Date(downloadDate).toLocaleString('ja-JP')}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '0', display: 'flex' }}>
                  <div style={{ width: '120px', color: '#00c8ff' }}>
                    アップロードモード:
                  </div>
                  <div style={{ flex: 1 }}>
                    {isAuthenticated ? '認証済み' : '非認証'}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #00c8ff',
                  borderRadius: '4px',
                  color: '#00c8ff',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={executeUpload}
                style={{
                  padding: '10px 24px',
                  background: '#00c8ff',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#0A1022',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                アップロードする
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchUploadPage;
