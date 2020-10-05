const addlib = require('../addLib.js');
module.exports = {
    run: (bot,message,args,con)=> {
        if(!args[0]) return addlib.errors.notArgs(message,'Введи аргумент help, для помощи по этой команде');
        if(args[0] == "help") return message.channel.send(con.defEmb.setTitle('Помощь по команде "settings"'))
    },
    cmd: "settings",
    desc: "Настройки бота",
    category: "Общее"
}