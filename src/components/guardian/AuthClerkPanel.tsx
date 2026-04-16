'use client';

import { SignIn, SignUp, useAuth } from '@clerk/nextjs';
import type { ComponentProps } from 'react';

type AppearanceProp = ComponentProps<typeof SignIn>['appearance'];

type AuthClerkPanelProps = {
  mode: 'sign-in' | 'sign-up';
  appearance: AppearanceProp;
};

export function AuthClerkPanel({ mode, appearance }: AuthClerkPanelProps) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div
        className="flex min-h-[22rem] w-full items-center justify-center rounded-lg border border-outline-variant/25 bg-surface-container-lowest px-4 py-12 text-center text-sm text-on-surface-variant"
        aria-busy="true"
      >
        Loading sign-in…
      </div>
    );
  }

  const mergedAppearance: AppearanceProp = {
    ...appearance,
    elements: {
      rootBox: 'w-full max-w-full min-w-0',
      card: 'w-full max-w-full shadow-sm border border-outline-variant/20',
    },
  };

  if (mode === 'sign-up') {
    return (
      <div className="w-full min-w-0">
        <SignUp
          routing="hash"
          signInUrl="/auth"
          fallbackRedirectUrl="/dashboard"
          appearance={mergedAppearance}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <SignIn
        routing="hash"
        signUpUrl="/auth/sign-up"
        fallbackRedirectUrl="/dashboard"
        appearance={mergedAppearance}
      />
    </div>
  );
}
