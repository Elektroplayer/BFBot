const addlib = require("../addLib.js");
module.exports = {
    run: (bot,message,args,con)=> {try{
        if(!args[0]) {
            return message.channel.send(con.defEmb.setTitle(`Вот твой аватар:`).setImage(message.author.avatarURL({ dynamic: true, size: 4096 })).setFooter(con.footer));
        } else if(args[0] == "help") {
            message.channel.send(con.defEmb.setTitle("Помощь по команде avatar").setDescription("Показать аватар").setFooter(con.footer)
            .addField('Аргументы:',`**<user || автор>** - Покажет аватар упомянутого пользователя *(Можно ввести ID или имя)*`)
            .addField('Примеры:',`**e!avatar** - Покажет твой аватар\n**e!avatar @user** - Покажет аватар упомянутого пользователя\n**e!avatar 111111123456789101** - Покажет аватар пользователя с таким ID\n**e!avatar UserName** - Покажет аватар пользователя с таким именем *(НЕ НИКОМ НА СЕРВЕРЕ)*`)
            .addField('Сокращения:',`**e!ava**`)
            .addField('Могут использовать:','Все без исключений',true)
            .addField('Последнее обновление:',`Версия 3.3.1`,true)
            )
        } else {
            let aUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.username == args[0]));
            if(!aUser) return addlib.errors.noUser(message);
            return message.channel.send(con.defEmb.setTitle(`Аватар пользователя ${aUser.user.username}:`).setImage(aUser.user.avatarURL({ dynamic: true, size: 4096 })).setFooter(con.footer));
        } 
    }catch(err){console.log(err)}},
    cmd: ["avatar","ava"],
    desc: "Показать аватар",
    category: "Прочее"
}