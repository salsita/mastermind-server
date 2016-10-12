export default games => async () => {
  const activeGames = (await games
    .orderByChild('over')
    .equalTo(false)
    .once('value')
  );

  return !!activeGames.val();
};
