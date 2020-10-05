const discord = require('discord.js')
module.exports.errors = {
    notArgs: (message,desc) => {
        let emb = new discord.MessageEmbed().setColor('ff0000').setTitle('Недостаточно аргументов!');
        if(desc) emb.setDescription(desc);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },
    falseArgs: (message,desc) => {
        let emb = new discord.MessageEmbed().setColor('ff0000').setTitle('Неверные аргументы!');
        if(desc) emb.setDescription(desc);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },
    notPerms: (message) => {
        let emb = new discord.MessageEmbed().setColor('ff0000').setTitle('Недостаточно прав!');
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },
    noUser: (message)=> {
        let emb = new discord.MessageEmbed().setColor('ff0000').setTitle('Такого человека не существует!');
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },
    castom: (message,title,desc) => {
        let emb = new discord.MessageEmbed().setColor('ff0000').setTitle(title);
        if(desc) emb.setDescription(desc);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },
    success: (message,title,desc) => {
        let emb = new discord.MessageEmbed().setColor('00ff00').setTitle(title);
        if(desc) emb.setDescription(desc);
        message.channel.send(emb);
    },
    unknow: (message,desc) => {
        let emb = new discord.MessageEmbed().setColor('ff0000').setTitle("Произошла неизвестная ошибка");
        if(desc) emb.setDescription(desc);
        message.channel.send(emb).then(msg=>msg.delete({timeout:5000}));
    },
}