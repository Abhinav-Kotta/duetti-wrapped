# Duetti Market Replay

A mobile-first, Wrapped-style companion to the Duetti × Billboard H2 2026 Music Finance Index. Built with Expo so the same codebase runs in a browser, Expo Go, iOS, and Android.

## Run it

This Expo SDK version requires Node 22.13 or newer.

```bash
npm install
npm run web
```

For a phone on the same Wi-Fi network:

```bash
npm start
```

Scan the QR code with Expo Go on Android, or the Camera app on iOS. If local networking is blocked, run `npx expo start --tunnel` instead.

## Interaction

- Swipe horizontally on a phone.
- Use the arrow controls on any device.
- Use the left/right arrow keys or space bar in a browser.
- On the catalog-age story, change rights type and age band to explore the panel baselines.

## Design tokens

The palette, typography, and radii live in `src/theme.ts`. All market figures used in the prototype are drawn from the public H2 2026 Music Finance Index and should be presented as panel expectations, not catalog quotes.
