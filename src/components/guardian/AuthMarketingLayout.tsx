import Link from 'next/link';
import { AuthClerkPanel } from '@/components/guardian/AuthClerkPanel';
import { AuthRedirectWhenSignedIn } from '@/components/guardian/AuthRedirectWhenSignedIn';
import { authAppearance } from '@/lib/authAppearance';

const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDOKMPdSq6rA8871do73iwAIy26Mu9V1TCzm7rhDygRPoAO14gf-JLlZLqbWKkb12-D-mOBHxEIz5rENLCyORw6QMfD0oHg_Wajwj3MYOwWgl1EpLBNhOntdfcHYM5FNjqhPIlfYQDLGMS_b-DuYsK--NwRnmvVHpDFQgsZDkaTyPNnEAgIk5r3fu1makJv4NpWzZ71tM7_Dapi4IK_U5sPuUvxonGYHUVSl0v2Rco5Kv_zkA3zGE3KmR96u1cRWBdfKp9aHmzQPDVy';

type Variant = 'sign-in' | 'sign-up';

export default function AuthMarketingLayout({ variant }: { variant: Variant }) {
  const isSignUp = variant === 'sign-up';

  const hero = isSignUp
    ? {
        title: 'Start your compliance journey',
        bullets: [
          ['check_circle', 'Guided onboarding'],
          ['description', 'Policy templates'],
          ['shield', 'Audit-ready trails'],
        ] as const,
        heading: 'Create your account',
        description: 'Join teams using Guardian AI for continuous compliance.',
      }
    : {
        title: 'The Quiet Authority in Compliance',
        bullets: [
          ['check_circle', 'Real-time monitoring'],
          ['description', 'Automated reporting'],
          ['shield', 'Enterprise-grade security'],
        ] as const,
        heading: 'Sign in to your account',
        description: 'Use your work email or SSO to access the platform.',
      };

  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row">
      <AuthRedirectWhenSignedIn redirectUrl="/dashboard" />
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-gradient-to-br from-primary to-primary-dim p-12 text-on-primary lg:flex">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
          <img src={HERO_IMG} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-primary-container/10 blur-3xl" />
        <div className="relative z-10 mb-12 flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl fill">security</span>
          <span className="font-headline text-2xl font-bold tracking-tighter">Guardian AI</span>
        </div>
        <div className="relative z-10 flex max-w-md flex-1 flex-col justify-center">
          <h2 className="mb-6 font-headline text-4xl font-bold leading-tight tracking-tight">{hero.title}</h2>
          <ul className="space-y-4">
            {hero.bullets.map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">{icon}</span>
                <span className="text-lg opacity-90">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 mt-12 text-sm opacity-70">
          <p>© 2024 Guardian AI Inc. All rights reserved.</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 flex flex-col items-center justify-center lg:hidden">
            <div className="mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined fill text-3xl text-primary">security</span>
              <span className="font-headline text-2xl font-bold tracking-tighter text-on-surface">
                Guardian AI
              </span>
            </div>
          </div>
          <div className="mb-10 text-center lg:text-left">
            <h1 className="mb-2 font-headline text-2xl font-semibold tracking-tight text-on-surface">
              {hero.heading}
            </h1>
            <p className="font-body text-sm text-on-surface-variant">{hero.description}</p>
          </div>

          <div className="flex w-full min-w-0 justify-center lg:justify-start">
            <AuthClerkPanel mode={isSignUp ? 'sign-up' : 'sign-in'} appearance={authAppearance} />
          </div>

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            <Link href="/" className="text-primary hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
