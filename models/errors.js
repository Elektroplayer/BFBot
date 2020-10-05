module.exports.err = class err {
    /*
    if(err == "noUser") {
        emb.embed.title = "Такого человека нет на нашем сервере!"
    } else return
    return msg.channel.send(emb).then(msg => msg.delete(5000));
    */
    
    constructor(msg) {
        this.chan = msg.channel;
        this.emb = {"embed": {"color": 16711680}}
    }
    
    noUser() {
        this.emb.embed.title = "Такого человека нет на нашем сервере!"
        return this.chan.send(this.emb).then(msg => msg.delete(5000));
    }

    notArgs(description) {
        this.emb.embed.title = "Не достаточно аргументов!"
        if(description) this.emb.embed.description = description
        return this.chan.send(this.emb).then(msg => msg.delete(5000));
    }

    falseArgs(description) {
        this.emb.embed.title = "Не верные аргументы!"
        if(description) this.emb.embed.description = description
        return this.chan.send(this.emb).then(msg => msg.delete(5000));
    }

    notPerm(description) {
        this.emb.embed.title = "Не достаточно прав!"
        if(description) this.emb.embed.description = description
        return this.chan.send(this.emb).then(msg => msg.delete(5000));
    }

    castom(title,description) {
        this.emb.embed.title = title
        if(description) this.emb.embed.description = description
        return this.chan.send(this.emb).then(msg => msg.delete(5000));
    }
}