import createPushCommand from './pushCommand';
import createWaitForAI from './waitForAI';
import * as Commands from '../server/commands';

export default (commands, auth, ratings, guesses, games) => {
  const pushCommand = createPushCommand(commands, auth);
  const waitForAI = createWaitForAI(ratings, guesses, games);

  return (guess) => {
    pushCommand({
      type: Commands.NEW_GUESS,
      payload: { guess }
    });

    return waitForAI();
  };
};
