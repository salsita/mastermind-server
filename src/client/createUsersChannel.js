export const USER_HAS_JOINED = 'USER_HAS_JOINED';
export const USER_HAS_DISCONNECTED = 'USER_HAS_DISCONNECTED';

export default (users, eventChannel) => () => eventChannel((emitter) => {
  const ref = users
    .orderByChild('activeConnections')
    .startAt(1);

  const onAdded = rec =>
    emitter({ type: USER_HAS_JOINED, user: { ...rec.val(), id: rec.key } });
  const onRemoved = rec =>
    emitter({ type: USER_HAS_DISCONNECTED, user: { ...rec.val(), id: rec.key } });

  ref.on('child_added', onAdded);
  ref.on('child_removed', onRemoved);

  return () => {
    ref.off('child_added', onAdded);
    ref.off('child_removed', onRemoved);
  };
});
