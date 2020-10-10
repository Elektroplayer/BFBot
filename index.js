/*
Задания:
1. Может пора подключать настройки к БД? А?
2. Нужно пересмотреть report.js.
Код давно не обновлялся, я думаю, работать будет, но нужно перепроверить и оптимизировать с новыми знаниями
*/

//  Подключаем библиотеки!
const discord   = require('discord.js');
const mongoose  = require('mongoose'); //  Пока что не нужно
const strftime  = require('strftime').localizeByIdentifier('ru_RU'); //  И сразу локализуем
const fs        = require('fs');
//const addlib    = require('./addLib.js'); //  Моя собственная разработка)

const CONFIG = require('./config.json'); //  Подключаем конфиг
//const SETTINGS = require('./settings.js'); //  Подключаем настройки
const XP     = require('./models/xp.js'); //  Подключаем уровень

bot = new discord.Client(); //  Создаём клиента
bot.login(CONFIG.token); //  И логиним его из конфига
bot.commands = new discord.Collection(); // Тут будут храниться команды
mongoose.connect(CONFIG.mongoToken, {useNewUrlParser: true, useUnifiedTopology: true}); //  Логиним mongoose из конфига

class dynamicTimer {  //  Динамический таймер! Не моя разработка, но я довёл её до ума. В прошлом она не работала
    constructor(func, delay) {
        this.callback = func
        this.triggerTime = +new Date + delay
        this.timer = 0
        this.updateTimer()
    }
    
    updateTimer() {
        clearTimeout(this.timer)
        let delay = this.triggerTime - new Date
        this.timer = setTimeout(this.callback, delay)
        return this
    }
  
    addTime(delay) {
        this.triggerTime += delay
        this.updateTimer()
        return this
    }
    
    getTime() {
        return this.triggerTime - new Date
	}
}

let allSettings = {
    "logChannel": "449903789932150785",
    "autorole": "737674609767350322",
    "wellcomeChannel": "449903789932150785"
}

/*
let statuses = { //  Задаём все статусы // Не используется!
    "list": [
        {
            "name": "аниме | e!? - Помощь",
            "type": "WATCHING"
        }
    ],
    "timeout": 15000
}
*/

let logSettings = {
    enabled: true,
    logs: {
        enabled: true,
        channel: allSettings.logChannel,
        ownerDirectMessage: true
    },
    exceptions: {
        roles: [],
        channels: [],
        members: []
    }
}

let xpExceptions = ['449905287655194624'];
let timers  = {} //  Кулдауны людей
let color   = '#0000ff'; //  Задаём цвет
let prefix  = 'e!'; //  Префикс
let cmds    = []; //  Массив с командами (нужен в help.js)

//  По готовности
bot.on('ready', () => {
    console.log('Ready!'); //  Говорим о готовности
    
    bot.user.setActivity("аниме | e!? - Помощь", {type: "WATCHING"}); // Выставляем активность

    /*
    //  У меня всего лишь 1 статус, но если их будет будет больше, этот код мне поможет
    let i=0; //  И изменяем активность по заданным статусам
	setInterval(()=>{
		if(i> statuses.list.length-1) i=0;
		if(typeof statuses.list[i]["name"]=='object') bot.user.setActivity(statuses.list[i]["name"][Math.floor(Math.random() * statuses.list[i]["name"].length)], {type: statuses.list[i].type});
		else bot.user.setActivity(statuses.list[i]["name"], {type: statuses.list[i].type});
		i++;
    },statuses.timeout);
    */
});

//  Загрузка команд из директории /cmd
fs.readdir("./cmd/", (err, files) => {
	if(err) console.log(err);
	let jsfile = files.filter(f => f.split(".").pop() === "js");
	if(jsfile.length <= 0){
		console.log("Не могу найти команды!");
		return;
	}

	jsfile.forEach((f, i) =>{
		let props = require(`./cmd/${f}`);
		console.log(`${f} загружен!`);
		if(typeof props.cmd == 'string') bot.commands.set(`${props.cmd}`, props);
		else if(typeof props.cmd == 'object') {
			for(i2=0;i2<=props.cmd.length-1;i2++) {
				bot.commands.set(props.cmd[i2], props);
			}
        }
        cmds.push({"cmd":props.cmd,"desc":props.desc,"category":props.category})
	});
});

