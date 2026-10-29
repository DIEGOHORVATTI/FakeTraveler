import type { LucideIcon } from 'lucide-react-native'

import { useEffect, useState } from 'react'
import { Animated, Easing, Text, View } from 'react-native'
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg'

import { useThemeColors } from '@/src/theme/colors'

const SIZE = 148

type HaloProps = {
  tint: string
}

function Halo({ tint }: HaloProps) {
  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 148 148">
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={tint} stopOpacity={0.22} />
          <Stop offset="70%" stopColor={tint} stopOpacity={0.06} />
          <Stop offset="100%" stopColor={tint} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx="74" cy="74" r="74" fill="url(#glow)" />
      <Circle cx="74" cy="74" r="52" fill={tint} fillOpacity={0.08} />
      <Circle cx="74" cy="74" r="38" fill={tint} fillOpacity={0.12} />
      <Circle cx="120" cy="40" r="4" fill={tint} fillOpacity={0.35} />
      <Circle cx="30" cy="104" r="3" fill={tint} fillOpacity={0.28} />
      <Circle cx="112" cy="110" r="2.5" fill={tint} fillOpacity={0.22} />
    </Svg>
  )
}

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  subtitle?: string
}

export function EmptyState({ icon: Icon, title, subtitle }: EmptyStateProps) {
  const colors = useThemeColors()
  const [appear] = useState(() => new Animated.Value(0))

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }, [appear])

  return (
    <Animated.View
      className="items-center justify-center gap-4 px-8 py-14"
      style={{
        opacity: appear,
        transform: [
          { translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
          { scale: appear.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
        ],
      }}
    >
      <View style={{ width: SIZE, height: SIZE }} className="items-center justify-center">
        <View style={{ position: 'absolute' }}>
          <Halo tint={colors.accent} />
        </View>
        <Icon size={40} color={colors.accent} />
      </View>
      <View className="items-center gap-1.5">
        <Text className="text-center text-base font-medium text-text-secondary">{title}</Text>
        {subtitle ? (
          <Text className="max-w-[280px] text-center text-sm leading-5 text-text-muted">
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  )
}
