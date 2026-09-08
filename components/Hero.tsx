import { LogoMark } from "./Logo";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-24 -top-24 text-[var(--border)] opacity-60"
        aria-hidden="true"
      >
        <LogoMark size={520} />
      </div>

      <div className="container-fayms relative pt-20 pb-24 md:pt-32 md:pb-36">
        <div className="max-w-2xl">
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Digital solutions for businesses in Saudi Arabia
          </p>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.08] tracking-tight">
            We turn your ideas into digital experiences.
          </h1>

          <p className="mt-6 text-base md:text-lg text-[var(--text-muted)] leading-relaxed max-w-xl">
            FAYMS designs and builds websites, online stores, mobile apps and
            interfaces that help businesses grow — combining thoughtful design
            with reliable engineering.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-flex items-center h-12 px-6 bg-[var(--text)] text-[var(--bg)] text-sm font-medium clip-corner hover:bg-[var(--accent)] transition-colors"
            >
              Start your project
            </a>
            <a
              href="#work"
              className="inline-flex items-center h-12 px-6 border border-[var(--border-strong)] text-sm font-medium hover:border-[var(--text-muted)] transition-colors"
            >
              View our work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
