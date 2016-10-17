import firebase from 'firebase';
import { map } from 'lodash';

import generateCipher from './generateCipher';
import getRating from './getRating';
import hasFoundCipher from './hasFoundCipher';
import isGameOver from './isGameOver';
import * as Commands from './commands';

export default (users, games, guesses, ratings, ciphers) => {
  const handleDisconnectUser = async (payload, user) => {
    const userRecord = (
      await users
      .child(user)
      .once('value')
    ).val();

    await users
      .child(user)
      .update({
        activeConnections: userRecord ? Math.max(userRecord.activeConnections - 1, 0) : 0
      });
  };

  const handleJoinUser = async ({ email, photo }, user) => {
    const userRecord = (
      await users
        .child(user)
        .once('value')
    ).val();

    if (userRecord) {
      users
        .child(user)
        .update({
          email,
          photo,
          lastLoggedIn: Date.now(),
          activeConnections: userRecord.activeConnections + 1
        });
    } else {
      users
        .child(user)
        .set({
          email,
          photo,
          lastLoggedIn: Date.now(),
          activeConnections: 1
        });
    }
  };

  const handleStartGame = async (payload, user) => {
    const userGames = (
      await games
      .orderByChild('user')
      .equalTo(user)
      .once('value')
    ).val();

    // Either user has no games or all of them have already finished
    if (!userGames || Object.keys(userGames).every(gameId => userGames[gameId].over)) {
      const ref = games
        .push();

      await ref.set({
        turn: 0,
        created: firebase.database.ServerValue.TIMESTAMP,
        user,
        over: false,
        found: false
      });

      await ciphers
        .push()
        .set({
          game: ref.key,
          cipher: generateCipher()
        });
    }
  };

  const handleDeleteGame = async (payload, user) => {
    const userGames = (
      await games
        .orderByChild('user')
        .equalTo(user)
        .once('value')
    ).val();

    await Promise.all(map(
      userGames,
      async (game, userGameId) => {
        if (!game.over) {
          games.child(userGameId).remove();

          const gameGuesses = (await guesses
            .orderByChild('game')
            .equalTo(userGameId)
            .once('value')).val();

          const gameRatings = (await ratings
            .orderByChild('game')
            .equalTo(userGameId)
            .once('value')).val();

          const gameCiphers = (await ciphers
            .orderByChild('game')
            .equalTo(userGameId)
            .once('value')).val();

          await Promise.all(
            map(gameGuesses, (gameGuess, gameGuessId) => guesses.child(gameGuessId).remove()));
          await Promise.all(
            map(gameRatings, (gameRating, gameRatingId) => ratings.child(gameRatingId).remove()));
          await Promise.all(
            map(gameCiphers, (gameCipher, gameCipherId) => ciphers.child(gameCipherId).remove()));
        }
      }
    ));
  };

  const handleNewGuess = async ({ guess }, user) => {
    const userGames = (
      await games
        .orderByChild('user')
        .equalTo(user)
        .once('value')
    ).val();

    const activeGameId = Object.keys(userGames).filter(id => !userGames[id].over)[0];
    if (activeGameId) {
      const gameCiphers = (
        await ciphers
          .orderByChild('game')
          .equalTo(activeGameId)
          .once('value')
      ).val();

      const cipher = gameCiphers[Object.keys(gameCiphers)[0]].cipher;

      const activeGame = userGames[activeGameId];
      const rating = getRating(guess, cipher);
      const nextTurn = activeGame.turn + 1;

      const newGame = {
        ...activeGame,
        turn: nextTurn,
        ratings: [{
          turn: 1,
          rating
        }]
      };

      await games
        .child(activeGameId)
        .update({
          turn: nextTurn,
          found: hasFoundCipher(newGame),
          over: isGameOver(newGame)
        });

      await guesses
        .push()
        .set({
          game: activeGameId,
          guess,
          turn: activeGame.turn,
          user
        });

      await ratings
        .push()
        .set({
          game: activeGameId,
          rating,
          turn: activeGame.turn,
          user
        });
    } else {
      console.warn('New guess for non-existing game');
    }
  };

  return async ({ type, payload, user }) => {
    switch (type) {
      case Commands.DISCONNECT_USER:
        await handleDisconnectUser(payload, user);
        break;

      case Commands.JOIN_USER:
        await handleJoinUser(payload, user);
        break;

      case Commands.START_GAME:
        await handleStartGame(payload, user);
        break;

      case Commands.DELETE_GAME:
        await handleDeleteGame(payload, user);
        break;

      case Commands.NEW_GUESS:
        await handleNewGuess(payload, user);
        break;

      default:
        throw new Error(`Invalid state - ${type}`);
    }
  };
};

