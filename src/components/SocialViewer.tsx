import React from 'react';
import {SceneState,E,pulse,progress} from '../story';
import {Text} from './Primitives';
import {CodeyRig} from './CodeyRig';
export function Heart({x,y,size=20,fill='#ff4e78'}:{x:number,y:number,size?:number,fill?:string}){return <path d="M0 15C-6 10-22 0-21-11C-20-24-6-28 0-17C6-28 20-24 21-11C22 0 6 10 0 15Z" transform={`translate(${x} ${y}) scale(${size/24})`} fill={fill}/>}
export function SocialViewer({s}:{s:SceneState}){const liked=s.f>=E.socialLikes[0];return <g>
 <defs><linearGradient id="socialBottom" x2="0" y2="1"><stop stopColor="#11192d" stopOpacity="0"/><stop offset="1" stopColor="#11192d" stopOpacity=".88"/></linearGradient><linearGradient id="socialTop" x2="0" y2="1"><stop stopColor="#11192d" stopOpacity=".56"/><stop offset="1" stopColor="#11192d" stopOpacity="0"/></linearGradient></defs>
 <rect width="360" height="77" fill="url(#socialTop)"/><rect y="505" width="360" height="135" fill="url(#socialBottom)"/>
 <path d="M27 29l-10 10 10 10" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
 <Text x={147} y={44} size={19} anchor="middle" fill="#e3d8ec">关注</Text><Text x={207} y={44} size={20} anchor="middle" fill="white">推荐</Text><path d="M191 54h32" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
 <circle cx="329" cy="38" r="8" stroke="white" strokeWidth="2" fill="none"/><path d="M335 44l6 6" stroke="white" strokeWidth="2"/>
 <circle cx="324" cy="266" r="24" fill="#8cc5fb" stroke="white" strokeWidth="2"/><g transform="translate(324 268) scale(.25)"><CodeyRig x={0} y={15} time={0} pose="happy"/></g><circle cx="324" cy="289" r="9" fill="#ff416e"/><path d="M320 289h8M324 285v8" stroke="white" strokeWidth="1.8"/>
 <g transform={`translate(324 341) scale(${1+s.socialLikePulse*.28})`}><Heart x={0} y={0} size={25} fill={liked?'#ff416e':'#fff'}/></g>
 <Text x={324} y={371} size={17} anchor="middle" fill="white" stroke="#372437" strokeWidth=".55" paintOrder="stroke">{s.socialLikes>=100000?'10万+':`${(Math.floor(s.socialLikes/1000)/10).toFixed(1)}万`}</Text>
 <g fill="white"><path d="M306 397q0-12 18-12t18 12q0 14-16 16l-11 6 2-8q-11-3-11-14Z"/><circle cx="316" cy="399" r="2" fill="#514969"/><circle cx="324" cy="399" r="2" fill="#514969"/><circle cx="332" cy="399" r="2" fill="#514969"/></g><Text x={324} y={441} size={17} anchor="middle" fill="white">2688</Text>
 <path d="M306 483q1-21 23-22v-11l20 23-20 17v-11q-12-3-23 4Z" fill="white"/><Text x={324} y={511} size={17} anchor="middle" fill="white">转发</Text>
 <circle cx="325" cy="552" r="21" fill="#17192b" stroke="#e0d5e3" strokeWidth="2"/><circle cx="325" cy="552" r="10" fill="#bda7ed"/><path d="M323 546v11q-5 5-7 0t5-3m2-8 7-2v11q-5 5-6 0" fill="none" stroke="white" strokeWidth="1.5"/>
 <Text x={19} y={558} size={21} fill="white">@KK-Codex</Text><Text x={19} y={585} size={15} fill="white">把灵感，剪成喜欢的样子。</Text><Text x={19} y={605} size={12} fill="#e5dfef">♪ 原创音乐 · KK 的剪辑工作台</Text>
 <rect y="616" width="360" height="24" fill="#181723"/><Text x={46} y={633} size={12} fill="white" anchor="middle">首页</Text><Text x={112} y={633} size={12} fill="#d9d4e0" anchor="middle">朋友</Text><rect x="164" y="621" width="32" height="15" rx="4" fill="white"/><path d="M175 628h10M180 624v9" stroke="#20202f" strokeWidth="1.5"/><Text x={247} y={633} size={12} fill="#d9d4e0" anchor="middle">消息</Text><Text x={320} y={633} size={12} fill="#d9d4e0" anchor="middle">我</Text>
 {E.socialLikes.map((event,i)=>{const p=progress(s.f,event,event+23);return s.f>=event&&p<1?<g key={event} opacity={(1-p)*.82}><Heart x={306-Math.sin(p*4+i)*16} y={328-p*105} size={9+5*p}/><Heart x={339+Math.sin(p*5+i)*8} y={324-p*76} size={6+4*p} fill="#ff9bc2"/></g>:null})}
 </g>}

