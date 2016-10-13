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
import getEmptyRating from './getEmptyRating';
import getBestGames from './getBestGames';
import isGameOver from '../server/isGameOver';
import hasFoundCipher from '../server/hasFoundCipher';
import { MAX_TURNS, PEGS_COUNT, COLORS_COUNT } from '../server/constants';

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
    login: login(auth),
    logout: logout(auth),
    joinUser: joinUser(commands, auth),
    createUsersChannel: createUsersChannel(users, eventChannel),
    userChannelEvents: {
      USER_HAS_JOINED,
      USER_HAS_DISCONNECTED
    },
    createAuthStateChangesChannel: createAuthStateChangesChannel(eventChannel),
    startGame: startGame(commands, auth),
    deleteActiveGame: deleteActiveGame(commands, auth),
    playerGuess: playerGuess(commands, auth, ratings, guesses, games),
    isGameInProgress: isGameInProgress(games),
    getActiveGame: getActiveGame(games, guesses, ratings),
    getGame: getGame(games, guesses, ratings),
    getBestGames: getBestGames(games, users),
    isGameOver,
    hasFoundCipher,
    getEmptyRating,
    MAX_TURNS,
    PEGS_COUNT,
    COLORS_COUNT
  };
};
