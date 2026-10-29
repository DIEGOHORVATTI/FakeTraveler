import { useEffect, useMemo } from 'react'
import { Animated } from 'react-native'

type SkeletonProps = {
  width?: number | 'auto' | `${number}%`
  height?: number
  borderRadius?: number
  className?: string
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className,
}: SkeletonProps) {
  const opacity = useMemo(() => new Animated.Value(0.3), [])

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    )
    animation.start()
    return () => animation.stop()
  }, [opacity])

  return (
    <Animated.View
      className={`bg-bg-input ${className ?? ''}`}
      style={{ width, height, borderRadius, opacity }}
    />
  )
}
