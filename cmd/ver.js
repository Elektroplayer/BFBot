module.exports = {
    run: (bot,message,args,con)=> {try{
        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Тебе серьёзно нужна помощь по этой команде?").setDescription("Мне лень)").setFooter(con.footer))
        }

        message.delete();

        message.channel.send(con.defEmb.setTitle('Версия 3.4.0! (стабильная!)')
        .addField('Что нового в обновлении?',`**e!give больше нет!** Да я просто его временно снёс...\n\n**Оптимизирован e!poll** Спиздил из Eclipse\n\n`)
        .addField('Если нашли ошибку, прошу сообщить мне!','Ждите новых обновлений! @ Лига "Синее Пламя"')
        )   
    }catch(err){console.log(err)}},
    cmd: ["ver","version"],
    desc: "Версия бота и что изменилось с последнего обновления",
    category: "Общее"
}