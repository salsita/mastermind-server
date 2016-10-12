import createPushCommand from './pushCommand';
import * as Commands from '../server/commands';

export default (commands, auth) => {
  const pushCommand = createPushCommand(commands, auth);

  return (turn, guess) => pushCommand({
    type: Commands.NEW_GUESS,
    payload: { turn, guess }
  });
};
