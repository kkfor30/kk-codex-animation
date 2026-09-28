from pathlib import Path
import json, numpy as np, scipy.signal as sig, scipy.io.wavfile as wav, subprocess
R=Path(__file__).resolve().parents[1]; P=R/'public'/'audio';P.mkdir(parents=True,exist_ok=True)
E=json.loads((R/'src'/'events.json').read_text());SR=48000;N=SR*30;rng=np.random.default_rng(E['seed']);beat=60/144
tracks={k:np.zeros((N,2),dtype=np.float64) for k in ['drums','bass','chords','melody','fx']}
def put(track,sound,t,vol=1,pan=0):
 start=round(t*SR);end=min(N,start+len(sound))
 if end<=start:return
 sound=sound[:end-start]*vol
 if sound.ndim==1:sound=np.column_stack((sound*np.sqrt((1-pan)/2),sound*np.sqrt((1+pan)/2)))
 tracks[track][start:end]+=sound
def noise(dur,lo,hi):
 n=rng.normal(0,1,round(SR*dur));s=sig.sosfilt(sig.butter(2,[lo,hi],btype='bandpass',fs=SR,output='sos'),n);return s
def tone(midi,dur,kind):
 t=np.arange(round(dur*SR))/SR;f=440*2**((midi-69)/12)
 if kind=='bass':s=np.sin(2*np.pi*f*t)+.27*np.sin(4*np.pi*f*t)+.08*np.sin(6*np.pi*f*t);env=(1-np.exp(-t*180))*np.exp(-t*8)
 elif kind=='keys':s=np.sin(2*np.pi*f*t+.6*np.sin(2*np.pi*f*2*t)*np.exp(-t*12))+.18*np.sin(2*np.pi*f*3*t);env=(1-np.exp(-t*400))*np.exp(-t*7)
 else:s=np.sin(2*np.pi*f*t)+.26*np.sin(2*np.pi*f*2*t)*np.exp(-t*15)+.08*np.sin(2*np.pi*f*4*t);env=(1-np.exp(-t*500))*np.exp(-t*8)
 env*=np.minimum(1,(dur-t)/.05);return s*env
def kick():
 t=np.arange(int(.23*SR))/SR;phase=2*np.pi*(47*t+95*.023*(1-np.exp(-t/.023)))
 return np.sin(phase)*np.exp(-t*19)+.12*noise(.23,1700,6800)*np.exp(-t*230)
def snare():
 t=np.arange(int(.14*SR))/SR;return .72*noise(.14,900,10000)*np.exp(-t*35)+.22*np.sin(2*np.pi*180*t)*np.exp(-t*39)
def hat(open=False):
 d=.19 if open else .07;t=np.arange(round(d*SR))/SR;return noise(d,6500,16000)*np.exp(-t*(24 if open else 82))
chords=[[57,60,64,67],[53,57,60,64],[60,64,67,71],[55,59,62,64]]
roots=[45,41,48,43]
melodies=[[76,None,79,81,None,84,81,None],[79,None,76,None,74,76,None,None],[76,None,81,79,None,76,72,None],[74,76,None,79,None,74,71,None]]
for bar in range(18):
 t0=bar*beat*4
 chord=chords[bar%4];root=roots[bar%4]
 if bar==16:chord=[52,56,59,62];root=40
 if bar==17:chord=[57,60,64,69];root=45
 intro=.55 if bar<2 else 1
 for b in range(4):
  t=t0+b*beat;v=.68 if b%2==0 else .60
  if bar>=13 and bar<=14:v*=1.14
  put('drums',kick(),t,v*intro)
  if b%2:put('drums',snare(),t,.42*intro)
  for off in [0,.5]:put('drums',hat(off==.5 and b==3 and bar%2==1),t+off*beat,(.105 if off==0 else .071)*intro,.18)
 for eighth in [0,1,3,4,6,7]:
  if bar<2 and eighth in [1,7]:continue
  note=root+(7 if eighth in [3,7] else 12 if eighth==6 else 0)
  put('bass',tone(note,.3,'bass'),t0+eighth*beat/2,.38*intro)
 for b in [0.5,1.5,2.5,3.5]:
  for k,n in enumerate(chord):put('chords',tone(n,.42,'keys'),t0+b*beat,.10*intro,(k-1.5)*.27)
 if bar>=1:
  motif=melodies[bar%4]
  if bar==16:motif=[76,None,80,None,83,None,86,None]
  if bar==17:motif=[84,None,81,None,76,None,69,None]
  for i,n in enumerate(motif):
   if n is not None:put('melody',tone(n,.5,'pluck'),t0+i*beat/2,.235 if bar<16 else .22,-.16)
 if bar%4==3 and bar<16:
  for j in range(3):put('drums',snare(),t0+(3.25+j*.25)*beat,.13+j*.035,-.1+j*.1)
