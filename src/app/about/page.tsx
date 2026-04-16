import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-on-background">
      <nav className="sticky top-0 z-40 flex h-16 w-full max-w-full items-center justify-between border-b border-slate-200/50 bg-slate-50 px-8 font-headline text-sm font-medium tracking-tight">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tighter text-slate-700">
            Guardian AI
          </Link>
          <div className="hidden gap-6 md:flex">
            <Link href="/" className="rounded px-3 py-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
              Product
            </Link>
            <Link
              href="/solutions"
              className="rounded px-3 py-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            >
              Solutions
            </Link>
            <Link
              href="/pricing"
              className="rounded px-3 py-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            >
              Pricing
            </Link>
          </div>
        </div>
        <Link
          href="/auth"
          className="font-medium text-slate-600 transition-colors hover:bg-slate-100 px-4 py-2 rounded"
        >
          Sign In
        </Link>
      </nav>

      <main className="mx-auto flex w-full max-w-5xl flex-grow flex-col items-center gap-32 px-6 py-24 md:px-12">
        <header className="flex w-full max-w-3xl flex-col items-center gap-6 text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
            The Quiet Authority in Compliance.
          </h1>
          <p className="max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant md:text-xl">
            Guardian AI simplifies the complex landscape of enterprise security, transforming rigid regulatory requirements
            into intuitive, actionable intelligence. We believe trust is built on transparency and precision.
          </p>
        </header>

        <section className="grid w-full grid-cols-1 gap-16 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface">Our Mission</h2>
            <div className="flex flex-col gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-8">
              <p className="font-body text-base leading-relaxed text-on-surface">
                To provide organizations with the unshakeable confidence needed to operate in a heavily regulated world. We
                automate the mundane so security teams can focus on the strategic.
              </p>
              <p className="font-body text-base leading-relaxed text-on-surface">
                We are not just a tool; we are a foundational layer of operational integrity. By continuously monitoring and
                adapting to evolving frameworks, we ensure compliance is a continuous state, not an annual event.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface">Security Philosophy</h2>
            <div className="flex flex-col gap-4 rounded-xl border border-outline-variant/20 bg-surface-container p-8">
              <p className="font-body text-base leading-relaxed text-on-surface">
                Security is not a feature; it is the architecture. We employ a defense-in-depth approach, ensuring every line
                of code and every data transfer meets the highest institutional standards.
              </p>
              <ul className="mt-2 flex flex-col gap-3">
                {[
                  { icon: 'verified_user', label: 'Zero-Trust Architecture' },
                  { icon: 'enhanced_encryption', label: 'End-to-End Encryption' },
                  { icon: 'policy', label: 'Continuous Auditing' },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-3">
                    <span className="material-symbols-outlined fill text-primary">{item.icon}</span>
                    <span className="font-body text-sm font-medium text-on-surface-variant">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="flex w-full flex-col items-center gap-12">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">Leadership</h2>
            <p className="mt-3 font-body text-base text-on-surface-variant">
              Guided by decades of experience in enterprise security and regulatory law.
            </p>
          </div>
          <div className="grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                name: 'Eleanor Vance',
                role: 'Chief Executive Officer',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkJdROxjc4iGCdaBzYI8q4ZiobsR9nIAq7Tv6k4YALns7Geou0-p1WYy4gfjhNQ-veoG5tkStiUSpRWs5KT9TcfcR7-UrKMRuM39e4yML1zekaOOZWbv163A9O_mEjHom0a6rBtxEZ7kpFvEhsgNqaqMvPYmg5N9fn2aUGY7jZWEx5qX1I2im8vt9hd61m-qGo3sXIF5OtRuLeH3S0CdDUWIWMUiYVHwtINpRWiGzw9eOqEW2-MyxfFSY7xxJiKbuF9mNBZrf_Sm8W',
              },
              {
                name: 'Dr. Marcus Chen',
                role: 'Chief Technology Officer',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9bR1wwfugNdQt2r6nwixZx0qfYucwzoasZ9Anco8LEJhaXk_zl3b_MTpYecFgTeP6r5hRtHPXJnh9qYbV-3hqVGtziQ5eFAnNYVw5xYbUXUipwlCxLeAikY6jjSvuYBvab3EnplBEedVf8doHddlHqkxexLQnAievHeifYTGtmucuOedHAoqE-gmrUm3yAMbFxxIshogFd0fEKB7lXhtrmYMY4ZgIu03q-JyL1WDPs1ImAhBZfsmAxGq5jP8vWg9WYCMymBWDLveE',
              },
              {
                name: 'Sarah Jenkins',
                role: 'Chief Information Security Officer',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIpJqud_iEe9nBPL_tXrKgGvn5hm19vDuY1DAvT4M9yMOtd_8pfeA6YCERwVhyzDdlpr0ojlbZaU0p4S1CD5RrlEOA7hOUVIrYS7tp-T8psgV5xoYhuIAgBDYo0Ngx820S1tlMAIAR3mK72Xz4YgEEyg64jXXDk3WuqBEcuqBLyohyVASIan1165XAtuwT49WK1CkYjY5J20Id-q8C47-qmiA0fKjxOoeMBT2pJ5UuJlghk6QMnx-exrGz6NCShZL8FipBYMUjBN0Q',
              },
            ].map((person) => (
              <div
                key={person.name}
                className="flex flex-col items-center gap-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6"
              >
                <div className="h-24 w-24 overflow-hidden rounded-full bg-surface-container-highest">
                  <img alt="" src={person.img} className="h-full w-full object-cover" />
                </div>
                <div className="text-center">
                  <h3 className="font-headline text-lg font-bold text-on-surface">{person.name}</h3>
                  <p className="mt-1 font-label text-sm text-on-surface-variant">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 flex w-full flex-col items-center gap-6 rounded-xl border border-outline-variant/20 bg-surface-container p-12 text-center">
          <h2 className="font-headline text-2xl font-bold text-on-surface">Built for the Enterprise. Ready for the Future.</h2>
          <p className="max-w-xl font-body text-base text-on-surface-variant">
            Join the leading organizations that trust Guardian AI to protect their data, maintain compliance, and mitigate
            risk.
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-primary px-6 py-3 font-body text-sm font-medium text-on-primary shadow-sm hover:bg-primary-dim"
          >
            Contact Leadership
          </button>
        </section>
      </main>

      <footer className="mt-auto border-t border-outline-variant/20 bg-surface-container-low py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-12">
          <p className="font-label text-sm text-on-surface-variant">© 2024 Guardian AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="font-label text-sm text-on-surface-variant transition-colors hover:text-on-surface">
              Privacy Policy
            </a>
            <a href="#" className="font-label text-sm text-on-surface-variant transition-colors hover:text-on-surface">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