// Просмотр ВСЕХ евентов (да читы, а хотя нет, раз это есть в официальной библеотеке, то это тоже самое, что не пользоваться имбалансным спелом))) )
bot.on('raw', async (event) => { try {
    
    if ((event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE") && event.d.emoji.name == '🆙') { // Выдача xp за реакцию
        let message = await bot.guilds.cache.get(event.d.guild_id).channels.cache.get(event.d.channel_id).messages.fetch(event.d.message_id)

        if(!Boolean(message.reactions.cache.get('🆙').users.cache.get(bot.user.id))) return;

        xpAdd = 50;
        if (event.t === "MESSAGE_REACTION_REMOVE") xpAdd=-xpAdd;

        XP.findOne({userID:event.d.user_id}, (err, level) => {
            if(err) console.log(err);

            if(!level) {
                var newXP =  new XP({
                    userID: message.author.id,
                    level: 0,
                    xp: xpAdd
                })
    
                newXP.save().catch(err => console.log(err))
            } else {
                level.xp   = level.xp + xpAdd
                level.save().catch(err => console.log(err))
            }
        })
        
	} else if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE") { // Роли по реакции
		if(event.d.message_id == '738369557961506886' && event.d.user_id != bot.user.id) {
			let guild      = bot.guilds.cache.get(event.d.guild_id);
			let member     = guild.members.cache.get(event.d.user_id);
			let emoji      = event.d.emoji.name;
			let reactions  = ["⬛", "⬜", "🟧","🟦","🟥","🟫","🟩","🟨","9️⃣","🔟"];
			let roles      = ['561961792830439426','738376044729597952','451994597112152074','451994596197531659', '458191962839711754','688328058796900385','451994592271663116','565557833639264257','451994600379383820','451994599448248321'];
			for(i=0;i<=roles.length-1;i++) {
				if(emoji == reactions[i]) {
					if (event.t === "MESSAGE_REACTION_ADD") member.roles.add(guild.roles.cache.get(roles[i])).catch(console.error);
					else member.roles.remove(guild.roles.cache.get(roles[i])).catch(console.error);
				}
			}
		}
	} else if(event.t === 'VOICE_STATE_UPDATE' && event.d.channel_id === '740524137981804664') { // Создание приваток
		let server = bot.guilds.cache.get(event.d.guild_id);
		let member = server.members.cache.get(event.d.user_id);
		let name   = `《🔊》${member.user.username}`;
		
		if(server.channels.cache.find(n=>n.name === name)) {
			return member.voice.setChannel(server.channels.find(n=>n.name === name).id)
		}

		server.channels.create(`${name}`, {type: 'voice', parent: '449804617421946880'}).then(channel => {
			member.voice.setChannel(channel);
			var intr = setInterval(()=>{
				if(channel.deleted) return clearInterval(intr)
				if(channel.members.size <= 0) {
					channel.delete();
					clearInterval(intr)
				}
			}, 5000)
		})
	} else return;
}catch(err){console.log(err)}})

//  Уровневая система
bot.on('message', async (message)=>{try{
    if(message.author.bot) return; //  Не слушаем других ботов
    if(message.channel.type == 'dm') return; //  Не слушаем ЛС

    let ok=true //  Проверка на исключение
    for(i=0;i<=xpExceptions.length-1;i++) { if(message.channel.id === xpExceptions[i]) { ok=false; break;}}
    if(!ok) return;

    if(timers[message.author.id]) { //  Смотрим кулдаун. Тут он умный)
        timers[message.author.id].addTime(1000);
        if(timers[message.author.id].getTime()>6000) message.author.send(new discord.MessageEmbed().setColor('ff0000').setTitle('Не пиши так быстро!').setDescription(`Твой таймаут достиг ${timers[message.author.id].getTime()/1000} секунд!`))
        return;
    } else {
		timers[message.author.id] = new dynamicTimer(function() {
			delete timers[message.author.id]
		}, 750)
    }
    
    XP.findOne({userID: message.author.id}, (err, level) => {
		if(err) console.log(err);

        let messLeng = message.content.length;
        if(messLeng>800) messLeng = 800

        let xpAdd = Math.floor(messLeng/2)+1;

        //let xpAdd = Math.floor(Math.random() * message.content.length) + 1;

        /*
        if(message.channel.id == "751832684246073344") {
            xpAdd = Math.ceil(xpAdd*0,75);

            if(xpAdd >75) xpAdd = 75;
        } else if(xpAdd >150) xpAdd = 150
        */

		//console.log(`${message.author.username}: ${xpAdd}xp`); // Не знаю зачем, раньше была для откладки

		if(!level) {
			var newXP =  new XP({
				userID: message.author.id,
				level: 0,
				xp: xpAdd
			})

			newXP.save().catch(err => console.log(err))
		} else {
			level.xp   = level.xp + xpAdd

			let curlvl = level.level;
            let nxtLvl = 400+(120*curlvl*2.5);
            //let nxtLvl = Math.ceil(Math.sqrt(10000 + Math.pow(level.level, 2) * 300 * Math.pow(1.2, level.level)));

			if(nxtLvl <= level.xp){

				otnxp        = level.xp - nxtLvl;
				level.level  = curlvl + 1;
                level.xp     = otnxp;
                
                message.react('🆙').then(message=>{
                    //  Попытка сделать через коллектор и не городить велосипед была... Как уже понятно, она провалилась
                    
                    setTimeout(()=>{
                        message.reactions.cache.get("🆙").remove(bot.user.id);
                    }, 10000);
                });
		
				//embed = new discord.MessageEmbed().setTitle("Новый уровень!").setColor("#0000FF").addField(`АТЛИЧНА, ${message.author.username}!!! Ты достиг **${curlvl+1} уровня**!`, "Продолжай в том же духе!").setImage("attachment://lvlup.png")
				//message.channel.send({embed: embed, files: [new discord.MessageAttachment("./img/lvlup.png", 'lvlup.png')]}).then(msg => {msg.delete({timeout:10000})});
			}

			level.save().catch(err => console.log(err))
		}
	})
}catch(err){console.log(err)}})

