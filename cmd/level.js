const discord  = require('discord.js');
const XP       = require('../models/xp.js');
const addlib   = require('../addLib.js');

//const xp       = require('../models/xp.js');
//const {err}    = require("../framework.js");

module.exports = {
    run: async (bot,message,args,con)=> {try{
        let embed = con.defEmb.setFooter(con.footer);
    
        let luser
        if(!args[0]){
            luser = message.author
            embed.setTitle("Твой уровень:")
        } else {
            luser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.name === args[0])).user;
            if(!luser) return addlib.errors.noUser(message);
            embed.setTitle(`Уровень ${luser.username}`)
        }
    
        await XP.findOne({userID: luser.id}, (err, level) => {
            if(err) console.log(err)
    
            if(!level)   embed.addField('Уровень:', '0', true).addField('XP:', `0/${400+(120*0*2.5)}`, true)
            else         embed.addField('Уровень:', level.level, true).addField('XP:', `${level.xp}/${400+(120*level.level*2.5)}`, true)
            
        })
        
        XP.find({}).sort([['level', 'descending'], ['xp', 'descending']]).exec((err, res) => {
            if (err) console.log(err);
    
            if (res.length === 0) {
                embed.addField('Место в рейтинге:', 'Нет данных', true)
            } else {
                let l = 0
                let m
                for (i = 0; i < res.length; i++) {
                    let member = message.guild.members.cache.get(res[i].userID) || "Нет на сервере"
                    if (member.id === luser.id) {
                        m = i+1-l;
                        break;
                    } else if (member === "Нет на сервере") {
                        l++
                        continue;
                    }
                }
                
                embed.addField('Место в рейтинге:', `${m||"Нет данных"}`, true)
                //if(!m) embed.addField('Место в рейтинге:', 'Нет данных', true)
                //else embed.addField('Место в рейтинге:', m, true)
            }
    
            message.channel.send(embed);
        })
    
    }catch(err){console.log(err)}},
    cmd: ["level","lvl","xp"],
    desc: "Узнать свой уровень",
    category: "Уровень"
}