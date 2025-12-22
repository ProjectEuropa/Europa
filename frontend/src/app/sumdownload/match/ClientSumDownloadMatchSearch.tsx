'use client';

import React from 'react';
import { SumDownloadSearchBase } from '../SumDownloadSearchBase';

const ClientSumDownloadMatchSearch: React.FC = () => {
  return (
    <SumDownloadSearchBase
      searchType="match"
      title="マッチデータ一括ダウンロード"
    />
  );
};

export default ClientSumDownloadMatchSearch;
