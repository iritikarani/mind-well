export type SoundId = "rain" | "waves" | "fire" | "wind" | "hum" | "chimes";

export const SOUNDS: { id: SoundId; label: string; emoji: string }[] = [
  { id: "rain", label: "Rain", emoji: "🌧️" },
  { id: "waves", label: "Ocean waves", emoji: "🌊" },
  { id: "fire", label: "Fireplace", emoji: "🔥" },
  { id: "wind", label: "Soft wind", emoji: "🍃" },
  { id: "hum", label: "Warm hum", emoji: "☁️" },
  { id: "chimes", label: "Wind chimes", emoji: "🎐" },
];

export type Mix = Record<SoundId, number>;

export const SILENT_MIX: Mix = { rain: 0, waves: 0, fire: 0, wind: 0, hum: 0, chimes: 0 };

export const PRESETS: { id: string; label: string; emoji: string; mix: Mix }[] = [
  { id: "rainy", label: "Rainy window", emoji: "🌧️", mix: { ...SILENT_MIX, rain: 0.7, hum: 0.2, chimes: 0.15 } },
  { id: "beach", label: "Quiet beach", emoji: "🏖️", mix: { ...SILENT_MIX, waves: 0.75, wind: 0.25 } },
  { id: "fireside", label: "Fireside", emoji: "🛋️", mix: { ...SILENT_MIX, fire: 0.7, hum: 0.25 } },
  { id: "forest", label: "Forest night", emoji: "🌲", mix: { ...SILENT_MIX, wind: 0.45, chimes: 0.3, hum: 0.15 } },
];

type NoiseKind = "white" | "pink" | "brown";

function makeNoise(ctx: BaseAudioContext, kind: NoiseKind, seconds: number): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (kind === "white") {
      data[i] = white;
    } else if (kind === "pink") {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    } else {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  }
  return buffer;
}

function loopSource(ctx: BaseAudioContext, buffer: AudioBuffer): AudioBufferSourceNode {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  return src;
}

const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];

/** One layered, procedurally generated soundscape. Everything is built from
 * filtered noise and a few oscillators — there are no audio files to
 * download, license or buffer, so it starts instantly and works offline. */
export class Soundscape {
  private ctx: BaseAudioContext;
  private master: GainNode;
  private channels = {} as Record<SoundId, GainNode>;
  private volumes: Mix = { ...SILENT_MIX };
  private sources: AudioScheduledSourceNode[] = [];
  private timeouts = new Set<ReturnType<typeof setTimeout>>();
  private alive = true;

  constructor(ctx: BaseAudioContext, output: AudioNode = ctx.destination) {
    this.ctx = ctx;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.ratio.value = 3;
    compressor.connect(output);

    this.master = ctx.createGain();
    this.master.gain.value = 1;
    this.master.connect(compressor);

    for (const { id } of SOUNDS) {
      const g = ctx.createGain();
      g.gain.value = 0;
      g.connect(this.master);
      this.channels[id] = g;
    }

    this.buildRain();
    this.buildWaves();
    this.buildFire();
    this.buildWind();
    this.buildHum();
    this.buildChimes();
  }

  private track<T extends AudioScheduledSourceNode>(node: T): T {
    this.sources.push(node);
    return node;
  }

  private lfo(frequency: number, depth: number, target: AudioParam) {
    const osc = this.track(this.ctx.createOscillator());
    osc.frequency.value = frequency;
    const gain = this.ctx.createGain();
    gain.gain.value = depth;
    osc.connect(gain).connect(target);
    osc.start();
  }

  private buildRain() {
    const ctx = this.ctx;
    const body = this.track(loopSource(ctx, makeNoise(ctx, "pink", 5)));
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 500;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 7500;
    const bodyGain = ctx.createGain();
    bodyGain.gain.value = 0.62;
    body.connect(hp).connect(lp).connect(bodyGain).connect(this.channels.rain);

    const patter = this.track(loopSource(ctx, makeNoise(ctx, "white", 4)));
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 3500;
    bp.Q.value = 0.4;
    const patterGain = ctx.createGain();
    patterGain.gain.value = 0.12;
    patter.connect(bp).connect(patterGain).connect(this.channels.rain);

    body.start();
    patter.start();
  }

  private buildWaves() {
    const ctx = this.ctx;
    const swell = this.track(loopSource(ctx, makeNoise(ctx, "brown", 6)));
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const swellGain = ctx.createGain();
    swellGain.gain.value = 0.25;
    swell.connect(lp).connect(swellGain).connect(this.channels.waves);
    this.lfo(0.11, 0.22, swellGain.gain);

    const foam = this.track(loopSource(ctx, makeNoise(ctx, "pink", 5)));
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1800;
    const foamLp = ctx.createBiquadFilter();
    foamLp.type = "lowpass";
    foamLp.frequency.value = 6000;
    const foamGain = ctx.createGain();
    foamGain.gain.value = 0.05;
    foam.connect(hp).connect(foamLp).connect(foamGain).connect(this.channels.waves);
    this.lfo(0.11, 0.06, foamGain.gain);

    swell.start();
    foam.start();
  }

