import 'firebase/messaging';
import localforage from 'localforage';
import { getMessaging, getToken } from "firebase/messaging";
const firebaseCloudMessaging = {
    //checking whether token is available in indexed DB
    tokenInlocalforage: async () => {
        return localforage.getItem('fcm_token');
    },
    //initializing firebase app
    init: async function () {
        try {
            const messaging = getMessaging();
            const tokenInLocalForage = await this.tokenInlocalforage();
            //if FCM token is already there just return the token
            if (tokenInLocalForage !== null) {
                return tokenInLocalForage;
            }
            //requesting notification permission from browser
            const status = await Notification.requestPermission();
            if (status && status === 'granted') {
                //getting token from FCM
                getToken(messaging, { vapidKey: 'BIjlgiWmSQrRxBhJOag3lVSl53VQl_CDDH1iDjyCCNK7RMWj5_i2FNueEyeWxTF_Ejak4tgqnqhVw7qH7vgyYnw' }).then((token) => {
                    if (token) {
                      
                        //setting FCM token in indexed db using localforage
                        localforage.setItem('fcm_token', token);
                        console.log('fcm token', token);
                        //return the FCM token after saving it
                        return token;
                    } else {
                      // Show permission request UI
                      console.log('No registration token available. Request permission to generate one.');
                      // ...
                    }
                  }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                    // ...
                  });
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },
};
export { firebaseCloudMessaging };