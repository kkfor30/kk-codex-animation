from pathlib import Path
import subprocess,json,hashlib
import numpy as np
from PIL import Image,ImageDraw,ImageFont
R=Path(__file__).resolve().parents[1];O=R/'out';video=O/'KK-Codex-30s.mp4'
def run(args):return subprocess.run(args,capture_output=True,text=True,encoding='utf-8',errors='replace',check=True)
probe=json.loads(run(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(video)]).stdout)
vs=next(s for s in probe['streams'] if s['codec_type']=='video');aus=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (vs['width'],vs['height'],vs['r_frame_rate'],int(vs['nb_read_frames']))==(1920,1080,'30/1',900)
assert abs(float(vs['duration'])-30)<.001
assert aus['codec_name']=='aac' and aus['sample_rate']=='48000' and aus['channels']==2
lr=run(['ffmpeg','-hide_banner','-i',str(video),'-af','loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json','-f','null','-'])
loudness=json.JSONDecoder().raw_decode(lr.stderr[lr.stderr.rfind('{'):])[0]
audio=subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','f32le','-ac','2','-ar','48000','-'],capture_output=True,check=True).stdout
samples=np.frombuffer(audio,dtype='<f4');assert np.isfinite(samples).all();assert np.max(np.abs(samples))<1
states=json.loads((O/'scene-states.json').read_text(encoding='utf-8'))
key=[33,72,93,153,173,198,230,248,263,282,296,307,330,340,393,423,440,441,450,467,491,513,542,563,591,604,614,623,632,635,650,658,675,683,700,711,728,760,790,798,823,846,864,884,899]
cut=list(range(245,268));caption=[393,399,400,414,420,422,423,430,440,441,442,450,458,467];play=list(range(635,729,3));export=list(range(780,806,2));wanted=set(key+cut+caption+play+export)
revision_import=[83,91,93,113,133,153,157,158,161,165,169,172]
revision_arms=[83,91,143,153,197,201,208,212,221,231,274,282,314,330,357,364,423,478,491,542,587,591,739,750]
revision_blades=list(range(190,215))
revision_zoom=[579,581,584,587,591,594,597,603]
revision_social=[823,846,864,866,870,879,890,899]
revision_bubbles=[173,250,303,400,450,542,591,650,761,800]
wanted.update(revision_import+revision_arms+revision_blades+revision_zoom+revision_social+revision_bubbles)
wanted.update(int(p.stem) for p in (O/'frames').glob('*.png') if p.stem.isdigit())
frames={};black=[];means=[]
process=subprocess.Popen(['ffmpeg','-v','error','-i',str(video),'-an','-vf','scale=1280:720','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
for i in range(900):
 raw=process.stdout.read(1280*720*3);assert len(raw)==1280*720*3
 a=np.frombuffer(raw,np.uint8).reshape(720,1280,3);mean=float(a.mean());means.append(mean)
 if mean<6:black.append(i)
 if i in wanted:frames[i]=Image.fromarray(a.copy())
process.stdout.close();assert process.wait()==0;assert not black
font=ImageFont.truetype(str(R/'public/fonts/LXGWWenKai.ttf'),20)
def sheet(seq,name,cols=4,tile=(480,270),crop=None):
 w,h=tile;pad=32;im=Image.new('RGB',(cols*w,((len(seq)+cols-1)//cols)*(h+pad)),'#f7f2e6');d=ImageDraw.Draw(im)
 for j,f in enumerate(seq):
  pic=frames[f]
  if crop:pic=crop(pic,f)
  pic=pic.resize(tile,Image.Resampling.LANCZOS);x=j%cols*w;y=j//cols*(h+pad);im.paste(pic,(x,y));d.text((x+10,y+h+3),f'{f:03d}  /  {f/30:.3f}s',font=font,fill='#292521')
 im.save(O/name)
def world_crop(im,f):
 cam=states[f]['camera'];z=cam['z'];cx=cam['x'];cy=cam['y']
 def p(x,y):return ((800+(x-cx)*z)*.8,(450+(y-cy)*z)*.8)
 x1,y1=p(370,684);x2,y2=p(880,775);return im.crop((int(x1),int(y1),int(x2),int(y2)))
sheet(key,'keyframes-contact-sheet.jpg',cols=4,tile=(480,270))
sheet(cut,'ripple-245-267.png',cols=4,tile=(510,91),crop=world_crop)
sheet(caption,'caption-sequence.jpg',cols=4,tile=(480,270))
sheet(play,'beat-playback-sequence.jpg',cols=4,tile=(400,225))
sheet(export,'export-collision-sequence.jpg',cols=4,tile=(400,225))
sheet(revision_import,'final-import-music-sequence.jpg',cols=4,tile=(480,270))
sheet(revision_arms,'final-arm-actions.jpg',cols=4,tile=(480,270))
def blade_crop(im,f):
 cam=states[f]['camera'];z=cam['z'];cx=cam['x'];cy=cam['y']
 def p(x,y):return ((800+(x-cx)*z)*.8,(450+(y-cy)*z)*.8)
 x1,y1=p(500,540);x2,y2=p(850,794);return im.crop((int(x1),int(y1),int(x2),int(y2)))
sheet(revision_blades,'final-blade-190-214.jpg',cols=5,tile=(350,254),crop=blade_crop)
sheet(revision_zoom,'final-live-zoom.jpg',cols=4,tile=(480,270))
sheet(revision_social,'final-social-outro.jpg',cols=4,tile=(480,270))
sheet(revision_bubbles,'final-bubble-tracking.jpg',cols=4,tile=(480,270))
for f in sorted(wanted):frames[f].save(O/'frames'/f'{f:03d}.png')
report={'video':{k:vs[k] for k in ['codec_name','width','height','r_frame_rate','nb_read_frames','duration','pix_fmt']},'audio':{k:aus[k] for k in ['codec_name','sample_rate','channels','duration']},'encodedAudioLoudness':{k:loudness[k] for k in ['input_i','input_tp','input_lra']},'decodedAudioPeak':float(np.max(np.abs(samples))),'finiteAudio':True,'blackFrames':black,'minimumMeanFrameLumaApprox':min(means),'all900FramesDecoded':True,'sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'listened':False}
(O/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
(O/'ffprobe.json').write_text(json.dumps(probe,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))



