const XP       = require('../models/xp.js');
const discord  = require('discord.js');
module.exports = {
    run: (bot,message,args,con)=> {try{
        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Помощь по команде leaderboard").setDescription("Рейтинг по уровню").setFooter(con.footer)
            .addField('Аргументы:',`Нету`)
            .addField('Примеры:',`**e!leaderbard** - Покажет рейтинг\n**e!lb** - Тоже покажет рейтинг`)
            .addField('Могут использовать:','Все без исключений',true)
            .addField('Последнее обновление:',`Версия 3.2`,true)
            )
        }

        XP.find({}).sort([['level', 'descending'], ['xp', 'descending']]).exec((err, res) => {
            if (err) console.log(err);
    
            let embed = con.defEmb.setTitle("Рейтинг:").setFooter(con.footer);
    
            if (res.length === 0) {
                embed.setColor("ff0000");
                embed.addField("Ничего не найдено", "Упс...")
            } else if (res.length < 10) {
    
                for (i=0; i < res.length; i++) {
                    let member = message.guild.members.cache.get(res[i].userID) || "Нет на сервере"
                    if (member === "Нет на сервере") {
                        embed.addField(`${i + 1}. ${member}`, `**Уровень:** ${res[i].level}\n**XP:** ${res[i].xp}`,true);
                    } else {
                        embed.addField(`${i + 1}. ${member.nickname || member.user.username}`, `**Уровень:** ${res[i].level}\n**XP:** ${res[i].xp}`,true);
                    }
                }
                
            } else {
    
                ik = 10;
                l = 0
                for (i = 0; i < ik; i++) {
                    let member = message.guild.members.cache.get(res[i].userID) || "Нет на сервере"
                    if (member === "Нет на сервере") {
                        ik++
                        l++
                        continue;
                    } else {
                        if(i + 1 - l == 10) embed.addField('\u200b', '\u200b',true)
                        embed.addField(`${i + 1 - l}. ${member.nickname || member.user.username}`, `**Уровень:** ${res[i].level}\n**XP:** ${res[i].xp}`,true);
                        if(i + 1 - l == 10) embed.addField('\u200b', '\u200b',true)
                    }
                }
    
            }
    
            message.channel.send(embed);
        })
    }catch(err){console.log(err)}},
    cmd: ["leaderboard","lb"],
    desc: "Рейтинг по уровню",
    category: "Уровень"
}