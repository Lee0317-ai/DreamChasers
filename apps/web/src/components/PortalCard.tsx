import Link from "next/link";
import type { PortalItem } from "./portal-data";

type PortalCardProps = {
  item: PortalItem;
  onSelect: (item: PortalItem) => void;
};

export function PortalCard({ item, onSelect }: PortalCardProps) {
  const cardContent = (
    <>
      <span aria-hidden="true" className="card-icon">
        {item.icon}
      </span>
      <span className="card-title">{item.title}</span>
      <span className="card-description">{item.description}</span>
      <span className="card-meta">
        {item.tags.map((tag) => (
          <span
            className={`tag${tag === "免费" ? " accent" : ""}${tag === "AI 能力" ? " new" : ""}`}
            key={tag}
          >
            {tag}
          </span>
        ))}
      </span>
    </>
  );

  return (
    <article
      className={`card${item.status === "coming" ? " card-muted" : ""}`}
      id={item.id}
    >
      {item.href ? (
        <Link className="card-button" href={item.href}>
          {cardContent}
        </Link>
      ) : (
        <button className="card-button" onClick={() => onSelect(item)} type="button">
          {cardContent}
        </button>
      )}
    </article>
  );
}
