from pathlib import Path
import urllib.request, hashlib, json, time
from PIL import Image, ImageDraw
from fontTools.ttLib import TTFont

ROOT=Path(__file__).resolve().parents[1]
sources=[
 ('character/codey.webp','https://learn.chatgpt.com/images/codex/app/pets/codex-spritesheet.webp'),
 ('fonts/MaShanZheng.ttf','https://fonts.gstatic.com/s/mashanzheng/v18/NaPecZTRCLxvwo41b4gvzkXaRMQ.ttf'),
 ('fonts/LXGWWenKai.ttf','https://raw.githubusercontent.com/lxgw/LxgwWenKai/main/fonts/TTF/LXGWWenKai-Regular.ttf'),
 ('fonts/MaShanZheng-OFL.txt','https://raw.githubusercontent.com/google/fonts/main/ofl/mashanzheng/OFL.txt'),
 ('fonts/LXGWWenKai-OFL.txt','https://raw.githubusercontent.com/lxgw/LxgwWenKai/main/OFL.txt'),
]
records=[]
for rel,url in sources:
 p=ROOT/'public'/rel;p.parent.mkdir(parents=True,exist_ok=True)
 for attempt in range(3):
  try:
   with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'KK-Codex asset fetch'}),timeout=90) as r:
    data=r.read(); status=r.status; actual=r.url
   assert status==200 and not data[:64].lower().startswith(b'<!doctype')
   p.write_bytes(data); break
  except Exception:
   if attempt==2: raise
   time.sleep(2)
 rec={'path':rel,'url':actual,'httpStatus':status,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
 if rel.endswith('.webp'):
  assert data[:4]==b'RIFF' and data[8:12]==b'WEBP'
  im=Image.open(p).convert('RGBA'); assert im.size==(1536,1872) and im.getextrema()[3][0]==0
  rec.update(size=list(im.size),transparent=True,format='WEBP')
  sheet=Image.new('RGB',(8*144,7*182),'#f7f2e6');d=ImageDraw.Draw(sheet)
  for i,(name,row,n) in enumerate([('idle',0,6),('walk',1,8),('wave',3,4),('panic',5,8),('think',6,6),('code',7,6),('happy',8,6)]):
   for col in range(n):
    crop=im.crop((col*192,row*208,(col+1)*192,(row+1)*208));assert crop.getbbox()
    cp=ROOT/'public'/'character'/f'{name}-{col}.png';crop.save(cp)
    crop.thumbnail((138,148));sheet.paste(crop,(col*144,i*182+22),crop)
    d.text((col*144+5,i*182+4),f'{name} {row}:{col}',fill='#292521')
  (ROOT/'out').mkdir(exist_ok=True);sheet.save(ROOT/'out'/'codey-contact-sheet.jpg')
 if rel.endswith('.ttf'):
  font=TTFont(p); chars=font.getBestCmap(); rec['family']=font['name'].getDebugName(1)
  required='前方高熊能这回对了剪辑软件素材落日咖啡柴犬舞台闪光饱和度缩放冲击速度导出卡点清爽开工收工'
  rec['missingChinese']= ''.join(c for c in required if ord(c) not in chars)
  assert not rec['missingChinese']
  if 'MaShanZheng' in rel:
   units=font['head'].unitsPerEm
   advance=max(sum(font['hmtx'][chars[ord(ch)]][0] for ch in word) for word in ['前方高熊','前方高能'])
   (ROOT/'src'/'font-metrics.json').write_text(json.dumps({'unitsPerEm':units,'maxCaptionAdvance':advance,'widthAt60Px':advance/units*60,'captionFontSize':min(60,284*units/advance)}),encoding='utf-8')
 records.append(rec)
(ROOT/'public'/'sources.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(records,ensure_ascii=False,indent=2))
