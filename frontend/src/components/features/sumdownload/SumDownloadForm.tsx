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
    onSearch(data.query);
  };

  const placeholderText =
    searchType === 'team' ? 'チーム名で検索' : 'マッチ名で検索';

  return (
    <div style={{ display: 'flex', marginBottom: '24px', alignItems: 'center' }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: 'flex',
          flex: 1,
          position: 'relative',
          marginRight: '16px',
        }}
      >
        <input
          {...register('query')}
          type="text"
          placeholder={placeholderText}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 20px',
            paddingRight: '60px',
            borderRadius: '50px',
            border: 'none',
            background: '#020824',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
            boxShadow: 'inset 0 0 0 2px #1E3A5F',
          }}
          aria-label="検索ワード"
        />
        {errors.query && (
          <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px' }}>
            {errors.query.message}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            position: 'absolute',
            right: 4,
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
