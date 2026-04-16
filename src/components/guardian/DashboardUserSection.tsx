'use client';

import { UserButton } from '@clerk/nextjs';

export function DashboardUserSection() {
  return (
    <div className="mt-4 border-t border-outline-variant/20 px-2 pt-4">
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: 'h-9 w-9',
          },
        }}
      />
    </div>
  );
}
