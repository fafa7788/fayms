const points = [
  {
    title: "Professional design",
    description: "Every product reflects your brand with a considered, polished look.",
  },
  {
    title: "Modern technology",
    description: "Built on current, well-supported tools chosen for the job at hand.",
  },
  {
    title: "Responsive websites",
    description: "Fast and consistent across phones, tablets and desktops.",
  },
  {
    title: "Attention to detail",
    description: "Small decisions — spacing, timing, wording — are never an afterthought.",
  },
  {
    title: "Reliable support",
    description: "We stay reachable after launch, not just during the build.",
  },
  {
    title: "Competitive pricing",
    description: "Transparent scopes and pricing suited to growing businesses.",
  },
];

export default function WhyFayms() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="container-fayms py-20 md:py-28">
        <div className="max-w-xl mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
            Why FAYMS
          </h2>
          <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
            Six reasons clients choose to build with us, and stay with us.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {points.map((p, i) => (
            <div key={p.title} className="flex gap-4">
              <span className="font-display text-sm text-[var(--accent)] pt-1 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-medium mb-1.5">{p.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
