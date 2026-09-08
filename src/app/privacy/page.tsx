import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Dr.Etshoooo Medical Education Platform",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p className="leading-relaxed">
              We collect information you provide directly, including your name, email address, and password (encrypted).
              We also collect usage data such as pages visited, content viewed, and quiz results to improve your learning experience.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p className="leading-relaxed">
              We use your information to provide and improve our educational services, track your learning progress,
              and communicate important updates about the platform.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Security</h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your personal information.
              Your password is encrypted using bcrypt, and all data transmissions are secured with HTTPS.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p className="leading-relaxed">
              We may use third-party services for analytics and hosting. These services may collect
              information sent by your browser as part of their standard operations.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
            <p className="leading-relaxed">
              You can access, update, or delete your account information at any time through your profile page.
              You may also contact us to request a complete copy of your data.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by
              posting the new policy on this page with an updated revision date.
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
