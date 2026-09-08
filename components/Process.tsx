const steps = [
  { n: "01", title: "Contact us", description: "We understand your idea and requirements." },
  { n: "02", title: "Planning & design", description: "We plan the project and create the UI/UX design." },
  { n: "03", title: "Development", description: "We turn the approved design into a functional product." },
  { n: "04", title: "Testing & review", description: "We test everything and confirm it works properly." },
  { n: "05", title: "Launch", description: "We launch the final product and deliver it to you." },
];

export default function Process() {
  return (
    <section id="process" className="border-t border-[var(--border)]">
      <div className="container-fayms py-20 md:py-28">
        <div className="max-w-xl mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
            Our process
          </h2>
          <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
            A clear five-step path from first conversation to launch day.
          </p>
        </div>

        <div className="border-t border-[var(--border)]">
          {steps.map((s) => (
            <div
              key={s.n}
              className="grid sm:grid-cols-[100px_1fr] gap-2 sm:gap-8 py-7 border-b border-[var(--border)]"
            >
              <span className="font-display text-2xl text-[var(--text-dim)]">{s.n}</span>
              <div className="grid sm:grid-cols-[220px_1fr] gap-2 sm:gap-8">
                <h3 className="font-display text-lg font-medium">{s.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
