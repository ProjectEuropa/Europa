'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

const MatchUploadPage: React.FC = () => {
  const [ownerName, setOwnerName] = useState('');
  const [comment, setComment] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [deletePassword, setDeletePassword] = useState('');
  const [downloadDate, setDownloadDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

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
    const newTags = tag.split(',').map(t => t.trim()).filter(t => t && !tags.includes(t));
    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('ファイルを選択してください');
      return;
    }
    
    setIsUploading(true);
    
    // 実際のアプリケーションでは、ここでAPIを呼び出してファイルをアップロード
    console.log({
      ownerName,
      comment,
      tags,
      deletePassword,
      downloadDate,
      fileName: selectedFile.name,
      fileSize: selectedFile.size
    });
    
    // アップロードの模擬（実際のアプリケーションではAPIコールに置き換え）
    setTimeout(() => {
      setIsUploading(false);
      alert('マッチデータがアップロードされました');
      
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
    }, 1500);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'rgb(var(--background-rgb))'
    }}>
      <Header />
      
      <main style={{
        flex: '1',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: '#0A1022',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          border: '1px solid #1E3A5F'
        }}>
          {/* ヘッダー部分 */}
          <div style={{
            background: '#0F1A2E',
            padding: '20px',
            color: '#00c8ff',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            borderBottom: '1px solid #1E3A5F'
          }}>
            <div style={{
              width: '24px',
              height: '24px'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                簡易アップロード(マッチデータ)
              </h1>
              <p style={{
                fontSize: '0.9rem',
                margin: '4px 0 0 0'
              }}>
                ユーザー登録処理をせずにマッチデータアップロードが可能です。
              </p>
            </div>
          </div>
          
          {/* フォーム部分 */}
          <form onSubmit={handleSubmit} style={{
            padding: '20px'
          }}>
            {/* オーナー名 */}
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#b0c4d8',
                marginBottom: '8px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                オーナー名
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111A2E',
                  border: '1px solid #1E3A5F',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem'
                }}
                maxLength={100}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                color: '#8CB4FF',
                fontSize: '0.8rem',
                marginTop: '4px'
              }}>
                {ownerName.length} / 100
              </div>
            </div>
            
            {/* コメント */}
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#b0c4d8',
                marginBottom: '8px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                コメント
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111A2E',
                  border: '1px solid #1E3A5F',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>
            
            {/* 検索タグ */}
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#b0c4d8',
                marginBottom: '8px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                検索タグ
              </label>
              <div>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagKeyDown}
                    placeholder="カンマ、エンターキー、または半角スペースで区切ってタグを入力"
                    style={{
                      flex: '1',
                      padding: '12px',
                      background: '#111A2E',
                      border: '1px solid #1E3A5F',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => tagInput.trim() && addTag(tagInput.trim())}
                    style={{
                      background: '#111A2E',
                      border: '1px solid #1E3A5F',
                      color: '#00c8ff',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    追加
                  </button>
                </div>
                
                {tags.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginTop: '12px'
                  }}>
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(0, 200, 255, 0.1)',
                          border: '1px solid #1E3A5F',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          color: '#00c8ff',
                          fontSize: '0.9rem'
                        }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#8CB4FF',
                            cursor: 'pointer',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '16px',
                            height: '16px'
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* 削除パスワード */}
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#b0c4d8',
                marginBottom: '8px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                削除パスワード
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111A2E',
                  border: '1px solid #1E3A5F',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem'
                }}
                maxLength={100}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                color: '#8CB4FF',
                fontSize: '0.8rem',
                marginTop: '4px'
              }}>
                {deletePassword.length} / 100
              </div>
            </div>
            
            {/* マッチデータ */}
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#b0c4d8',
                marginBottom: '8px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                マッチデータ
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".zip,.rar,.7z,.dat"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: '#111A2E',
                    border: '1px solid #1E3A5F',
                    color: '#00c8ff',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  ファイルを選択
                </button>
                <span style={{ color: '#b0c4d8' }}>
                  {selectedFile ? `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)` : '(0 B)'}
                </span>
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#8CB4FF',
                marginTop: '4px'
              }}>
                {selectedFile ? `1 files (${(selectedFile.size / 1024).toFixed(1)} KB in total)` : '0 files (0 B in total)'}
              </div>
            </div>
            
            {/* ダウンロード可能日時 */}
            <div style={{
              marginBottom: '30px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#b0c4d8',
                marginBottom: '8px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                ダウンロード可能日時
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <input
                  type="datetime-local"
                  value={downloadDate}
                  onChange={(e) => setDownloadDate(e.target.value)}
                  style={{
                    flex: '1',
                    padding: '12px',
                    background: '#111A2E',
                    border: '1px solid #1E3A5F',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setDownloadDate('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#b0c4d8',
                    cursor: 'pointer',
                    padding: '0 8px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  </svg>
                </button>
              </div>
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
                transition: 'all 0.2s'
              }}
            >
              {isUploading ? 'アップロード中...' : 'マッチデータアップロード'}
            </button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MatchUploadPage;