//  Если человек изменил сообщение, то уровень пересчитывается и следовательно отнимается или даётся
bot.on('messageUpdate',async (oldMessage,newMessage)=>{try{
    if(oldMessage.author.bot) return; //  Не слушаем других ботов
    if(oldMessage.channel.type == 'dm') return; //  Не слушаем ЛС

    let ok=true; //  Проверка на исключение
    for(i=0;i<=xpExceptions.length-1;i++) { if(oldMessage.channel.id === xpExceptions[i]) { ok=false; break;}}
    if(!ok) return;
    
    let oldMessLeng = oldMessage.content.length;
    if(oldMessLeng>800) oldMessLeng = 800;
    let newMessLeng = newMessage.content.length;
    if(newMessLeng>800) newMessLeng = 800;

    let xpAdd = (Math.floor(newMessLeng/2)+1) - (Math.floor(oldMessLeng/2)+1);

    XP.findOne({userID: oldMessage.author.id}, (err, level) => {
		if(err) console.log(err);

		//console.log(`${message.author.username}: ${xpAdd}xp`); // Не знаю зачем, раньше была для откладки

		if(!level) {
			var newXP =  new XP({
				userID: oldMessage.author.id,
				level: 0,
				xp: xpAdd
			})

			newXP.save().catch(err => console.log(err))
		} else {
			level.xp   = level.xp + xpAdd

			let curlvl = level.level;
            let nxtLvl = 400+(120*curlvl*2.5);

			if(nxtLvl <= level.xp){

				otnxp        = level.xp - nxtLvl;
				level.level  = curlvl + 1;
                level.xp     = otnxp;
                
                //message.react('🆙'); // Наверное, лучше это тут убрать
			}

			level.save().catch(err => console.log(err))
		}
	})
}catch(err){console.log(err)}})

//  Если человек удалил сообщение, то уровень удаляется. ДА, с помощью такой фичи можно получить отрицательный XP, но мне пофиг)
bot.on('messageDelete',async (message)=> {try{
    if(message.author.bot) return; //  Не слушаем других ботов
    if(message.channel.type == 'dm') return; //  Не слушаем ЛС

    let ok=true //  Проверка на исключение
    for(i=0;i<=xpExceptions.length-1;i++) { if(message.channel.id === xpExceptions[i]) { ok=false; break;}}
    if(!ok) return;
    
    XP.findOne({userID: message.author.id}, (err, level) => {
		if(err) console.log(err);

        let messLeng = message.content.length;
        if(messLeng>800) messLeng = 800

        let xpAdd = Math.floor(messLeng/2)+1;

		//console.log(`${message.author.username}: ${xpAdd}xp`); // Не знаю зачем, раньше была для откладки

		if(!level) {
			var newXP =  new XP({
				userID: message.author.id,
				level: 0,
				xp: -xpAdd
			})

			newXP.save().catch(err => console.log(err))
		} else {
			level.xp   = level.xp - xpAdd

			level.save().catch(err => console.log(err))
		}
	})
}catch(err){console.log(err)}});

