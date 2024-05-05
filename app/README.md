# SmartCompass Mobile App

## Build
### Prerequisites
- [Java JDK17](https://openjdk.org/projects/jdk/17/) 
- [Android SDK](https://developer.android.com/tools)
- [NodeJS v20](https://nodejs.org/en/download)

### Run with expo
1. Instalacja expo: https://docs.expo.dev/get-started/installation/
- Instalacja aplikacji Expo Go ze sklepu play
- Emulator Androida / podłączenie kablem telefonu (trzeba najpierw włączyć debuggowanie w opcjach developera)

2. W projekcie
- ``cd ./App``
- ``npx expo prebuild	``			tylko raz na początku powinno wystarczyć
- ``npx expo run:android -> press 'a' open Android``	za każdym razem żeby odpalić serwer expo -> apliakcję na telefonie 

3. Jeśli wszystko jest poprawnie skonfigurowane aplikacja odpali się teraz sama na telefonie

### Build .APK 
https://dev.to/chinmaymhatre/how-to-generate-apk-using-react-native-expo-kae

NIE INSTALUJCIE ``npm install --global expo-cli eas-cli``.
Expo-cli jest deprecated. Cała funkcjonalność jest w npx.
Komandy wywołujecie jako ``npx expo <command>``
np. ``npx expo login``
Do budowania wybieracie tylko Android. Potrwa to ponad 10min.