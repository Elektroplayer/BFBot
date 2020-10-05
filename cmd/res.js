module.exports = {
    run: async (bot,message,args,con)=> {try{
        let used = process.memoryUsage().rss / 1024 / 1024;
        let resEmbed = con.defEmb
        .setTitle("Понг!")
        .addField(`Пинг:`, `${Math.round(bot.ws.ping)} ms`,true)
        .addField(`Выделенные ресурсы:`, `${Math.round(used * 100) / 100} МБ`,true)
        .setFooter(con.footer)
        message.channel.send(resEmbed);
    }catch(err){console.log(err)}},
    cmd: ["res","ping"],
    desc: "Ресурсы и пинг",
    category: "Прочее"
}