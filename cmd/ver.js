module.exports = {
    run: (bot,message,args,con)=> {try{
        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Тебе серьёзно нужна помощь по этой команде?").setDescription("Мне лень)").setFooter(con.footer))
        }

        message.delete();

        message.channel.send(con.defEmb.setTitle('Версия 3.3.0! (стабильная!)')
        .addField('Что нового в обновлении?',`**Ошибок пока что нет!** Это реально самое главное нововведение)\n\n**Убран XP за реакцию нового уровня!** Нестабильна работа и тд\n\n**Исправлены мелкие ошибки в e!clear и e!avatar!**\n\n**e!server, e!info, e!ver получили "заглушку" на аргумент help!** Раньше он был только на help...`)
        .addField('Если нашли ошибку, прошу сообщить мне!','Ждите новых обновлений! @ Лига "Синее Пламя"')
        )   
    }catch(err){console.log(err)}},
    cmd: ["ver","version"],
    desc: "Версия бота и что изменилось с последнего обновления",
    category: "Общее"
}