def effect(kind):
 durations={'paper':.13,'land':.19,'cut':.23,'whoosh':.32,'bin':.28,'click':.075,'basket':.27,'page':.25,'key':.055,'undo':.11,'stamp':.12,'slide':.36,'snap':.13,'button':.09,'beat':.09,'thud':.24,'complete':.72}
 d=durations[kind];t=np.arange(round(d*SR))/SR;n=noise(d,450,9000)
 if kind in ['paper','page']:s=n*(.3+.4*np.sin(t*160)**2)*np.sin(np.pi*t/d)**1.3*.48
 elif kind=='cut':s=n*(.9*np.exp(-t*22)+.4*np.sin(np.pi*t/d)**2)+.16*np.sin(2*np.pi*1700*t)*np.exp(-t*80)
 elif kind=='whoosh':s=noise(d,600,5800)*np.sin(np.pi*t/d)**2*.48
 elif kind in ['land','bin','basket','thud']:s=np.sin(2*np.pi*(140*t-65*t*t))*np.exp(-t*(23 if kind!='thud' else 16))*.72+n*np.exp(-t*46)*.42
 elif kind=='slide':s=noise(d,1400,6500)*np.sin(np.pi*t/d)*.16
 elif kind=='complete':
  s=np.zeros(len(t))
  for offset,mid in [(0,76),(.18,81)]:
   z=t-offset;s+=np.where(z>=0,np.sin(2*np.pi*440*2**((mid-69)/12)*z)*np.exp(-np.maximum(0,z)*7)*(1-np.exp(-np.maximum(0,z)*400)),0)*.42
 else:
  pitch={'key':1050,'undo':440,'click':1600,'snap':750,'button':580,'beat':2200,'stamp':250}[kind]
  s=(np.sin(2*np.pi*pitch*t)*.45+n*.8)*np.exp(-t*(85 if kind=='key' else 52))
 return s*np.minimum(1,t/.001)*np.minimum(1,(d-t)/.009)
for frame,kind in E['sounds']:
 vol=.55 if kind in ['key','slide','beat'] else .8 if kind=='cut' else .67
 put('fx',effect(kind),frame/30,vol,0)
# Gentle stereo short delay; no duplicate music bed in final composition.
for name in ['chords','melody']:
 shift=int(.095*SR);a=tracks[name].copy();tracks[name][shift:,1]+=a[:-shift,0]*.15
 shift=int(.145*SR);tracks[name][shift:,0]+=a[:-shift,1]*.11
music=sum(tracks[k] for k in ['drums','bass','chords','melody'])
# Merge nearby events before generating duck envelopes, avoiding typing pump.
windows=[]
for f,k in E['sounds']:
 if k=='beat':continue
 a=f/30-.048;b=f/30+(.35 if k=='slide' else .07)
 if windows and a<=windows[-1][1]+.23:windows[-1][1]=max(windows[-1][1],b)
 else:windows.append([a,b])
duck=np.ones(N);depth=10**(-3.7/20)
for a,b in windows:
 i=max(0,round(a*SR));j=min(N,round((a+.045)*SR));k=min(N,round(b*SR));q=min(N,k+int(.19*SR))
 if j>i:duck[i:j]=np.minimum(duck[i:j],np.linspace(1,depth,j-i))
 duck[j:k]=np.minimum(duck[j:k],depth)
 if q>k:duck[k:q]=np.minimum(duck[k:q],np.linspace(depth,1,q-k))
fade=np.ones(N);n=int(.45*SR);fade[-n:]=np.linspace(1,0,n)**1.4
music*=fade[:,None];fx=tracks['fx']*fade[:,None];mix=music*duck[:,None]+fx
assert np.isfinite(mix).all()
wav.write(P/'music.wav',SR,music.astype(np.float32));wav.write(P/'effects.wav',SR,fx.astype(np.float32))
for key in ['drums','bass','chords','melody']:wav.write(P/f'{key}.wav',SR,(tracks[key]*fade[:,None]).astype(np.float32))
wav.write(P/'mix-raw.wav',SR,mix.astype(np.float32))
cmd=['ffmpeg','-hide_banner','-i',str(P/'mix-raw.wav'),'-af','loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json','-f','null','-']
r=subprocess.run(cmd,capture_output=True,text=True,encoding='utf-8',errors='replace');report=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])[0];
filter=f"loudnorm=I=-14:TP=-1.5:LRA=9:measured_I={report['input_i']}:measured_TP={report['input_tp']}:measured_LRA={report['input_lra']}:measured_thresh={report['input_thresh']}:offset={report['target_offset']}:linear=true:print_format=json"
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(P/'mix-raw.wav'),'-af',filter,'-ar','48000','-c:a','pcm_s24le',str(P/'mix.wav')],check=True)
# Detect kick-band transient peaks locally near the required beat map.
sos=sig.butter(3,[35,170],btype='bandpass',fs=SR,output='sos');low=sig.sosfilt(sos,music.mean(axis=1));env=np.convolve(low**2,np.ones(240)/240,mode='same')
measured=[]
for f in E['beatMap']:
 a=int((f/30-.018)*SR);b=int((f/30+.06)*SR);sample=a+int(np.argmax(env[a:b]));measured.append({'nominalFrame':f,'energyPeakSeconds':sample/SR,'energyPeakFrame':sample/SR*30,'offsetMs':(sample/SR-f/30)*1000})
wave=[float(np.sqrt(np.mean(music[i:i+N//550]**2))) for i in range(0,N,N//550)][:550]
(R/'src'/'waveform.json').write_text(json.dumps(wave))
(R/'out'/'audio-analysis.json').write_text(json.dumps({'method':'new deterministic offline composition','sampleRate':SR,'bpm':144,'firstBeatSeconds':0,'bars':18,'measuredBeatPeaks':measured,'rawMixPeak':float(np.max(np.abs(mix))),'normalizationInput':report,'duckWindows':windows,'audition':'not performed by a human or an audio-listening tool'},indent=2))
(P/'mix-raw.wav').unlink()
print(json.dumps({'beatPeaks':measured,'normalization':report},indent=2))



