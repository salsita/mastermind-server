export default (games, auth) => async () => {
  const activeGames = (await games
    .orderByChild('over')
    .equalTo(false)
    .once('value')
  ).val();

  return activeGames && Object
    .keys(activeGames)
    .some(gameId => activeGames[gameId].user === auth.currentUser.uid);
};
