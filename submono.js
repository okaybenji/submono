/*!
 *  submono - a Web Audio subtractive, monophonic synthesizer
 *  (c) 2015 Benji Kay
 *  MIT License
 */

/*
 * TODO: Explore synth.cutoff.contour.
 */

var submono = {
  createSynth: function(audioCtx, config) {
    config = config || {};
    config.cutoff = config.cutoff || {};
    
    var synth = {
      audioCtx: audioCtx,
      amp:      audioCtx.createGain(),
      filter:   audioCtx.createBiquadFilter(),
      osc:      audioCtx.createOscillator(),
      pan:      audioCtx.createPanner(),
      maxGain:  config.maxGain  || 0.9, // out of 1
      attack:   config.attack   || 0.1, // in seconds
      decay:    config.decay    || 0.0, // in seconds
      sustain:  config.sustain  || 1.0, // out of 1
      release:  config.release  || 0.8, // in seconds
    };
    
    synth.amp.gain.value = 0;
    synth.filter.type = 'lowpass';
    synth.filter.connect(synth.amp);
    synth.amp.connect(audioCtx.destination);
    synth.pan.panningModel = 'equalpower';
    synth.pan.setPosition(0, 0, 1); // start with stereo image centered
    synth.osc.connect(synth.pan);
    synth.pan.connect(synth.filter);
    synth.osc.start(0);
    
    //low-pass filter
    synth.cutoff              = synth.filter.frequency;
    synth.cutoff.maxFrequency = config.cutoff.maxFrequency || 7500; // in hertz
    synth.cutoff.attack       = config.cutoff.attack       || 0.1; // in seconds
    synth.cutoff.decay        = config.cutoff.decay        || 2.5; // in seconds
    synth.cutoff.sustain      = config.cutoff.sustain      || 0.2; // out of 1
    
    function getNow() {
      var now = synth.audioCtx.currentTime;
      synth.amp.gain.cancelScheduledValues(now);
      synth.amp.gain.setValueAtTime(synth.amp.gain.value, now);
      return now;
    };

    synth.pitch = function pitch(newPitch) {
      if (newPitch) {
        var now = synth.audioCtx.currentTime;
        synth.osc.frequency.setValueAtTime(newPitch, now);
      }
      return synth.osc.frequency.value;
    };

    synth.waveform = function waveform(newWaveform) {
      if (newWaveform) {
        synth.osc.type = newWaveform;
      }
      return synth.osc.type;
    };

    //apply attack, decay, sustain envelope
    synth.start = function startSynth() {
      var atk  = parseFloat(synth.attack);
      var dec  = parseFloat(synth.decay);
      var cAtk = parseFloat(synth.cutoff.attack);
      var cDec = parseFloat(synth.cutoff.decay);
      var now  = getNow();
      synth.cutoff.cancelScheduledValues(now);
      synth.cutoff.linearRampToValueAtTime(synth.cutoff.value, now);
      synth.cutoff.linearRampToValueAtTime(synth.cutoff.maxFrequency, now + cAtk);
      synth.cutoff.linearRampToValueAtTime(synth.cutoff.sustain * synth.cutoff.maxFrequency, now + cAtk + cDec);
      synth.amp.gain.linearRampToValueAtTime(synth.maxGain, now + atk);
      synth.amp.gain.linearRampToValueAtTime(synth.sustain * synth.maxGain, now + atk + dec);
    };

    //apply release envelope
    synth.stop = function stopSynth() {
      var rel = parseFloat(synth.release);
      var now = getNow();
      synth.amp.gain.linearRampToValueAtTime(0, now + rel);
    };

    synth.waveform(config.waveform || 'sine');
    synth.pitch(config.pitch || 440);
    
    return synth;
  }
};
