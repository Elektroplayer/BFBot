module.exports = {
    run: (bot,message,args,con)=> {try{
        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Тебе серьёзно нужна помощь по этой команде?").setDescription("Мне лень)").setFooter(con.footer))
        }

        message.delete();

        message.channel.send(con.defEmb.setTitle('Версия 3.5.0! (стабильная!)')
        .addField('Что нового в обновлении?',`**Всё возвращено к тому, что было,** и исправлены мелкие бажики)`)
        .addField('Если нашли ошибку, прошу сообщить мне!','Ждите новых обновлений! @ Лига "Синее Пламя"')
        )   
    }catch(err){console.log(err)}},
    cmd: ["ver","version"],
    desc: "Версия бота и что изменилось с последнего обновления",
    category: "Общее"
}
//  Тряляля