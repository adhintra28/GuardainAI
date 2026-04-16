import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

type MarketingHeaderProps = {
  /** Highlight nav item */
  active?: 'product' | 'solutions' | 'pricing' | 'docs';
};

export default function MarketingHeader({ active }: MarketingHeaderProps) {
  const link = (key: NonNullable<MarketingHeaderProps['active']>, href: string, label: string) => {
    const isActive = active === key;
    return (
      <Link
        href={href}
        className={
          isActive
            ? 'border-b-2 border-slate-600 px-3 py-2 font-semibold text-slate-900'
            : 'px-3 py-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800'
        }
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full max-w-full items-center justify-between border-b border-slate-200/50 bg-surface-container-lowest/90 px-8 font-headline text-sm font-medium tracking-tight backdrop-blur-md">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold tracking-tighter text-on-surface">
          Guardian AI
        </Link>
        <nav className="hidden gap-6 md:flex">
          {link('product', '/', 'Product')}
          {link('solutions', '/solutions', 'Solutions')}
          {link('pricing', '/pricing', 'Pricing')}
          {link('docs', '#', 'Documentation')}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <SignedOut>
          <Link
            href="/auth"
            className="hidden font-semibold text-on-surface-variant transition-colors hover:text-on-surface md:block"
          >
            Login
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-md bg-on-surface px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-on-surface/90"
          >
            Sign up for free
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}
