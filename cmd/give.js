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

        if(!args[0]||!args[1]) return addlib.errors.notArgs(message)

        let inUser = message.mentions.users.first() || message.guild.members.cache.find(m => m.user.username == args[0]) || message.guild.members.cache.get(args[0]) //
        if(!inUser) return addlib.errors.noUser(message);
        inUser = message.guild.member(inUser).id;

        let outUser = message.author.id;
        
        if(!/^[0-9]{1,}$/g.test(args[1])) return addlib.errors.falseArgs(message,'Нужны только цифры!');
        let num = Number(args[1]);
        if(num<=0) return addlib.errors.falseArgs(message,`Число может быть только положительным!`);

        let ok = true;
        
        XP.findOne({userID: outUser}, (err, level) => {
            if(err) console.log(err);
                    
            if(!level) {
                return ok = !ok
            } else {
                let xpAll = 0;
                let i=0;
                for(;i<=level.level;i++) {xpAll += 400+(120*i*2.5);}
                xpAll+=level.xp-num;

                console.log(xpAll)
                
                if(xpAll<0) return ok = !ok

                i=0;
                for(;;i++) {
                    if(400+(120*i*2.5)>xpAll) break;
                    else xpAll-=400+(120*i*2.5);
                }

                console.log(`${i-1}, ${xpAll}`)

                level.level = i-1;
                level.xp = xpAll;
    
                level.save().catch(err => console.log(err));
            }

            if(!ok) return addlib.errors.castom(message,"Мало XP!");

            XP.findOne({userID: inUser}, (err, level) => {
                if(err) console.log(err);
                        
                if(!level) {
                    let xpAll = num;
                    let i=0;
                    for(;;i++) {
                        console.log(i)
                        if(400+(120*i*2.5)>xpAll) break;
                        else xpAll-= 400+(120*i*2.5);
                    }

                    console.log(`${i-1}, ${xpAll}`)

                    var newXP = new XP({
                        userID: inUser,
                        level: i,
                        xp: xpAll
                    })

                    newXP.save().catch(err => console.log(err))

                    message.channel.send(new discord.MessageEmbed().setColor('00ff00').setTitle(`Транзакция в ${num}XP была успешно завершена!`).setDescription(`Получатель: ${message.guild.members.cache.get(inUser)}`).setFooter(con.footer))
                    //addlib.errors.success(message,`XP был успешно переведён ${message.guild.cache.get(inUser)}!`)
                } else {
                    let xpAll = 0
                    let i=0;
                    for(;i<=level.level;i++) {xpAll += 400+(120*i*2.5);}
                    xpAll+=level.xp+num

                    i=0
                    for(;;i++) {
                        if(400+(120*i*2.5)>xpAll) break;
                        else xpAll-=400+(120*i*2.5);
                    }

                    console.log(`${i-1}, ${xpAll}`)

                    level.level = i-1
                    level.xp = xpAll

                    level.save().catch(err => console.log(err))

                    message.channel.send(new discord.MessageEmbed().setColor('00ff00').setTitle(`Транзакция в ${num}XP была успешно завершена!`).setDescription(`Получатель: ${message.guild.members.cache.get(inUser)}`).setFooter(con.footer))
                }
            })
        })
    }catch(err){console.log(err)}},
    cmd: "give",
    desc: "Передать свой уровень другому человеку",
    category: "Уровень"
}