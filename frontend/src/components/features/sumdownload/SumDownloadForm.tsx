import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const sumDownloadSearchSchema = z.object({
  query: z.string().max(100, '検索クエリは100文字以内で入力してください'),
});

type SumDownloadSearchFormData = z.infer<typeof sumDownloadSearchSchema>;

interface SumDownloadFormProps {
  searchType: 'team' | 'match';
  onSearch: (query: string) => void;
  loading?: boolean;
  initialQuery?: string;
}

export const SumDownloadForm = ({
  searchType,
  onSearch,
  loading = false,
  initialQuery = '',
}: SumDownloadFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SumDownloadSearchFormData>({
    resolver: zodResolver(sumDownloadSearchSchema),
    defaultValues: {
      query: initialQuery,
    },
  });

  const onSubmit = (data: SumDownloadSearchFormData) => {
    onSearch(data.query.trim());
  };

  const placeholderText =
    searchType === 'team' ? 'チーム名で検索' : 'マッチ名で検索';

  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      position: 'relative',
    }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#111A2E',
          borderRadius: '9999px',
          border: '1px solid #1E3A5F',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <input
          {...register('query')}
          type="text"
          placeholder={placeholderText}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 24px',
            paddingRight: '50px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '1.1rem',
          }}
          aria-label="検索ワード"
        />
        {errors.query && (
          <p style={{ 
            color: '#ef4444', 
            fontSize: '0.875rem', 
            position: 'absolute',
            top: '100%',
            left: '24px',
            marginTop: '4px',
            whiteSpace: 'nowrap'
          }}>
            {errors.query.message}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#3B82F6',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            cursor: loading ? 'not-allowed' : 'pointer',
            height: 40,
            width: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        aria-label="検索実行"
      >
          <Search style={{ width: '18px', height: '18px' }} />
        </button>
      </form>
    </div>
  );
};
