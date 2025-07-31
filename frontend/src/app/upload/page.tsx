'use client';

import type React from 'react';
import { useEffect } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { FileUploadForm } from '@/components/upload/FileUploadForm';
import { UploadProgress } from '@/components/upload/UploadProgress';
import { useAuth } from '@/hooks/useAuth';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { FileUploadOptions } from '@/types/file';

const TEAM_SPECIAL_TAGS = ['大会ゲスト許可', 'フリーOKE'];
const MAX_FILE_SIZE = 25; // KB

const TeamUploadPage: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const { uploadProgress, uploadTeamFile, resetUpload, isUploading } =
    useFileUpload({
      onSuccess: () => {
        // 成功時の処理は FileUploadForm 内で行う
      },
      onError: error => {
        console.error('Upload error:', error);
      },
    });

  const handleUpload = async (file: File, options: FileUploadOptions) => {
    await uploadTeamFile(file, isAuthenticated, options);
  };

  // コンポーネントマウント時にアップロード状態をリセット
  useEffect(() => {
    resetUpload();
  }, [resetUpload]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main
        style={{
          flex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* アップロード進捗表示 */}
          {uploadProgress.status !== 'idle' && (
            <UploadProgress
              progress={uploadProgress.progress}
              status={uploadProgress.status}
              error={uploadProgress.error}
            />
          )}

          {/* アップロードフォーム */}
          <FileUploadForm
            title="チームデータアップロード"
            subtitle="CHEファイル形式のチームデータをアップロードできます"
            fileType="team"
            maxFileSize={MAX_FILE_SIZE}
            specialTags={TEAM_SPECIAL_TAGS}
            isAuthenticated={isAuthenticated}
            defaultOwnerName={user?.name || ''}
            onSubmit={handleUpload}
            isUploading={isUploading}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeamUploadPage;
