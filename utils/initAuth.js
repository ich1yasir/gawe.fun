import { init } from 'next-firebase-auth'

const TWELVE_DAYS_IN_MS = 12 * 60 * 60 * 24 * 1000

const initAuth = () => {
  init({
    debug: false,
    authPageURL: '/auth',
    appPageURL: '/',
    loginAPIEndpoint: '/api/login',
    logoutAPIEndpoint: '/api/logout',
    firebaseAdminInitConfig: {
      credential: {
        type: "service_account",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
          : undefined,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        clientId: process.env.FIREBASE_PRIVATE_KEY_CLIENT_ID,
        authUri: process.env.FIREBASE_PRIVATE_KEY_AUTH_URL,
        tokenUri: process.env.FIREBASE_PRIVATE_KEY_TOKEN_URL,
        authProviderX509CertUrl: process.env.FIREBASE_PRIVATE_KEY,
      },
      databaseURL: process.env.FIREBASE_PRIVATE_KEY_X509_CERT_URL
    },
    firebaseClientInitConfig: {
      databaseURL: process.env.FIREBASE_CLIENT_DB_URL,
      apiKey: process.env.FIREBASE_CLIENT_API_KEY,
      authDomain: process.env.FIREBASE_CLIENT_AUTHDOMAIN,
      projectId: process.env.FIREBASE_CLIENT_PROJECTID,
      storageBucket: process.env.FIREBASE_CLIENT_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_CLIENT_MESSAGING_SENDERID,
      appId: process.env.FIREBASE_CLIENT_APPID,
      measurementId: process.env.FIREBASE_CLIENT_MEASUREMENTID
    },
    cookies: {
      name: 'gawe.fun',
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: TWELVE_DAYS_IN_MS,
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true',
      signed: true,
    },
  }
  )
}

export default initAuth
