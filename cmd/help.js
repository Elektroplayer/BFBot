module.exports = {
    run: (bot,message,args,con)=> {try{
        if(args[0] == "help") {
            return message.channel.send(con.defEmb.setTitle("Тебе серьёзно нужна помощь по команде помощи?").setDescription("Мне лень)").setFooter(con.footer))
        }

        let categories = con.categories;
        emb = con.defEmb.setTitle('Помощь')
        let text =''
        for(i1=0;i1<=categories.length-1;i1++) {
            text = ''
            for(i2=0;i2<=con.cmds.length-1;i2++) {
                if(con.cmds[i2].category == categories[i1]) text = text+`**${con.prefix}${con.cmds[i2].cmd}** - ${con.cmds[i2].desc}\n`
            }
            emb.addField(categories[i1],text);
        }
        message.channel.send(emb.setFooter(con.footer));
    }catch(err){console.log(err)}},
    cmd: ["help","?"],
    desc: "Помощь",
    category: "Общее"
}