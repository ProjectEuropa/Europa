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

const MATCH_SPECIAL_TAGS = ['フルリーグ', 'ハーフリーグ', '上級演習所'];
const MAX_FILE_SIZE = 260; // KB

const MatchUploadPage: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const { uploadProgress, uploadMatchFile, resetUpload, isUploading } =
    useFileUpload({
      onSuccess: () => {
        // 成功時の処理は FileUploadForm 内で行う
      },
      onError: error => {
        console.error('Upload error:', error);
      },
    });

  const handleUpload = async (file: File, options: FileUploadOptions) => {
    await uploadMatchFile(file, isAuthenticated, options);
  };

  // コンポーネントマウント時にアップロード状態をリセット
  useEffect(() => {
    resetUpload();
  }, [resetUpload]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto py-8 px-4 w-full">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
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
            title="マッチデータアップロード"
            subtitle="CHEファイル形式のマッチデータをアップロードできます"
            fileType="match"
            maxFileSize={MAX_FILE_SIZE}
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

export default MatchUploadPage;
