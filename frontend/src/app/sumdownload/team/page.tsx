'use client';

import { Suspense } from 'react';
import { SumDownloadErrorBoundary } from '@/components/features/sumdownload/SumDownloadErrorBoundary';
import { Loading } from '@/components/ui/loading';
import ClientSumDownloadTeamSearch from './ClientSumDownloadTeamSearch';

export default function SumDownloadTeamPage() {
  return (
    <SumDownloadErrorBoundary>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <Loading />
          </div>
        }
      >
        <ClientSumDownloadTeamSearch />
      </Suspense>
    </SumDownloadErrorBoundary>
  );
}
