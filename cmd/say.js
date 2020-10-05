module.exports.run = async (bot,message, args,config) => {
    message.delete();

    let botmessage = args.join(" ");
    if(!botmessage) return;
	console.log(`${message.author.username} сказал: ${botmessage}`);
	message.channel.send(botmessage);
}

module.exports.cmd = ['say', '>']