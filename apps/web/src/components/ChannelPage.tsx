"use client";

import { useMemo, useState } from "react";
import { PortalCard } from "./PortalCard";
import { PortalModal } from "./PortalModal";
import type { PortalItem } from "./portal-data";

type Filter = {
  label: string;
  value: string;
};

type ChannelPageProps = {
  title: string;
  description: string;
  searchPlaceholder: string;
  filters: Filter[];
  items: PortalItem[];
  emptyTitle: string;
  emptyDescription: string;
};

export function ChannelPage({
  title,
  description,
  searchPlaceholder,
  filters,
  items,
  emptyTitle,
  emptyDescription
}: ChannelPageProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<PortalItem | null>(null);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFilter = activeFilter === "all" || item.categories.includes(activeFilter);
      const text = `${item.title} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, items, query]);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="page-actions">
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              type="search"
              value={query}
            />
          </div>
        </div>
      </section>

      <section className="container channel-content" aria-label={`${title}列表`}>
        <div className="filter-tabs" role="tablist" aria-label={`${title}筛选`}>
          {filters.map((filter) => (
            <button
              aria-selected={activeFilter === filter.value}
              className={`filter-tab${activeFilter === filter.value ? " active" : ""}`}
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              role="tab"
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>

        {visibleItems.length ? (
          <div className="cards-grid">
            {visibleItems.map((item) => (
              <PortalCard item={item} key={item.id} onSelect={setSelectedItem} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>{emptyTitle}</h3>
            <p>{emptyDescription}</p>
          </div>
        )}
      </section>

      <PortalModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
