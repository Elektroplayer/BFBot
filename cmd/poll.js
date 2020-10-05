const addlib = require('../addLib.js');
module.exports = {
    run: (bot,message,args,con)=> {
		if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Помощь по команде poll").setDescription("Создание голосований").setFooter(con.footer)
            .addField('Аргументы:',`**<@тема голосования>** - *Не обязательный аргумент!* Покажет тему голосования\n**ИЛИ**\n**+выбор 1 +выбор 2 ... +выбор 10** - создаст голосование между заданными элементами`)
            .addField('Примеры:',`**e!poll** - Создаст голосование с темой "?"\n**e!poll Пойти кушать?** -  Создаст голосование с темой "Пойти кушать?"\n**e!poll +Яишница +Омлет +Омлет с сосисками** - Создаст голосование с элементами "Яишница", "Омлет", "Омлет с сосисками"`)
            .addField('Могут использовать:','Все без исключений',true)
            .addField('Последнее обновление:',`Версия 3.2`,true)
            )
        }

        message.delete();
	
        let poll = args.join(" ");
        let emb = con.defEmb.setFooter(con.footer);
		if(!poll.includes("+")) {
			if(poll.length > 256) return addlib.errors.castom(message,'Нельзя писать тему длиннее 256 символов!');
			else if(!poll) return message.channel.send(emb.setTitle('?')).then(async msg => {await msg.react("✅"); msg.react("❎")});
			else return message.channel.send(emb.setTitle(poll)).then(async msg => {await msg.react("✅"); msg.react("❎")});
		}
	
		messageArray  = message.content.split("+");
		args          = messageArray.slice(1);
	
		if(!args[0]) return message.channel.send(emb.setTitle('?')).then(async msg => {await msg.react("✅"); msg.react("❎")});
		else if(args[0] && !args[1]) return message.channel.send(emb.setTitle(args[0])).then(async msg => {await msg.react("✅"); msg.react("❎")});
		else if(args[0] && args[1]) {
			poll = "";
			let i;
			let l=0;
			for(i=0;;i++) {
				if(i>=10) return addlib.errors.castom(message,"Разрешено не больше 10 вариантов!");;
				if(args[i]) {
					if(args[i].trim().length === 0) {l++;continue;}
					poll = poll + `${i+1-l}. ` + args[i].replace(/^\s+|\s+$/g, '') + "\n"
				} else break;
			}
	
			if(poll == "") return message.channel.send(emb.setTitle('?')).then(async msg => {await msg.react("✅"); msg.react("❎")});
	
			if(poll.length >= 256) return addlib.errors.castom(message,'Нельзя писать тему длиннее 256 символов!');
	
			let reactions = ["1️⃣", "2️⃣", "3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
			message.channel.send(emb.setTitle(poll)).then(async msg => {
				let i2 = 1
				while(i2<=i-l) {
					await msg.react(reactions[i2-1]);
					i2++
				}
			});
		}
    },
    cmd: "poll",
    desc: "Создание голосований",
    category: "Общее"
}