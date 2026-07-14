# 曾浩晟作品集

一个由 `public/data.json` 驱动的 React 单页作品集。首页、简历、联系信息、项目列表与项目详情均从数据文件渲染；华硕项目额外包含完整的电商体验案例叙事。

## 本地运行

```bash
npm install
npm run dev
```

常用命令：

- `npm run validate:data`：检查项目 ID、图片索引和本地素材引用。
- `npm run lint`：运行 ESLint。
- `npm run build`：生成生产构建到 `dist/`。
- `npm run verify`：依次执行数据校验、Lint 和生产构建。

## 内容维护

- 文案与结构：`public/data.json`
- 项目图片：`public/work/`
- 作品集 PDF：`public/resume.pdf`
- 页面组件：`src/components/`
- 全站样式：`src/portfolio.css`

新增普通项目时提供 `id`、`title`、分类信息和 `workImages`；需要编辑型长案例时，可使用 `images`、`process`、`strategy` 与 `strategyCases`。修改数据后运行 `npm run validate:data`，可在构建前发现路径或图片索引错误。
