const Discord  = require("discord.js");
const weather  = require("weather-js");

module.exports.run = async (bot,message, args,config) => {
    message.delete();

    if(!args[0]) {
        return message.channel.send(new Discord.RichEmbed().setColor('0000ff').setTitle('О команде').addField('Аргументы:', "**<город>** - город, в котором нужно искать погоду"))
    }
    
    weather.find({search: args.join(" "), degreeType: 'C', lang : 'ru-RU'}, function(err, result) {
        if (err) console.log(err);

        if(!result[0]) return message.channel.send(new Discord.RichEmbed().setColor('ff0000').setTitle('Это где?')).then(msg => msg.delete(5000));
        let current = result[0].current;
        let location = result[0].location;

        let embed = new Discord.RichEmbed()
        .setAuthor(`Погода для ${current.observationpoint}`)
        .setThumbnail(`${current.imageUrl}`)
        .setColor('0000ff')
        .addField(`Статус:`, `${current.skytext}`, true)
        .addField("Часовой пояс:", `UTC${location.timezone}`, true)
        .addField(`Температура:`, `${current.temperature}°`, true) 
        .addField(`Чувствуется, как:`, `${current.feelslike}°`, true)
        .addField(`Ветер:`,current.winddisplay, true)
        .addField(`Влажность:`, `${current.humidity}%`, true)
        .setFooter(message.author.username +' | © Лига "Синее Пламя"');

        message.channel.send({embed});
    });
}

module.exports.cmd = 'weather'