import createPushCommand from './pushCommand';
import * as Commands from '../server/commands';

export default (commands, auth) => {
  const pushCommand = createPushCommand(commands, auth);

  return async (user) => {
    commands
      .push()
      .onDisconnect()
      .set({
        user: user.id,
        type: Commands.DISCONNECT_USER
      });

    await pushCommand({
      type: 'JOIN_USER',
      payload: user
    });
  };
};
