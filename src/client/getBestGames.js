import { sortBy, take } from 'lodash';

export default (games, users, guesses, ratings) => async (limit) => {
  const finishedGames = (
    await games
      .orderByChild('over')
      .equalTo(true)
      .once('value')
  ).val();

  if (!finishedGames) {
    return [];
  }

  const bestGames = take(sortBy(
    Object
      .keys(finishedGames)
      .map(gameId => ({ ...finishedGames[gameId], id: gameId })),
    game => game.turn
  ), limit);

  return Promise.all(bestGames.map(async (game) => {
    const user = (
      await users
        .child(game.user)
        .once('value')
    ).val();

    const guessMap = (await guesses
      .orderByChild('game')
      .equalTo(game.id)
      .once('value')
    ).val();

    const gameGuesses = Object.keys(guessMap || {});

    const ratingMap = (await ratings
      .orderByChild('game')
      .equalTo(game.id)
      .once('value')
    ).val();

    const gameRatings = Object.keys(ratingMap || {});

    return {
      ...game,
      user: {
        ...user,
        id: game.user
      },
      guesses: gameGuesses.map(guessId => ({ id: guessId, ...guessMap[guessId] })),
      ratings: gameRatings.map(ratingId => ({ id: ratingId, ...ratingMap[ratingId] }))
    };
  }));
};
