import React from 'react';
import rough from 'roughjs';
import {C} from '../config';
const generator=rough.generator();
const cache=new Map<string,ReturnType<typeof generator.toPaths>>();
export function RoughBox({x,y,w,h,fill=C.paper,seed=7,r=12,stroke=C.ink}:{x:number,y:number,w:number,h:number,fill?:string,seed?:number,r?:number,stroke?:string}){
 const radius=Math.min(r,w/2,h/2),key=`${w}:${h}:${radius}:${seed}:${stroke}`;
 const outline=`M${radius} 0H${w-radius}Q${w} 0 ${w} ${radius}V${h-radius}Q${w} ${h} ${w-radius} ${h}H${radius}Q0 ${h} 0 ${h-radius}V${radius}Q0 0 ${radius} 0Z`;
 if(!cache.has(key))cache.set(key,generator.toPaths(generator.path(outline,{seed:20260928+seed,roughness:.42,bowing:.35,strokeWidth:2.4,stroke,disableMultiStroke:true})));
 return <g transform={`translate(${x} ${y})`}><rect x="3" y="5" width={w} height={h} rx={radius} fill="#725437" opacity=".13"/><rect width={w} height={h} rx={radius} fill={fill}/>{cache.get(key)!.map((p,i)=><path key={i} d={p.d} stroke={p.stroke} strokeWidth={p.strokeWidth} fill="none"/>)}</g>;
}
export function Text({x,y,children,size=25,fill=C.ink,anchor='start',opacity=1,...props}:{x:number,y:number,children:React.ReactNode,size?:number,fill?:string,anchor?:'start'|'middle'|'end',opacity?:number}&React.SVGProps<SVGTextElement>){
 const content=typeof children==='string'?children.split(/([\x00-\x7F]+)/).map((s,i)=><tspan key={i} fontFamily={/^[\x00-\x7F]+$/.test(s)?'Wenkai':'Ma'}>{s}</tspan>):children;
 return <text x={x} y={y} fontFamily="Ma, Wenkai" fontSize={size} fill={fill} textAnchor={anchor} opacity={opacity} {...props}>{content}</text>;
}
export function Star({x,y,r=12,fill=C.yellow,rotate=0}:{x:number,y:number,r?:number,fill?:string,rotate?:number}){return <path d={`M0 ${-r}L${r*.26} ${-r*.25}L${r} 0L${r*.26} ${r*.26}L0 ${r}L${-r*.26} ${r*.26}L${-r} 0L${-r*.26} ${-r*.26}Z`} transform={`translate(${x} ${y}) rotate(${rotate})`} fill={fill} stroke={C.ink} strokeWidth="1"/>}
export function Burst({x,y,amount}:{x:number,y:number,amount:number}){if(amount<=0)return null;return <g opacity={amount}>{Array.from({length:6},(_,i)=><Star key={i} x={x+Math.cos(i*Math.PI/3)*(18+(1-amount)*22)} y={y+Math.sin(i*Math.PI/3)*(18+(1-amount)*22)} r={5+amount*5} rotate={i*24}/>)}</g>}
