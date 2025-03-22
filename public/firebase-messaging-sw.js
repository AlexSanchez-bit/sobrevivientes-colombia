importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyBo_4AYPOi52SK4ah5I7Wk1JvJV465jHgU",
  authDomain: "myomi-4555c.firebaseapp.com",
  projectId: "myomi-4555c",
  storageBucket: "myomi-4555c.firebasestorage.app",
  messagingSenderId: "876319512682",
  appId: "1:876319512682:web:8ea54aa1beeab7d4ea9213",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
// Manejo de notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  });
});
