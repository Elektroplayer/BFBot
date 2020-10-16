const addlib = require('../addLib.js');
module.exports = {
    run: (bot,message,args,con)=> {try{
        let channel = message.channel
        let inMember = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.username == args[0]));
        if(!inMember) return addlib.errors.noUser(message);
        channel.send(`<@${inMember.id}>, сыграем в крестики нолики? (e!y или e!n)`).then(msg=>{
            let filter = (message) => (message.author.id == inMember.id)
            let collector  = channel.createMessageCollector(filter,{time:5000});
            collector.on('collect',(r) => {
                console.log(r.content)
                msg.edit()
            });
            
            collector.on('end', async (r) => {
                console.log(r);
                //try {
                //    await msg.reactions.removeAll()
                //} catch (error) {console.log(error)}
            })

        });
    }catch(err){console.log(err)}},
    cmd: ["tictactoe","tic-tac-toe"],
    desc: "Версия бота и что изменилось с последнего обновления",
    category: "Игры"
}