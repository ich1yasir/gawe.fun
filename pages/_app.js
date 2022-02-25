import '../styles/globals.css'
import initAuth from '../utils/initAuth'
import React, { useEffect } from 'react';
import { getMessaging, onMessage } from 'firebase/messaging';
import { firebaseCloudMessaging } from '../utils/webPush';

initAuth()

function MyApp({ Component, pageProps }) {
  const getMessage = (payload) => {
    console.log('foreground -----', payload)
  }
  useEffect(() => {
    setToken();
    async function setToken() {
      try {
        const token = await firebaseCloudMessaging.init();
        if (token) {
          const messaging = getMessaging();
          // const messaging = getMessaging();
          onMessage(messaging, (payload) => {
            getMessage(payload);
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);
  return <Component {...pageProps} />
}

export default MyApp
