import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import Canvas from 'react-canvas-wrapper'
import { SpeedoPosition } from './constants'
import useSpeedo from './useSpeedo'

const Speedo = forwardRef((props, ref) => {
  const canvasRef = useRef(null)
  const nodeRef = useRef(null)
  const contextRef = useRef(null)

  const { begin, end, history, value, window } = useSpeedo()

  useImperativeHandle(ref, () => ({ begin, end }))

  const draw = useCallback((ctx) => {}, [history, value, window])

  useEffect(() => {
    if (!canvasRef.current) return

    if (!nodeRef.current) {
      nodeRef.current = React.findDOMNode(canvasRef.current)
    }

    if (!contextRef.current) {
      contextRef.current = nodeRef.current.getContext('2d', { alpha: false })
    }

    draw(contextRef.current)
  }, [draw])

  return <Canvas ref={canvasRef} />
})

export default Speedo
