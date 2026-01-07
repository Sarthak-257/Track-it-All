'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Bell, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-slate-950 text-white min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-slate-950 to-slate-950 -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20 mb-8 inline-block mt-10">
              New: Advanced Analytics ✨
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Master Your Habits. <br />
              <span className="text-indigo-500">Transform Your Life.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Tracking your progress shouldn't be a chore. Track It All provides a premium, data-driven experience to help you build the life you've always wanted.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition shadow-lg shadow-indigo-500/25 w-full sm:w-auto"
              >
                Start Tracking Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-xl font-bold text-lg transition w-full sm:w-auto"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-slate-900/50 border-y border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureCard
              Icon={CheckCircle2}
              title="Daily Tracking"
              description="A seamless, spreadsheet-style interface for quick daily logs."
            />
            <FeatureCard
              Icon={TrendingUp}
              title="Smart Analytics"
              description="Visualize streaks, completion rates, and progress over time."
            />
            <FeatureCard
              Icon={Bell}
              title="Smart Reminders"
              description="Get timely email notifications to keep you on track."
            />
            <FeatureCard
              Icon={Shield}
              title="Privacy First"
              description="Your data is encrypted and secure. Always."
            />
          </div>
        </div>
      </section>

      {/* Social Proof/CTA */}
      <section className="py-32 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to reach your goals?</h2>
          <p className="text-slate-400 mb-10">Join thousands of others tracking their way to success.</p>
          <Link
            href="/register"
            className="px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-xl font-bold text-lg transition"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-900 text-center">
        <p className="text-slate-500 text-sm">© 2025 Track It All. Built for builders.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ Icon, title, description }: any) {
  return (
    <div className="group">
      <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
