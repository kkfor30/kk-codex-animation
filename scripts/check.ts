import assert from 'node:assert/strict';
import fs from 'node:fs';
import {getSceneState,coffeeSource,E} from '../src/story';
const results:string[]=[];
fs.mkdirSync('out',{recursive:true});
assert.deepEqual(getSceneState(263).b,[120,390,710,980,1320]);
assert.deepEqual(getSceneState(632).b,[120,410,770,1010,1320]);
for(let f=0;f<900;f++){
 const s=getSceneState(f);assert.equal(s.f,f);assert(s.b.every(Number.isFinite));
 for(let i=0;i<4;i++)assert(s.b[i]<s.b[i+1]);
 if(f>0){const before=getSceneState(f-1);for(const key of ['flash','saturation','zoom'] as const)if(s.parameters[key]!==before.parameters[key])assert.equal(s.activeParameter,key,`${f}: ${key} changed without grip`);}
 if(f>=591)assert.deepEqual(s.parameters,{flash:20,saturation:115,zoom:50,speed:1});
 if(f>=E.bin)assert(!s.bad);
 if(f>=423&&f<441)assert.equal(s.caption,'前方高');
 if(f>=441)assert.equal(s.caption,'前方高能');
 if(f>=400&&f<468&&s.bubble){assert(s.bubbleBox.x>=936);assert(s.bubbleBox.x+s.bubbleBox.w<=1220);}
 if(f>=249&&f<263){assert(s.ripple>=getSceneState(f-1).ripple);assert(s.b[2]===860-150*s.ripple);}
}
results.push('900 frames: finite ordered clip boundaries; parameter changes only while gripped; final values latch at 20/115/50.');
assert.equal(getSceneState(393).caption,'前方高熊');assert.equal(getSceneState(423).caption,'前方高');assert.equal(getSceneState(440).caption,'前方高');assert.equal(getSceneState(441).caption,'前方高能');
results.push('Caption wrong / undo / hold / corrected sequence, with bubbles outside phone and parameters.');
for(const [f,x,id] of [[650,410,'coffee'],[675,770,'dog'],[700,1010,'stage']] as const){assert.equal(getSceneState(f).playhead,x);assert.equal(getSceneState(f).preview,id);}
assert.equal(getSceneState(635).preview,'sunset');assert.equal(getSceneState(728).playhead,1320);
results.push('Beat playback crosses the three real boundaries on 650/675/700; begins with sunset and reaches 1320 at 728.');
assert.equal(coffeeSource(209),209);assert.equal(coffeeSource(210),360);assert.equal(coffeeSource(319),469);
for(let i=0;i<320;i++)assert(coffeeSource(i)<210||coffeeSource(i)>=360);
results.push('Coffee source mapping excludes removed range [210,360) and preserves one clip identity.');
for(const [f,id] of [[823,'sunset'],[841,'coffee'],[859,'dog'],[877,'stage']] as const)assert.equal(getSceneState(f).preview,id);
results.push('Outro: all four clips in order, after entrance completes.');
assert(E.musicUnroll[0]>E.land[3]);
for(let f=0;f<=E.musicUnroll[0];f++)assert.equal(getSceneState(f).musicReveal,0);
assert.equal(getSceneState(E.musicUnroll[1]).musicReveal,1);
for(let i=0;i<2;i++){
 assert.equal(getSceneState(E.cuts[i]).knife?.y,692);
 assert(getSceneState(E.cutEnd[i]).knife!.y>=768);
 for(let f=E.cuts[i]+1;f<=E.cutEnd[i];f++)assert(getSceneState(f).knife!.y>getSceneState(f-1).knife!.y);
}
assert.equal(getSceneState(579).previewScale,1);
assert(getSceneState(587).previewScale>1.15);
assert(getSceneState(591).previewScale>1.2);
assert.equal(getSceneState(899).socialLikes,100000);
for(let f=0;f<810;f++){const s=getSceneState(f);if(s.bubble){assert.equal(s.bubbleTip.x,s.character.x);assert.equal(s.bubbleTip.y,s.character.y-96);assert(s.bubbleBox.y+s.bubbleBox.h<s.bubbleTip.y);}if(s.held){const d=Math.hypot(s.hand.x-s.character.x-s.armSide*28,s.hand.y-s.character.y-39);assert(d<=(s.held==='knob'?220:190)+.001);}}
results.push('Revision: music follows fourth clip; blades traverse full track height; zoom visible during drag; bubble tips track head; bounded arm reach; social likes reach 100000.');
fs.writeFileSync('out/state-checks.json',JSON.stringify({passed:true,results},null,2));console.log(results.join('\n'));
fs.writeFileSync('out/scene-states.json',JSON.stringify(Array.from({length:900},(_,f)=>{const s=getSceneState(f);return {frame:f,camera:s.camera,boundaries:s.b,preview:s.preview,caption:s.preview==='dog'?s.caption:'',parameters:s.parameters,playhead:s.playhead}})));
