const store = require('./_store');
module.exports = async (req, res) => {
  try{
    const body = req.method === 'POST' ? req.body : {};
    const email = body.email || null;
    // check ban
    if(store.bans.find(b=>b.email === email)){ return res.status(403).json({error:'banned'}); }
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    const msg = { id, name: body.name || 'Guest', email, role: body.role || 'user', text: body.text || '', ts: new Date().toISOString(), deleted:false };
    store.messages.push(msg);
    // cap messages to 200
    if(store.messages.length>200) store.messages.shift();
    return res.status(200).json({ok:true, id});
  }catch(e){
    return res.status(500).json({error:'server'});
  }
};
