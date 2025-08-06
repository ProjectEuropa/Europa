'use client';

import { Suspense } from 'react';
import { SumDownloadErrorBoundary } from '@/components/features/sumdownload/SumDownloadErrorBoundary';
import { Loading } from '@/components/ui/loading';
import ClientSumDownloadMatchSearch from './ClientSumDownloadMatchSearch';

export default function SumDownloadMatchPage() {
  return (
    <SumDownloadErrorBoundary>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <Loading />
          </div>
        }
      >
        <ClientSumDownloadMatchSearch />
      </Suspense>
    </SumDownloadErrorBoundary>
  );
}
