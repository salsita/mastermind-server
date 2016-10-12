export default (games, guesses, ratings) => async () => {
  const activeGames = (await games
    .orderByChild('over')
    .equalTo(false)
    .once('value')).val();

  const activeGameId = Object.keys(activeGames)[0];

  const guessMap = (await guesses
    .orderByChild('game')
    .equalTo(activeGameId)
    .once('value')
  ).val();

  const gameGuesses = Object.keys(guessMap || {});

  const ratingMap = (await ratings
    .orderByChild('game')
    .equalTo(activeGameId)
    .once('value')
  ).val();

  const gameRatings = Object.keys(ratingMap || {});

  return {
    ...activeGames[activeGameId],
    id: activeGameId,
    guesses: gameGuesses.map(guessId => ({ id: guessId, ...guessMap[guessId] })),
    ratings: gameRatings.map(ratingId => ({ id: ratingId, ...ratingMap[ratingId] }))
  };
};
