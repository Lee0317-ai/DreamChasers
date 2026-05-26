# 打工人弹射解压 — 交接文档

> 团队交接和后续开发者快速上手指南。

## 1. 项目背景

- **游戏名称**：打工人弹射解压
- **游戏类型**：Roguelike 物理弹射解压游戏
- **目标平台**：微信小程序（首发），后续扩展抖音小游戏
- **对标产品**：愤怒的小鸟 + 吸血鬼幸存者（Roguelike 元素）
- **核心差异化**：随机关卡生成 + 本地图片替换目标 + 职场吐槽系统

## 2. 团队配置

| 角色 | 人数 | 职责 |
|------|------|------|
| 开发 | 1 | Matter.js 物理引擎、游戏逻辑、微信小程序、后端 API |
| 美术 | 1 | 角色、场景、UI、特效、分享图模板 |
| 策划 | 1 | 关卡算法、Buff 设计、文案、数值、测试 |

## 3. 关键文档索引

### 模块文档（本目录）

| 文档 | 用途 |
|------|------|
| `README.md` | 产品定位、核心循环、特性概览、技术栈 |
| `IMPLEMENTATION_PLAN.md` | 完整功能清单、开发计划、算法说明、成功指标 |
| `PROGRESS.md` | 当前进度追踪 |
| `DECISIONS.md` | 关键设计决策及原因 |
| `HANDOFF.md` | 本文档 |

### 原始方案文档（根目录）

| 文档 | 内容 |
|------|------|
| `custom-angry-bird_ideas.md` | 原始想法 + 5W2H 分析 |
| `custom-angry-bird_expert_review.md` | 4 位专家视角分析 |
| `custom-angry-bird_market_research_quick.md` | 竞品与市场验证（20 个样本） |
| `custom-angry-bird_solution.md` | MVP 方案 |
| `custom-angry-bird_roadmap.md` | 10 天压缩版开发计划 |
| `custom-angry-bird_detail_expansion.md` | 关卡设计、30 条吐槽台词、Matter.js 集成代码、分享图 Canvas 代码、本地换脸代码 |
| `custom-angry-bird_growth_monetization.md` | 爽点 / 爆点 / 留存 / 广告 / 迭代 |
| `custom-angry-bird_gameplay_retention.md` | 武器差异化 / Combo / Boss / 无尽模式 |
| `custom-angry-bird_roguelike_generator.md` | 关卡生成算法 + Buff 系统 + Boss 生成 + 模式设计 |
| `custom-angry-bird_FINAL_SOLUTION.md` | 全功能整合 + 1 个月开发计划（最终版） |

## 4. 技术要点

### 4.1 物理引擎

- 使用 **Matter.js** 处理刚体物理
- 重力默认值 `engine.gravity.y = 1`
- 弹射物发射使用 `Body.applyForce` 施加冲量
- 碰撞事件监听：`Events.on(engine, 'collisionStart', callback)`
- 性能限制：刚体数量 ≤ 50（低端机）

### 4.2 关卡生成

- 使用种子随机生成器保证可复现
- 每日挑战种子：`YYYY * 10000 + MM * 100 + DD`
- 建筑生成：基座 → 上层堆叠 → 木板支撑 → 特殊元素
- 目标放置：优先放在"顶部"结构（上方无其他砖块）

### 4.3 本地存储

```javascript
// 图片本地存储
wx.setStorageSync('target_face_' + targetId, base64Image);

// 读取
const face = wx.getStorageSync('target_face_' + targetId);

// 进度存储
wx.setStorageSync('worker_game_progress', JSON.stringify(progress));
```

### 4.4 分享图生成

- 使用 Canvas 2D API 动态合成
- 固定模板：背景 + 预置角色 + 吐槽文字 + 战绩 + 二维码
- 二维码使用微信 `wxacode.get` API 生成
- 分享图尺寸建议：750 × 1334（iPhone 标准）

## 5. 关键代码片段

### 5.1 物理世界初始化

