module.exports = {
    run: (bot,message,args,con)=> {try{
        message.delete();

        message.channel.send(con.defEmb.setTitle('Версия 3.2!')
        .addField('Что нового в обновлении?',`**e!sudo даёт мне ЕЩЁ больше прав!** Теперь я могу выполнять код прямо из сервера *а ты нет!*\n\n**Исправлен баг 102!** Да этот баг получил от меня имя!\n\n**Переработана уровневая система!** Причём полностью!\n\n**Теперь если при заходе на сервер у человека нет аватарки, то будет ставиться дефолтная!** Афигеть, я дошёл до этого!\n\n**Некоторые команды получили аргумент "help"**\n\n**Оптимизация кода** *Обожаю ||!*`)
        .addField('Если нашли ошибку, прошу сообщить мне!','Ждите новых обновлений! @ Лига "Синее Пламя"')
        )   
    }catch(err){console.log(err)}},
    cmd: ["ver","version"],
    desc: "Версия бота и что изменилось с последнего обновления",
    category: "Общее"
}