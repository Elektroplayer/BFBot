const discord   = require("discord.js");
//const {err}     = require("../framework.js");
const addlib    = require('../addLib.js');
const strftime  = require('strftime');

module.exports = {
    run: (bot,message,args,con)=> {try{
        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Помощь по команде report").setDescription("Отправка жалобы на человека").setFooter(con.footer)
            .addField('Аргументы:',`**<user> <причина>** - Создаст репорт на человека по заданной причине`)
            .addField('Примеры:',`**e!report @Electroplayer Собака, допустил ошибку в тексте** - Отправит репорт на ~~меня~~ Electroplayer по причине "Собака, допустил ошибку в тексте"`)
            .addField('Могут использовать:','Все без исключений',true)
            .addField('Последнее обновление:',`Версия 3.3.1`,true)
            )
        }

        message.delete();
    
        if(!args[0]) return addlib.errors.notArgs(message,"Нету имени!");
        if(!args[1]) return addlib.errors.notArgs(message,"Нету причины");
    
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.username == args[0]));
        if(!rUser) return addlib.errors.noUser(message);
        let reason = args.join(" ").slice(22);
        if(!reason) return addlib.errors.notArgs(message,"Нету причины");
    
        message.channel.send(new discord.MessageEmbed().setColor('#00ff00').setTitle("Жалоба успешно отправлена!")).then(msg=>msg.delete({timeout:5000}))
    
        let emb = con.defEmb.setTitle("Жалоба").addField("Отправитель:",`${message.author}\nID: "${message.author.id}"`,true)
        .addField("Нарушитель:",`${rUser}\nID: "${rUser.id}"`,true)
        .addField('\u200b','\u200b',true)
        .addField("Канал:",`<#${message.channel.id}>`,true)
        .addField("Время:",strftime("%B %d, %H:%M", new Date(message.createdAt)),true)
        .addField("Причина:",reason)
        .setFooter(con.footer);

        message.guild.channels.cache.get(con.logchannel).send(emb);
        message.guild.owner.send(emb);
    }catch(err){console.log(err)}},
    cmd: "report",
    desc: "Отправка жалобы на человека",
    category: "Элитное"
}