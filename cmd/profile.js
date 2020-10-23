const Discord    = require("discord.js");
const strftime   = require("strftime").localizeByIdentifier('ru_RU');
const addlib     = require("../addLib.js");

module.exports = {
    run: (bot,message,args,con)=> {try{
        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Помощь по команде profile").setDescription("Информация о человеке").setFooter(con.footer)
            .addField('Аргументы:',`**<user || автор>** - Покажет информацию о пользователе *(Можно ввести ID или имя)*`)
            .addField('Примеры:',`**e!profile** - Покажет информацию о тебе\n**e!profile @user** -  Покажет информацию об упомянутом пользователе\n**e!profile 111111123456789101** - Покажет информацию о пользователе с таким ID\n**e!profile UserName** - Покажет информацию о пользователе с таким именем *(НЕ НИКОМ НА СЕРВЕРЕ)*`)
            .addField('Сокращения:',`**e!me**`)
            .addField('Могут использовать:','Все без исключений',true)
            .addField('Последнее обновление:',`Версия 3.3.1`,true)
            )
        }


        let argsUser
        if(!args[0]) argsUser = message.author
        else {
            argsUser = message.mentions.users.first() || message.guild.members.cache.find(m => m.user.username == args[0]) || message.guild.members.cache.get(args[0]) //
            if(!argsUser) return addlib.errors.noUser(message);
            argsUser = message.guild.member(argsUser).user;

            //argsUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(m => m = args[0])).user
            //if(!argsUser) return addlib.errors.noUser(message);
        }
    
        let day = 1000 * 60 * 60 * 24
        let date1 = new Date(message.createdTimestamp)
        let date2 = new Date(argsUser.createdTimestamp)
        let date3 = new Date(message.guild.member(argsUser).joinedTimestamp)
        let diff1 = Math.round(Math.abs((date1.getTime() - date2.getTime()) / day))
        let diff2 = Math.round(Math.abs((date1.getTime() - date3.getTime()) / day))
    
        let statuses = {online: `В сети`, idle: `Не активен`, dnd: `Не беспокоить`, offline: `Не в сети`}
        let game
        if(message.guild.presences.cache.get(argsUser.id)) game = `\`\`\`${statuses[message.guild.presences.cache.get(argsUser.id).status]}\`\`\``
        else return message.channel.send(con.defEmb.setTitle(argsUser.username).addField('Дата регистрации:', `${strftime('%B %d, %Y год в %H:%M', date2)}\n(${diff1} дней назад)`,true).addField('Подключился на сервер:', `${strftime('%B %d, %Y год в %H:%M', date3)}\n(${diff2} дней назад)`,true).addField(`ID:`,`${argsUser.id}`,true).addField(`Имеет статус:`, `\`\`\`${statuses[argsUser.presence.status]}\`\`\``).setThumbnail(argsUser.avatarURL()).setFooter(con.footer))
    
        if(game == `\`\`\`Не в сети\`\`\``) return message.channel.send(con.defEmb.setTitle(argsUser.username).addField('Дата регистрации:', `${strftime('%B %d, %Y год в %H:%M', date2)}\n(${diff1} дней назад)`,true).addField('Подключился на сервер:', `${strftime('%B %d, %Y год в %H:%M', date3)}\n(${diff2} дней назад)`,true).addField(`ID:`,`${argsUser.id}`,true).addField(`Имеет статус:`, `\`\`\`Не в сети\`\`\``).setThumbnail(argsUser.avatarURL()).setFooter(con.footer))
    
        let text = ``
        if(message.guild.presences.cache.get(argsUser.id).clientStatus.web) text = text + `Браузера\n`
        if(message.guild.presences.cache.get(argsUser.id).clientStatus.mobile) text = text + `Телефона\n`
        if(message.guild.presences.cache.get(argsUser.id).clientStatus.desktop) text = text + `Компьютера\n`
    
        text = `\`\`\`${text}\`\`\``
    
        let activit = message.guild.presences.cache.get(argsUser.id).activities
        let activ = ''
    
        for(let i=0;i<=activit.length-1;i++) {
            if (activit[i].type == 'CUSTOM_STATUS') {
                activ = activ + ` \`\`\`Кастомный статус: ${activit[i].state}\`\`\` `
            } else {
                activ = activ + ` \`\`\`Имя: ${activit[i].name}\n${activit[i].details}\n${activit[i].state}\`\`\` `
            }
        }
    
        if(activ == '') activ = '```Нет```'
    
        let profileEmbed = new Discord.MessageEmbed().setTitle(argsUser.username).setColor('#0000ff').addField('Дата регистрации:', `${strftime('%B %d, %Y год в %H:%M', date2)}\n(${diff1} дней назад)`,true).addField('Подключился на сервер:', `${strftime('%B %d, %Y год в %H:%M', date3)}\n(${diff2} дней назад)`,true).addField(`ID:`,`${argsUser.id}`,true)
        .addField(`Имеет статус:`, game)
        .addField(`Активен с`,text)
        .addField(`Активности:`, activ)
        .setThumbnail(argsUser.avatarURL())
        .setFooter(message.author.username +' | © Лига "Синее Пламя"');
        message.channel.send(profileEmbed)
    }catch(err){console.log(err)}},
    cmd: ["profile","me"],
    desc: "Информация о человеке",
    category: "Прочее"
}