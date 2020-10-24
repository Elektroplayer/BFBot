const addlib  = require('../addLib.js');
const discord = require('discord.js');
const XP      = require('../models/xp.js');

module.exports = {
    run: (bot,message,args,con)=> {try{

        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Помощь по команде give").setDescription("Передать свой уровень другому человеку").setFooter(con.footer)
            .addField('Аргументы:',`**<имя получателя> <количество денег>** - Передаст данному человеку указанную сумму`)
            .addField('Примеры:',`**e!give @user 100** - Передаст 100xp человеку @user\n**e!give <представь\\_что\\_тут\\_ID> 100** - Передаст 100xp человеку с ID <представь\\_что\\_тут\\_тот\\_же\\_ID>`)
            .addField('Могут использовать:','Все без исключений',true)
            .addField('Последнее обновление:',`Версия 3.3.1`,true)
            )
        }

        if(!args[0]||!args[1]) return addlib.errors.notArgs(message)

        let inUser = message.mentions.users.first() || message.guild.members.cache.find(m => m.user.username == args[0]) || message.guild.members.cache.get(args[0]) //
        if(!inUser) return addlib.errors.noUser(message);
        inUser = message.guild.member(inUser).id;

        let outUser = message.author.id;
        
        if(!/^[0-9]{1,}$/g.test(args[1])) return addlib.errors.falseArgs(message,'Нужны только цифры!');
        let num = Number(args[1]);
        if(num<=0) return addlib.errors.falseArgs(message,`Число может быть только положительным!`);
        
        XP.findOne({userID: outUser}, (err, level) => {
            if(err) console.log(err);
                    
            if(!level) {
                return addlib.errors.castom(message,"Мало XP!");
            } else {
                let xpAll = 0;
                let i=0;
                for(;i<=level.level;i++) {xpAll += (Math.floor(i/2)+1);}
                xpAll+=level.xp-num;
                
                if(xpAll<0) return addlib.errors.castom(message,"Мало XP!");

                i=0;
                for(;;i++) {
                    if((Math.floor(i/2)+1)>xpAll) break;
                    else xpAll-=(Math.floor(i/2)+1);
                }

                level.level = i-1;
                level.xp = xpAll;
    
                level.save().catch(err => console.log(err));
            }
        })

        XP.findOne({userID: inUser}, (err, level) => {
            if(err) console.log(err);
                    
            if(!level) {
                let xpAll = num;
                let i=0;
                for(;;i++) {
                    if((Math.floor(i/2)+1)>xpAll) break;
                    else xpAll-=(Math.floor(i/2)+1);
                }

                var newXP =  new XP({
                    userID: message.author.id,
                    level: i-1,
                    xp: xpAll
                })

                message.channel.send(new discord.MessageEmbed().setColor('00ff00').setTitle(`${num}XP был успешно переведён ${message.guild.cache.get(inUser)}!`).setFoote(con.footer))
                //addlib.errors.success(message,`XP был успешно переведён ${message.guild.cache.get(inUser)}!`)
    
                newXP.save().catch(err => console.log(err))
            } else {
                let xpAll = 0
                let i=0;
                for(;i<=level.level;i++) {xpAll += (Math.floor(i/2)+1);}
                xpAll+=level.xp+num

                i=0
                for(;;i++) {
                    if((Math.floor(i/2)+1)>xpAll) break;
                    else xpAll-=(Math.floor(i/2)+1);
                }

                level.level = i-1
                level.xp = xpAll

                message.channel.send(new discord.MessageEmbed().setColor('00ff00').setTitle(`Транзакция в ${num}XP была успешно завершена!`).setDescription(`Получатель: ${message.guild.members.cache.get(inUser)}`).setFooter(con.footer))
    
                level.save().catch(err => console.log(err))
            }
        })
    }catch(err){console.log(err)}},
    cmd: "give",
    desc: "Передать свой уровень другому человеку",
    category: "Уровень"
}