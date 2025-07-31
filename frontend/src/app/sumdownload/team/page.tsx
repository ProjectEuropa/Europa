'use client';

import { Suspense } from 'react';
import ClientSumDownloadTeamSearch from './ClientSumDownloadTeamSearch';

export default function SumDownloadTeamPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientSumDownloadTeamSearch />
    </Suspense>
  );
}
