export default (ratings, guesses, games) => () => new Promise(async (res) => {
  const activeGames = (
    await games
      .orderByChild('over')
      .equalTo(false)
      .once('value')
  ).val();

  const gameId = Object.keys(activeGames)[0];
  const game = activeGames[gameId];
  const turn = game.turn;

  const ratingRef = ratings
    .orderByChild('game')
    .equalTo(gameId);

  const guessRef = guesses
    .orderByChild('game')
    .equalTo(gameId);

  let rating;
  let guess;

  const onRatingAdded = (rec) => {
    const val = rec.val();
    if (val.turn === turn) {
      ratingRef.off('child_added', onRatingAdded);
      rating = {
        ...val,
        id: rec.key
      };

      if (rating && guess) {
        res({ rating, guess });
      }
    }
  };

  const onGuessAdded = (rec) => {
    const val = rec.val();
    if (val.turn === turn) {
      guessRef.off('child_added', onGuessAdded);
      guess = {
        ...val,
        id: rec.key
      };

      if (rating && guess) {
        res({ rating, guess });
      }
    }
  };

  ratingRef.on('child_added', onRatingAdded);
  guessRef.on('child_added', onGuessAdded);
});
