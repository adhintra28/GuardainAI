import MarketingHeader from '@/components/guardian/MarketingHeader';

const tiers = [
  {
    name: 'Starter',
    desc: 'Essential compliance scanning for small teams.',
    price: '$499',
    suffix: '/mo',
    cta: 'Get Started',
    ctaClass: 'bg-surface-container-highest text-on-surface hover:bg-surface-container',
    highlight: false,
    features: [
      'Up to 50 assets',
      'Daily automated scans',
      'Standard compliance frameworks (SOC2, HIPAA)',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    desc: 'Advanced security posture management for growing organizations.',
    price: '$1,299',
    suffix: '/mo',
    cta: 'Start Free Trial',
    ctaClass: 'bg-primary text-on-primary hover:bg-primary-dim shadow-sm',
    highlight: true,
    features: [
      'Up to 500 assets',
      'Continuous real-time scanning',
      'All compliance frameworks + custom rules',
      'API access & Integrations (Jira, Slack)',
      'Priority 24/7 support',
    ],
  },
  {
    name: 'Enterprise',
    desc: 'Tailored solutions for complex, multi-cloud environments.',
    price: 'Custom',
    suffix: '',
    cta: 'Contact Sales',
    ctaClass: 'bg-surface-container-highest text-on-surface hover:bg-surface-container',
    highlight: false,
    features: [
      'Unlimited assets',
      'Dedicated infrastructure options',
      'Advanced RBAC & SSO (SAML/OIDC)',
      'Dedicated Technical Account Manager',
      'Custom SLAs',
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background">
      <MarketingHeader active="pricing" />
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col items-center px-6 py-24 sm:px-12 lg:px-24">
        <header className="mb-20 max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-on-surface md:text-5xl">
            Simple, transparent pricing for enterprise compliance.
          </h1>
          <p className="font-body text-lg text-on-surface-variant">
            Scale your security posture with plans designed for modern infrastructure. No hidden fees, no complex tiers.
          </p>
        </header>

        <div className="mb-32 grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-md border bg-surface-container-lowest p-8 shadow-[0_12px_32px_-4px_rgba(42,52,57,0.06)] ${
                t.highlight ? 'border-primary/50' : 'border-outline-variant/20 hover:border-primary/30'
              } transition-colors`}
            >
              {t.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wider text-on-primary uppercase">
                  Most Popular
                </div>
              )}
              <h3 className="mb-2 text-xl font-bold text-on-surface">{t.name}</h3>
              <p className="mb-6 h-10 text-sm text-on-surface-variant">{t.desc}</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-on-surface">{t.price}</span>
                {t.suffix && <span className="text-sm text-on-surface-variant">{t.suffix}</span>}
              </div>
              <button type="button" className={`mb-8 w-full rounded-md py-3 font-semibold transition-colors ${t.ctaClass}`}>
                {t.cta}
              </button>
              <ul className="flex-grow space-y-4 text-sm text-on-surface-variant">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-lg text-primary">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
