import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Dr.Etshoooo Medical Education Platform",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using Dr.Etshoooo, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the platform.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Educational Purpose</h2>
            <p className="leading-relaxed">
              Dr.Etshoooo is an educational platform designed for medical students. Content provided
              is for learning purposes only and should not be used as a substitute for professional
              medical advice, diagnosis, or treatment.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
            <p className="leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials.
              You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Content Usage</h2>
            <p className="leading-relaxed">
              All educational content on Dr.Etshoooo is provided for personal learning. You may not
              redistribute, reproduce, or commercialize any content without explicit permission.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Limitation of Liability</h2>
            <p className="leading-relaxed">
              Dr.Etshoooo is provided &quot;as is&quot; without warranties of any kind. We are not liable for any
              damages arising from the use of this platform.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Termination</h2>
            <p className="leading-relaxed">
              We reserve the right to suspend or terminate your account at our discretion for
              violation of these terms or any harmful behavior.
            </p>
          </section>
          <section>
            <p className="text-sm text-gray-500">Last updated: January 2026</p>
          </section>
        </div>
      </div>
    </div>
  );
}