  private buildFire() {
    const ctx = this.ctx;
    const rumble = this.track(loopSource(ctx, makeNoise(ctx, "brown", 5)));
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 500;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.5;
    rumble.connect(lp).connect(rumbleGain).connect(this.channels.fire);
    rumble.start();

    const crackleBuffer = makeNoise(ctx, "white", 0.1);
    const tick = () => {
      if (!this.alive) return;
      if (this.volumes.fire > 0.02 && Math.random() < 0.4) {
        const now = ctx.currentTime;
        const src = ctx.createBufferSource();
        src.buffer = crackleBuffer;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 1500 + Math.random() * 3500;
        bp.Q.value = 1.5;
        const env = ctx.createGain();
        const peak = 0.15 + Math.random() * 0.45;
        env.gain.setValueAtTime(0.0001, now);
        env.gain.linearRampToValueAtTime(peak, now + 0.003);
        env.gain.exponentialRampToValueAtTime(0.0001, now + 0.03 + Math.random() * 0.06);
        src.connect(bp).connect(env).connect(this.channels.fire);
        src.start(now);
        src.stop(now + 0.12);
      }
      this.later(tick, 70 + Math.random() * 90);
    };
    this.later(tick, 200);
  }

  private buildWind() {
    const ctx = this.ctx;
    const src = this.track(loopSource(ctx, makeNoise(ctx, "pink", 6)));
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 500;
    bp.Q.value = 0.8;
    this.lfo(0.05, 250, bp.frequency);
    const gain = ctx.createGain();
    gain.gain.value = 0.8;
    this.lfo(0.08, 0.3, gain.gain);
    src.connect(bp).connect(gain).connect(this.channels.wind);
    src.start();
  }

  private buildHum() {
    const ctx = this.ctx;
    const src = this.track(loopSource(ctx, makeNoise(ctx, "brown", 6)));
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 700;
    const gain = ctx.createGain();
    gain.gain.value = 0.42;
    src.connect(lp).connect(gain).connect(this.channels.hum);
    src.start();
  }

  private buildChimes() {
    const ctx = this.ctx;
    const ring = () => {
      if (!this.alive) return;
      if (this.volumes.chimes > 0.02) {
        const now = ctx.currentTime;
        const freq = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
        const env = ctx.createGain();
        env.gain.setValueAtTime(0.0001, now);
        env.gain.linearRampToValueAtTime(0.28, now + 0.012);
        env.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);
        let out: AudioNode = env;
        if (typeof ctx.createStereoPanner === "function") {
          const pan = ctx.createStereoPanner();
          pan.pan.value = Math.random() * 1.2 - 0.6;
          env.connect(pan);
          out = pan;
        }
        out.connect(this.channels.chimes);
        for (const [mult, level] of [
          [1, 1],
          [2.76, 0.25],
        ] as const) {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = freq * mult;
          const g = ctx.createGain();
          g.gain.value = level;
          osc.connect(g).connect(env);
          osc.start(now);
          osc.stop(now + 3.7);
        }
      }
      this.later(ring, 2200 + Math.random() * 4200);
    };
    this.later(ring, 800);
  }

  private later(fn: () => void, ms: number) {
    const id = setTimeout(() => {
      this.timeouts.delete(id);
      fn();
    }, ms);
    this.timeouts.add(id);
  }

  setVolume(id: SoundId, value: number) {
    const v = Math.min(1, Math.max(0, value));
    this.volumes[id] = v;
    this.channels[id].gain.setTargetAtTime(v, this.ctx.currentTime, 0.35);
  }

  setMix(mix: Mix) {
    for (const { id } of SOUNDS) this.setVolume(id, mix[id]);
  }

  /** Gently lowers everything to silence over `seconds`. */
  fadeOut(seconds: number) {
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0.0001, now + seconds);
  }

  restoreMaster() {
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(1, now, 0.2);
  }

  dispose() {
    this.alive = false;
    this.timeouts.forEach(clearTimeout);
    this.timeouts.clear();
    for (const s of this.sources) {
      try {
        s.stop();
      } catch {
        // already stopped
      }
    }
  }
}

/** A soft two-note bell — used to close a breathing session. */
export function playBell(ctx: BaseAudioContext) {
  const now = ctx.currentTime;
  [523.25, 783.99].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const env = ctx.createGain();
    const start = now + i * 0.35;
    env.gain.setValueAtTime(0.0001, start);
    env.gain.linearRampToValueAtTime(0.22, start + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, start + 2.6);
    osc.connect(env).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 2.7);
  });
}
