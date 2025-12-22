'use client';

import React from 'react';
import { SumDownloadSearchBase } from '../SumDownloadSearchBase';

const ClientSumDownloadTeamSearch: React.FC = () => {
  return (
    <SumDownloadSearchBase
      searchType="team"
      title="チームデータ一括ダウンロード"
    />
  );
};

export default ClientSumDownloadTeamSearch;
