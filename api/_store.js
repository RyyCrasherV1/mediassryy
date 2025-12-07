// simple in-memory store for demo (module scope may persist on warm instances)
const store = { messages: [], bans: [] };
module.exports = store;
