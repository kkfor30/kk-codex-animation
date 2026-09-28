import E from './events.json';
import {ClipId} from './config';
export {E};
export const clamp=(v:number,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const progress=(f:number,a:number,b:number)=>clamp((f-a)/(b-a));
export const smooth=(x:number)=>{x=clamp(x);return x*x*(3-2*x)};
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const tween=(f:number,a:number,b:number,x:number,y:number)=>mix(x,y,smooth(progress(f,a,b)));
export type Point={x:number,y:number};
export const pt=(x:number,y:number):Point=>({x,y});
export const between=(a:Point,b:Point,t:number):Point=>pt(mix(a.x,b.x,t),mix(a.y,b.y,t));
export const pulse=(f:number,event:number,length=12)=>f>=event&&f<event+length?Math.sin(Math.PI*(f-event)/length)*Math.exp(-(f-event)/length):0;
export const travel=(f:number,keys:number[],values:number[],eased=false)=>{
 let i=keys.findIndex((k)=>f<k)-1;if(f<keys[0])return values[0];if(i<0)return values[values.length-1];
 return mix(values[i],values[i+1],eased?smooth(progress(f,keys[i],keys[i+1])):progress(f,keys[i],keys[i+1]));
};
export const coffeeSource=(edited:number)=>edited<210?edited:edited+150;
export function getSceneState(frame:number){
 const f=clamp(frame,0,899),sec=E.sections.findIndex(v=>f<v)-1;
 const ripple=smooth(progress(f,...E.ripple as [number,number]));
 const b=[120,390,860-150*ripple,1130-150*ripple,1470-150*ripple];
 if(f>=E.sections[6]){b[1]=tween(f,606,E.snap[0],390,410);b[2]=tween(f,615,E.snap[1],710,770);b[3]=tween(f,624,E.snap[2],980,1010);}
 const flash=f<E.flashDown[0]?tween(f,...E.flashUp as [number,number],0,70):tween(f,...E.flashDown as [number,number],70,20);
 const saturation=f<E.satDown[0]?tween(f,...E.satUp as [number,number],100,360):tween(f,...E.satDown as [number,number],360,115);
 const zoom=tween(f,...E.zoomUp as [number,number],0,50);
 const parameters={flash,saturation,zoom,speed:1};
 const knobX={flash:1260+252*flash/100,saturation:1260+252*saturation/400,zoom:1260+252*zoom/100};
 let playhead=120,preview:ClipId='sunset',sourceTime=f/30,bad=false,transition:null|{kind:'circle'|'page',from:ClipId,to:ClipId,p:number}=null;
 if(f>=156&&f<264){playhead=tween(f,156,E.bad,220,675);preview='coffee';bad=f>=E.bad&&f<E.bin;sourceTime=bad?285/30:4;}
 if(f>=264&&f<E.basket){preview='sunset';playhead=300;}
 if(f>=E.basket&&f<E.page){preview='coffee';playhead=500;if(f<E.basket+9)transition={kind:'circle',from:'sunset',to:'coffee',p:progress(f,E.basket,E.basket+9)};}
 if(f>=E.page&&f<468){preview='dog';playhead=820;if(f<E.page+10)transition={kind:'page',from:'coffee',to:'dog',p:progress(f,E.page,E.page+10)};}
 if(f>=468){preview='stage';playhead=1150;}
 if(f>=E.play&&f<=E.playEnd){
  playhead=travel(f,[E.play,...E.beatMap,E.playEnd],[120,410,770,1010,1320]);
  const i=E.beatMap.filter(t=>f>=t).length;preview=(['sunset','coffee','dog','stage'] as ClipId[])[i];
  if(i===1&&f<E.beatMap[0]+7)transition={kind:'circle',from:'sunset',to:'coffee',p:progress(f,E.beatMap[0],E.beatMap[0]+7)};
  if(i===2&&f<E.beatMap[1]+7)transition={kind:'page',from:'coffee',to:'dog',p:progress(f,E.beatMap[1],E.beatMap[1]+7)};
 }
 if(f>=E.play){const i=['sunset','coffee','dog','stage'].indexOf(preview);const edited=clamp((playhead-b[i])/(b[i+1]-b[i]))*(i===1?320:300);sourceTime=(i===1?coffeeSource(edited):edited)/30;}
 if(f>=E.replay[0]){const i=Math.max(0,E.replay.filter(t=>f>=t).length-1);preview=(['sunset','coffee','dog','stage'] as ClipId[])[i];sourceTime=(f-E.replay[i])/30;
  if(i===1&&f<E.replay[i]+4)transition={kind:'circle',from:'sunset',to:'coffee',p:progress(f,E.replay[i],E.replay[i]+4)};
  if(i===2&&f<E.replay[i]+4)transition={kind:'page',from:'coffee',to:'dog',p:progress(f,E.replay[i],E.replay[i]+4)};
 }
 let caption='';for(let i=0;i<4;i++)if(f>=E.type[i])caption='前方高熊'.slice(0,i+1);
 if(f>=E.undo)caption='前方高';if(f>=E.correct)caption='前方高能';
 let characterX=travel(f,[0,72,90,110,130,153,173,192,205,221,248,264,280,310,330,348,368,410,440,466,474,590,600,635,729,739,759,778,790,801],[505,330,370,700,890,1180,620,540,670,760,970,460,480,530,790,420,1020,1070,1080,1110,1130,1130,1090,1070,1130,1240,1200,1200,1104,1160],true);
 let characterY=530;
 if(f>=778&&f<=799)characterY=travel(f,[778,787,790,799],[530,495,495,530],true);
 if(f>=778&&f<=801)characterX=f<=790?1200-100*progress(f,778,790)**2:travel(f,[790,801],[1100,1160],true);
 let pose:'idle'|'walk'|'think'|'code'|'panic'|'happy'|'wave'='idle';
 if(f>=72&&f<156)pose='walk';if(f>=E.bad&&f<214)pose='think';if(f>=214&&f<264)pose='happy';
 if(f>=264&&f<348)pose='happy';if(f>=348&&f<E.mistake)pose='code';if(f>=E.mistake&&f<E.correct)pose='panic';if(f>=E.correct&&f<468)pose='happy';
 if(f>=468&&f<600)pose=saturation>230?'panic':'think';if(f>=600&&f<729)pose='happy';if(f>=760&&f<798)pose='think';if(f>=798)pose='happy';
 const activeBeat=E.beatMap.find(t=>f>=t&&f<t+12);const beatPulse=activeBeat===undefined?0:pulse(f,activeBeat);
 characterY-=beatPulse*30;
 const armSide=(f>=72&&f<157)||(f>=E.lift&&f<E.release+7)||(f>=268&&f<369)||(f>=414&&f<=434)?-1:1;
 let hand=pt(characterX+armSide*43,characterY+48),otherHand=pt(characterX-armSide*43,characterY+48),held='';
 const rest=()=>pt(characterX+armSide*43,characterY+48);
 const reach=(target:Point,a:number,b:number)=>between(rest(),target,smooth(progress(f,a,b)));
 let carried:null|{id:ClipId,p:Point,w:number,h:number}=null;
 const cards=[pt(120,228),pt(262,228),pt(120,391),pt(262,391)];
 E.land.forEach((land,i)=>{if(f>=land-20&&f<=land+3){const contact=land-12;const start=cards[i];const dest=pt((([120,390,860,1130][i])+([390,860,1130,1470][i]))/2,730);held='card';if(f<contact)hand=reach(pt(start.x,start.y-35),land-20,contact);else if(f<=land){const p=smooth(progress(f,contact,land));const pos=between(start,dest,p);pos.y-=140*Math.sin(Math.PI*p);carried={id:(['sunset','coffee','dog','stage'] as ClipId[])[i],p:pos,w:mix(104,150,p),h:mix(122,76,p)};hand=pt(pos.x,pos.y-35);held='card';}else hand=between(pt(dest.x,dest.y-35),rest(),progress(f,land,land+3));}});
 let knife:Point|null=null;
 if(f>=188&&f<217){const keys=[188,193,E.cuts[0],E.cutEnd[0],203,204,E.cuts[1],E.cutEnd[1],217];const knifeX=travel(f,keys,[562,600,600,600,680,750,750,750,790],true);const y=travel(f,keys,[590,674,692,781,644,674,692,781,596]);knife=pt(knifeX,y);hand=pt(knifeX+35,y-55);held='knife';}
 let waste: null|{x:number,y:number,scale:number,angle:number}=null;
 if(f>=E.lift&&f<E.release){const p=smooth(progress(f,E.lift,E.release-3));waste={x:675,y:mix(730,620,p),scale:1,angle:-8*p};hand=pt(675,waste.y-38);held='waste';}
 if(f>=E.release&&f<E.bin+3){const p=progress(f,E.release,E.bin);waste={x:mix(675,1120,p),y:mix(620,512,p)-175*4*p*(1-p),scale:mix(1,.35,p),angle:310*p};hand=between(pt(675,582),rest(),smooth(progress(f,E.release,E.release+7)));if(f<E.release+7)held='return';}
 let ball:Point|null=null;
 if(f>=268&&f<E.ballRelease){const p=smooth(progress(f,274,E.ballRelease));ball=between(pt(113,224),pt(510,450),p);ball.y-=80*Math.sin(Math.PI*p);hand=f<274?reach(ball,268,274):ball;held='ball';}
 if(f>=E.ballRelease&&f<=E.basket){const p=progress(f,E.ballRelease,E.basket);ball=between(pt(510,450),pt(390,687),p);ball.y-=220*4*p*(1-p);hand=between(pt(510,450),rest(),smooth(progress(f,E.ballRelease,E.ballRelease+6)));if(f<E.ballRelease+6)held='return';}
 let page:Point|null=null;
 if(f>=309&&f<=E.page){const p=smooth(progress(f,314,E.page));page=between(pt(260,227),pt(710,689),p);page.y-=140*Math.sin(Math.PI*p);hand=f<314?reach(page,309,314):page;held='page';}
 let textCard:Point|null=null;
 if(f>=350&&f<369){const p=smooth(progress(f,357,367));textCard=between(pt(190,230),pt(850,653),p);textCard.y-=110*Math.sin(Math.PI*p);const grip=pt(textCard.x-50,textCard.y-24);hand=f<357?reach(grip,350,357):grip;held='caption';}
 if(f>=414&&f<=434){hand=reach(pt(1060,607+(f>=E.undo?4:0)),414,422);if(f>426)hand=between(hand,rest(),smooth(progress(f,426,434)));held='undo';}
 let activeParameter:string|null=null;
 const intervals:[string,number,number,number,number][]=[['flash',472,478,513,519],['saturation',521,529,563,570],['zoom',572,579,591,597]];
 for(const [name,a,c,end,r] of intervals){if(f>=a&&f<=r){const y=name==='flash'?224:name==='saturation'?308:392;const target=pt(knobX[name as keyof typeof knobX],y);hand=f<c?reach(target,a,c):f<=end?target:between(target,rest(),smooth(progress(f,end,r)));if(f>=c&&f<=end)activeParameter=name;held='knob';}}
 if(f>=600&&f<611){hand=reach(pt(1370,595+(f>=604?3:0)),600,604);if(f>606)hand=between(hand,rest(),progress(f,606,611));held='button';}
 if(f>=733&&f<754){hand=reach(pt(1450,61),733,E.exportTouch);if(f>=742)hand=between(pt(1450,61),rest(),smooth(progress(f,742,753)));held='export';}
 // Body follows a distant grip, so the arm remains a shaped limb instead of
 // spanning half the desk. No previous-frame state is accumulated.
 if(held){const shoulder=pt(characterX+armSide*28,characterY+39);const dx=hand.x-shoulder.x,dy=hand.y-shoulder.y,d=Math.hypot(dx,dy);const limit=held==='knob'?220:190;
  if(d>limit){const correction=d-limit;characterX+=dx/d*correction;characterY+=dy/d*correction;}
 }
 const musicReveal=smooth(progress(f,...E.musicUnroll as [number,number]));
 const cutProgress=E.cuts.map((start,i)=>progress(f,start,E.cutEnd[i]));
 const zoomImpulse=E.zoomPreviewBeats.reduce((sum,event)=>sum+pulse(f,event,14),0)+beatPulse;
 const previewScale=1+zoom/100*.42+zoom/100*zoomImpulse*.42;
 const socialLikePulse=E.socialLikes.reduce((sum,event)=>sum+pulse(f,event,12),0);
 const socialLikes=Math.round(tween(f,823,E.socialMilestone,98200,100000));
 const cameraKeys=[0,67,72,154,173,248,264,360,370,463,477,594,610,724,742,799,810];
 const cameraZ=[1,1,1,1,1.25,1.25,1.08,1.08,1.3,1.3,1.32,1.32,1.08,1.08,1.2,1.2,1];
 const cameraX=[800,800,800,800,845,845,795,795,955,955,1085,1085,820,820,970,970,800];
 const cameraY=[450,450,450,450,484,484,470,470,370,370,374,374,474,474,375,375,450];
 const camera={z:travel(f,cameraKeys,cameraZ,true),x:travel(f,cameraKeys,cameraX,true),y:travel(f,cameraKeys,cameraY,true)};
 let bubble='';let bubbleBox={x:965,y:405,w:230,h:62};
 if(f>=173&&f<188){bubble='这段在发呆 zzz';bubbleBox={x:460,y:418,w:235,h:62};}
 if(f>=250&&f<264){bubble='清爽！';bubbleBox={x:970,y:397,w:175,h:64};}
 if(f>=298&&f<312){bubble='好球！';bubbleBox={x:470,y:382,w:160,h:64};}
 if(f>=400&&f<414){bubble='能？怎么打成熊了！';bubbleBox={x:963,y:398,w:247,h:66};}
 if(f>=450&&f<468)bubble='这回对了！';
 if(saturation>230){bubble='哎呀，过头了！';bubbleBox={x:944,y:399,w:261,h:68};}
 if(f>=591&&f<604){bubble='这次刚刚好';bubbleBox={x:964,y:400,w:245,h:68};}
 if(f>=638&&f<660){bubble='听，画面跟上了！';bubbleBox={x:952,y:408,w:253,h:70};}
 if(f>=761&&f<779){bubble='怎么又卡了？';bubbleBox={x:1096,y:413,w:248,h:67};}
 if(f>=799&&f<810){bubble='叮！搞定！';bubbleBox={x:1120,y:418,w:210,h:64};}
 if(bubble){bubbleBox={...bubbleBox,x:characterX<704?clamp(characterX-bubbleBox.w/2,360,690-bubbleBox.w):clamp(characterX-bubbleBox.w/2,954,1208-bubbleBox.w),y:characterY-118-bubbleBox.h};}
 const bubbleTip=pt(characterX,characterY-96);
 return {f,sec,ripple,b,parameters,knobX,activeParameter,playhead,preview,sourceTime,bad,transition,caption,character:{x:characterX,y:characterY,pose},hand,otherHand,held,armSide,musicReveal,cutProgress,previewScale,socialLikes,socialLikePulse,carried:carried as null|{id:ClipId,p:Point,w:number,h:number},knife,waste,ball,page,textCard,camera,bubble,bubbleBox,bubbleTip,beatPulse,lights:clamp((saturation-145)/215),outro:progress(f,810,822),soundEvents:E.sounds.filter(([frame])=>frame===f)};
}
export type SceneState=ReturnType<typeof getSceneState>;



