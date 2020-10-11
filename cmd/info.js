module.exports = {
    run: (bot,message,args,con)=> {try{
        let botembed = con.defEmb
        .setTitle("Информация о боте!")
        .setThumbnail(bot.user.displayAvatarURL)
        .addField(`Описание:`, `Я **Синее пламя** зажжённое **Electroplayer'ом**, чтобы помогать всем на этом сервере. Чтобы начать со мной работать, нужно написать **e!?**. Появится список того, что я могу. Приятного пользования)`)
        .setFooter(con.footer)
        message.channel.send(botembed);
    }catch(err){console.log(err)}},
    cmd: "info",
    desc: "Информация о боте",
    category: "Общее"
}