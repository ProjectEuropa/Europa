'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import TeamCards, { TeamData } from '@/components/search/TeamCards';
import { searchTeams } from '@/utils/api';
import ClientMatchSearch from './ClientMatchSearch';

export default function MatchSearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientMatchSearch />
    </Suspense>
  );
}
