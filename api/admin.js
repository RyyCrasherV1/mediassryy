const store = require('./_store');
const OWNER = "ryyxiaoyan@gmail.com";
module.exports = async (req, res) => {
  try {
    const body = req.method === 'POST' ? req.body : {};
    const actor = body.email || null;
    const actorRole = body.role || 'user';
    if(!actor || (actorRole !== 'admin' && actorRole !== 'owner')) return res.status(403).json({error:'forbidden'});
    const action = body.action;
    const target = body.target;
    if(action === 'ban'){ store.bans.push({email:target, at: new Date().toISOString()}); return res.json({ok:true}); }
    if(action === 'delete_message'){ const m = store.messages.find(x=>x.id===target); if(m){ m.deleted = true; return res.json({ok:true}); } return res.json({error:'notfound'}); }
    if(action === 'clear'){ store.messages.forEach(m=>m.deleted=true); return res.json({ok:true}); }
    return res.json({error:'unknown'});
  } catch(e) { return res.status(500).json({error:'server'}); }
};
