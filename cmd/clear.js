const addlib = require("../addLib.js");
module.exports = {
    run: async (bot,message,args,con)=> {try{
        await message.delete();

        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Помощь по команде clear").setDescription("Очистка сообщений").setFooter(con.footer)
            .addField('Аргументы:',`**<count>** - Удалит заданное количество сообщений`)
            .addField('Примеры:',`**e!clear 10** - Удалит 10 сообщений`)
            .addField('Сокращения:',`**e!clean**`)
            .addField('Могут использовать:','Серверная элита',true)
            .addField('Последнее обновление:',`Версия 3.3.1`,true)
            )
        }

        if(!args[0]) return addlib.errors.notArgs(message);
        if(!/^[0-9]{1,}$/g.test(args[0]) || args[0] == "0") return addlib.errors.falseArgs(message, "Можно вводить только цифры, большие 0!");
        let ok = false;
        for(let i=0;i<=con.moderators.length-1;i++) {if(message.member.roles.cache.has(con.moderators[i])) ok = true;}
        if(!ok) return addlib.errors.notPerms(message);

        message.channel.bulkDelete(args[0],true).then(() => {
            addlib.errors.success(`Очищено ${args[0]} сообщений.`);
            //message.channel.send(con.defEmb.setColor('#00ff00').setTitle(`Очищено ${args[0]} сообщений.`)).then(msg => msg.delete({timeout:5000}));
        });
    }catch(err){console.log(err)}},
    cmd: ["clear","clean"],
    desc: "Очистка сообщений",
    category: "Элитное"
}