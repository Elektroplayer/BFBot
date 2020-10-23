const XP       = require('../models/xp.js');
//const discord  = require('discord.js');
module.exports = {
    run: (bot,message,args,con)=> {try{
        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Помощь по команде leaderboard").setDescription("Рейтинг по уровню").setFooter(con.footer)
            .addField('Аргументы:',`Нету`)
            .addField('Примеры:',`**e!leaderbard** - Покажет рейтинг`)
            .addField('Сокращения:',`**e!lb**`)
            .addField('Могут использовать:','Все без исключений',true)
            .addField('Последнее обновление:',`Версия 3.3.1`,true)
            )
        }

        XP.find({}).sort([['level', 'descending'], ['xp', 'descending']]).exec((err, res) => {
            if (err) console.log(err);
    
            let embed = con.defEmb.setTitle("Рейтинг:").setFooter(con.footer);
    
            if (res.length === 0) {
                embed.setColor("ff0000");
                embed.addField("Ничего не найдено", "Упс...")
            } else if (res.length < 9) {
    
                for (let i=0; i < res.length; i++) {
                    let member = message.guild.members.cache.get(res[i].userID) || "Нет на сервере"
                    if (member === "Нет на сервере") {
                        embed.addField(`${i + 1}. ${member}`, `**Уровень:** ${res[i].level}\n**XP:** ${res[i].xp}`,true);
                    } else {
                        embed.addField(`${i + 1}. ${member.nickname || member.user.username}`, `**Уровень:** ${res[i].level}\n**XP:** ${res[i].xp}`,true);
                    }
                }
                return message.channel.send(embed);
                
            } else {
    
                let ik = 9;
                let l = 0
                for (let i = 0; i < ik; i++) {
                    let member = message.guild.members.cache.get(res[i].userID) || "Нет на сервере"
                    if (member === "Нет на сервере") {
                        ik++
                        l++
                        continue;
                    } else {
                        embed.addField(`\u200b`, `**${i + 1 - l}. ${member.user.toString()}**\n**Уровень:** ${res[i].level}\n**XP:** ${res[i].xp}`,true);
                    }
                }

                message.channel.send(embed).then(async (msg)=> {
                    await msg.react('⏪');
                    await msg.react('⏩');

                    let count;
                    if(res.length%9!=0) count = (res.length - res.length%9)/9+1;
                    else count = res.length/9;
    
                    let countNow  = 0;

                    let filter = (reaction,user) => (reaction.emoji.name === '⏪' || reaction.emoji.name === '⏩') && user.id === message.author.id
                    let collector  = msg.createReactionCollector(filter,{idle:30000});
                    await collector.on('collect',(r) => {
                        msg.reactions.cache.get(r.emoji.name).users.remove(message.client.users.cache.get(message.author.id));

                        let one
                        if(r.emoji.name === '⏪') one = -1;
                        else one = 1;

                        if(countNow+one<=-1 || countNow+one>count-1) return;
                        countNow+=one;

                        embed.fields = []
                        l = 0
                        for (let i = 0; i < res.length-1; i++) {

                            let member = message.guild.members.cache.get(res[i].userID) || "Нет на сервере";
                            if (member === "Нет на сервере") {
                                l++
                                continue;
                            } else {
                                if(i-l<countNow*9) continue;
                                if(i-l>((countNow+1)*9)-1) break;
                                embed.addField(`\u200b`, `**${i + 1 - l}. ${member.user.toString()}**\n**Уровень:** ${res[i].level}\n**XP:** ${res[i].xp}`,true);
                            }
                        }

                        msg.edit(embed)
                    });
                    
                    collector.on('end', async () => {
                        try {
                            await msg.reactions.removeAll()
                        } catch (error) {console.log(error)}
                    })
                })
            }
        })
    }catch(err){console.log(err)}},
    cmd: ["leaderboard","lb"],
    desc: "Рейтинг по уровню",
    category: "Уровень"
}