module.exports = {
    run: async (bot,message,args,con)=> {try{
        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Тебе серьёзно нужна помощь по этой команде?").setDescription("Мне лень)").setFooter(con.footer))
        }

        let up = bot.uptime
        let ms = up%1000
        let s = ((up-ms)/1000)%60
        let m = ((((up-ms)/1000)-s)/60)%60
        let h = ((((((up-ms)/1000)-s)/60)-m)/60)%60
        let d = (((((((up-ms)/1000)-s)/60)-m)/60)-h)/24

        let used = process.memoryUsage().rss / 1024 / 1024;
        let resEmbed = con.defEmb
        .setTitle("Понг!")
        .addField(`Пинг:`, `${Math.round(bot.ws.ping)} ms`,true)
        .addField(`Выделенные ресурсы:`, `${Math.round(used * 100) / 100} МБ`,true)
        .addField(`Время работы:`,`${d} : ${h} : ${m} : ${s}.${ms}`,true)
        .setFooter(con.footer)
        message.channel.send(resEmbed);
    }catch(err){console.log(err)}},
    cmd: ["res","ping"],
    desc: "Ресурсы и пинг",
    category: "Общее"
}