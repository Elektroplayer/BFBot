const addlib = require('../addLib.js');
module.exports = {
    run: (bot,message,args,con)=> {try{
		message.delete();

		if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Помощь по команде create").setDescription("Создать голосовой канал").setFooter(con.footer)
            .addField('Аргументы:',`**name** - *Не обязательный аргумент!* Имя создаваемого канала`)
            .addField('Примеры:',`**e!create Дом Электрика** - Создаст канал с именем "Дом Электрика"\n**e!create** - Создаст канал с вашим ником`)
            .addField('Могут использовать:','Все без исключений',true)
            .addField('Последнее обновление:',`Версия 3.2`,true)
            )
        }

        let server = message.guild;
		let member = message.member;
        let name
        if(args.join(" ")) name  = `《🔊》${message.content.slice(8,message.content.length).replace(/^\s+|\s+$/g, '')}`;
        else name                = `《🔊》${member.user.username}`;
        
        if(server.channels.cache.find(n=>n.name === name)) return addlib.errors.castom(message,'Такой канал уже существует!')
		if(name.length>100) return addlib.errors.castom(message,'Слишком длинное имя канала');

		server.channels.create(`${name}`, {type: 'voice', parent: '449804617421946880'}).then(channel => {
			//member.voice.setChannel(channel);
			var intr = setInterval(()=>{
				if(channel.deleted) return clearInterval(intr)
				if(channel.members.size <= 0) {
					channel.delete();
					clearInterval(intr)
				}
			}, 5000)
		})
    }catch(err){console.log(err)}},
    cmd: "create",
    desc: "Создать голосовой канал",
    category: "Прочее"
}