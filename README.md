# KK-Codex Animation

**把一条社媒剪辑动画，做成可以运行、修改、重新渲染的代码工程。**

蓝色 Codey 在手绘工作台上搬素材、裁废片、投篮加转场、纠正字幕、调参数、磁吸卡点，再导出自己的作品。最后在短视频观看界面完成四段回放，收获「10万+」点赞。

Remotion · React · TypeScript · 分层 SVG · 原创离线配乐与动作音效

## 先看两个版本

### 原始社媒展示 · 26 秒

这条视频是本项目的视觉与故事参考，保留原先的素材质感和卡片界面。它与下面的开源版本是两条独立成片。

https://github.com/user-attachments/assets/811f388f-dafe-4bc1-850d-34c927d81f2f

### 本仓库开源成片 · 30 秒

**仓库代码对应这一版。** 1920×1080、30fps、900帧，包含确定的事件时间、同源 SVG 场景、可编辑字幕、真实素材删除与合拢、完整音乐和独立音效。

https://github.com/user-attachments/assets/b84b018b-1c78-45d0-bb93-b89c0b446489

喜欢原始社媒版的视觉，可以把它作为改造方向；想了解角色怎么伸手、素材怎么连续合拢、画面如何卡上重音，可以直接从这份工程开始。

两段视频均由作者提供。原始社媒版在这里作为作品展示；本仓库不包含其原始制作工程，也不承诺由这里的源码渲染出该版本。

完整视频下载：[Release](https://github.com/kkfor30/kk-codex-animation/releases/latest)。README 播放器使用轻量预览，Release 保留1080p完整成片。

## 工程里有什么

| 内容 | 实现 |
| --- | --- |
| 30秒完整故事 | 统一事件表和 `getSceneState(frame)`，每帧结果确定 |
| 角色操作 | 保留 Codey 原身体，只延伸正在操作的一侧手臂 |
| 四段素材 | 落日、咖啡、柴犬、舞台共用分层 SVG 场景 |
| 裁剪与合拢 | 一个咖啡 clipId，源区间映射跳过废片，统一外壳与缩略图 |
| 转场与字幕 | 圆形扩散、翻页；错字输入、撤销停留、改正；字幕绑定柴犬片段 |
| 调参和卡点 | 手机实时反馈，参数锁存，播放头按三个重音穿过真实接缝 |
| 音乐与声音 | 144 BPM、18小节；音乐和音效分轨，独立生成和混音 |
| 片尾 | 四段快速回放、短视频观看界面与点赞动画 |

![四段同源 SVG 插画](docs/images/artwork-sheet.png)

## 本地运行

需要 Node.js、npm、Python，以及位于 PATH 的 FFmpeg / ffprobe。制作环境使用 Node.js 24.9.0 和 Python 3.13.2；依赖版本由 lockfile 与 `requirements.txt` 固定。

```bash
git clone https://github.com/kkfor30/kk-codex-animation.git
cd kk-codex-animation
npm ci
python -m pip install -r requirements.txt
python scripts/assets.py
npm run artwork
npm run studio
```

首次准备素材需要网络：脚本从公开来源下载 Codey 和字体，检查文件格式、透明度、尺寸、字形和 SHA-256，并裁出角色动作帧。下载后，预览与渲染使用本地副本。字体许可随仓库保存，Codey 图片通过脚本获取，不在源码仓库重复分发。

完整渲染：

```bash
npm run typecheck
npm run check
npm run render
python scripts/verify.py
```

输出是 `out/KK-Codex-30s.mp4`。验证脚本核对尺寸、时长、帧数、音轨、全部帧解码、黑帧和音频数值，并生成关键帧与连续动作联络表。

音乐、音效和最终混音已放在 `public/audio/`，可以直接渲染。重新生成全部乐器声部和声音：

```bash
npm run audio
```

只看关键帧：

```bash
node scripts/render.mjs stills 153,201,450,587,650,899
```

## 从哪里改

| 文件 | 作用 |
| --- | --- |
| `src/events.json` | 唯一事件时间与重音表 |
| `src/story.ts` | 角色、手、参数、字幕、素材、镜头和播放头状态 |
| `src/components/CodeyRig.tsx` | 官方角色身体保真与单侧延伸手臂 |
| `src/components/Artwork.tsx` | 四幅同源 SVG 插画 |
| `src/components/Workspace.tsx` | 工作台、时间轴、手机、卡片、滑块与反馈 |
| `src/components/SocialViewer.tsx` | 片尾短视频观看界面 |
| `scripts/audio.py` | 多声部编曲、动作音效、ducking 与混音 |
| `scripts/render.mjs` | 素材、关键帧与 MP4 渲染 |

完整制作规格：[Markdown Prompt](docs/PRODUCTION-PROMPT.md) · [TXT Prompt](docs/PRODUCTION-PROMPT.txt)。这是一份独立制作说明，实际工程由多轮视觉检查和修复完成，不能把“运行 Prompt”理解为各模型会产生完全相同的画面。

可以从暖纸卡片配色、四段插画或配乐开始修改。分享改造版本时，请保留来源与第三方声明，并说明你改了哪些内容。

## 验证与许可

发布成片验证：1920×1080、30fps、900帧、30.000秒，全部帧成功解码，无检测到的黑帧；48kHz双声道AAC。详见 [渲染记录](docs/VALIDATION.md)。本次没有完成实际声音试听，不把响度值当作听感验收。

自制代码、SVG场景、文档与原创合成音频采用 [MIT](LICENSE)。第三方角色、字体和依赖不因本仓库采用MIT而改变许可，见 [素材与第三方声明](THIRD_PARTY_NOTICES.md)。Codey来自OpenAI公开素材；本项目是作者的独立创作，与OpenAI官方项目无关联。

欢迎通过 [Issue](https://github.com/kkfor30/kk-codex-animation/issues) 分享可复现的问题或改造作品。提交前请运行 `npm run typecheck` 和 `npm run check`。
