import type { ReactNode } from "react";

export function AccountSection({
  actions,
  children,
  eyebrow,
  title
}: {
  actions?: ReactNode;
  children: ReactNode;
  eyebrow?: string;
  title: string;
}) {
  return (
    <section className="account-card">
      <div className="account-card-header">
        <div>
          {eyebrow ? <p className="account-kicker">{eyebrow}</p> : null}
          <h2>{title}</h2>
        </div>
        {actions ? <div className="account-card-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function AccountStatusPill({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "accent" | "danger" | "neutral" | "success" | "warning";
}) {
  return <span className={`account-pill account-pill-${tone}`}>{children}</span>;
}

export function AccountEmptyState({ children }: { children: ReactNode }) {
  return <p className="account-empty">{children}</p>;
}
