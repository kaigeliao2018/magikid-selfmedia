# Codex 派单设计简报 · VEX IQ 课件 html-ppt 版

> 本文档供 Codex 制作 html-ppt 格式课件时使用。
> 每次派单时附上此文件路径即可。

---

## 一、技能调用方式

```bash
# html-ppt skill 已安装，路径：
~/.agents/skills/html-ppt/

# 新建课件时，复制 presenter-mode-reveal 模板：
cp -r ~/.agents/skills/html-ppt/templates/full-decks/presenter-mode-reveal/ <输出目录>/
```

**资产相对路径规则：**
从输出的 `index.html` 到 `~/.agents/skills/html-ppt/assets/` 的相对路径，
取决于输出目录的层级。例如：
- 输出在 `ai-teaching-kb/classes/cn-2026/lessons/` → 路径为 `../../../../.agents/skills/html-ppt/assets/`
- 输出在 `magikid-selfmedia/products/courses/<name>/` → 路径为 `../../../../.agents/skills/html-ppt/assets/`

---

## 二、字体规范（必须遵守）

**禁止使用默认 `fonts.css`**（Google Fonts，中国加载失败）。

**改用 `fonts-magikid.css`：**
```html
<!-- 替换这行 -->
<link rel="stylesheet" href="[path]/assets/fonts.css">

<!-- 改为 -->
<link rel="stylesheet" href="~/magikid-selfmedia/design/assets/fonts-magikid.css">
```

**字体层级规则：**

| 用途 | 字体 | 字重 | 备注 |
|---|---|---|---|
| 大标题 h1 | Barlow Condensed | 900 | 全大写，科技感 |
| 副标题 h2 | Barlow Condensed | 800 | 全大写 |
| 正文（英） | Inter | 400/600 | |
| 正文（中） | Noto Sans SC | 400/700 | |
| 代码 | JetBrains Mono | 400/700 | |
| 兜底系统字体 | PingFang SC / Microsoft YaHei | — | 网络断开时 |

**字号规范：**
- h1：`clamp(52px, 6vw, 80px)` — 不要写死，用 clamp 适配屏幕
- h2：`clamp(38px, 4.5vw, 58px)`
- 正文：`16-18px`（slides 不要超过 20px）
- 备注/辅助文字：`13-14px`

---

## 三、VEX IQ 品牌色规范

> 来源：2026-2027 VEX IQ Robotics Competition 官方课件模板（Canva）
> 模板图片：`~/Desktop/IQ课件模板/2026-2027 VEX IQ ROBOTICS COMPETITION 课件模板/`（14张PNG）

**使用主题文件：**
```html
<link rel="stylesheet" id="theme-link" href="~/magikid-selfmedia/design/assets/theme-magikid-vex.css">
```

**核心色板：**

| Token | Hex | 用途 |
|---|---|---|
| `--bg` | `#060A0F` | 页面背景（近黑深蓝） |
| `--surface-1` | `#0D1117` | 卡片底色 |
| `--surface-2` | `#161C24` | 次级卡片 |
| `--accent` | `#FFD000` | **VEX 黄：标题高亮、数字、边框** |
| `--red` | `#E53935` | 章节标签（L1/L2）、警告 |
| `--green` | `#00E676` | 成功状态、SYSTEM ONLINE |
| `--text-1` | `#FFFFFF` | 主文字 |
| `--text-2` | `#A8B2C0` | 辅助文字 |
| `--border` | `#1E2D3D` | 普通边框 |
| `--border-accent` | `rgba(255,208,0,0.35)` | 黄色 HUD 边框 |

---

## 四、设计风格关键词

- **深黑科技 · HUD界面 · 机甲风 · 赛博朋克**
- 背景：深黑色，可叠加网格/电路板纹理（用 CSS 实现）
- 边框：黄色霓虹光 `box-shadow: 0 0 8px rgba(255,208,0,0.4)`
- 角落装饰：HUD 瞄准框（主题文件已内置 `::before/::after`）
- 章节标签：红色背景小胶囊，全大写（如 `L1 INTRODUCTION`）
- 底部状态栏：深色，显示 Level / Season / 进度

---

## 五、图片配图规则

**有图片时：**
- 图片来源：`~/Desktop/IQ课件模板/` 中的模板截图可作为参考风格
- Magikid Logo：`~/magikid-selfmedia/design/assets/logo-icon.png`（白底，只用于浅色背景）
- VEX 风格图片：深色背景可叠加半透明图片，`opacity: 0.3` 作为纹理

**需要生图时：**
- Codex 写调用 DALL-E API 的脚本，风格提示词：
  `"dark tech background, VEX robotics, cyberpunk, yellow neon, grid overlay, 16:9, no text"`
- 生成后保存到课件目录 `assets/` 子文件夹

---

## 六、每页结构规范（presenter-mode 模板）

```html
<section class="slide" data-title="页面标题">
  <p class="kicker">// 章节编号 · 英文说明</p>
  <h2 class="h2">中文大标题 <span class="accent">高亮词</span></h2>
  <!-- 内容区：用 .grid .g2/.g3、.stack、.card 等 html-ppt 布局类 -->
  <div class="deck-footer">
    <span class="mono">底部说明</span>
    <span class="slide-number" data-current="N" data-total="总页数"></span>
  </div>
  <aside class="notes">
    <!-- 逐字稿：150-300字，口语化，关键词加 <strong> -->
  </aside>
</section>
```

**规则：**
- 每页逐字稿必须写（150-300字），凯戈出镜录制用
- 逐字稿用口语，"因此"→"所以"，"该方案"→"这个方案"
- 纯受众内容放 slide，演讲者提示放 `<aside class="notes">`

---

## 七、派单模板（CTO → Codex）

```
任务：制作 <课程名> 第<N>课 html-ppt 课件
输入：
  - 课程大纲：<文件路径或内容>
  - 设计简报：~/magikid-selfmedia/design/codex-brief-vex-slides.md
  - 参考图片：~/Desktop/IQ课件模板/（14张PNG，看风格参考）
输出：<输出路径>/index.html + style.css
验收：
  - 打开浏览器双击可运行
  - 按 S 键演讲者模式正常
  - 字体使用 fonts-magikid.css（不用 fonts.css）
  - 主题使用 theme-magikid-vex.css
  - 每页有逐字稿
  - 共 N 页（封面+内容+作业+结尾）
```
