import React,{useId} from 'react';
import {staticFile} from 'remotion';
import type {Point} from '../story';
const counts={idle:6,walk:8,wave:4,panic:8,think:6,code:6,happy:6};
type Pose=keyof typeof counts;
// Only the operating arm is extended. Original torso, legs and opposite arm stay intact.
function Arm({side,hand,fill}:{side:number,hand:Point,fill:string}){
 const a={x:side*26,y:29},b=hand,distance=Math.hypot(b.x-a.x,b.y-a.y);
 const c={x:a.x+side*Math.min(30,distance*.24),y:a.y+Math.min(16,distance*.3)};
 const d={x:b.x-(b.x-a.x)*.20,y:b.y-(b.y-a.y)*.22};
 const left:Point[]=[],right:Point[]=[];
 for(let i=0;i<=32;i++){
  const t=i/32,u=1-t;
  const x=u*u*u*a.x+3*u*u*t*c.x+3*u*t*t*d.x+t*t*t*b.x;
  const y=u*u*u*a.y+3*u*u*t*c.y+3*u*t*t*d.y+t*t*t*b.y;
  const tx=3*u*u*(c.x-a.x)+6*u*t*(d.x-c.x)+3*t*t*(b.x-d.x);
  const ty=3*u*u*(c.y-a.y)+6*u*t*(d.y-c.y)+3*t*t*(b.y-d.y);
  const n=Math.hypot(tx,ty)||1,r=10.5*(1-t)+7*t+1.5*Math.sin(Math.PI*t);
  left.push({x:x-ty/n*r,y:y+tx/n*r});right.push({x:x+ty/n*r,y:y-tx/n*r});
 }
 const path=`M${left.map(p=>`${p.x},${p.y}`).join('L')}L${right.reverse().map(p=>`${p.x},${p.y}`).join('L')}Z`;
 return <g><path d={path} fill={fill} stroke="#142653" strokeWidth="2.5" strokeLinejoin="round"/>
  <path d={`M${a.x} ${a.y}C${c.x} ${c.y} ${d.x} ${d.y} ${b.x} ${b.y}`} fill="none" stroke="#90baff" strokeWidth="4" opacity=".28" strokeLinecap="round"/>
  <Palm x={b.x} y={b.y}/>
 </g>;
}
export function Palm({x,y,fill='#527ff1',angle=0}:{x:number,y:number,fill?:string,angle?:number}){
 return <g transform={`translate(${x} ${y}) rotate(${angle})`}>
  <path d="M-7 5C-11 1-10-7-5-9Q0-12 6-8Q11-5 9 1Q11 7 3 10Q-4 11-7 5Z" fill={fill} stroke="#142653" strokeWidth="2.2" strokeLinejoin="round"/>
  <path d="M-5-5Q-1-8 3-6" stroke="#92b9ff" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".6"/>
 </g>;
}
export function CodeyRig({x,y,time,pose='idle',hand,side=1,scale=1,tilt=0,glasses=false,wave=false}:{x:number,y:number,time:number,pose?:Pose,hand?:Point,side?:number,scale?:number,tilt?:number,glasses?:boolean,wave?:boolean}){
 const id=useId().replace(/:/g,'');const angle=-tilt*Math.PI/180;
 const relative=hand?{x:(hand.x-x)/scale,y:(hand.y-y)/scale}:null;
 const target=relative?{x:relative.x*Math.cos(angle)-relative.y*Math.sin(angle),y:relative.x*Math.sin(angle)+relative.y*Math.cos(angle)}:null;
 const nativePose=wave?'wave':pose;
 const index=Math.floor(Math.max(0,time)*(nativePose==='walk'?8:5))%counts[nativePose];
 const source=target?'idle-0':`${nativePose}-${index}`;
 // The mask follows the outside of the torso in original sprite pixels.
 const armRemoval=side<0?'M0 144H70L65 157L64 208H0Z':'M128 144H192V208H132L130 158Z';
 const expression=pose==='think'?'think-1':pose==='panic'?'panic-2':pose==='happy'?'happy-1':null;
 return <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${scale})`}>
  {target&&<defs>
   <linearGradient id={`${id}arm`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#6092ff"/><stop offset=".5" stopColor="#4e7ef1"/><stop offset="1" stopColor="#3b64dc"/></linearGradient>
   <mask id={`${id}body`} maskUnits="userSpaceOnUse" x="-110" y="-130" width="220" height="230"><rect x="-110" y="-130" width="220" height="230" fill="white"/><path transform="translate(-96 -120)" d={armRemoval} fill="black"/></mask>
   <clipPath id={`${id}face`}><rect x="-29" y="-39" width="71" height="43" rx="8"/></clipPath>
  </defs>}
  {target&&<Arm side={side} hand={target} fill={`url(#${id}arm)`}/>}
  <image href={staticFile(`character/${source}.png`)} x="-96" y="-120" width="192" height="208" mask={target?`url(#${id}body)`:undefined}/>
  {target&&expression&&<image href={staticFile(`character/${expression}.png`)} x="-96" y="-120" width="192" height="208" clipPath={`url(#${id}face)`}/>}
  {glasses&&<g><path d="M-32-32l32 1-4 19h-22ZM9-31l32-1-4 20H14Z" fill="#252e45" stroke="#102139" strokeWidth="2"/><path d="M0-28h10" stroke="#102139" strokeWidth="4"/><path d="M-25-28l12 9M16-28l12 9" stroke="#7998bc" strokeWidth="2"/></g>}
  {pose==='panic'&&<path d="M79-87q18 22 5 25q-15-3-5-25" fill="#7cd8f4" stroke="#336eab" strokeWidth="2"/>}
 </g>;
}
