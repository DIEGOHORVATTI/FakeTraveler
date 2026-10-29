import { Pressable, Text, type PressableProps } from 'react-native'

type ButtonVariant = 'primary' | 'danger'

type ButtonProps = PressableProps & {
  title: string
  variant?: ButtonVariant
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-button',
  danger: 'bg-danger',
}

export function Button({ title, variant = 'primary', ...props }: ButtonProps) {
  return (
    <Pressable
      className={`h-14 items-center justify-center rounded-xl active:opacity-70 ${variantClass[variant]}`}
      {...props}
    >
      <Text className="text-base font-semibold text-on-accent">{title}</Text>
    </Pressable>
  )
}
