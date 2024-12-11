import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'app_movil',
  webDir: 'www'
};

export default config;


// capacitor.config.ts
module.exports = {
  plugins: {
    Camera: {
      allowEditing: true,
      quality: 90,
      resultType: 'DataUrl',
    },
  },
};
