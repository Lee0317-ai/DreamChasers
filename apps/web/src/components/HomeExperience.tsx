"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PortalCard } from "./PortalCard";
import { PortalModal } from "./PortalModal";
import { gameItems, searchItems, toolItems, type PortalItem } from "./portal-data";

export function HomeExperience() {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortalItem | null>(null);

  const filteredSearchItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return searchItems;
    }

    return searchItems.filter((item) =>
      `${item.title} ${item.description} ${item.tag}`.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="hero-kicker">免费 · 实用 · 有趣</span>
          <h1>一个站点，满足你的工具与游戏需求</h1>
          <p>PDF 处理、AI 修图、休闲小游戏……工作学习用工具，碎片时间玩游戏，全部免费开放。</p>

          <div className="search-wrap" id="ai-search">
            <div className="search-box">
              <input
                aria-label="搜索工具或游戏"
                autoComplete="off"
                onBlur={() => window.setTimeout(() => setIsSearchOpen(false), 120)}
                onChange={(event) => {
                  setQuery(event.target.value);
                  openSearch();
                }}
                onFocus={openSearch}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && filteredSearchItems[0]) {
                    window.location.href = filteredSearchItems[0].href;
                  }
                }}
                placeholder="搜索工具、游戏或输入需求，例如：合并 PDF"
                type="search"
                value={query}
              />
              <Link className="search-btn" href={filteredSearchItems[0]?.href ?? "/tools"}>
                搜索
              </Link>
            </div>
            <div className={`search-dropdown${isSearchOpen ? " open" : ""}`}>
              {filteredSearchItems.map((item) => (
                <Link className="search-item" href={item.href} key={item.href}>
                  <span aria-hidden="true" className="si-icon">
                    {item.icon}
                  </span>
                  <span className="si-text">
                    <span className="si-title">{item.title}</span>
                    <span className="si-desc">{item.description}</span>
                  </span>
                  <span className="si-tag">{item.tag}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="channel-section" aria-labelledby="tools-preview-title">
        <div className="container">
          <div className="section-header">
            <h2 id="tools-preview-title">实用工具</h2>
            <Link href="/tools">查看全部 →</Link>
          </div>
          <div className="cards-grid">
            {toolItems.slice(0, 3).map((item) => (
              <PortalCard item={item} key={item.id} onSelect={setSelectedItem} />
            ))}
          </div>
        </div>
      </section>

      <section className="channel-section" aria-labelledby="games-preview-title">
        <div className="container">
          <div className="section-header">
            <h2 id="games-preview-title">休闲游戏</h2>
            <Link href="/games">查看全部 →</Link>
          </div>
          <div className="cards-grid">
            {gameItems.slice(0, 2).map((item) => (
              <PortalCard item={item} key={item.id} onSelect={setSelectedItem} />
            ))}
          </div>
        </div>
      </section>

      <section className="container">
        <div className="cta-strip">
          <h3>有想法？告诉我们</h3>
          <p>工具和游戏会持续更新，欢迎提交你需要的工具或想玩的游戏类型。</p>
          <Link className="cta-btn" href="/tools">
            浏览工具
          </Link>
        </div>
      </section>

      <PortalModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
