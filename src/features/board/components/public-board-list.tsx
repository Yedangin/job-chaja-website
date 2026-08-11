'use client';

import { CanonicalInfoBoardList } from './canonical-info-board-list';

export function PublicBoardList() {
  return <CanonicalInfoBoardList access="public" kind="notice" basePath="/notice" />;
}
