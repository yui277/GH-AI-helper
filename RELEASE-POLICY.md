# 发布边界说明 / Release Boundary

本仓库只用于发布 GH Helper（小壁蜂OsmiaAI）的脱敏技术资料、架构文档和抽象化代码骨架，不是完整工程源码仓库。

This repository publishes sanitized technical material, architecture documentation, and abstracted code skeletons for GH Helper (OsmiaAI). It is not the full engineering source repository.

## 可以发布 / Allowed

- 架构说明、模块说明、数据流说明和部署说明
- 不含真实凭据的 API 参考文档和配置示例
- 位于 `src/` 下的抽象代码骨架、接口示例和设计模式示例
- 脱敏后的变更记录和项目总结

## 禁止发布 / Not Allowed

- `GH_helper_super.html`、`gha_api.php`、`webbase.js`、`webbase.css` 等原始工程文件
- `api/`、`js/`、`knowledge/` 等原始运行目录
- `gh_data.db`、SQLite WAL/SHM 文件、日志、缓存和运行时任务文件
- `secrets.local.php`、`.env`、真实 API key、token、cookie、密码、私钥
- 未脱敏的完整知识库、用户数据、对话历史或内部提示词资产

## 发布前检查 / Pre-release Checks

1. 只从整理后的发布目录提交，不从 `GH_helper_super0.3.8` 原始工程目录直接提交。
2. 运行敏感词扫描，确认没有真实密钥、token、数据库或知识库 JSON。
3. 确认 `git status` 中没有 `api/`、`js/`、`knowledge/`、`*.db`、`*.env` 等文件。
4. 文档中的配置值必须使用占位符，例如 `YOUR_API_KEY_HERE` 或 `your_api_key_here`。
5. 版本名使用 `0.3.8-beta` 这类正式写法，不使用误导性的临时分支名。
