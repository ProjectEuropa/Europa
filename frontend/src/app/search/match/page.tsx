'use client';

import { Suspense } from 'react';
import ClientMatchSearch from './ClientMatchSearch';

export default function MatchSearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientMatchSearch />
    </Suspense>
  );
}
