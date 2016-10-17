import firebase from 'firebase';

import createCommandHandler from './commandHandler';

let auth;
if (process.env.AUTH) {
  auth = JSON.parse(process.env.AUTH);
} else {
  auth = require('./auth.json');
}

const firebaseConfig = {
  serviceAccount: {
    projectId: auth.project_id,
    clientEmail: auth.client_email,
    privateKey: auth.private_key
  },
  databaseURL: process.env.DB_URL || 'https://mastermind-ea220.firebaseio.com'
};

const db = firebase
  .initializeApp(firebaseConfig)
  .database()
  .ref();

const commandHandler = createCommandHandler(
  db.child('users'),
  db.child('games'),
  db.child('guesses'),
  db.child('ratings'),
  db.child('ciphers')
);

db
  .child('commands')
  .on('child_added', async (snapshot) => {
    const command = snapshot.val();

    try {
      await commandHandler(command);
    } catch (ex) {
      console.error(ex);
    } finally {
      snapshot.ref.remove();
    }
  });
