import firebase from 'firebase';

import joinUser from './joinUser';
import login from './login';
import logout from './logout';
import createUsersChannel, { USER_HAS_JOINED, USER_HAS_DISCONNECTED } from './createUsersChannel';
import createAuthStateChangesChannel from './createAuthStateChangesChannel';
import startGame from './startGame';
import deleteActiveGame from './deleteActiveGame';
import playerGuess from './playerGuess';
import isGameInProgress from './isGameInProgress';
import getActiveGame from './getActiveGame';
import getGame from './getGame';
import getBestGames from './getBestGames';

export default (firebaseConfig, eventChannel) => {
  const db = firebase
    .initializeApp(firebaseConfig)
    .database()
    .ref();

  const auth = firebase.auth();

  const commands = db.child('commands');
  const games = db.child('games');
  const users = db.child('users');
  const ratings = db.child('ratings');
  const guesses = db.child('guesses');

  return {
    createAuthStateChangesChannel: createAuthStateChangesChannel(eventChannel),
    createUsersChannel: createUsersChannel(users, eventChannel),
    deleteActiveGame: deleteActiveGame(commands, auth),
    getActiveGame: getActiveGame(games, guesses, ratings, auth),
    getBestGames: getBestGames(games, users, guesses, ratings),
    getGame: getGame(games, guesses, ratings),
    isGameInProgress: isGameInProgress(games, auth),
    joinUser: joinUser(commands, auth),
    login: login(auth),
    logout: logout(commands, auth),
    playerGuess: playerGuess(commands, auth, ratings, guesses, games),
    startGame: startGame(commands, auth),
    userChannelEvents: {
      USER_HAS_JOINED,
      USER_HAS_DISCONNECTED
    }
  };
};
