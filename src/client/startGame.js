import createPushCommand from './pushCommand';
import * as Commands from '../server/commands';

export default (commands, auth) => {
  const pushCommand = createPushCommand(commands, auth);

  return () => pushCommand({
    type: Commands.START_GAME
  });
};
