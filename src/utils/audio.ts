// Synthesized audio engine using native Web Audio API (no external asset dependencies)
import { useProfileStore } from '../store/useProfileStore'

let audioCtx: AudioContext | null = null

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export const playClickSound = () => {
  if (!useProfileStore.getState().soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(420, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.05)

    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.05)
  } catch (e) {
    console.debug('Audio playback error', e)
  }
}

export const playCorrectSound = () => {
  if (!useProfileStore.getState().soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 (sparkling major arpeggio)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07)

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.07)
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.07 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.28)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + idx * 0.07)
      osc.stop(ctx.currentTime + idx * 0.07 + 0.3)
    })
  } catch (e) {
    console.debug('Audio error', e)
  }
}

export const playWrongSound = () => {
  if (!useProfileStore.getState().soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    // Gentle encouraging 'uh-oh' bump
    const tones = [260, 220]
    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12)

      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.18)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + idx * 0.12)
      osc.stop(ctx.currentTime + idx * 0.12 + 0.2)
    })
  } catch (e) {
    console.debug('Audio error', e)
  }
}

export const playFanfareSound = () => {
  if (!useProfileStore.getState().soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    // Victory fanfare notes: G4, C5, E5, G5 (longer)
    const melody = [
      { freq: 392.0, time: 0, dur: 0.12 },
      { freq: 523.25, time: 0.12, dur: 0.12 },
      { freq: 659.25, time: 0.24, dur: 0.14 },
      { freq: 783.99, time: 0.40, dur: 0.45 },
    ]

    melody.forEach((note) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time)

      gain.gain.setValueAtTime(0.001, ctx.currentTime + note.time)
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + note.time + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.dur)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + note.time)
      osc.stop(ctx.currentTime + note.time + note.dur + 0.05)
    })
  } catch (e) {
    console.debug('Audio error', e)
  }
}

export const playCoinSound = () => {
  if (!useProfileStore.getState().soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1760, ctx.currentTime) // A6
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.07)

    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.08)
  } catch (e) {
    console.debug('Coin audio error', e)
  }
}

export const playCashRegisterSound = () => {
  if (!useProfileStore.getState().soundEnabled) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    // "Cha-ching" effect: 2 quick coin hits + bright register bell
    const hits = [
      { freq: 1320, time: 0, dur: 0.06 },
      { freq: 1760, time: 0.07, dur: 0.07 },
      { freq: 2637, time: 0.15, dur: 0.4 }, // E7 bright register bell
    ]

    hits.forEach((h) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(h.freq, ctx.currentTime + h.time)

      gain.gain.setValueAtTime(0.001, ctx.currentTime + h.time)
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + h.time + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + h.time + h.dur)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + h.time)
      osc.stop(ctx.currentTime + h.time + h.dur + 0.02)
    })
  } catch (e) {
    console.debug('Cash register audio error', e)
  }
}
