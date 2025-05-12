"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { searchTeams } from '@/utils/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamCards, { TeamData } from '@/components/search/TeamCards';

import { Suspense } from 'react';
import ClientMatchSearch from './ClientMatchSearch';

export default function MatchSearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientMatchSearch />
    </Suspense>
  );
}
