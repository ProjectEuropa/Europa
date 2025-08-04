import type React from 'react';
import Icons from './Icons';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  iconSize?: number;
  iconColor?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  description = '',
  className = '',
  iconSize = 24,
  iconColor = '#00c8ff',
}) => {
  // エンコードされたURL、タイトル、説明
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const _encodedDescription = encodeURIComponent(description);

  // 各SNSのシェアURL
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  // 新しいウィンドウでシェアリンクを開く関数
  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button
        onClick={() => handleShare(twitterUrl)}
        className="transition-transform hover:scale-110 focus:outline-none"
        aria-label="Share on Twitter"
      >
        <Icons.Twitter size={iconSize} color={iconColor} />
      </button>

      <button
        onClick={() => handleShare(facebookUrl)}
        className="transition-transform hover:scale-110 focus:outline-none"
        aria-label="Share on Facebook"
      >
        <Icons.Facebook size={iconSize} color={iconColor} />
      </button>

      <button
        onClick={() => handleShare(linkedInUrl)}
        className="transition-transform hover:scale-110 focus:outline-none"
        aria-label="Share on LinkedIn"
      >
        <Icons.LinkedIn size={iconSize} color={iconColor} />
      </button>

      <button
        onClick={() => {
          if (navigator.share) {
            navigator
              .share({
                title,
                text: description,
                url,
              })
              .catch(console.error);
          }
        }}
        className="transition-transform hover:scale-110 focus:outline-none"
        aria-label="Share"
      >
        <Icons.Share size={iconSize} color={iconColor} />
      </button>
    </div>
  );
};

export default ShareButtons;
