import React,{useId} from 'react';
import {staticFile} from 'remotion';
import {Artwork,Sprite} from './Artwork';
import {RoughBox,Text,Star,Burst} from './Primitives';
import {C,clips,ClipId} from '../config';
import {E,SceneState,clamp,progress,pulse,mix,smooth} from '../story';
import waveform from '../waveform.json';
import fontMetrics from '../font-metrics.json';
import {CodeyRig,Palm} from './CodeyRig';
import {SocialViewer} from './SocialViewer';

export function Thumb({id,x,y,w,h}:{id:ClipId,x:number,y:number,w:number,h:number}){return <image href={staticFile(`artwork/${id}.png`)} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid slice"/>}
export function Header({s}:{s:SceneState}){return <g>
 <path d="M0 0H1600V91H0Z" fill="#fcf4e6"/><rect x="12" y="12" width="1576" height="66" rx="10" fill="none" stroke={C.ink} strokeWidth="2.4"/><path d="M0 92H1600" stroke="#b8a68a" strokeWidth="1.5"/>
 {[C.pink,C.yellow,C.teal].map((c,i)=><circle key={c} cx={40+i*26} cy={43} r="7" fill={c} stroke={C.ink} strokeWidth="1.5"/>)}
 <Text x={138} y={53} size={30}>KK-Codex复刻版.mp4</Text>
 <Text x={663} y={52} size={24}>{`00:${String(Math.floor(s.f/30)).padStart(2,'0')}:${String(s.f%30).padStart(2,'0')}`}</Text>
 <Text x={917} y={49} size={23} fill="#648c77">✓ 已自动保存</Text><Text x={1200} y={50} size={22}>1080p</Text>
 <RoughBox x={1383} y={28+(s.f===739?3:0)} w={150} h={46} fill={C.teal}/><Text x={1458} y={59} anchor="middle" size={25}>↑ 导出</Text>
 </g>}
export function AssetLibrary({s}:{s:SceneState}){
 const tab=s.f>=264&&s.f<348?1:s.f>=348&&s.f<468?2:0;
 return <g><RoughBox x={31} y={110} w={318} h={416} fill="#fff8e9" seed={1}/>
  {['素材','转场','文字'].map((v,i)=><g key={v}><rect x={45+i*99} y="123" width="88" height="37" rx="7" fill={tab===i?'#ffda60':'#f6efdf'} stroke={C.ink} strokeWidth={tab===i?2:1.5}/><Text x={89+i*99} y={149} size={25} anchor="middle" fill={tab===i?C.ink:'#786c5a'}>{v}</Text></g>)}
  {tab===0&&<g>{clips.map((c,i)=>{const x=52+i%2*145,y=183+Math.floor(i/2)*151;return <g key={c.id}><RoughBox x={x} y={y} w={128} h={129} fill="#fffaf0" seed={i+3}/><svg x={x+5} y={y+5} width="118" height="93" viewBox="0 0 118 93"><Thumb id={c.id} x={0} y={0} w={118} h={93}/></svg><Text x={x+64} y={y+117} anchor="middle" size={20}>{c.name}</Text></g>})}<Text x={105} y={512} size={24} fill="#8d948b">＋</Text><Text x={250} y={512} size={24} fill="#8d948b">＋</Text></g>}
  {tab===1&&['投篮','翻页','放大','叠化','擦除','旋转'].map((name,i)=>{const x=51+i%2*146,y=181+Math.floor(i/2)*107;return <g key={name}><RoughBox x={x} y={y} w={126} h={91} fill={['#ffdc94','#dcc1f0','#bce4e8','#bfe4ca','#f9e69b','#cfc5ef'][i]} seed={12+i}/><path d={`M${x+12} ${y+11}h102`} stroke="#fffaf0" strokeWidth="2" opacity=".65" strokeLinecap="round"/><Text x={x+63} y={y+45} size={32} anchor="middle" fill={['#92501e','#614783','#276f78','#47724e','#857029','#64518b'][i]}>{['◉','▱','↗','◌','▰','↻'][i]}</Text><Text x={x+63} y={y+76} size={22} anchor="middle">{name}</Text></g>})}
  {tab===2&&['前方高能','好耶～','霓虹 NEON'].map((name,i)=><g key={name}><RoughBox x={54} y={192+i*99} w={272} h={76} fill={['#ffdf79','#a7e3cc','#d5b6ef'][i]} seed={24+i}/><path d={`M68 ${204+i*99}h244`} stroke="#fffaf0" strokeWidth="2" opacity=".65" strokeLinecap="round"/><Text x={190} y={242+i*99} size={32} anchor="middle">{name}</Text></g>)}
 </g>
}
export function Caption({text}:{text:string}){const wrong=text.endsWith('熊');return <g>
 <rect x="33" y="78" width="294" height="79" rx="19" fill="#263b37" opacity=".17"/>
 <text x="180" y="139" textAnchor="middle" fontFamily="Ma" fontSize={fontMetrics.captionFontSize} fill={C.yellow} stroke={C.ink} strokeWidth="4" paintOrder="stroke" strokeLinejoin="round">{wrong?<><tspan>前方高</tspan><tspan fill="#f291b4">熊</tspan></>:text}</text>
 {wrong&&<path d="M242 150h55" stroke="#dc5a69" strokeWidth="4" strokeLinecap="round"/>}
 </g>}
export function Phone({s,x=704,y=103,w=232,h=411,ending=false}:{s:SceneState,x?:number,y?:number,w?:number,h?:number,ending?:boolean}){
 const uid=useId().replace(/:/g,'');const a=s.transition;const view=(id:ClipId)=> <g transform={id==='stage'?`translate(180 360) scale(${s.previewScale}) translate(-180 -360)`:undefined}><Artwork id={id} time={s.sourceTime} parameters={s.parameters} beat={s.beatPulse}/></g>;
 const brightness=s.f>=760&&s.f<798&&!ending?.67:1;
 return <g><rect x={x+6} y={y+10} width={w} height={h} rx={27*w/232} fill="#272b26" opacity=".15"/>
  <rect x={x} y={y} width={w} height={h} rx={26*w/232} fill="#262829" stroke="#292521" strokeWidth="3"/>
  <svg x={x+8*w/232} y={y+9*h/411} width={w-16*w/232} height={h-27*h/411} viewBox="0 0 360 640" style={{borderRadius:18,overflow:'hidden'}}>
   <defs><clipPath id={`${uid}screen`}><rect width="360" height="640" rx="26"/></clipPath><clipPath id={`${uid}circle`}><circle cx="180" cy="320" r={(a?.p??0)*392}/></clipPath></defs>
   <g clipPath={`url(#${uid}screen)`}>
   <g opacity={brightness}>
    <g style={{filter:s.bad?'blur(6px) saturate(.3)':''}}>
    {a?<>{view(a.from)}{a.kind==='circle'?<g clipPath={`url(#${uid}circle)`}>{view(a.to)}</g>:<>{view(a.to)}<g transform={`translate(${360*a.p} 0) scale(${1-a.p} 1)`}>{view(a.from)}<rect x="342" width="18" height="640" fill="#fff7df" opacity=".9"/></g><path d={`M${360*a.p} 0V640`} stroke="#332748" strokeWidth="8" opacity=".3"/></>}</>:view(s.preview)}
    </g>
    {a?.kind==='circle'&&<circle cx="180" cy="320" r={a.p*392} fill="none" stroke="#ffe6a1" strokeWidth="6"/>}
    {s.preview==='dog'&&s.caption&&(!a||a.p>.65)&&<Caption text={s.caption}/>}
   </g>
   {ending&&<SocialViewer s={s}/>}
   {s.bad&&<g><rect x="43" y="255" width="274" height="117" rx="20" fill="#faf3df" opacity=".8"/><circle cx="180" cy="286" r="15" fill="none" stroke="#75684f" strokeWidth="4" strokeDasharray="50 45" transform={`rotate(${s.f*17} 180 286)`}/><Text x={180} y={340} size={33} anchor="middle">对焦中…</Text></g>}
   {s.f>=760&&s.f<798&&!ending&&<circle cx="180" cy="320" r="24" stroke="#fff6cb" strokeWidth="5" strokeDasharray="60 90" fill="none" transform={`rotate(${s.f*17} 180 320)`}/>}
   </g>
  </svg>
  <rect x={x+w*.365} y={y+7*h/411} width={w*.27} height={6*h/411} rx="3" fill="#141819"/>
  <path d={`M${x+w*.38} ${y+h-9*h/411}h${w*.24}`} stroke="#d9d7ce" strokeWidth="3" strokeLinecap="round"/>
  {s.beatPulse>0&&<rect x={x-4} y={y-4} width={w+8} height={h+8} rx="30" fill="none" stroke={C.yellow} strokeWidth={s.beatPulse*7} opacity={s.beatPulse}/>}
 </g>
}
export function Parameters({s}:{s:SceneState}){return <g><RoughBox x={1220} y={110} w={340} h={416} fill="#fff8e9" seed={35}/><rect x="1236" y="123" width="307" height="44" rx="9" fill="#bce7da"/><Text x={1250} y={154} size={29}>调整 ✦</Text>
 {['闪光','饱和度','缩放冲击','速度'].map((label,i)=>{const y=224+i*84;const values=[s.parameters.flash,s.parameters.saturation,s.parameters.zoom,1];const x=[s.knobX.flash,s.knobX.saturation,s.knobX.zoom,1323][i];return <g key={label}><Text x={1246} y={y-23} size={24}>{label}</Text><Text x={1515} y={y-23} size={23} anchor="end">{i===3?'1.0x':`${Math.round(values[i])}%`}</Text><path d={`M1260 ${y}H1512`} stroke="#e0dbca" strokeWidth="8" strokeLinecap="round"/><path d={`M1260 ${y}H${x}`} stroke={[C.yellow,C.teal,C.pink,'#c0b7d4'][i]} strokeWidth="8" strokeLinecap="round"/><circle cx={x} cy={y} r="10" fill="#fffcf0" stroke={C.ink} strokeWidth="2"/>{s.activeParameter===['flash','saturation','zoom','speed'][i]&&<circle cx={x} cy={y} r="17" fill="none" stroke={C.yellow} strokeWidth="2"/>}</g>})}
 </g>}
function ClipStrip({id,x,w,s,outline=true,label=true,gridOffset=0}:{id:ClipId,x:number,w:number,s:SceneState,outline?:boolean,label?:boolean,gridOffset?:number}){
 const uid=useId().replace(/:/g,'');const c=clips.find(v=>v.id===id)!;const active=s.f>=635&&s.f<=728&&s.preview===id;
 return <g><defs><clipPath id={uid}><rect x={x} y="693" width={w} height="75" rx={outline?8:0}/></clipPath></defs><g clipPath={`url(#${uid})`}><rect x={x} y="693" width={w} height="75" fill={c.color}/>{Array.from({length:Math.ceil((w+gridOffset%66)/66)},(_,i)=><Thumb key={i} id={id} x={x+i*66-gridOffset%66} y={696} w={66} h={72}/>)}<rect x={x} y="737" width={w} height="31" fill={c.color} opacity=".95"/>{label&&<Text x={x+12} y={760} size={21}>{c.name}</Text>}</g>{outline&&<rect x={x} y="693" width={w} height="75" rx="8" fill="none" stroke={active&&s.beatPulse>0?C.yellow:C.ink} strokeWidth={active&&s.beatPulse>0?4:2}/>}
 </g>
}
export function Timeline({s}:{s:SceneState}){
 const deleted=s.f>=E.ripple[1];const shift=150*s.ripple;const b=s.b;
 return <g><RoughBox x={31} y={559} w={1534} h={312} fill="#fff7e7" seed={48}/>
  <path d="M46 574h5v27h-5Z" fill="#a181d8"/><Text x={61} y={595} size={24}>时间轴</Text><Text x={202} y={592} size={17} fill="#888272">素材时间</Text>
  <RoughBox x={1304} y={574+(s.f>=604&&s.f<607?3:0)} w={146} h={37} fill={C.yellow} seed={53}/><Text x={1377} y={601} size={23} anchor="middle">▼ 卡点</Text>
  <Text x={1507} y={599} size={24} anchor="middle">{s.f>=635&&s.f<729?'Ⅱ':'▶'}</Text>
  {Array.from({length:29},(_,i)=><g key={i}><path d={`M${120+i*48} 615v${i%5===0?14:7}`} stroke="#a49983" strokeWidth="1"/>{i%5===0&&<Text x={120+i*48} y={611} size={16} fill="#8b826f" anchor="middle">{`0:${String(i/5*2).padStart(2,'0')}`}</Text>}</g>)}
  <Text x={71} y={673} size={29} anchor="middle">T</Text><Text x={71} y={740} size={25} anchor="middle">▷</Text><Text x={71} y={815} size={31} anchor="middle">♪</Text>
  {[642,689,780,835].map(y=><path key={y} d={`M112 ${y}H1539`} stroke="#cdbc9e" strokeWidth="1"/>)}
  {s.f>=367&&<g><rect x={b[2]} y="648" width={b[3]-b[2]} height="31" rx="5" fill="#f8dfa3" stroke={C.ink} strokeWidth="1.5"/><Text x={b[2]+14} y={671} size={23}>{s.caption||'T'}</Text></g>}
  {clips.map((c,i)=>{if(s.f<E.land[i])return null;if(i===1&&!deleted){return <g key={c.id}>
    <ClipStrip id="coffee" x={390} w={210} s={s} outline={false}/>
    <ClipStrip id="coffee" x={750-shift} w={110} s={s} outline={false} label={false} gridOffset={210}/>
    {s.f<E.lift&&<g><rect x="600" y="693" width="150" height="75" fill="url(#badHatch)"/><Text x={675} y={740} size={19} anchor="middle" fill="#665f5f">失焦 · zzz</Text></g>}
    {s.f<E.cutEnd[0]&&<rect x="390" y="693" width="470" height="75" rx="8" fill="none" stroke={C.ink} strokeWidth="2"/>}
    {s.cutProgress[0]>0&&<path d={`M600 693V${693+75*s.cutProgress[0]}`} stroke={C.ink} strokeWidth="2"/>}
    {s.cutProgress[1]>0&&<path d={`M${750-shift} 693v${75*s.cutProgress[1]}`} stroke={C.ink} strokeWidth="2"/>}
    {s.f>=E.cutEnd[1]&&<path d={`M600 693H398q-8 0-8 8v59q0 8 8 8h202M${750-shift} 693h102q8 0 8 8v59q0 8-8 8h-102`} fill="none" stroke={C.ink} strokeWidth="2"/>}
   </g>;}return <ClipStrip key={c.id} id={c.id} x={b[i]} w={b[i+1]-b[i]} s={s}/>;})}
  {s.f>=E.basket&&<g transform={`translate(${b[1]} 685)`}><path d="M-15-9H15V13H-15Z" fill="#f5b170" stroke={C.ink} strokeWidth="1.5"/><circle cy="2" r="7" fill="#ef914a"/><path d="M-6 2H6M0-4v12" stroke={C.ink} strokeWidth="1"/></g>}
  {s.f>=E.page&&<g transform={`translate(${b[2]} 685)`}><path d="M-14-9H14V13H-14Z" fill="#cab3e4" stroke={C.ink} strokeWidth="1.5"/><path d="M-6-3H7L3 8H-6Z" fill="#fff7e8" stroke={C.ink}/></g>}
  {s.musicReveal>0&&<g><svg x="120" y="783" width={1200*s.musicReveal} height="49" overflow="hidden"><rect x="0" y="4" width="1200" height="41" rx="7" fill="#ddd1f5" stroke="#9a7ac5" strokeWidth="1.5"/>
   {waveform.map((v,i)=><path key={i} d={`M${i*1200/waveform.length} ${24-v*66}v${v*132}`} stroke="#8460b3" strokeWidth="1.7"/>)}</svg>
   {s.musicReveal<1&&<g><ellipse cx={120+1200*s.musicReveal} cy="807" rx="8" ry="23" fill="#b297dc" stroke="#75529f" strokeWidth="2"/><Text x={120+1200*s.musicReveal} y={774} size={27} fill="#8661b3" anchor="middle">♪</Text></g>}
   {s.musicReveal===1&&<Text x={1336} y={814} size={17} fill="#8868a5">144 BPM</Text>}
  </g>}
  {[410,770,1010].map((x,i)=><g key={x}><path d={`M${x-7} 850h14l-7-10Z`} fill={C.yellow} stroke={C.ink} strokeWidth="1"/>{s.f>=606+i*9&&s.f<645&&<g><path d={`M${x} 631v210`} stroke={C.yellow} strokeWidth="2" strokeDasharray="5 4"/><path d={`M${[390,710,980][i]} 631v146`} stroke="#9b8d76" strokeWidth="1" strokeDasharray="4 4"/><Text x={s.b[i+1]} y={660} size={31} anchor="middle" fill="#b55e5a">∩</Text><Burst x={x} y={690} amount={pulse(s.f,E.snap[i],13)}/></g>}</g>)}
  <path d={`M${s.playhead} 633v200`} stroke="#d66660" strokeWidth="2.5"/><path d={`M${s.playhead-7} 628h14l-7 10Z`} fill="#d66660"/>
  {E.land.map((f,i)=><Burst key={f} x={(s.b[i]+s.b[i+1])/2} y={704} amount={pulse(s.f,f,10)}/>)}
  {E.cuts.map((f,i)=><g key={f}>{s.f>=f&&s.f<=E.cutEnd[i]&&<path d={`M${[600,750][i]} 693v${75*s.cutProgress[i]}`} stroke="#ffbd43" strokeWidth="5" opacity=".65"/>}<Burst x={[600,750][i]} y={693+75*s.cutProgress[i]} amount={pulse(s.f,f,10)}/></g>)}
  {E.beatMap.map((f,i)=><Burst key={f} x={[410,770,1010][i]} y={711} amount={pulse(s.f,f,12)}/>)}
 </g>
}
export function Character({s}:{s:SceneState}){const {x,y,pose}=s.character;const tilt=s.held?clamp((s.hand.x-x)/75,-1,1)*4:Math.sin(s.f*.13)*(pose==='walk'?3:1);
 return <g><ellipse cx={x} cy={Math.max(610,y+92)} rx="61" ry="11" fill="#393050" opacity=".14"/>
 <CodeyRig x={x} y={y} pose={pose} time={s.f/30} hand={s.held?s.hand:undefined} side={s.armSide} tilt={tilt} glasses={s.f>=600&&s.f<729}/>
 </g>
}
export function Props({s}:{s:SceneState}){return <g>
  {s.knife&&<g transform={`translate(${s.knife.x} ${s.knife.y}) rotate(19)`}><path d="M0 0L-9-28 4-51 16-42Z" fill="#bbc3c0" stroke={C.ink} strokeWidth="2"/><path d="M2-44L18-83 32-77 17-38Z" fill={C.yellow} stroke={C.ink} strokeWidth="2"/><path d="M13-55l9-20" stroke={C.ink} strokeWidth="3"/></g>}
  {s.f>=213&&s.f<266&&<g transform={`rotate(${pulse(s.f,E.bin,14)*8} 1120 540)`}>
   <ellipse cx="1120" cy="549" rx="51" ry="8" fill="#c8c4b0" opacity=".35"/>
   <path d="M1074 477Q1120 455 1166 477L1153 547H1087Z" fill="#a6bdb8" stroke={C.ink} strokeWidth="2"/>
   <ellipse cx="1120" cy="477" rx="46" ry="13" fill="#4e6965" stroke={C.ink} strokeWidth="2"/>
   {s.waste&&<g transform={`translate(${s.waste.x} ${s.waste.y}) rotate(${s.waste.angle}) scale(${s.waste.scale})`} opacity={1-progress(s.f,248,251)}><rect x="-75" y="-38" width="150" height="76" rx="3" fill="url(#badHatch)" stroke={C.ink} strokeWidth="2"/><Text x={0} y={6} size={23} anchor="middle">失焦 · zzz</Text></g>}
   <path d="M1074 480Q1120 500 1166 480L1153 548H1087Z" fill="#baccc2" stroke={C.ink} strokeWidth="2"/><path d="M1095 503l5 32M1120 507v29M1144 502l-4 32" stroke="#79918a" strokeWidth="2"/>
   {s.f>=248&&<path d={`M1071 ${477-18*(1-smooth(progress(s.f,248,254)))}q49-18 98 0`} fill="#c9d6c8" stroke={C.ink} strokeWidth="5"/>}
  </g>}
  {s.carried&&<g transform={`translate(${s.carried.p.x} ${s.carried.p.y})`}><rect x={-s.carried.w/2-3} y={-s.carried.h/2-3} width={s.carried.w+6} height={s.carried.h+6} rx="6" fill="#fcf7e7" stroke={C.ink} strokeWidth="2"/><Thumb id={s.carried.id} x={-s.carried.w/2} y={-s.carried.h/2} w={s.carried.w} h={s.carried.h}/></g>}
  {s.f>=275&&s.f<309&&<g><path d="M371 692l6 27h26l6-27" fill="none" stroke="#eee1c7" strokeWidth="2"/><path d="M375 696l25 21M385 695l18 17M405 696l-25 21" stroke="#766e61" strokeWidth="1"/><ellipse cx="390" cy="690" rx="24" ry="6" fill="none" stroke="#d97947" strokeWidth="4"/></g>}
  {s.ball&&<g><circle cx={s.ball.x} cy={s.ball.y} r="18" fill="#f0a150" stroke={C.ink} strokeWidth="2"/><path d={`M${s.ball.x-16} ${s.ball.y}h32M${s.ball.x} ${s.ball.y-16}q-10 16 0 32`} fill="none" stroke={C.ink} strokeWidth="1.4"/></g>}
  <Burst x={390} y={689} amount={pulse(s.f,E.basket,14)}/>
  {s.page&&<g transform={`translate(${s.page.x} ${s.page.y}) rotate(-12)`}><rect x="-26" y="-28" width="52" height="56" rx="7" fill="#c5a6db" stroke={C.ink} strokeWidth="2"/><path d="M-13-14H15L8 14H-13Z" fill="#fff7e3" stroke={C.ink}/></g>}
  {s.textCard&&<g><RoughBox x={s.textCard.x-73} y={s.textCard.y-26} w={146} h={52} fill={C.yellow}/><Text x={s.textCard.x} y={s.textCard.y+9} size={27} anchor="middle">前方高能</Text></g>}
  {s.f>=406&&s.f<443&&<g><RoughBox x={987} y={584+(s.f>=423&&s.f<427?5:0)} w={148} h={54} fill="#eee8d8" seed={62}/><Text x={1061} y={621+(s.f>=423&&s.f<427?5:0)} size={27} anchor="middle">Ctrl+Z</Text></g>}
 </g>}
export function Feedback({s}:{s:SceneState}){const box=s.bubbleBox,tip=s.bubbleTip,baseX=clamp(tip.x,box.x+27,box.x+box.w-27),bottom=box.y+box.h;
 return <g>
 {s.f>=450&&s.f<468&&<g transform={`rotate(-3 1060 ${box.y-30})`}><rect x="984" y={box.y-53} width="165" height="39" rx="6" fill="#e0f3df" stroke="#408b79" strokeWidth="2.5"/><Text x={1066} y={box.y-25} size={27} anchor="middle" fill="#408b79">✓ 已修正</Text></g>}
 {s.bubble&&<g><rect x={box.x+3} y={box.y+5} width={box.w} height={box.h} rx="15" fill="#796b57" opacity=".12"/><rect x={box.x} y={box.y} width={box.w} height={box.h} rx="15" fill="#fffcf2" stroke={C.ink} strokeWidth="2"/>
 <path d={`M${baseX-13} ${bottom-1}Q${baseX-7} ${bottom+9} ${tip.x} ${tip.y}Q${baseX+7} ${bottom+9} ${baseX+13} ${bottom-1}`} fill="#fffcf2" stroke={C.ink} strokeWidth="2" strokeLinejoin="round"/><path d={`M${baseX-12} ${bottom-1}h24`} stroke="#fffcf2" strokeWidth="3"/>
 <Text x={box.x+box.w/2} y={box.y+42} size={s.bubble.length>10?24:s.bubble.length>6?28:34} anchor="middle">{s.bubble}</Text></g>}
 {s.lights>0&&<g opacity={s.lights*.6}>{Array.from({length:10},(_,i)=>{const angle=i*Math.PI/5;return <path key={i} d={`M${1100+Math.cos(angle)*115} ${440+Math.sin(angle)*115}l${Math.cos(angle)*48} ${Math.sin(angle)*48}`} stroke={[C.yellow,C.teal,C.pink][i%3]} strokeWidth="5" strokeLinecap="round"/>})}</g>}
 </g>}
export function ExportDialog({s}:{s:SceneState}){if(s.f<E.dialog||s.f>=810)return null;const done=s.f>=798;const p=done?100:Math.min(99.9,progress(s.f,742,760)*99.9);const hit=s.f>=790?Math.sin((s.f-790)*2)*Math.exp(-(s.f-790)/3)*9:0;
 return <g transform={`translate(${hit} 0)`}><rect x="420" y="220" width="760" height="270" rx="24" fill="#403327" opacity=".04"/><RoughBox x={610} y={241} w={421} h={236} fill="#fffaf0" seed={86}/><Text x={646} y={291} size={30}>{done?'导出完成 ✓':'正在导出…'}</Text><Text x={988} y={290} size={23} anchor="end">MP4</Text><rect x="646" y="326" width="347" height="26" rx="8" fill="#e6e0cf" stroke={C.ink} strokeWidth="1.5"/><rect x="648" y="328" width={343*p/100} height="22" rx="6" fill={done?C.teal:C.yellow}/><Text x={820} y={402} size={44} anchor="middle">{done?'100%':`${p.toFixed(1)}%`}</Text><Text x={820} y={445} size={23} anchor="middle" fill="#857b69">{done?'灵感，已经准备好了':'最后一点点…'}</Text>
 {done&&Array.from({length:20},(_,i)=><rect key={i} x={630+(i*79)%390} y={245-((s.f-798)*5)+(i*17)%90} width="7" height="13" fill={[C.yellow,C.teal,C.pink,C.purple][i%4]} transform={`rotate(${i*27+s.f*3} ${630+(i*79)%390} ${245-((s.f-798)*5)+(i*17)%90})`}/>)}
 </g>
}
export function Workspace({s}:{s:SceneState}){return <g>
 <Header s={s}/><AssetLibrary s={s}/><Parameters s={s}/>
 <Text x={819} y={547} size={18} anchor="middle" fill="#a79b87">PREVIEW · 9:16</Text>
 <Phone s={s}/><Timeline s={s}/>
 {s.lights>0&&<g opacity={s.lights*.22}><ellipse cx="1040" cy="420" rx="540" ry="360" fill="url(#tableGlow)"/><ellipse cx="1130" cy="607" rx="230" ry="19" fill={C.teal}/></g>}
 <ExportDialog s={s}/>{s.f<810&&<><Character s={s}/><Props s={s}/>{s.held&&<Palm x={s.hand.x} y={s.hand.y}/>}<Feedback s={s}/></>}
 </g>}



