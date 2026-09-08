export default function About() {
  return (
    <section id="about" className="border-t border-[var(--border)]">
      <div className="container-fayms py-20 md:py-28 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
            About FAYMS
          </h2>
        </div>
        <div className="max-w-xl">
          <p className="text-lg text-[var(--text)] leading-relaxed">
            FAYMS is a digital solutions company focused on designing and
            developing modern digital experiences for businesses.
          </p>
          <p className="mt-5 text-[var(--text-muted)] leading-relaxed">
            We combine creative design, modern technology and attention to
            detail to transform ideas into reliable digital products — from
            first sketch to launch day.
          </p>
        </div>
      </div>
    </section>
  );
}
