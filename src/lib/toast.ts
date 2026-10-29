import { ToastAndroid } from 'react-native'

export function toast(message: string) {
  ToastAndroid.show(message, ToastAndroid.SHORT)
}
