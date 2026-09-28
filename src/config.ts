export const C={paper:'#f6eddd',ink:'#302a27',yellow:'#ffcc43',teal:'#48bbb3',pink:'#f881a0',purple:'#ad8be2'};
export const clips=[{id:'sunset',name:'落日.mp4',color:'#ffc078'},{id:'coffee',name:'咖啡.mp4',color:'#e2b17d'},{id:'dog',name:'柴犬.mov',color:'#69d4c0'},{id:'stage',name:'KK舞台.mp4',color:'#ba98ed'}] as const;
export type ClipId=typeof clips[number]['id'];
export const sourceRanges={coffee:[[0,210],[360,470]] as const};
export const connections=[{from:'sunset',to:'coffee',kind:'circle',event:'basket'},{from:'coffee',to:'dog',kind:'page',event:'page'}] as const;
export const captionBinding={clipId:'dog',safeBox:{x:22,y:70,w:316,h:90},fontSize:60};