//  Для выполнения команд
bot.on("message", async (message) => {try{
    if(message.author.bot) return; //  Не слушаем других ботов
    if(message.channel.type == 'dm') return; //  Не слушаем ЛС

    //let messageArray  = message.content.replace(/\s/g, ' ').split(" ");
    let messageArray  = message.content.replace(/\s+/g, ' ').split(" ");
	let cmd           = messageArray[0];
    let args          = messageArray.slice(1);

    let commandfile
	if(cmd.substr(0, 2) == prefix) commandfile = bot.commands.get(cmd.slice(prefix.length));
	if(commandfile) commandfile.run(bot,message,args,{
        "cmds":cmds,
        "prefix":prefix,
        "color": color,
        "defEmb": new discord.MessageEmbed().setColor(color),
        "footer": message.author.username +' | © Лига "Синее Пламя"',
        "categories": ['Общее','Уровень','Прочее','Элитное'],
        "moderators": ['449585603567157258','449590549683634176','652500169354510357'],
        "logchannel": allSettings.logChannel
    });
}catch (err) {console.log(err)}})

//  Удаление ссылок приглашений
bot.on("message", async (message) => {try{
    //if(message.author.bot) return; //  Не слушаем других ботов
    if(message.channel.type == 'dm') return; //  Не слушаем ЛС

    if(message.content.replace(/\s/g, '').includes("discord.gg/")) {
        if(!logSettings.enabled) return; //  Не обращаем внимания, если проверка выключена
        if(message.author.id == message.guild.owner.id) return; //  Исключаем создателя

        let ok=true //  Проверка на исключение
        for(i=0;i<=logSettings.exceptions.roles.length-1;i++) { if(message.member.roles.cache.has(logSettings.exceptions.roles[i])) { ok=false; break;}}
        for(i=0;i<=logSettings.exceptions.channels.length-1;i++) { if(message.channel.id == logSettings.exceptions.channels[i]) { ok=false; break;}}
        for(i=0;i<=logSettings.exceptions.members.length-1;i++) { if(message.author.id == logSettings.exceptions.members[i]) { ok=false; break;}}
        
        if(!ok) return; //  Если это испключение, то не продолжаем

        message.delete() //  Удаляем сообщение
        message.channel.send(new discord.MessageEmbed().setColor('ff0000').setTitle(`${message.author.username}, реклама на этом сервере запрещена!`)).then(msg=>msg.delete({timeout:5000}));

        let emb = new discord.MessageEmbed().setColor(color).setTitle('Нарушение!').addField('Нарушитель:',`<@${message.author.id}> \nID: "${message.author.id}"`,true).addField('Канал:',`${message.channel.name}`,true).addField('Время', strftime("%B %d, %H:%M", new Date(message.createdAt)),true).addField('Причина:','Отправка ссылок-приглашений на другие сервера');
        
        if(logSettings.logs.enabled) { //  Смотрим, включено ли логирование и если да, то смотрим доступность канала. Если всё норм, то отправляем сообщение
            if(message.guild.channels.cache.get(logSettings.logs.channel)) message.guild.channels.cache.get(logSettings.logs.channel).send(emb);
            else message.guild.members.cache.get(message.guild.owner.id).send(new discord.MessageEmbed().setTitle('Лог канала не существует!').setDescription('Выключите функцию логирования или задайте другой канал!').setColor('ff0000')); //  Отправляем сообщение создателю, что канала для логов не сущетсвует. Пускай вырубает или изменяет.
        }
        if(logSettings.logs.ownerDirectMessage) message.guild.owner.send(emb); //  Смотрим включено ли логгирование в ЛС и если да, то отправляем ЛС человеку.
	};

}catch (err) {console.log(err)}});

