const ms      = require('ms');
const addlib  = require('../addLib.js');

module.exports = {
    run: (bot,message,args,con)=> {try{


        if(!args[0] || !args[1]) return addlib.errors.notArgs(message)
        
        let option       = args[0];
        let time         = args[1];
        
        let prize;
        let winnerCount;
        if(!args[2]) {
            winnerCount  = 1;
            prize        = "Приз" ;
        } else
        if(!/^[0-9]{1,}$/g.test(args[2])) {
            winnerCount  = 1;
            prize        = args.slice(2).join(" ") || "Приз";
        } else {
            winnerCount  = args[2];
            if(winnerCount>200) return addlib.errors.falseArgs(message, "Где найти столько победителей?")
            prize        = args.slice(3).join(" ") || "Приз";
        }
    
        switch (option) {
            case "start":
                if(!ms(time)) return addlib.errors.falseArgs(message)
                bot.giveawayManager.start(message.channel, {
                    time: ms(time),
                    prize: prize,
                    winnerCount: winnerCount,
                });
            break;
    
            case "end":
                var messageId = args[1];
                bot.giveawayManager
                .delete(messageId)
                .catch(() =>
                    message.channel.send(`Никаких розыгрышей не найдено по этому ID: ${messageId}`)
                );
            break;

            case "help":
                return message.channel.send(con.defEmb.setTitle("Помощь по команде giveaway").setDescription("Сделать розыгрыш").setFooter(con.footer)
                .addField('Аргументы:',`**start <время> <количество победителей || 1> <подарок || "приз">** - Создаёт розыгрыш с выбранными параметрами\n**end** - Удаляет идущий розыгрыш`)
                .addField('Примеры:',`**e!giveaway start 1d 3 Discord Nitro** - Создаёт розыгрыш, продлящееся 1 день, с тремя победителями и призом будет "Discord Nitro" *(Можно писать больше 1 слова)*\n**e!giveaway start 1d** - Создаёт розыгрыш, продлящееся 1 день, с одним победителем и призом будет "Приз"\n**e!giveaway end 123123123123** - Закончит голосование с таким ID *(ВВОДИТЬ ТОЛЬКО ID)*`)
                .addField('Могут использовать:','Все без исключений',true)
                .addField('Последнее обновление:',`Версия 3.3.1`,true)
                )
    
            default:
                return addlib.errors.falseArgs(message);
        }
    }catch(err){console.log(err)}},
    cmd: ["giveaway"],
    desc: "Сделать розыгрыш",
    category: "Прочее"
}