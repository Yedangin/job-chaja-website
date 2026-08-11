'use client';

import { CanonicalInfoBoardList } from './canonical-info-board-list';

export function CompanyNoticeList() {
  return (
    <CanonicalInfoBoardList
      access="company"
      kind="notice"
      basePath="/company/support/notices"
    />
  );
}
