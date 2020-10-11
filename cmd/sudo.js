const XP              = require('../models/xp.js');
const {MessageEmbed}  = require('discord.js');
const colors          = require('../colors.json');

module.exports = {
    run: (bot,message,args)=> {try{
        //message.delete();

        if(message.author.id != "283666032823107585") return message.channel.send(MessageEmbed().setColor(colors.red).setTitle('У тебя нет права суперпользователя!'));

        if(args[0] == "xp") {
            let user = message.mentions.users.first().id
            let num
            if(args[2]) num = Number(args[2])
            XP.findOne({userID: user}, (err, level) => {
                if(err) console.log(err)
                        
                if(!level) {
                    let xpAll = num || 0
                    let i=0
                    for(;;i++) {
                        if(Math.ceil(Math.sqrt(10000 + Math.pow(i, 2) * 300 * Math.pow(1.2, i)))>xpAll) break;
                        else xpAll-=Math.ceil(Math.sqrt(10000 + Math.pow(i, 2) * 300 * Math.pow(1.2, i)));
                    }

                    var newXP =  new XP({
                        userID: message.author.id,
                        level: i-1,
                        xp: xpAll
                    })

                    message.channel.send('Уровень пересобран!')
        
                    newXP.save().catch(err => console.log(err))
                } else {
                    let xpAll = 0
                    let i=0;
                    for(;i<=level.level;i++) {xpAll += Math.ceil(Math.sqrt(10000 + Math.pow(i, 2) * 300 * Math.pow(1.2, i)));}
                    xpAll+=level.xp

                    if(num) xpAll+=num

                    i=0
                    for(;;i++) {
                        if(Math.ceil(Math.sqrt(10000 + Math.pow(i, 2) * 300 * Math.pow(1.2, i)))>xpAll) break;
                        else xpAll-=Math.ceil(Math.sqrt(10000 + Math.pow(i, 2) * 300 * Math.pow(1.2, i)));
                    }

                    level.level = i-1
                    level.xp = xpAll

                    message.channel.send('Уровень пересобран!')
        
                    level.save().catch(err => console.log(err))
                }
            })
        }// else
        //if(args[0] == "eval") {
        //    message
        //}

    }catch(err){console.log(err)}},
    cmd: "sudo",
    desc: "Команда суперпользователя",
    category: "Элитное"
}