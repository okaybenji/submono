# submono
a WebAudio subtractive, monophonic synthesizer

### create a synth
```
var audioCtx = new AudioContext();
var synth = new Monosynth(audioCtx);
```
### play a note
`synth.start();`
### stop playing
`synth.stop();`
### change the volume, attack duration, frequency, waveform...
```
synth.maxGain = 0.5;        // out of 1
synth.attack = 1.0;         // in seconds
synth.pitch(440);           // in Hz
synth.waveform('sawtooth'); // or sine, triangle, square
```
### configure any or all the properties on initialization
```
var config = {
  waveform: 'sawtooth', // or sine, triangle, square
  pitch: 440,           // in hertz
  maxGain: 0.5,         // out of 1
  attack: 0.1,          // in seconds
  decay: 0.0,           // in seconds
  sustain: 1.0,         // out of 1
  release: 0.8,         // in seconds
  cutoff: {
    maxValue: 7500,     // in hertz
    attack: 0.1,        // in seconds
    decay: 2.5,         // in seconds
    sustain: 0.2        // 0-5; maxValue multiplied by this
  }
};

var synth = new Monosynth(audioCtx, config);
```