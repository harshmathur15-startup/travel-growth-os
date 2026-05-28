import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/5 bg-background/80 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500">
              <TrendingUp className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold">
              GrowthOS<span className="text-indigo-400">.travel</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: May 2026
        </p>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly — such as your name,
              business name, email address, website URL, and business category —
              when you create an account or run an audit. We also collect usage
              data about how you interact with the platform.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">
              2. How We Use Your Information
            </h2>
            <p>
              We use your information to provide and improve our AI growth audit
              service, send you audit results and recommendations, communicate
              platform updates, and personalise your experience. We do not sell
              your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">
              3. Data We Analyse
            </h2>
            <p>
              When you submit a website or social profile URL for audit, our AI
              agents access publicly available information on those pages. We do
              not access private account data without explicit OAuth
              authorisation from you.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">
              4. Data Retention
            </h2>
            <p>
              Audit results and account data are retained for the duration of
              your subscription and up to 90 days after account deletion, after
              which they are permanently removed from our systems.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">
              5. Third-Party Integrations
            </h2>
            <p>
              When you connect integrations (Google Analytics, WhatsApp
              Business, etc.), we access only the data scopes you explicitly
              authorise. You can revoke these permissions at any time from the
              Integrations settings page.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">
              6. Security
            </h2>
            <p>
              We use industry-standard encryption (TLS in transit, AES-256 at
              rest) to protect your data. Access to production data is
              restricted to authorised personnel only.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">
              7. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal
              data at any time. To make a request, contact us at{" "}
              <a
                href="mailto:privacy@growthos.travel"
                className="text-indigo-400 hover:underline"
              >
                privacy@growthos.travel
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-3">
              8. Contact
            </h2>
            <p>
              For any privacy-related questions, reach us at{" "}
              <a
                href="mailto:privacy@growthos.travel"
                className="text-indigo-400 hover:underline"
              >
                privacy@growthos.travel
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-6 text-center text-xs text-muted-foreground">
        © 2026 GrowthOS.travel ·{" "}
        <Link href="/terms" className="hover:text-foreground transition-colors">
          Terms
        </Link>
        {" · "}
        <Link
          href="/privacy"
          className="hover:text-foreground transition-colors"
        >
          Privacy
        </Link>
      </footer>
    </div>
  );
}
