import 'dotenv/config';
import { ConfigContext } from '@expo/config-plugins';

export default ({ config }) => {
  const extra = {
    eas: {
      projectId: '6d4cd093-8aca-4fa6-b92f-2affcc28ddd7',
    },
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      databaseURL:
        'https://rappelanniversaires-677d7-default-rtdb.europe-west1.firebasedatabase.app',
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
  };

  return {
    ...config,
    extra,
    android: {
      ...config.android,
      package: 'com.rkawka.rappelanniversaires',
    },
  };
};
