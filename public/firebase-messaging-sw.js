// Web push messaging Service Worker

// Allows the background notification to work.
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Typically, you'd need the config here to initialize messaging in the SW.
// However, Firebase looks at query params when auto-registering. 
// If users use manual registering, we provide a placeholder they must configure.
const firebaseConfig = {
  // To receive background notifications, uncomment and fill in your details:
  // apiKey: "...",
  // authDomain: "...",
  // projectId: "...",
  // storageBucket: "...",
  // messagingSenderId: "...",
  // appId: "..."
};

// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/inviteLogo.svg'
//   };
//
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
