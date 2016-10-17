import createPushCommand from './pushCommand';
import * as Commands from '../server/commands';

export default (commands, auth) => {
  const pushCommand = createPushCommand(commands, auth);

  return async () => {
    await pushCommand({
      type: Commands.DISCONNECT_USER
    });

    auth.signOut();
  };
};
