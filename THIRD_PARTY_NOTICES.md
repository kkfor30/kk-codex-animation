# 素材与第三方声明

本仓库MIT许可证适用于作者自制代码、SVG场景、文档和原创合成音频，不覆盖下列第三方内容。展示成片包含Codey角色，成片展示不等于对该角色授予新的许可。

## Codey

角色来源：OpenAI公开精灵图。

https://learn.chatgpt.com/images/codex/app/pets/codex-spritesheet.webp

实际下载记录为1536×1872、RGBA透明WebP。原文件SHA-256：`431a9680d6480c394a143db33bc3d47a9d90b55da04b7761d28ac7f2a000b203`。

原图和逐格裁切图由 `scripts/assets.py` 在本地获取，未作为MIT素材重新分发。OpenAI角色、名称和相关标识的权利归各自权利人；本仓库不是官方OpenAI项目。角色处理代码保留官方完整躯干，仅在操作时延伸活动侧手臂。

## 字体

- Ma Shan Zheng：[Google Fonts来源](https://github.com/google/fonts/tree/main/ofl/mashanzheng)，SIL Open Font License 1.1，许可见 `public/fonts/MaShanZheng-OFL.txt`。
- LXGW WenKai：[官方来源](https://github.com/lxgw/LxgwWenKai)，SIL Open Font License 1.1，许可见 `public/fonts/LXGWWenKai-OFL.txt`。

字体文件由素材脚本下载到本地；实际URL、字符覆盖、字节数与哈希见 `public/sources.json`。

## 依赖

- Remotion 4.0.529：[项目许可](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)。Remotion使用自己的分级许可证，不是本项目MIT许可证的一部分；其使用条件以所安装版本的许可证为准。
- React / React DOM：[MIT](https://github.com/facebook/react/blob/main/LICENSE)。
- roughjs：[MIT](https://github.com/rough-stuff/rough/blob/master/LICENSE)。
- 其他npm和Python依赖保留各自许可。依赖通过包管理器安装，没有把 `node_modules` 或Python运行库源码复制进仓库。

## 自制素材与视频

落日、咖啡、柴犬和舞台由 `src/components/Artwork.tsx` 从零绘制SVG，素材卡、缩略图、手机预览来自同一场景。配乐由固定种子的离线多声部合成产生；动作音效按统一事件表生成，没有使用未知原曲或外链音效录音。

README展示的原始26秒社媒视频由作者提供，是视觉和叙事参考；本仓库代码对应30秒开源版本。原始社媒视频的制作工程与其素材来源不包含在本仓库中。
