const {err}       = require("../framework.js");
const discord     = require("discord.js");
const superagent  = require("superagent");

const querystring = require('querystring');
const r2          = require('r2');

// https://thedogapi.com/signup

module.exports.run = async (bot, message, args) => {
    message.delete();

    try{

        var images = await loadImage(message.author.username);

        var image = images[0];
        var breed = image.breeds[0];

        message.channel.send(new discord.RichEmbed().setColor('0000ff').setTitle("Котэ:").setImage(image.url).setFooter(message.author.username +' | © Лига "Синее Пламя"'));

    } catch(error) { console.log(error) }

    async function loadImage(sub_id){
        var headers = {'X-API-KEY': "85971b05-1249-4b34-b88f-05d77d2dc2ae",}

        try {
            var response = await r2.get(`https://api.thecatapi.com/v1/images/search?${querystring.stringify({'has_breeds':true,'mime_types':'jpg,png','size':'small','sub_id': sub_id,'limit' : 1})}` , {headers} ).json
        } catch (e) {console.log(e)}
        return response;
    }
}

module.exports.cmd = "cat"