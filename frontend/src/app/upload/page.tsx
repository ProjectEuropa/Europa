'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Calendar from '../../components/Calendar';

const UploadPage: React.FC = () => {
  const [ownerName, setOwnerName] = useState('');
  const [comment, setComment] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [deletePassword, setDeletePassword] = useState('');
  const [downloadDate, setDownloadDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
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

  const handleDateSelect = (date: Date) => {
    // 日付と時間を設定（時間は現在時刻を使用）
    const now = new Date();
    date.setHours(now.getHours());
    date.setMinutes(now.getMinutes());
    
    // ISO文字列に変換して、datetime-local入力用にフォーマット
    const isoString = date.toISOString();
    const formattedDate = isoString.substring(0, isoString.length - 8); // 秒とミリ秒を削除
    
    setDownloadDate(formattedDate);
    setShowCalendar(false);
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
      alert('チームデータがアップロードされました');
      
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
            <h1 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              チームデータアップロード
            </h1>
          </div>
          
          {/* フォーム部分 */}
          <form onSubmit={handleSubmit} style={{
            padding: '30px'
          }}>
            {/* オーナー名 */}
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                オーナー名
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="あなたの名前を入力"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111A2E',
                  border: '1px solid #1E3A5F',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            {/* コメント */}
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                コメント
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="チームについての説明や特徴を入力"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111A2E',
                  border: '1px solid #1E3A5F',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>
            
            {/* タグ */}
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
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                タグ
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '8px'
              }}>
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
                      color: '#00c8ff'
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
                        justifyContent: 'center'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  ref={tagInputRef}
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyDown}
                  placeholder="タグを入力（Enterキーで追加）"
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
                    marginLeft: '8px',
                    padding: '12px',
                    background: '#1E3A5F',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#00c8ff',
                    cursor: 'pointer'
                  }}
                >
                  追加
                </button>
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#8CB4FF',
                marginTop: '4px'
              }}>
                タグは複数入力できます。カンマで区切るか、Enterキーで追加します。
              </div>
            </div>
            
            {/* 削除パスワード */}
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                削除パスワード
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="削除時に必要なパスワードを設定"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111A2E',
                  border: '1px solid #1E3A5F',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <div style={{
                fontSize: '0.8rem',
                color: '#8CB4FF',
                marginTop: '4px'
              }}>
                このパスワードはチームデータを削除する際に必要です。忘れないようにしてください。
              </div>
            </div>
            
            {/* ファイル選択 */}
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
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                チームデータファイル
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                required
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
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
              marginBottom: '30px',
              position: 'relative'
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
                  onClick={() => setShowCalendar(!showCalendar)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#00c8ff',
                    cursor: 'pointer',
                    padding: '0 8px'
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#00c8ff" strokeWidth="2"/>
                    <path d="M3 10H21" stroke="#00c8ff" strokeWidth="2"/>
                    <path d="M8 2L8 6" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 2L16 6" stroke="#00c8ff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              
              {showCalendar && (
                <div 
                  onClick={(e) => e.stopPropagation()}
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
                    pointerEvents: 'auto'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <button
                      onClick={(e) => {
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
                        height: '30px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <Calendar 
                    initialDate={downloadDate ? new Date(downloadDate) : new Date()}
                    onSelect={handleDateSelect}
                    size="small"
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
                transition: 'all 0.2s'
              }}
            >
              {isUploading ? 'アップロード中...' : 'チームデータアップロード'}
            </button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadPage;
