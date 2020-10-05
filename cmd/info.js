module.exports = {
    run: (bot,message,args,con)=> {try{
        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Помощь по команде info").setDescription("Информация о боте").setFooter(con.footer)
            .addField('Аргументы:',`Нету`)
            .addField('Примеры:',`**e!info** - Покажет информация о боте`)
            .addField('Могут использовать:','Все без исключений',true)
            .addField('Последнее обновление:',`Версия 3.2`,true)
            )
        }

        let botembed = con.defEmb
        .setTitle("Информация о боте!")
        .setThumbnail(bot.user.displayAvatarURL)
        .addField(`Описание:`, `Я **Синее пламя** зажжённое **Electroplayer'ом**, что бы помогать всем на этом сервере. Что бы начать со мной работать, нужно написать **e!?**. Появится список того, что я могу. Приятного пользования)`)
        .setFooter(con.footer)
        message.channel.send(botembed);
    }catch(err){console.log(err)}},
    cmd: "info",
    desc: "Информация о боте",
    category: "Общее"
}