import Link from 'next/link';
import LandingFooter from '@/components/guardian/LandingFooter';
import MarketingHeader from '@/components/guardian/MarketingHeader';

export default function LandingPage() {
  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-background opacity-[0.07] neural-bg-dots" />
      <MarketingHeader active="product" />

      <main>
        <section className="relative flex min-h-[600px] flex-col items-center px-6 pt-32 pb-24 text-center md:px-12 lg:px-24">
          <div className="pointer-events-none absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] neural-bg-dots [background-size:100px_100px]" />
          <div className="relative z-10 flex max-w-4xl flex-col items-center">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-outline-variant/30 bg-surface-container-lowest px-4 py-1.5 text-xs font-semibold text-on-surface-variant shadow-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                Compliance
              </span>
              <span className="h-1 w-1 rounded-full bg-outline-variant" />
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">security</span>
                Security
              </span>
              <span className="h-1 w-1 rounded-full bg-outline-variant" />
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                AI Agents
              </span>
            </div>
            <h1 className="mb-6 font-headline text-5xl font-extrabold leading-[1.1] tracking-tighter text-on-surface md:text-7xl">
              AI-Powered Compliance <br className="hidden md:block" />
              for Modern Businesses
            </h1>
            <p className="mb-10 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant md:text-xl">
              Automate complex regulatory requirements, identify risks proactively, and ensure audit readiness
              with our enterprise-grade AI engine.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-md bg-on-surface px-6 py-3 text-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-on-surface/90"
              >
                Get Started
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-md border border-outline-variant/30 bg-surface-container-lowest px-6 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
              >
                Contact Sales
              </Link>
            </div>
            <p className="mt-4 text-xs text-on-surface-variant">No credit card required.</p>
          </div>
        </section>

        <section className="relative z-10 border-b border-surface-container bg-surface-container-lowest py-12">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-12 px-6 opacity-70 grayscale md:px-12">
            {[
              'https://lh3.googleusercontent.com/aida-public/AB6AXuADKTl5FQBzYSz2BJCtF3T_YDMMb0Gr2hoGeTDMj7fYKvR3F3kuHebHlGNy7G6qMfmWtGVwIAJZbCbVts7RtdemOjJcg-hpyx3CNY2noQxqBlcmHT33pbBOV6LUBR8W9kLiUYvO3a-dfRjBF0RPhv6gk2bV7wSGFdLAMCQQiF1Hy7xDy-V1hqQ1WZP2RLTLLR0bPZ-RZ93GqNdNYphW9KARXEbU-BSf7v1nTThEEAZ9goJxS0XR7rvrzHMb7pVRtVJXYc1m7Iiq1zUU',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCqzWoxW-izJ-R4Ni4W6bH1GJ6PkRPbsudMydHOCLoHFJrr1955bQaZc6ekA8MB2QdiipgoXQtIJxwIy6LhR98VX0Dw39evPIlL-x_pzHzDhKdACYgCNISpqvCQLMfxHRb4F23aRiYm-C6dwMlrMjje-RpMDOXT9QzvCzeauCCfCgQlAkUTOqN1Qp4OoTwKRW2rMiEBJ8idwgydh-My2QLDbK7gOsfIuFg_rJ5bjXOLfTCIAUvZgJbEoElrpyj4C06mTE6tMWoXS5IV',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDXk6WhV7BtpgFbhOAB68suZqbXOQnqAEBVlaOCqEh8yyLSpBHV0anO5ChyBGAFxcTk2ayoBGpBXbpP6RzoIu-pVfmAxcK1TWG6MK7X0cSZ70H5kAu47LFphoR_7itPD7-MEZ0ST1Ij7ekxTR_BWNGzqb58iiDXXa5_0S8VUGtWo4IHR3HpCUJVlQY7Nn0q5d-Nmyg7rCLixZFaOA_FFieBRvpQUVpQo68vgeQDAih5S7mJRugFQcRnmIelBy0rLQfK6l_tGayvJjFU',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCu1B2BFe186pgysA55K_cC078Jqhg5lsADxnn-RJctxPPsWx18jBhuUVAYx8xqdM4QnR5nNbjIIo84xlM-kSDTfB2AXWKgFcBaikGIdJ63Jzv4qOB06BgtJrL3wRtHpC7gno97kRyiQukAk8wXAUwiSWTrh2RboRl5qH8ZzibEt4Bqa6z8_U5hWqgBU_tE29JO3x1W-3y0e_E3B9f3il_z_r945_h8jYe6pSh1sof3jf4OOBJ1Zde-Ip1n1qZdvYLrIM7a4sdsQqBc',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAzr-GETZuKv2psS5cH_69_zXEM0F26Gj9ezY362QVsiv4Dtdb5dPmOmpa3pAwRf0nCneLdx3hDzO17TKwaCk-yuKHL0d4mcwRs0pFxmD859AUVWu3TVmWU_4G9X8GjLzv0W5NLfVeZQ2MT4bK0CSNdqUkAm05Flw97TvC2MeDHHs5_jVpyCDM8j5QV7drB0o8VleWAHiYy58nVTs8cXyGzWm6Yr7X7WWdHe8Q9blyuDktwe5NfWll_pYyIiEwYmzqoR1LXATy6Py_C',
            ].map((src, i) => (
              <img key={i} src={src} alt="" className="h-6 object-contain md:h-8" />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 md:px-12 lg:px-24">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-6 font-headline text-3xl font-bold tracking-tight text-on-surface md:text-5xl">
              Build compliance workflows your way
            </h2>
            <p className="font-body text-lg text-on-surface-variant">
              Continuous monitoring and automated workflows to keep your organization secure and compliant,
              whether you use our dashboard or API.
            </p>
          </div>
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                icon: 'policy',
                title: 'Policy Automation',
                desc: 'Automatically map controls to regulatory frameworks and generate compliance documentation instantly with our programmable API.',
                checks: ['Auto-mapping', 'Custom controls'],
                cta: 'Explore API',
                href: '/dashboard',
              },
              {
                icon: 'troubleshoot',
                title: 'Continuous Scanning',
                desc: 'Real-time monitoring of your infrastructure to detect misconfigurations and vulnerabilities without writing a single line of code.',
                checks: ['Real-time alerts', 'One-click remediation'],
                cta: 'Start Scanning',
                href: '/scanner',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-10 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="mb-8 flex min-h-[200px] items-center justify-center rounded-lg bg-surface-container p-6">
                  <span className="material-symbols-outlined text-5xl text-primary">{card.icon}</span>
                </div>
                <h3 className="mb-3 font-headline text-2xl font-bold text-on-surface">{card.title}</h3>
                <p className="mb-6 text-base leading-relaxed text-on-surface-variant">{card.desc}</p>
                <div className="mb-8 flex flex-wrap gap-4 text-sm font-medium text-on-surface-variant">
                  {card.checks.map((c) => (
                    <span key={c} className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                      {c}
                    </span>
                  ))}
                </div>
                <Link
                  href={card.href}
                  className="inline-flex items-center justify-center rounded-md bg-on-surface px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-on-surface/90"
                >
                  {card.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-surface-container bg-surface-container-lowest px-6 py-24 md:px-12 lg:px-24">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="mb-16 font-headline text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
              Enterprise-grade security & compliance
            </h2>
            <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                ['SOC2', 'SOC 2 Type II'],
                ['ISO', 'ISO 27001'],
                ['HIPAA', 'HIPAA'],
                ['GDPR', 'GDPR Ready'],
              ].map(([a, b]) => (
                <div key={a} className="flex flex-col items-center justify-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-outline-variant/30 font-headline text-xl font-bold text-on-surface">
                    {a}
                  </div>
                  <span className="text-sm font-semibold text-on-surface-variant">{b}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 border-t border-surface-container pt-12 text-left md:grid-cols-3">
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-bold text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">lock</span>
                  Encryption everywhere
                </h4>
                <p className="text-sm text-on-surface-variant">TLS in transit. AES-256 at rest. No exceptions.</p>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-bold text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">public</span>
                  Data residency
                </h4>
                <p className="text-sm text-on-surface-variant">
                  Choose US, EU, or APAC. Your data stays where you need it.
                </p>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-bold text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">fact_check</span>
                  Audit-ready
                </h4>
                <p className="text-sm text-on-surface-variant">
                  Full access logs, RBAC, and compliance reports on demand.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-inverse-surface px-6 py-24 text-center md:px-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 font-headline text-3xl font-bold tracking-tight text-white md:text-4xl">
              Ready to streamline your compliance?
            </h2>
            <p className="mb-10 text-lg text-inverse-on-surface">
              Get $10 in free credits. No credit card required. Deploy your first policy in under 10 minutes.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-md bg-white px-8 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
            >
              Sign up for free
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
