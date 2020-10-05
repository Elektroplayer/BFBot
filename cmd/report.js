const discord   = require("discord.js");
//const {err}     = require("../framework.js");
const addlib    = require('../addLib.js');
const strftime  = require('strftime');

module.exports = {
    run: (bot,message,args,con)=> {try{
        message.delete();
    
        if(!args[0]) return addlib.errors.notArgs(message,"Нету имени!");
        if(!args[1]) return addlib.errors.notArgs(message,"Нету причины");
    
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(m => m.name === args[0]));
        if(!rUser) return addlib.errors.noUser(message);
        let reason = args.join(" ").slice(22);
        if(!reason) return addlib.errors.notArgs(message,"Нету причины");
    
        message.channel.send(new discord.MessageEmbed().setColor('#00ff00').setTitle("Жалоба успешно отправлена!")).then(msg=>msg.delete({timeout:5000}))
    
        let emb = {
            "embed": {
                "color": 16711680,
                "fields": [
                    {
                        "name": "Отправитель:",
                        "value": `${message.author}\nID: "${message.author.id}"`,
                        "inline": true
                    },
                    {
                        "name": "Нарушитель:",
                        "inline": true,
                        "value": `${rUser}\nID: "${rUser.id}"`
                    },
                    {
                        "name": '\u200b',
                        "value": '\u200b',
                        "inline": true
                    },
                    {
                        "name": "Канал:",
                        "value": `<#${message.channel.id}>`,
                        "inline": true
                    },
                    {
                        "name": "Время:",
                        "value": strftime("%B %d, %H:%M", new Date(message.createdAt)),
                        "inline": true
                    },
                    {
                        "name": "Причина:",
                        "value": reason
                    }
                ],
                "title": "Жалоба",
                "footer": con.footer
            }
        }
        message.guild.channels.cache.get(con.logchannel).send(emb);
        message.guild.owner.send(emb);
    }catch(err){console.log(err)}},
    cmd: "report",
    desc: "Отправка жалобы на человека",
    category: "Элитное"
}