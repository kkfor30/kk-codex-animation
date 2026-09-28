import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,renderMedia,openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const mode=process.argv[2]||'video';
fs.mkdirSync('out',{recursive:true});fs.mkdirSync('public/artwork',{recursive:true});
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),onProgress:()=>{}});
const browser=await openBrowser('chrome',{logLevel:'warn'});
const base={serveUrl,puppeteerInstance:browser,logLevel:'warn',timeoutInMilliseconds:120000};
try{
 if(mode==='assets'){
  for(const id of ['sunset','coffee','dog','stage']){const props={id};const composition=await selectComposition({...base,id:'Artwork',inputProps:props});await renderStill({...base,composition,inputProps:props,output:`public/artwork/${id}.png`});console.log(`Artwork ${id}`);}
  const composition=await selectComposition({...base,id:'ArtworkSheet'});await renderStill({...base,composition,output:'out/artwork-contact-sheet.png'});
 }else{
  const composition=await selectComposition({...base,id:'KK-Codex-30s'});
  if(mode==='stills'){
   const frames=process.argv[3]?process.argv[3].split(',').map(Number):[33,55,93,173,198,205,230,245,248,252,257,263,267,296,330,393,423,440,441,450,467,491,542,563,591,623,650,675,700,760,790,798,823,841,859,877,899];
   fs.mkdirSync('out/frames',{recursive:true});
   for(const frame of frames){await renderStill({...base,composition,frame,output:`out/frames/${String(frame).padStart(3,'0')}.png`,scale:.6666667});console.log(`frame ${frame}`);}
  }else{
   const range=mode==='draft'?[156,267]:undefined;
   let previous=-1;
   await renderMedia({...base,composition,outputLocation:mode==='draft'?'out/cut-review.mp4':'out/KK-Codex-30s.mp4',codec:'h264',audioCodec:'aac',audioBitrate:'320k',videoBitrate:'12M',pixelFormat:'yuv420p',concurrency:4,frameRange:range,scale:mode==='draft'?.6666667:1,onProgress:({progress})=>{let p=Math.floor(progress*100);if(p>=previous+5){console.log(`render ${p}%`);previous=p;}}});
  }
 }
}finally{await browser.close({silent:true});}
