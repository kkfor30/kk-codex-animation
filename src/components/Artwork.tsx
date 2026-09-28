import React,{useId} from 'react';
import {staticFile} from 'remotion';
import {ClipId} from '../config';
import {CodeyRig} from './CodeyRig';

export const spriteCounts={idle:6,walk:8,wave:4,panic:8,think:6,code:6,happy:6};
export function Sprite({x,y,w=192,pose='idle',time=0}:{x:number,y:number,w?:number,pose?:keyof typeof spriteCounts,time?:number}){
 const index=Math.floor(Math.max(0,time)*(pose==='walk'?8:5))%spriteCounts[pose];
 return <image href={staticFile(`character/${pose}-${index}.png`)} x={x} y={y} width={w} height={w*208/192}/>;
}
const heart=(x:number,y:number,s:number)=>`M${x},${y+s*.8} C${x-s*1.6},${y-s*.2} ${x-s*.6},${y-s*1.3} ${x},${y-s*.4} C${x+s*.6},${y-s*1.3} ${x+s*1.6},${y-s*.2} ${x},${y+s*.8}Z`;
export function Artwork({id,time=0,quality='full',parameters={flash:0,saturation:100,zoom:0,speed:1},beat=0}:{id:ClipId,time?:number,quality?:'full'|'thumb',parameters?:{flash:number,saturation:number,zoom:number,speed:number},beat?:number}){
 const uid=useId().replace(/:/g,'');const g=(s:string)=>`${uid}-${s}`;const url=(s:string)=>`url(#${g(s)})`;
 const breath=Math.sin(time*2.1);const full=quality==='full';
 return <svg width="360" height="640" viewBox="0 0 360 640" overflow="hidden">
  <defs>
   <linearGradient id={g('sky')} x2="0" y2=".55"><stop stopColor="#ffd04b"/><stop offset=".48" stopColor="#ff9148"/><stop offset="1" stopColor="#f36188"/></linearGradient>
   <linearGradient id={g('sea')} x2="0" y2="1"><stop stopColor="#398fba"/><stop offset=".5" stopColor="#2e66ad"/><stop offset="1" stopColor="#233b80"/></linearGradient>
   <radialGradient id={g('sun')}><stop stopColor="#fff3a5"/><stop offset=".7" stopColor="#ffcb54"/><stop offset="1" stopColor="#ffdf86" stopOpacity="0"/></radialGradient>
   <linearGradient id={g('table')} x1="0" x2="1" y2="1"><stop stopColor="#ffecca"/><stop offset="1" stopColor="#d99a69"/></linearGradient>
   <linearGradient id={g('cup')} x2=".8" y2="1"><stop stopColor="#fffefa"/><stop offset=".6" stopColor="#efe0ca"/><stop offset="1" stopColor="#b58c6c"/></linearGradient>
   <radialGradient id={g('latte')} cx=".35" cy=".3"><stop stopColor="#e6a04e"/><stop offset=".65" stopColor="#c27432"/><stop offset="1" stopColor="#78401e"/></radialGradient>
   <linearGradient id={g('fur')} x2=".8" y2="1"><stop stopColor="#ffcb68"/><stop offset=".5" stopColor="#e79c3d"/><stop offset="1" stopColor="#cd7133"/></linearGradient>
   <linearGradient id={g('stage')} x2=".65" y2="1"><stop stopColor="#492b91"/><stop offset=".52" stopColor="#a44fce"/><stop offset="1" stopColor="#f492bf"/></linearGradient>
   <radialGradient id={g('orb')} cx=".3" cy=".2"><stop stopColor="#fffce5"/><stop offset=".5" stopColor="#bfe6f3"/><stop offset="1" stopColor="#78629d"/></radialGradient>
   <pattern id={g('grain')} width="61" height="73" patternUnits="userSpaceOnUse"><circle cx="11" cy="22" r=".9" fill="#33271b" opacity=".08"/><circle cx="43" cy="60" r="1.2" fill="#fff" opacity=".18"/><path d="M20 44l3 -1M53 13l2 1" stroke="#37291e" opacity=".06"/></pattern>
  </defs>
  {id==='sunset'&&<g>
   <path d="M0 0H360V640H0Z" fill={url('sky')}/>
   <circle cx="220" cy="205" r={91+Math.sin(time)*3} fill={url('sun')} opacity=".7"/>
   <circle cx="220" cy="205" r="43" fill="#fff1a0" stroke="#f7c365" strokeWidth="2"/>
   <path d="M0 301L43 280 79 285 110 273 142 290 174 294 214 274 261 289 296 277 334 295 360 289V358H0Z" fill="#b15e9c"/>
   <path d="M0 319L39 308 81 315 129 294 161 318 203 315 241 302 281 323 321 303 360 316V363H0Z" fill="#654083"/>
   <path d="M0 328 Q180 321 360 328V640H0Z" fill={url('sea')}/>
   {Array.from({length:23},(_,i)=>{const y=340+Math.pow(i/22,1.43)*288;const drift=Math.sin(time*.65+i*.8)*5;return <g key={i}>
    <path d={`M-20 ${y}Q40 ${y-5} 88 ${y}T195 ${y+1}T380 ${y-1}`} fill="none" stroke={i%3===0?'#9bc9e1':'#6fa7d1'} opacity={.45-i*.008} strokeWidth={1+i*.07} transform={`translate(${drift} 0)`}/>
    <path d={`M${220-(7+i*2)+(i%3)*2} ${y+3}q${8+i*1.7} ${-3-i*.1} ${16+i*3.1} 0`} stroke={i%2?'#ffd171':'#ffb94f'} opacity={.85-i*.021} strokeWidth={1.3+i*.09} fill="none" transform={`translate(${drift} 0)`}/>
   </g>})}
   <path d="M-12 595Q88 586 172 621T373 610V650H-12Z" fill="#2b477f" opacity=".65"/>
   <g fill="#4b4e40" stroke="#3e4236" strokeWidth="2">
    <path d="M-10 0Q73 21 89 122Q37 75-10 0M-10 3Q102-5 151 52Q64 38-10 3M-10 3Q41 92 24 153Q1 82-10 3"/>
    <path d="M370-5Q291 25 286 114Q329 55 370-5M370-5Q280-14 225 49Q305 28 370-5"/>
   </g>
   <g fill="none" stroke="#675c4b" strokeWidth="1.2"><path d="M0 4Q70 33 87 114M2 1L141 45M357 2Q314 34 289 106"/></g>
   <path d="M43 172q8 -7 16 0q8-7 16 0M72 191q5-5 11 0q5-5 11 0" fill="none" stroke="#7b5c6e" strokeWidth="2"/>
  </g>}
  {id==='coffee'&&<g>
   <rect width="360" height="640" fill={url('table')}/>
   {Array.from({length:15},(_,i)=><path key={i} d={`M${i*34-170} -20Q${i*34-85} 160 ${i*34+20} 660`} fill="none" stroke={i%2?'#c89e7d':'#fff3d9'} strokeWidth={i%3===0?2:1} opacity=".35"/>)}
   <path d="M-10 71L91 49 116 165-10 183Z" fill="#e2c49f" opacity=".8"/><path d="M0 85L76 67 94 148 0 165" stroke="#f5ead5" fill="none" strokeWidth="2"/>
   <ellipse cx="193" cy="474" rx="145" ry="55" fill="#805437" opacity=".15"/>
   <ellipse cx="177" cy="438" rx="153" ry="99" fill="#bba58c" stroke="#5d4636" strokeWidth="3"/>
   <ellipse cx="172" cy="427" rx="153" ry="96" fill="#fffaf0" stroke="#80644d" strokeWidth="2.5"/>
   <ellipse cx="172" cy="427" rx="125" ry="72" fill="none" stroke="#d7c3aa" strokeWidth="3"/>
   <path d="M289 334C365 313 369 398 302 418L280 392C327 388 335 354 292 366Z" fill={url('cup')} stroke="#5c3e2a" strokeWidth="3.5"/>
   <path d="M57 322C52 483 291 495 303 327Z" fill={url('cup')} stroke="#604635" strokeWidth="3.5"/>
   <path d="M72 363Q78 421 124 439" fill="none" stroke="#fffaf0" strokeWidth="10" strokeLinecap="round" opacity=".8"/>
   <ellipse cx="180" cy="325" rx="127" ry="106" fill="#fff9e8" stroke="#604635" strokeWidth="3.5"/>
   <ellipse cx="180" cy="325" rx="115" ry="94" fill="#683823"/>
   <ellipse cx="180" cy="322" rx="109" ry="87" fill={url('latte')} stroke="#e5b976" strokeWidth="2"/>
   <g fill="#fff0cf" transform="translate(180 323) rotate(-8)">
    {Array.from({length:7},(_,i)=>{const y=-43+i*15,w=50-i*5;return <path key={i} d={`M0 ${y+23} C${-w-5} ${y+5} ${-w} ${y-13} 0 ${y+7} C${w} ${y-13} ${w+5} ${y+5} 0 ${y+23}Z`} stroke="#bb8042" strokeWidth="2.2"/>})}
    <path d="M-2-42Q-1 28 2 73L9 88Q3 17 2-42Z"/>
   </g>
   <path d="M88 290Q105 247 162 243" fill="none" stroke="#fff3d2" strokeWidth="4" strokeLinecap="round"/>
   {Array.from({length:3},(_,i)=><path key={i} d={`M${125+i*51} 201C${93+i*53+breath*6} 160 ${166+i*41} 144 ${138+i*45+breath*7} 104`} fill="none" stroke="#fff9e9" strokeWidth="5" strokeLinecap="round" opacity={.36+i*.07}/>)}
   {[[55,530,-30],[89,552,30],[305,551,-24],[285,581,40]].map(([x,y,r],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><ellipse rx="11" ry="17" fill="#6d402a" stroke="#3c3026" strokeWidth="2"/><path d="M0-13Q-6 0 2 12" fill="none" stroke="#c89864" strokeWidth="2"/></g>)}
  </g>}
  {id==='dog'&&<g>
   <defs><radialGradient id={g('dogBG')} cx=".45" cy=".4" r=".8"><stop stopColor="#adede0"/><stop offset=".65" stopColor="#52c6bc"/><stop offset="1" stopColor="#249c9b"/></radialGradient><radialGradient id={g('roundFur')} cx=".35" cy=".25" r=".85"><stop stopColor="#ffe39a"/><stop offset=".38" stopColor="#ffc35f"/><stop offset=".78" stopColor="#ee9537"/><stop offset="1" stopColor="#ca6329"/></radialGradient><radialGradient id={g('cream')} cx=".4" cy=".2" r=".9"><stop stopColor="#fffdf0"/><stop offset="1" stopColor="#ffe1ac"/></radialGradient></defs>
   <rect width="360" height="640" fill={url('dogBG')}/>
   {Array.from({length:32},(_,i)=><circle key={i} cx={(i*83+19)%360} cy={(i*131+32)%640} r={i%3+1.5} fill="#e9ffdf" opacity=".5"/>)}
   {[[39,224],[321,244],[39,457],[321,457],[283,561]].map(([x,y],i)=><path key={i} d={heart(x,y+Math.sin(time*.9+i)*5,13+i%2*4)} fill="#ff93af" stroke="#c36385" strokeWidth="1.4"/>)}
   <ellipse cx="180" cy="613" rx="100" ry="18" fill="#1b6b65" opacity=".2"/>
   <g transform={`translate(0 ${breath*1.5})`} stroke="#613c2c" strokeWidth="3.3" strokeLinejoin="round">
    <g transform={`rotate(${breath*4} 259 543)`}><path d="M253 548C335 589 350 487 313 472C272 457 257 502 291 516C317 527 295 552 268 535Z" fill={url('roundFur')}/><path d="M305 481Q330 493 323 518" stroke="#ffdda0" strokeWidth="8" strokeLinecap="round" fill="none"/></g>
    <path d="M120 413Q95 460 101 583Q99 615 130 613L151 586H209L230 613Q261 615 259 583Q265 460 240 413Z" fill={url('roundFur')}/>
    <path d="M150 429Q126 461 134 544Q143 584 180 592Q217 584 226 544Q234 461 210 429Z" fill={url('cream')} stroke="none"/>
    <path d="M126 544L126 610M234 544L234 610" fill="none" strokeWidth="3"/><path d="M111 601l5 9m22-9-4 9M223 601l5 9m22-9-4 9" strokeWidth="1.7"/>
    {/* Mirrored ears and a symmetrical, rounded cranial silhouette. */}
    {[-1,1].map(side=><g key={side} transform={`translate(180 0) scale(${side} 1)`}><path d="M27 262Q35 210 78 184Q97 226 89 283Z" fill={url('roundFur')}/><path d="M45 254Q54 228 75 209Q83 235 79 260Z" fill="#d87d67" stroke="none"/><path d="M58 234l10-15" fill="none" stroke="#f9b694" strokeWidth="4" strokeLinecap="round"/></g>)}
    <path d="M180 229C117 229 80 269 76 324C71 383 112 437 180 440C248 437 289 383 284 324C280 269 243 229 180 229Z" fill={url('roundFur')}/>
    <path d="M80 337C92 321 119 329 142 354Q160 341 180 346Q200 341 218 354C241 329 268 321 280 337C282 387 237 430 180 433C123 430 78 387 80 337Z" fill={url('cream')} stroke="none"/>
    {[-1,1].map(side=><g key={side} transform={`translate(180 0) scale(${side} 1)`}><path d="M34 292q16-10 29 1" stroke="#ffe9b3" strokeWidth="7" fill="none" strokeLinecap="round"/><ellipse cx="48" cy="316" rx="10" ry="13" fill="#342721" stroke="none"/><circle cx="45" cy="312" r="3.2" fill="#fff9e3" stroke="none"/><ellipse cx="68" cy="358" rx="17" ry="10" fill="#ef9788" opacity=".67" stroke="none"/></g>)}
    <ellipse cx="180" cy="358" rx="18" ry="13" fill="#392a24" strokeWidth="2"/><ellipse cx="175" cy="353" rx="5" ry="2.7" fill="#8c6b54" stroke="none"/>
    <path d="M180 371v9Q165 396 151 380M180 380Q195 396 209 380" fill="none" strokeWidth="3.2" strokeLinecap="round"/>
    <path d="M165 391Q180 416 195 391Q180 398 165 391Z" fill="#ed8b9c" strokeWidth="2"/>
    <path d="M119 427Q180 447 241 427L243 445Q180 466 117 445Z" fill="#ec5863"/>
    <path d="M127 433Q180 450 233 433" stroke="#ffb2a5" strokeWidth="3" fill="none"/>
    <circle cx="180" cy="454" r="16" fill="#ffd359" strokeWidth="2.5"/><circle cx="175" cy="449" r="5" fill="#ffed9f" stroke="none"/><path d="M180 448v12m-5 1h10" strokeWidth="2"/>
   </g>
  </g>}
  {id==='stage'&&<g style={{filter:`saturate(${parameters.saturation/100})`}}>
   <rect width="360" height="640" fill={url('stage')}/>
   <path d="M48 0L-50 640H246Z" fill="#ffebad" opacity=".12"/><path d="M325 0L118 640H449Z" fill="#bde8f5" opacity=".16"/>
   <path d="M0 420H360V640H0Z" fill="#615296"/>
   {Array.from({length:7},(_,row)=>{const y=420+Math.pow(row/6,1.7)*220,ny=420+Math.pow((row+1)/6,1.7)*220;return Array.from({length:12},(_,col)=>{const x=180+(col-6)*(y-395)*.31,nx=180+(col-5)*(y-395)*.31;const xx=180+(col-6)*(ny-395)*.31,nnx=180+(col-5)*(ny-395)*.31;return <path key={`${row}-${col}`} d={`M${x} ${y}H${nx}L${nnx} ${ny}H${xx}Z`} fill={(row+col)%2?'#b396de':'#4b569f'} stroke="#c6abd3" strokeWidth=".8"/>})})}
   <path d="M180 0V82" stroke="#e4cbed" strokeWidth="2"/><circle cx="180" cy="125" r="43" fill={url('orb')} stroke="#39304f" strokeWidth="3"/>
   <g stroke="#797da4" fill="none" strokeWidth="1.2"><ellipse cx="180" cy="125" rx="24" ry="43"/><ellipse cx="180" cy="125" rx="39" ry="16"/><path d="M138 125h84M180 83v84M145 104h70M145 146h70"/></g>
   <path d="M204 88l4 11 12 3-12 4-4 11-3-11-11-4 11-3Z" fill="#fff8c4"/>
   {[0,1,2,3,4,5].map(i=><circle key={i} cx={30+i*61} cy={230+(i%3)*53} r={2+(i%2)} fill="#fff4d8" opacity=".6"/>)}
   <g transform={`translate(180 553) scale(${1+beat*.1*parameters.zoom/50} ${1-beat*.045}) translate(-180 -553)`}>
    <ellipse cx="180" cy="567" rx={72-beat*10} ry="16" fill="#302c59" opacity=".32"/>
    <g transform={`translate(${Math.sin(time*4)*4} ${-Math.max(0,Math.sin(time*7.5398))*16-beat*13}) rotate(${Math.sin(time*3.7699)*4} 180 520)`}>
     <CodeyRig x={180} y={466} scale={1.25} time={time} pose="happy" wave/>
    </g>
   </g>
   <rect width="360" height="640" fill="#fff3b1" opacity={parameters.flash/100*(.08+beat*.3)}/>
  </g>}
  {full&&<rect width="360" height="640" fill={url('grain')} style={{mixBlendMode:'multiply'}}/>}
 </svg>;
}

