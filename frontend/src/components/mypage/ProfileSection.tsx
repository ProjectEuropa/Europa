'use client';

import React, { useState } from 'react';

interface ProfileData {
  name: string;
  email: string;
  joinDate: string;
}

interface ProfileSectionProps {
  initialProfile: ProfileData;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ initialProfile }) => {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(initialProfile.name);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      // キャンセル時は元の値に戻す
      setTempName(profile.name);
    }
    setIsEditing(!isEditing);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  const handleSave = () => {
    if (!tempName.trim()) {
      alert('名前を入力してください');
      return;
    }

    setIsSaving(true);

    // 実際のアプリケーションではここでAPIを呼び出してデータを更新
    console.log('更新データ:', { ...profile, name: tempName });

    // 更新の模擬（実際のアプリケーションではAPIコールに置き換え）
    setTimeout(() => {
      setProfile(prev => ({ ...prev, name: tempName }));
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div style={{
      background: '#0A1022',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #1E3A5F',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{
          color: '#00c8ff',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          margin: 0
        }}>
          プロフィール情報
        </h2>
        <button
          onClick={handleEditToggle}
          style={{
            background: 'transparent',
            border: '1px solid #00c8ff',
            borderRadius: '6px',
            color: '#00c8ff',
            padding: '8px 16px',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          {isEditing ? 'キャンセル' : '編集'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ color: '#8CB4FF', fontSize: '1rem' }}>名前</div>
        {isEditing ? (
          <input
            type="text"
            value={tempName}
            onChange={handleNameChange}
            style={{
              background: '#0F1A2E',
              border: '1px solid #1E3A5F',
              borderRadius: '6px',
              color: 'white',
              padding: '8px 12px',
              fontSize: '1rem',
              width: '100%'
            }}
          />
        ) : (
          <div style={{ color: 'white', fontSize: '1rem' }}>{profile.name}</div>
        )}

        <div style={{ color: '#8CB4FF', fontSize: '1rem' }}>メールアドレス</div>
        <div style={{ color: 'white', fontSize: '1rem' }}>{profile.email}</div>

        <div style={{ color: '#8CB4FF', fontSize: '1rem' }}>登録日</div>
        <div style={{ color: 'white', fontSize: '1rem' }}>{profile.joinDate}</div>
      </div>

      {isEditing && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              background: '#00c8ff',
              border: 'none',
              borderRadius: '6px',
              color: '#020824',
              padding: '10px 20px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isSaving ? (
              <>
                <svg
                  style={{
                    width: '20px',
                    height: '20px',
                    animation: 'spin 1s linear infinite'
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="6" y2="12"></line>
                  <line x1="18" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                保存中...
              </>
            ) : (
              <>保存</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
