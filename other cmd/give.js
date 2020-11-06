const addlib  = require('../addLib.js');
const discord = require('discord.js');
const XP      = require('../models/xp.js');

module.exports = {
    run: async (bot,message,args,con)=> {try{

        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Помощь по команде give").setDescription("Передать свой уровень другому человеку").setFooter(con.footer)
            .addField('Аргументы:',`**<имя получателя> <количество денег>** - Передаст данному человеку указанную сумму`)
            .addField('Примеры:',`**e!give @user 100** - Передаст 100xp человеку @user\n**e!give <представь\\_что\\_тут\\_ID> 100** - Передаст 100xp человеку с ID <представь\\_что\\_тут\\_тот\\_же\\_ID>`)
            .addField('Могут использовать:','Все без исключений',true)
            .addField('Последнее обновление:',`Версия 3.3.1`,true)
            )
        }

        if(!args[0] || !args[1]) return addlib.errors.notArgs(message);

        let inUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.username == args[0]));
        if(!inUser) return addlib.errors.noUser(message);
        inUser      = inUser.id;
        let outUser = message.author.id;

        let filter = {userID : {$in : [inUser, outUser]}}
        XP.find(filter,(err,res)=> {
            if(err) console.log(err)
            console.log(res)
        })

    }catch(err){console.log(err)}},
    cmd: "give",
    desc: "Передать свой уровень другому человеку",
    category: "Уровень"
}