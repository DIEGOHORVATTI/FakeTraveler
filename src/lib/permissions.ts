import { PermissionsAndroid, Platform } from 'react-native'

const NOTIFICATIONS_API_LEVEL = 33

export async function ensureMockPermissions() {
  const wanted = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]
  if (Number(Platform.Version) >= NOTIFICATIONS_API_LEVEL) {
    wanted.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
  }

  const result = await PermissionsAndroid.requestMultiple(wanted)
  return result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted'
}
