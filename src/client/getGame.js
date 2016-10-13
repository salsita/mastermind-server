export default (games, guesses, ratings) => async (id) => {
  const game = (
    await games
      .child(id)
      .once('value')
  ).val();

  const guessMap = (await guesses
    .orderByChild('game')
    .equalTo(id)
    .once('value')
  ).val();

  const gameGuesses = Object.keys(guessMap || {});

  const ratingMap = (await ratings
    .orderByChild('game')
    .equalTo(id)
    .once('value')
  ).val();

  const gameRatings = Object.keys(ratingMap || {});

  return {
    ...game,
    id,
    guesses: gameGuesses.map(guessId => ({ id: guessId, ...guessMap[guessId] })),
    ratings: gameRatings.map(ratingId => ({ id: ratingId, ...ratingMap[ratingId] }))
  };
};