```javascript
const { Engine, Render, Runner, Bodies, Body, Events, Vector } = Matter;

class PhysicsWorld {
  constructor(canvas) {
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.engine.gravity.y = 1;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // 碰撞事件
    Events.on(this.engine, 'collisionStart', (event) => {
      this.handleCollisions(event.pairs);
    });
  }

  addBrick(x, y, width, height, options = {}) {
    const brick = Bodies.rectangle(x, y, width, height, {
      ...options,
      render: { fillStyle: '#8B4513' }
    });
    Composite.add(this.world, brick);
    return brick;
  }

  addTarget(x, y, radius, options = {}) {
    const target = Bodies.circle(x, y, radius, {
      ...options,
      isStatic: true,
      render: { fillStyle: '#FF6B6B' }
    });
    Composite.add(this.world, target);
    return target;
  }

  shoot(angle, force) {
    const projectile = Bodies.circle(100, 500, 15, {
      restitution: 0.6,
      density: 0.004
    });
    Composite.add(this.world, projectile);

    const impulse = Vector.mult(
      Vector.create(Math.cos(angle), Math.sin(angle)),
      force
    );
    Body.applyForce(projectile, projectile.position, impulse);
    return projectile;
  }
}
```

### 5.2 目标图片替换

```javascript
class TargetFaceReplacer {
  constructor() {
    this.storageKey = 'user_target_face';
  }

  async chooseImage() {
    return new Promise((resolve) => {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => resolve(res.tempFilePaths[0])
      });
    });
  }

  async cropToCircle(imagePath, size = 120) {
    return new Promise((resolve) => {
      const ctx = wx.createCanvasContext('cropCanvas');
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(imagePath, 0, 0, size, size);
      ctx.restore();
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId: 'cropCanvas',
          width: size,
          height: size,
          destWidth: size,
          destHeight: size,
          success: (res) => resolve(res.tempFilePath)
        });
      });
    });
  }

  async replaceFace(targetId) {
    const imagePath = await this.chooseImage();
    const cropped = await this.cropToCircle(imagePath);
    wx.setStorageSync(`${this.storageKey}_${targetId}`, cropped);
    return cropped;
  }

  getFace(targetId) {
    return wx.getStorageSync(`${this.storageKey}_${targetId}`);
  }
}
```

## 6. 下一步行动

### 立即要做（Day 0）

1. **开发**：安装微信开发者工具，创建项目，接入 Matter.js，跑通 Demo 场景
2. **美术**：画出 3 个角色概念草图，团队投票确定风格方向
3. **策划**：输出《3 关结构文档》+《吐槽台词初稿 30 条》
4. **全员**：拉群，约定每日站会时间，共享文档链接

### 需要准备

- [ ] 免费音效素材收集（freesound.org 搜索 "collision" "break" "whoosh"）
- [ ] 确定美术风格参考（找 2-3 个喜欢的卡通游戏截图）
- [ ] 微信小游戏账号注册和备案资料准备

### 需要决策

- [ ] 角色命名最终确认（"秃头老板"是否过审？备选"严谨上司"）
- [ ] 分享图是否带二维码？（带二维码 = 引导下载，审核可能更严）
- [ ] 是否接入激励视频广告？（Demo 阶段建议不接，避免审核复杂度）

## 7. 风险提醒

| 风险 | 监控指标 | 预警阈值 | 应对措施 |
|------|----------|----------|----------|
| 时间不够 | Day 5 时核心 playable 不可玩 | Day 5 17:00 前未完成 | 砍无尽模式 / 砍 2 个 Boss 模板 |
| 物理手感差 | 策划 playable test 评分 | 评分 < 6/10 | 降级为简化抛物线；减少建筑复杂度 |
| 微信审核被拒 | 敏感词 / 暴力元素 | 文案含敏感词 > 3 处 | 替换敏感词；"砸"改为"弹飞" |
| 性能问题 | 低端机帧率 | 帧率 < 30fps | 减少刚体数量；降低物理精度 |

## 8. 联系方式

- 项目仓库：DreamChasers
- 模块路径：`docs/modules/angry-worker/`
- 任务编号：T064
