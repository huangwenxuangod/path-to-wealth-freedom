import pathlib,subprocess,numpy as np,json
root=pathlib.Path(__file__).resolve().parent.parent
def read(path):
    r=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-vn','-ar','16000','-ac','1','-f','f32le','-'],capture_output=True,check=True)
    return np.frombuffer(r.stdout,dtype=np.float32).astype(np.float64)
x=read(root/'evidence/BASELINE.mp4');y=read(root/'renders/silk-road-refined.mp4')
n0=min(len(x),len(y));x=x[:n0];y=y[:n0];n=1<<(2*n0-1).bit_length()
c=np.fft.irfft(np.fft.rfft(x,n)*np.conj(np.fft.rfft(y,n)),n)
lags=np.arange(-1600,1601);best=int(lags[np.argmax(c[lags%n])]);corr=float(c[best%n]/np.sqrt(np.dot(x,x)*np.dot(y,y)))
def db(v):return float(20*np.log10(max(v,1e-12)))
freq=np.fft.rfftfreq(n0,1/16000);mask=(freq>=5000)&(freq<=7900)
hf_ratio=db(np.linalg.norm(np.fft.rfft(y)[mask])/np.linalg.norm(np.fft.rfft(x)[mask]))
# EQ changes waveform phase; envelope similarity is the meaningful continuity test.
block=320;count=n0//block
ex=np.sqrt(np.mean(x[:count*block].reshape(count,block)**2,axis=1))
ey=np.sqrt(np.mean(y[:count*block].reshape(count,block)**2,axis=1))
envelope=float(np.corrcoef(ex,ey)[0,1])
assert envelope>.90,envelope;assert abs(best)<=800,best;assert hf_ratio<-1,hf_ratio
record={'decodedWaveformCorrelation':corr,'envelopeCorrelation20ms':envelope,'waveformBestLagMs':best/16,'highBandDeltaDb':hf_ratio,'baselineRmsDbfs':db(np.sqrt(np.mean(x*x))),'modifiedRmsDbfs':db(np.sqrt(np.mean(y*y))),'baselinePeakDbfs':db(np.max(np.abs(x))),'modifiedPeakDbfs':db(np.max(np.abs(y))),'sourceSeparation':False}
(root/'evidence/audio-qc.json').write_text(json.dumps(record,indent=2),encoding='utf-8')
print(f'AUDIO_QC_PASS envelope_correlation={envelope:.6f} waveform_lag_ms={best/16:.3f} high_band_delta_db={hf_ratio:.3f} separated_stems=no')
