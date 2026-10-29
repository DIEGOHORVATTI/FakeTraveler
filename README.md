# FakeTraveler
<img alt="Logo" src="assets/images/icon.png" width="80" />

Fake where your phone is located (Mock location for Android).

Sometimes you need to fake the location of your device (for privacy or to test an app). Fake Traveler provides you a map to select the location where you want your phone to be.



## How does it work?

Long press in the map where you want to be located or type the latitude and longitude, and tap the Apply button. Tapping the gear (⚙) button (formerly the "..." button) will show two settings to mock the location over a period of time. 

<div style="display:flex;">
<img alt="Main screen of the app" src="screenshots/map.png" width="30%">
<img alt="Main screen of the app in dark mode" src="screenshots/dark_mode.png" width="30%">
<img alt="Settings section of the app" src="screenshots/settings.png" width="30%">
</div>

### Notes

If your reported location appears to bounce from one location to another or is otherwise unstable, you
may want to go to system **Settings**, and in **Location services**, disable **Wi-Fi scanning** and
**Bluetooth scanning** as these alternate location providers may compete with the GPS location data
you are mocking.

## Requirements?

In order to work, you need to allow Fake Traveler to mock locations. You have to [enable Developer options](https://developer.android.com/studio/debug/dev-options?hl=en-419) and select this app in "Settings/System/Developer options/Select mock location app" option.

<div style="display:flex;">
<img alt="How to set up mock locations step 1" src="screenshots/mock_location_1.png" width="30%">
<img alt="How to set up mock locations step 2" src="screenshots/mock_location_2.png" width="30%">
</div>


## Development

Expo (SDK 57) + Expo Router + NativeWind + zustand, managed with [bun](https://bun.sh). The mock itself
is a local Expo module in Kotlin (`modules/mock-location`); the map is Leaflet inside a WebView.

```sh
bun install
bun run check    # typecheck + oxlint + oxfmt + bun test
bun run start    # Metro for a dev-client build
```

Native builds run on CI only:

- `ci.yml`: typecheck, lint, format and tests on every push.
- `build-aab.yml` (manual): signed AAB uploaded to Google Play (`com.diegohorvatti.fakeTraveler`),
  then records versionCode, versionName and the native fingerprint on the default branch.
- `ota-update.yml`: on push to the default branch, publishes an EAS Update when the native
  fingerprint still matches the last AAB.
- `build-apk.yml` (manual or `v*` tag): installable APK for testing.

Secrets: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`,
`ANDROID_KEY_PASSWORD`, `PLAY_SERVICE_ACCOUNT_JSON`, `EXPO_TOKEN`.


## License
Copyright © 2018 Matías Castillo Felmer

> This program is free software: you can redistribute it and/or modify
> it under the terms of the GNU General Public License as published by
> the Free Software Foundation, either version 3 of the License, or
> (at your option) any later version.
> 
> This program is distributed in the hope that it will be useful,
> but WITHOUT ANY WARRANTY; without even the implied warranty of
> MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
> GNU General Public License for more details.
> 
> You should have received a copy of the GNU General Public License
> along with this program.  If not, see <https://www.gnu.org/licenses/>.

The launcher icon was created by [@ArtistDev44](https://portfolio-guillaume-renoult.vercel.app/) (see #77) - thank you very much for your work!
