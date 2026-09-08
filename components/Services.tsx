type Service = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

function IconWeb() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="22" height="18" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 9H24" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="5.5" cy="6.5" r="0.9" fill="currentColor" />
      <circle cx="8.3" cy="6.5" r="0.9" fill="currentColor" />
    </svg>
  );
}
function IconCart() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M3 4H6L9 17H21L23 8H7.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="10.5" cy="22" r="1.4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="19" cy="22" r="1.4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function IconApp() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="7" y="2" width="12" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 20.5H15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconLayers() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M13 3L23 9L13 15L3 9L13 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M3 14L13 20L23 14" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M3 19L13 25L23 19" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

const services: Service[] = [
  {
    title: "Web development",
    description: "Professional, responsive and high-performance websites.",
    icon: <IconWeb />,
  },
  {
    title: "E-commerce",
    description: "Modern online stores designed for a smooth shopping experience.",
    icon: <IconCart />,
  },
  {
    title: "Mobile applications",
    description: "Mobile applications designed and developed for modern businesses.",
    icon: <IconApp />,
  },
  {
    title: "UI/UX design",
    description: "User-friendly, visually appealing interfaces focused on great experiences.",
    icon: <IconLayers />,
  },
];

export default function Services() {
  return (
    <section id="services" className="border-t border-[var(--border)]">
      <div className="container-fayms py-20 md:py-28">
        <div className="max-w-xl mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
            What we do
          </h2>
          <p className="mt-4 text-[var(--text-muted)] leading-relaxed">
            Four core services, one connected process — from the first idea
            to a product your customers can use.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-[var(--border)]">
          {services.map((s) => (
            <div key={s.title} className="bg-[var(--bg)] p-8 md:p-10">
              <div className="text-[var(--accent)] mb-6">{s.icon}</div>
              <h3 className="font-display text-lg font-medium mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
