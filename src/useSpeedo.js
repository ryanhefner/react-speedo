import { useCallback, useEffect, useRef, useState } from 'react'
import { SpeedoMode } from './constants'

const DEFAULT_OPTIONS = {
  disable: false,
  interval: 1000,
  mode: SpeedoMode.FPS,
  target: '>= 24',
  window: 60,
}

/**
 * useSpeedo Hook
 *
 * @param {Object=} options
 * @param {boolean} options.disable
 * @param {number} options.interval
 * @param {string} options.mode
 * @param {string} options.target
 * @param {number} options.window
 * @returns {
 *  begin: () => void;
 *  end: () => void;
 *  error: Error | null;
 *  history: number[];
 *  maxValue: number;
 *  minValue: number;
 *  mode: string;
 *  reset: () => void;
 *  target: string;
 *  targetAchieved: boolean;
 *  value: number;
 *  window: number;
 * }
 */
const useSpeedo = (options = {}) => {
  const { disable, interval, mode, target, window } = { ...DEFAULT_OPTIONS, ...options }

  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [maxValue, setMaxValue] = useState(null)
  const [minValue, setMinValue] = useState(null)
  const [value, setValue] = useState(null)
  const [targetAchieved, setTargetAchieved] = useState(false)

  const cycleRef = useRef(null)
  const framesRef = useRef([])
  const prevTimeRef = useRef(null)

  const begin = useCallback(() => {
    cycleRef.current = (performance || Date).now()
  }, [])

  const end = useCallback(() => {
    const now = (performance || Date).now()

    framesRef.current = [...(framesRef.current || []), now - cycleRef.current]
    cycleRef.current = null

    if (!prevTimeRef.current) {
      prevTimeRef.current = now
    }

    if (now - prevTimeRef.current >= interval) {
      const nextValue = framesRef.current?.length
      framesRef.current = []
      setMinValue((prevState) => (prevState !== null ? Math.min(prevState, nextValue) : nextValue))
      setMaxValue((prevState) => (prevState !== null ? Math.max(prevState, nextValue) : nextValue))
      setValue(nextValue)
      setHistory((prevState) => [...prevState, nextValue])
      setTargetAchieved(eval(`${nextValue} ${target}`))
      prevTimeRef.current = now
    }
  }, [interval, target])

  const reset = useCallback(() => {
    setMinValue(null)
    setMaxValue(null)
    setHistory([])
    setTargetAchieved(false)
  }, [])

  useEffect(() => {
    if (!SpeedoMode.hasOwnProperty(mode)) {
      setError('Invalid `mode` provided to `useSpeedo`.')
    }
  }, [mode])

  return {
    begin,
    end,
    error,
    history,
    maxValue,
    minValue,
    mode,
    reset,
    target,
    targetAchieved,
    value,
    window,
  }
}

export default useSpeedo