//  Удаление ссылок приглашений после обновления сообщения
bot.on("messageUpdate", async (oldMessage, message) => {try{
    //if(message.author.bot) return; //  Не слушаем других ботов
    if(message.channel.type == 'dm') return; //  Не слушаем ЛС

    if(message.content.replace(/\s/g, '').includes("discord.gg/")) {
        if(!logSettings.enabled) return; //  Не обращаем внимания, если проверка выключена
        if(message.author.id == message.guild.owner.id) return; //  Исключаем создателя

        let ok=true //  Проверка на исключение
        for(i=0;i<=logSettings.exceptions.roles.length-1;i++) { if(message.member.roles.cache.has(logSettings.exceptions.roles[i])) { ok=false; break;}}
        for(i=0;i<=logSettings.exceptions.channels.length-1;i++) { if(message.channel.id == logSettings.exceptions.channels[i]) { ok=false; break;}}
        for(i=0;i<=logSettings.exceptions.members.length-1;i++) { if(message.author.id == logSettings.exceptions.members[i]) { ok=false; break;}}
        
        if(!ok) return; //  Если это испключение, то не продолжаем

        message.delete() //  Удаляем сообщение
        message.channel.send(new discord.MessageEmbed().setColor('ff0000').setTitle(`${message.author.username}, реклама на этом сервере запрещена!`)).then(msg=>msg.delete({timeout:5000}));

        let emb = new discord.MessageEmbed().setColor(color).setTitle('Нарушение!').addField('Нарушитель:',`<@${message.author.id}> \nID: "${message.author.id}"`,true).addField('Канал:',`${message.channel.name}`,true).addField('Время', strftime("%B %d, %H:%M", new Date(message.createdAt)),true).addField('Причина:','Отправка ссылок-приглашений на другие сервера');
        
        if(logSettings.logs.enabled) { //  Смотрим, включено ли логирование и если да, то смотрим доступность канала. Если всё норм, то отправляем сообщение
            if(message.guild.channels.cache.get(logSettings.logs.channel)) message.guild.channels.cache.get(logSettings.logs.channel).send(emb);
            else message.guild.members.cache.get(message.guild.owner.id).send(new discord.MessageEmbed().setTitle('Лог канала не существует!').setDescription('Выключите функцию логирования или задайте другой канал!').setColor('ff0000')); //  Отправляем сообщение создателю, что канала для логов не сущетсвует. Пускай вырубает или изменяет.
        }
        if(logSettings.logs.ownerDirectMessage) message.guild.owner.send(emb); //  Смотрим включено ли логгирование в ЛС и если да, то отправляем ЛС человеку.
	}

}catch (err) {console.log(err)}});

// Когда пришёл новый человек
bot.on("guildMemberAdd", member =>  {
    let channel = member.guild.channels.cache.get(allSettings.wellcomeChannel);

    if (!channel) return member.guild.channels.cache.get(allSettings.logChannel).send(new discord.MessageEmbed().setColor('ff0000').setTitle(`Канал "${allSettings.wellcomeChannel}" не найден`));
    if (!channel.permissionsFor(bot.user).has('SEND_MESSAGES')) return member.guild.channels.cache.get(allSettings.logChannel).send(new discord.MessageEmbed().setColor('ff0000').setTitle(`Я не могу отправлять сообщения в канал "${allSettings.wellcomeChannel}"`));
    
    let embed
    if(member.user.bot) {
        embed = new discord.MessageEmbed().setTitle("Новый бот!").setColor("8b00ff").setDescription(`И имя его ${member.user.username}!`).setThumbnail(member.user.avatarURL()|| member.user.defaultAvatarURL)
    } else embed = new discord.MessageEmbed().setTitle("Прибыл новый человек!").setColor("00ff00").setDescription(`Добро пожаловать на наш сервер, <@${member.id}>!`).setThumbnail(member.user.avatarURL()|| member.user.defaultAvatarURL)

    XP.findOne({userID: member.id}, (err, level) => {
        if(err) console.log(err)

        if(!level) {
            channel.send(embed);
        } else {
            let fld = `Уровень: ${level.level}\nXP: ${level.xp}`

            embed.addField(`У тебя:`, fld);
            channel.send(embed)
        }
    })
    
    member.send("Добро пожаловать на сервер **║ЛИГА \"СИНЕЕ ПЛАМЯ\"║**! Приятного время провождения!");

    let role
    if(member.user.bot) role = member.guild.roles.cache.find(n => n.name === '[Боты]');
    else role = member.guild.roles.cache.get(allSettings.autorole);

    if(!role) member.guild.channels.cache.get(allSettings.logChannel).send(new discord.MessageEmbed().setColor('ff0000').setTitle(`Нет роли для новых участников/ботов`));
    else member.roles.add(role);
    
});

// А это когда человек ушёл(
bot.on('guildMemberRemove', member => {

    let channel = member.guild.channels.cache.get(allSettings.wellcomeChannel);

    if (!channel) return member.guild.channels.cache.get(allSettings.logChannel).send(new discord.MessageEmbed().setColor('ff0000').setTitle(`Канал "${allSettings.wellcomeChannel}" не найден`));
    if (!channel.permissionsFor(bot.user).has('SEND_MESSAGES')) return member.guild.channels.cache.get(allSettings.logChannel).send(new discord.MessageEmbed().setColor('ff0000').setTitle(`Я не могу отправлять сообщения в канал "${allSettings.wellcomeChannel}"`));
    
    if(member.user.bot) channel.send(new discord.MessageEmbed().setTitle("Ушёл бот!").setColor("8b00ff").setDescription(`${member.user.username} оказался не нужен нашему серверу!`).setThumbnail(member.user.avatarURL))
    else channel.send(new discord.MessageEmbed().setTitle("Ушёл человек!").setColor("ff0000").setDescription(`Прощай, ${member.user.username}!`))
});