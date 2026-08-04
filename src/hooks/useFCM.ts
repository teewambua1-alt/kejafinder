import { useState, useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { firebaseMessaging, firebaseDb } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export function useFCM() {
  const { firebaseUser } = useAuth();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    try {
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications.');
        return false;
      }

      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        const messaging = await firebaseMessaging;
        if (messaging) {
          // Note: In a real app, you need a VAPID key to generate tokens
          const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY; 
          
          let currentToken;
          if (vapidKey) {
            currentToken = await getToken(messaging, { vapidKey });
          } else {
            // Attempt generic getToken if vapid isn't provided (may fail in production)
            currentToken = await getToken(messaging);
          }
          
          if (currentToken) {
            setFcmToken(currentToken);
            if (firebaseUser) {
              await saveTokenToFirestore(firebaseUser.uid, currentToken);
            }
            return true;
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        }
      } else {
        console.log('Unable to get permission to notify.');
      }
      return false;
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
      return false;
    }
  };

  const saveTokenToFirestore = async (userId: string, token: string) => {
    if (!firebaseDb) return;
    try {
      const userRef = doc(firebaseDb, 'users', userId);
      // add token logic, preventing duplicates
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(token)
      });
      console.log('FCM token saved to user profile.');
    } catch (err) {
      console.error('Failed to save FCM token to firestore:', err);
    }
  };

  // Listen for foreground messages
  useEffect(() => {
    // Without this flag, a cleanup that runs while setupMessaging() is still
    // awaiting firebaseMessaging would call the original no-op `unsubscribe`,
    // and the real onMessage subscription created moments later would never
    // get torn down — it would keep firing indefinitely.
    let cancelled = false;
    let unsubscribe = () => {};

    const setupMessaging = async () => {
      const messaging = await firebaseMessaging;
      if (cancelled) return;
      if (messaging && notificationPermission === 'granted') {
        unsubscribe = onMessage(messaging, (payload) => {
          console.log('Foreground Message received. ', payload);
          // In a real app, you would show a toast notification here
          if (payload.notification) {
            // We can use native Notification API if app is in focus
            new Notification(payload.notification.title || 'New Match!', {
              body: payload.notification.body,
              icon: '/vite.svg'
            });
          }
        });
      }
    };

    setupMessaging();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [notificationPermission]);

  return { requestPermission, fcmToken, notificationPermission };
}
