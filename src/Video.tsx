import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import {getSceneState,progress,smooth,mix} from './story';
import {C,clips,ClipId} from './config';
import {Workspace,Phone} from './components/Workspace';
import {Artwork,Sprite,spriteCounts} from './components/Artwork';
import {Text,RoughBox,Star} from './components/Primitives';
import {CodeyRig} from './components/CodeyRig';
import {Heart} from './components/SocialViewer';
import {E,pulse} from './story';

export function Ready(){const [handle]=useState(()=>delayRender('Load local fonts and images'));
 useEffect(()=>{let cancelled=false;(async()=>{const ma=new FontFace('Ma',`url(${staticFile('fonts/MaShanZheng.ttf')})`);const wen=new FontFace('Wenkai',`url(${staticFile('fonts/LXGWWenKai.ttf')})`);await Promise.all([ma.load(),wen.load()]);(document.fonts as FontFaceSet & {add(font:FontFace):void}).add(ma);(document.fonts as FontFaceSet & {add(font:FontFace):void}).add(wen);await document.fonts.ready;
 const files=[...Object.entries(spriteCounts).flatMap(([pose,n])=>Array.from({length:n},(_,i)=>`character/${pose}-${i}.png`)),...clips.map(c=>`artwork/${c.id}.png`)];
 await Promise.all(files.map(file=>new Promise<void>(resolve=>{const img=new Image();img.onload=()=>resolve();img.onerror=()=>resolve();img.src=staticFile(file)})));
 if(!cancelled)continueRender(handle);})().catch(err=>{throw err});return()=>{cancelled=true}},[handle]);return null;}
const paperDots=Array.from({length:440},(_,i)=>{let n=(Math.imul(i+1,1664525)+20260928)>>>0;const x=(n%16000)/10;n=(Math.imul(n,1664525)+1013904223)>>>0;return {x,y:n%9000/10,r:.25+i%3*.25}});
export const Defs=()=> <defs><pattern id="badHatch" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#c1beba"/><path d="M-3 3l12 12M3-3l12 12" stroke="#aaa6a2" strokeWidth="3"/></pattern><radialGradient id="tableGlow"><stop stopColor="#ffe755"/><stop offset=".6" stopColor="#6cd0c0" stopOpacity=".5"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient></defs>;
function Intro({f}:{f:number}){const p=smooth(progress(f,55,72));const lines=['const 剪辑软件 = KK.写代码();','剪辑软件.画出(时间轴, 预览, 面板);','KK.钻进屏幕().开工();'];return <g opacity={1-p} transform={`translate(${p*-40} ${p*-50}) scale(${1+p*.08})`}>
 <rect width="1600" height="900" fill={C.paper}/>
 <Text x={800} y={217} size={30} anchor="middle" fill="#917d59">从一行代码，到一条好片。</Text>
 <RoughBox x={310} y={291} w={980} h={259} fill="#fffaf0" seed={100}/>
 <path d="M312 333H1288" stroke="#d8ceb9" strokeWidth="1.5"/>
 {[C.pink,C.yellow,C.teal].map((v,i)=><circle key={v} cx={333+i*22} cy="313" r="5" fill={v}/>)}<Text x={1250} y={318} size={18} anchor="end" fill="#8f8069">kk-codex.ts</Text>
 {lines.map((line,i)=>{const n=Math.floor(progress(f,3+i*9,12+i*10)*line.length);return <g key={line}><Text x={338} y={381+i*65} size={22} fill="#b5a78d">{`0${i+1}`}</Text><Text x={393} y={381+i*65} size={35} fill={i===2?'#3d857d':C.ink}>{line.slice(0,n)}</Text></g>})}
 <Sprite x={229} y={471} w={245} pose="code" time={f/30}/>
 <Text x={844} y={647} size={50} anchor="middle">KK-Codex复刻版</Text>
 <path d="M649 666q189 14 385-1" stroke={C.yellow} strokeWidth="10" strokeLinecap="round"/>
 <Text x={850} y={717} size={25} anchor="middle" fill="#8d806a">一个小剪辑师的 30 秒工作日</Text>
 </g>}
