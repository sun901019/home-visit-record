import clsx from "clsx";

export function Section({ icon: Icon, title, description, children, accent = "brand" }) {
  return (
    <section className="glass animate-fade-in rounded-3xl p-5 md:p-7">
      <header className="mb-5 flex items-start gap-3">
        {Icon && (
          <span
            className={clsx(
              "grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-white shadow-sm",
              accent === "brand" && "bg-gradient-to-br from-brand-400 to-brand-600",
              accent === "rose" && "bg-gradient-to-br from-rose-400 to-rose-600",
              accent === "emerald" && "bg-gradient-to-br from-emerald-400 to-emerald-600",
              accent === "amber" && "bg-gradient-to-br from-amber-400 to-amber-600",
              accent === "violet" && "bg-gradient-to-br from-violet-400 to-violet-600",
              accent === "slate" && "bg-gradient-to-br from-slate-500 to-slate-700",
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 md:text-lg">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs text-slate-500 md:text-sm">{description}</p>
          )}
        </div>
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function SubGrid({ children, cols = 2 }) {
  const colsClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
        ? "grid-cols-1 md:grid-cols-2"
        : cols === 3
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return <div className={clsx("grid gap-4", colsClass)}>{children}</div>;
}
