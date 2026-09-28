from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
r=Path(__file__).resolve().parents[1]
s=json.loads((r/'out/character-review-state.json').read_text(encoding='utf-8-sig'))
font=ImageFont.truetype(str(r/'public/fonts/LXGWWenKai.ttf'),23)
for name,sel in [('v3-character-closeups.jpg',[143,201,274,330,450,491,542,587,623]),('v3-reach-continuity.jpg',list(range(73,82)))]:
 sheet=Image.new('RGB',(1536,1536),'#f7f2e6');d=ImageDraw.Draw(sheet)
 for i,f in enumerate(sel):
  q=next(x for x in s if x['frame']==f);im=Image.open(r/f'out/frames/{f:03}.png');c=q['camera'];ch=q['character'];x=ch['x'];y=ch['y']
  # Fixed world crop, includes the shoulder and operating palm in every sample.
  points=[(x-105,y-125),(x+105,y+95)]
  if q['held']: points+=[(q['hand']['x']-28,q['hand']['y']-28),(q['hand']['x']+28,q['hand']['y']+28)]
  x0=min(p[0] for p in points)-14;y0=min(p[1] for p in points)-14;x1=max(p[0] for p in points)+14;y1=max(p[1] for p in points)+14
  def screen(a,b):return ((800+(a-c['x'])*c['z'])*im.width/1600,(450+(b-c['y'])*c['z'])*im.height/900)
  a,b=screen(x0,y0);e,g=screen(x1,y1);crop=im.crop((int(a),int(b),int(e),int(g)));crop.thumbnail((488,458),Image.Resampling.LANCZOS)
  ox=i%3*512;oy=i//3*512;sheet.paste(crop,(ox+(512-crop.width)//2,oy+(470-crop.height)//2));d.text((ox+18,oy+477),f'frame {f:03} / {q["held"] or "original sprite"}',font=font,fill='#292521')
 sheet.save(r/'out'/name,quality=94)
