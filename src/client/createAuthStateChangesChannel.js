import firebase from 'firebase';

export default eventChannel => () =>
  eventChannel(emitter => firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      emitter({
        id: user.uid,
        email: user.email,
        photo: user.photoURL
      });
    } else {
      emitter(false);
    }
  }));
