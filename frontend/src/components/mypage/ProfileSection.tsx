'use client';

import type React from 'react';
import { useState } from 'react';
import { useProfile, useUpdateProfile } from '@/hooks/api/useMyPage';

const ProfileSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  const { data: profile, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const handleEditToggle = () => {
    if (isEditing) {
      // キャンセル時は元の値に戻す
      setTempName(profile?.name || '');
    } else {
      // 編集開始時に現在の値をセット
      setTempName(profile?.name || '');
    }
    setIsEditing(!isEditing);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  const handleSave = async () => {
    if (!tempName.trim()) {
      return;
    }

    await updateProfileMutation.mutateAsync({ name: tempName });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] mb-6 text-center">
        <div className="text-[#b0c4d8]">プロフィール情報を読み込み中...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] mb-6">
        <p className="text-[#ff6b6b] m-0">
          プロフィール情報の読み込みに失敗しました
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0A1022] rounded-xl p-6 border border-[#1E3A5F] mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[#00c8ff] text-2xl font-bold m-0">
          プロフィール情報
        </h2>
        <button
          onClick={handleEditToggle}
          className="bg-transparent border border-[#00c8ff] rounded-md text-[#00c8ff] py-2 px-4 text-[0.9rem] cursor-pointer"
        >
          {isEditing ? 'キャンセル' : '編集'}
        </button>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-4 mb-5">
        <div className="text-[#8CB4FF] text-base">名前</div>
        {isEditing ? (
          <input
            type="text"
            value={tempName}
            onChange={handleNameChange}
            placeholder="名前を入力してください"
            className="bg-[#0F1A2E] border border-[#1E3A5F] rounded-md text-white py-2 px-3 text-base w-full"
          />
        ) : (
          <div className="text-white text-base">{profile.name}</div>
        )}

        <div className="text-[#8CB4FF] text-base">メールアドレス</div>
        <div className="text-white text-base">{profile.email}</div>

        <div className="text-[#8CB4FF] text-base">登録日</div>
        <div className="text-white text-base">
          {profile.joinDate}
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending || !tempName.trim()}
            className={`bg-[#00c8ff] border-none rounded-md text-[#020824] py-2.5 px-5 text-base font-bold flex items-center gap-2 ${
              updateProfileMutation.isPending || !tempName.trim()
                ? 'cursor-not-allowed opacity-70'
                : 'cursor-pointer'
            }`}
          >
            {updateProfileMutation.isPending ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
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
              '保存'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
