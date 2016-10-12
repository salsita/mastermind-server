export default (commands, auth) => command => new Promise((res) => {
  const ref = commands.push();

  const done = (removedChild) => {
    if (removedChild.key === ref.key) {
      commands.off('child_removed', done);
      res();
    }
  };

  commands.on('child_removed', done);

  ref.set({
    ...command,
    user: auth.currentUser.uid
  });
});
