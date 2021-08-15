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
        privateKeyId: "8ad79c6464f7d8a681f9442e09cfa3aae1bf7ef5",
        clientId: "8ad79c6464f7d8a681f9442e09cfa3aae1bf7ef5",
        authUri: "https://accounts.google.com/o/oauth2/auth",
        tokenUri: "https://oauth2.googleapis.com/token",
        authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
      },
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    },
    firebaseClientInitConfig: {
      databaseURL: "next-event-eb2ff.firebaseio.com",
      apiKey: "AIzaSyBR5IBDc-0gbZdnDL0B2XM5kgMF4K7eSKM",
      authDomain: "next-event-eb2ff.firebaseapp.com",
      projectId: "next-event-eb2ff",
      storageBucket: "next-event-eb2ff.appspot.com",
      messagingSenderId: "117461649566",
      appId: "1:117461649566:web:3aa10f036f8f2e6e8ed38f",
      measurementId: "G-PGCS29LPYZ"
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
