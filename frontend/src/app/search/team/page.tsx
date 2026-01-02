'use client';

import { Suspense } from 'react';
import ClientTeamSearch from './ClientTeamSearch';

export default function TeamSearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientTeamSearch />
    </Suspense>
  );
}