function Outro({s}:{s:ReturnType<typeof getSceneState>}){const p=smooth(s.outro);return <g opacity={p}>
 <rect width="1600" height="900" fill={C.paper} opacity=".87"/>
 <g transform={`translate(${-35*(1-p)} 0) rotate(-3 417 435)`}><RoughBox x={112} y={262} w={492} h={332} fill="#fff9d9" seed={103}/><path d="M289 249h119l-7 35H294Z" fill="#d7c68c" opacity=".5"/><Text x={160} y={326} size={22} fill="#a68b45">MADE WITH CODE & A LITTLE JOY</Text><Text x={161} y={407} size={48}>KK-Codex复刻版</Text><path d="M163 431h370" stroke={C.yellow} strokeWidth="9" strokeLinecap="round"/><Text x={161} y={485} size={30}>把灵感，剪成喜欢的样子。</Text><Text x={161} y={555} size={23} fill="#8c8061">四段日常，一个完整故事。</Text></g>
 <Phone s={s} x={mix(704,690,p)} y={mix(103,70,p)} w={mix(232,388,p)} h={mix(411,688,p)} ending/>
 <g transform={`translate(${(1-p)*45} 0)`}><ellipse cx="1278" cy="639" rx="94" ry="17" fill="#444378" opacity=".12"/><CodeyRig x={1278} y={518} scale={1.48} pose="happy" time={s.f/30} wave/><Star x={1429} y={409} r={20}/><Star x={1144} y={340} r={11}/><Text x={1279} y={703} size={43} anchor="middle">{s.f>=887?'KK，收工！':'剪好了，看看吧！'}</Text></g>
 {s.f>=823&&<g transform={`translate(364 673) scale(${1+pulse(s.f,E.socialMilestone,17)*.1})`}><rect x="-222" y="-46" width="444" height="92" rx="24" fill="#f45c87"/><rect x="-218" y="-42" width="436" height="84" rx="21" stroke="#ffb2c4" strokeWidth="2" fill="none"/><Heart x={-154} y={2} size={32} fill="#fff3ef"/><Text x={-93} y={17} size={48} fill="#fff8f4">{s.socialLikes>=100000?'10万+':`${(Math.floor(s.socialLikes/1000)/10).toFixed(1)}万`}</Text><Text x={107} y={11} size={26} fill="#fff8f4">喜欢</Text></g>}
 <Text x={884} y={809} size={23} anchor="middle" fill="#897c64">{s.f<823?'作品准备就绪':`${clips.find(c=>c.id===s.preview)?.name}  ·  ${['sunset','coffee','dog','stage'].indexOf(s.preview)+1} / 4`}</Text>
 <Text x={800} y={867} size={20} anchor="middle" fill="#ad9f87">KK-CODEX / CREATIVE DESK / 2026</Text>
 </g>}
export function Video(){const f=useCurrentFrame(),s=getSceneState(f);return <AbsoluteFill style={{background:C.paper}}><Ready/><svg width="1920" height="1080" viewBox="0 0 1600 900"><Defs/><rect width="1600" height="900" fill={C.paper}/>{paperDots.map((d,i)=><circle key={i} {...{cx:d.x,cy:d.y,r:d.r}} fill="#5d4623" opacity=".06"/>)}
 <g transform={`translate(800 450) scale(${s.camera.z}) translate(${-s.camera.x} ${-s.camera.y})`} opacity={f<55?0:1}><Workspace s={s}/></g>
 {f<72&&<Intro f={f}/>}{f>=810&&<Outro s={s}/>}
 </svg><Audio src={staticFile('audio/mix.wav')}/></AbsoluteFill>}
export function ArtFrame({id='sunset'}:{id?:ClipId}){return <AbsoluteFill><Ready/><svg width="360" height="640" viewBox="0 0 360 640"><Artwork id={id} time={2}/></svg></AbsoluteFill>}
export function ArtworkSheet(){return <AbsoluteFill style={{background:C.paper}}><Ready/><svg width="1600" height="900"><Text x={60} y={73} size={40}>四段日常 · 同源插画素材</Text><Text x={60} y={112} size={22} fill="#8a7c68">360 × 640 / SVG / 固定纹理与自然微动作</Text>{clips.map((c,i)=><g key={c.id}><svg x={51+i*390} y={161} width="326" height="580" viewBox="0 0 360 640"><Artwork id={c.id} time={2}/></svg><Text x={214+i*390} y={789} size={31} anchor="middle">{c.name}</Text><Text x={214+i*390} y={831} size={21} anchor="middle" fill="#8d7d65">{['暖霞 · 海浪碎金','焦糖 · 叶形拉花','微笑 · 头顶字幕安全区','同一位 Codey · 镜球舞台'][i]}</Text></g>)}</svg></AbsoluteFill>}



