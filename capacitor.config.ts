import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.huzefa.airlines',
  appName: 'Huzefa Airlines',
  webDir: '.',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      backgroundColor: '#040c1a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#f5c542'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#071a3d',
      overlaysWebView: false
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
