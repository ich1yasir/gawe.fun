import '../styles/globals.css'
import initAuth from '../utils/initAuth'
import React, { useEffect } from 'react';
import { getMessaging, onMessage } from 'firebase/messaging';
import { firebaseCloudMessaging } from '../utils/webPush';

initAuth()

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    setToken();
    async function setToken() {
      try {
        const token = await firebaseCloudMessaging.init();
        if (token) {
          getMessage();
        }
      } catch (error) {
        console.log(error);
      }
    }
    function getMessage() {
      onMessage((message) => console.log('foreground' , message));
    }
  }, []);
  return <Component {...pageProps} />
}

export default MyApp
