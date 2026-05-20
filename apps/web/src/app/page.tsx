const toolCategories = ["PDF", "图片", "文本", "效率", "游戏"];
const homepageSignals = ["免费优先", "无需登录", "先做高频入口"];
const featuredTools = [
  {
    name: "PDF 工具箱",
    summary: "合并、拆分、旋转、压缩和转图片。"
  },
  {
    name: "AI 修图工具",
    summary: "亮度、滤镜、边框和基础去水印入口。"
  },
  {
    name: "麻将 Roguelike 消除",
    summary: "碰、吃、杠组合叠加 Roguelike 奖励。"
  }
];

const featuredGames = [
  {
    name: "麻将 Roguelike 消除",
    summary: "把消除和局内奖励做成一局一局的挑战。"
  },
  {
    name: "后续小游戏位",
    summary: "预留给第二个轻量游戏。"
  }
];

export default function HomePage() {
  return (
    <section className="home">
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">工具和游戏平级展示</p>
        <div className="hero-grid">
          <div className="hero-copy-block">
            <h1 id="hero-title">免费工具和小游戏</h1>
            <p className="hero-copy">
              先把高频工具和轻量游戏摆到眼前。用最少的步骤找到 PDF、修图和麻将消除入口，先解决“我现在想做什么”。
            </p>
            <div className="signal-row" aria-label="产品信号">
              {homepageSignals.map((signal) => (
                <span key={signal} className="signal-pill">
                  {signal}
                </span>
              ))}
            </div>
            <div className="hero-actions">
              <a className="primary-action" href="#tools">
                看工具
              </a>
              <a className="secondary-action" href="#games">
                看游戏
              </a>
            </div>
          </div>

          <aside className="search-panel" aria-label="搜索入口">
            <span className="search-label">AI 搜索入口</span>
            <div className="search-box">
              <span className="search-placeholder">输入需求，例如“转 PDF、修图、放松一下”</span>
              <button className="search-button" type="button">
                搜索
              </button>
            </div>
            <div className="search-tags">
              {toolCategories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section id="tools" aria-labelledby="tools-title" className="panel">
        <div className="panel-heading">
          <div>
            <h2 id="tools-title">工具频道</h2>
            <p>先做免费和高频，再逐步补 AI 能力。</p>
          </div>
          <span className="section-kicker">Tools</span>
        </div>

        <div className="section-filters" aria-label="工具筛选">
          <span className="filter-chip filter-chip-active">热门</span>
          <span className="filter-chip">免费</span>
          <span className="filter-chip">最近更新</span>
        </div>

        <div className="tile-grid">
          {featuredTools.map((item) => (
            <article key={item.name} className="tile">
              <div className="tile-head">
                <h3>{item.name}</h3>
                <span>进入</span>
              </div>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="games" aria-labelledby="games-title" className="panel">
        <div className="panel-heading">
          <div>
            <h2 id="games-title">游戏频道</h2>
            <p>轻量玩法先上，后续再接更多内容。</p>
          </div>
          <span className="section-kicker">Games</span>
        </div>

        <div className="section-filters" aria-label="游戏筛选">
          <span className="filter-chip filter-chip-active">推荐</span>
          <span className="filter-chip">免费</span>
          <span className="filter-chip">轻量</span>
        </div>

        <div className="tile-grid">
          {featuredGames.map((item) => (
            <article key={item.name} className="tile">
              <div className="tile-head">
                <h3>{item.name}</h3>
                <span>进入</span>
              </div>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
