import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
    setValue,
    watch,
    formState: { errors },
  } = useForm<SumDownloadSearchFormData>({
    resolver: zodResolver(sumDownloadSearchSchema),
    defaultValues: {
      query: initialQuery,
    },
  });

  const queryValue = watch('query');

  const onSubmit = (data: SumDownloadSearchFormData) => {
    onSearch(data.query.trim());
  };

  const handleClear = () => {
    setValue('query', '');
    onSearch('');
  };

  const placeholderText =
    searchType === 'team' ? 'チーム名で検索' : 'マッチ名で検索';

  return (
    <div className="w-full max-w-3xl relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flex items-center w-full"
      >
        <div className="
          w-full flex items-center 
          bg-slate-900 
          border border-slate-700 
          rounded-full 
          overflow-hidden 
          shadow-[0_0_10px_rgba(0,0,0,0.3)] 
          focus-within:border-cyan-500 
          focus-within:shadow-[0_0_15px_rgba(6,182,212,0.3)] 
          transition-all duration-300
        ">
          <input
            {...register('query')}
            type="text"
            placeholder={placeholderText}
            disabled={loading}
            className="
              w-full px-6 py-3.5 
              bg-transparent 
              text-white text-lg 
              placeholder-slate-400 
              border-none outline-none 
              appearance-none
            "
            aria-label="検索ワード"
            autoComplete="off"
          />

          {/* クリアボタン */}
          {queryValue && (
            <button
              type="button"
              onClick={handleClear}
              className="
                p-2 mr-1
                text-slate-400 
                hover:text-white 
                transition-colors duration-200
                focus:outline-none focus:text-white
              "
              aria-label="検索をクリア"
            >
              <X size={20} />
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`
              flex items-center justify-center 
              w-12 h-12 m-1.5 rounded-full 
              border-none 
              bg-gradient-to-r from-blue-600 to-cyan-500 
              text-white 
              transition-all duration-300 
              ${loading
                ? 'opacity-60 cursor-not-allowed'
                : 'opacity-100 hover:shadow-[0_0_10px_rgba(6,182,212,0.6)] cursor-pointer'
              }
            `}
            aria-label="検索実行"
          >
            <Search size={22} strokeWidth={2.5} />
          </button>
        </div>

        {errors.query && (
          <p className="absolute top-full left-6 mt-1 text-red-400 text-sm whitespace-nowrap">
            {errors.query.message}
          </p>
        )}
      </form>
    </div>
  );
};
