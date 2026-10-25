# Zyphix — Android & iOS app

One app with **Now** (groceries), **Eats** (food), **Book** (home services) and **Account**, built with Expo (React Native).
It uses the same backend as zyphix.in: live catalogue, sign-in with an email code, saved addresses and orders.

## Run it on your phone (no build needed)

```bash
cd mobile
npm install
npx expo start
```

Install **Expo Go** on your phone and scan the QR code. (Some features, like the app icon and splash screen, only show in a real build.)

## Build the store apps (in the cloud — no Mac needed)

One-time setup:

```bash
npm install -g eas-cli
eas login            # free Expo account
cd mobile
eas init             # links this folder to your Expo project
```

Test builds you can install directly:

```bash
eas build --profile preview --platform android   # gives you an .apk download link
eas build --profile preview --platform ios       # needs your Apple Developer account; installs on registered iPhones
```

Store builds:

```bash
eas build --profile production --platform all
eas submit --platform android    # uploads to Google Play (internal testing track)
eas submit --platform ios        # uploads to App Store Connect / TestFlight
```

EAS asks for your Apple ID and creates the iOS certificates for you. For Google Play, the first upload must be done
once by hand in Play Console (Create app → Internal testing → upload the .aab), after that `eas submit` works with a
Google service-account key.

## Identifiers

- App name: **Zyphix**
- iOS bundle id / Android package: **in.zyphix.app**
- Backend: https://zyphix.in (Cloudflare Worker). The app signs in with a Bearer token kept in the phone's secure keychain.

## Code map

- `src/app/` — screens (Expo Router). `(tabs)/` holds the five tabs.
- `src/lib/` — API client, auth, carts, theme.
- `src/data/` — Eats/Book data (same as the website) and media URLs (served from zyphix.in/media).
- `src/components/` — shared UI.
