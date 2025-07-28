
function signal() {
  const user = new Map();
  const subscribers = new Set();

  const setuser = (socketid, userid) => {
    user.set(socketid, userid);
  };

  const getalluser = () => {
    return Array.from(user, ([socketid, userid]) => ({ socketid, userid }));
  };

  const deleteuser = (socketid) => {
    user.delete(socketid);
  };

  const subscribe = (fn) => {
    subscribers.add(fn);
    fn(user);
    return () => subscribers.delete(fn);

  }
  const notify = () => {
    subscribers.forEach((fn) => fn(user));
  };


  return {
    setuser,
    getalluser,
    deleteuser,
    subscribe,
    notify
  }
}
export default signal;
