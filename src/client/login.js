import firebase from 'firebase';

const provider = new firebase.auth.GoogleAuthProvider();

export default auth => () => auth.signInWithPopup(provider);
