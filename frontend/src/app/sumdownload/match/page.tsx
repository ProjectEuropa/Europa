'use client';

import { Suspense } from 'react';
import ClientSumDownloadMatchSearch from './ClientSumDownloadMatchSearch';

export default function SumDownloadMatchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientSumDownloadMatchSearch />
    </Suspense>
  );
}
