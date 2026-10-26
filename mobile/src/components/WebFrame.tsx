import React from 'react';

/** Native: renders children as-is. (Web version in WebFrame.web.tsx shows the app inside a phone frame.) */
export default function WebFrame({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
