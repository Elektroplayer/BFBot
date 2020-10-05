const addlib   = require('../addLib.js');

function getRandomInRange(first, second) {
    let min,max
    if(first>second) {
        min = second;
        max = first;
    } else {
        min = first;
        max = second;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    run: (bot,message,args,con)=> {try{
        if(!args[0]) return addlib.errors.notArgs(message,'Введи аргумент help для подробностей!');
        else if(args[0] == "help") {
            message.channel.send(con.defEmb.setTitle("Помощь по команде random").setDescription("Рандомайзер").setFooter(con.footer)
            .addField('Аргументы:',`**word** - Следующими аргументами должен быть список слов из которых нужно выбрать 1\n**number** - {\n  Следующим аргументом должно быть число, от 0 до которого нужно выдать рандомное число\n  Следующим аргументом должно быть два числа от которого и до которого нужно придумать рандомное\n}\n**user** - Рандомный человек с нашего сервера\n\n`)
            .addField('Могут использовать:','Все без исключений')
            .addField('Послденее обновление:',`Версия 3.1`)
            )
        }
        else if(args[0] == "word") {
            console.log(args)
            if(!args[1] || !args[2]) return addlib.errors.notArgs(message,"А из чего выбирать?")
            message.channel.send(con.defEmb.setTitle(`${args[(Math.floor( Math.random() * (args.length-1) )+1)]}`))
        }
        else if(args[0] == "number") {
            if(!args[1]) return addlib.errors.notArgs(message,"А из чего выбирать?");

            if(args[1] && !args[2]) {
                if(!/^[0-9]{1,}$/g.test(args[1])) return addlib.errors.falseArgs(message, "Разрешены только числа!")
                if(args[1]>999999) return addlib.errors.falseArgs(message, "Число не должно быть больше 999999")
                return message.channel.send(con.defEmb.setTitle(`${Math.floor(Math.random() * args[1])}`))
            }
            else if(args[1] && args[2]) {
                if(!/^[0-9]{1,}$/g.test(args[1])||!/^[0-9]{1,}$/g.test(args[2])) return addlib.errors.falseArgs(message, "Разрешены только числа!")
                if(args[1]>999999||args[2]>999999) return addlib.errors.falseArgs(message, "Число не должно быть больше 999999");
                if(args[1]==args[2]) return message.channel.send(con.defEmb.setTitle(`${args[1]}`))
                return message.channel.send(con.defEmb.setTitle(`${getRandomInRange(Number(args[1]), Number(args[2]))}`))
            } else return addlib.errors.unknow(message);
        }
        else if(args[0] == "user") {
            return message.channel.send(con.defEmb.setTitle(`${message.guild.members.cache.random().user.username}`))

            //return message.channel.send(con.defEmb.setTitle(`${Array.from(message.guild.members.cache)[Math.floor(Math.random()*(message.guild.members.cache.size))+1][1].user.username}`))  //  Если функция рандома будет убрана
        }
    }catch(err){console.log(err)}},
    cmd: "random",
    desc: "Рандомайзер",
    category: "Прочее"
}