import { sortBy, take } from 'lodash';

export default (games, users) => async (limit) => {
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

    return {
      ...game,
      user: {
        ...user,
        id: game.user
      }
    };
  }));
};
