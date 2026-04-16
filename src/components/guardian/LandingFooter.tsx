import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="bg-inverse-surface px-6 pt-16 pb-8 md:px-12 lg:px-24">
      <div className="mx-auto mb-12 grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <span className="mb-4 block text-xl font-bold tracking-tighter text-white">Guardian AI</span>
          <p className="max-w-xs text-xs leading-relaxed text-inverse-on-surface">
            Enterprise compliance, simplified through artificial intelligence.
          </p>
        </div>
        <div>
          <h4 className="mb-6 text-sm font-semibold text-white">Product</h4>
          <ul className="space-y-4 text-xs text-inverse-on-surface">
            <li>
              <Link href="/solutions" className="transition-colors hover:text-white">
                AI Agents
              </Link>
            </li>
            <li>
              <Link href="/solutions" className="transition-colors hover:text-white">
                Policy Automation
              </Link>
            </li>
            <li>
              <Link href="/scanner" className="transition-colors hover:text-white">
                Continuous Scanning
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="transition-colors hover:text-white">
                Pricing
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 text-sm font-semibold text-white">Solutions</h4>
          <ul className="space-y-4 text-xs text-inverse-on-surface">
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Financial Services
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Healthcare
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Startups
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Enterprise
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 text-sm font-semibold text-white">Resources</h4>
          <ul className="space-y-4 text-xs text-inverse-on-surface">
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                API Reference
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Security
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 text-sm font-semibold text-white">Company</h4>
          <ul className="space-y-4 text-xs text-inverse-on-surface">
            <li>
              <Link href="/about" className="transition-colors hover:text-white">
                About
              </Link>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-white">
                Legal
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-inverse-on-surface md:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tighter text-white">Guardian AI</span>
          <p>Copyright © 2024 Guardian AI Inc.</p>
        </div>
        <div className="flex gap-4">
          <a href="#" className="transition-colors hover:text-white">
            <span className="material-symbols-outlined text-[18px]">link</span>
          </a>
          <a href="#" className="transition-colors hover:text-white">
            <span className="material-symbols-outlined text-[18px]">mail</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
