export default (games, guesses, ratings, auth) => async () => {
  const activeGames = (await games
    .orderByChild('over')
    .equalTo(false)
    .once('value')).val();

  const activeGameId = Object
    .keys(activeGames)
    .filter(gameId => activeGames[gameId].user === auth.currentUser.uid)[0];

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
