const telegraf = require('telegraf')
const axios = require('axios')

const api = '1627579170:AAHMTT5rVWzEXOY5lf1-RSlbmyaDFRQEqhA';

const bot = new telegraf.Telegraf(api);

bot.catch((err) => {
    console.log('ERROR: ', err);
})

bot.start((ctx) => {
    ctx.reply('Bienvenido. No me toques mucho los cojones, por favor.');
})

bot.command('help', (ctx) => {
    ctx.reply("Soy como una navaja suiza. Valgo para muchas cosas, y si me calientas puedo incluso apuñalarte. ¿No me crees? Echa un vistazo a mis increibles funcionalidades:\r\n\r\n" +
    "/help - Puedes pedirme ayuda si quieres, puto noname de mierda.\r\n" +
    "/random valor1,valor2... - Devuelve un valor aleatorio de la lista proporcionada.\r\n" +
    "/meme - Te mando un pedazo memaso de me_irl.\r\n" +
    "/weahter ubicación - El tiempo en la ubicación seleccionada.\r\n" +
    "\r\nEsto es todo. Si no te llega, puedes ir a follarte a tu prima.");
})

bot.command('random', (ctx) => {
    var texto = ctx.message.text;
    texto = texto.replace('/random', '').trim();
     if(texto === '') {
         ctx.reply('A ver, pedazo de escoria. No puedo devolver un resultado aleatorio de una lista QUE NO EXISTE. O sí, puedo devolverte a tu novi@.');
         ctx.replyWithSticker('https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/4.webp');
     } else {
        var opciones = texto.split(',');
        var rand = Math.floor(Math.random() * (opciones.length));
        ctx.reply(opciones[rand]);
     }
    
})

bot.command('meme', (ctx) => {
    axios
        .get('https://www.reddit.com/r/me_irl/new.json?limit=100')
        .then(res => {
            const data = res.data.data;
            if (data.children.length < 1) {
                ctx.reply('No hay meme. Te jodes.');
            }

            var rand = Math.floor(Math.random() * 100);

            try {
                ctx.replyWithPhoto({url: data.children[rand].data.url});
            } catch (error) {
                ctx.reply('No hay meme. Te jodes.');
            }
        })
})

bot.command('weather', (ctx) => {
    var texto = ctx.message.text;
    texto = texto.replace('/weather', '').trim();
    if(texto === '') {
        ctx.reply('Como no me des una ubicación, voy a buscarte y te pego un tiro. IMBECIL');
    } else {
        let apiKey = '7b41c6df6d991f4c9990dbd7eed746eb';
        let city = texto;
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
        axios
            .get(url)
            .then(res => {
                const data = res.data;
                console.log(data);
                const temp = data.main;
                const weather = data.weather[0].description;

                ctx.reply(`Estado del Cielo: ${weather}\r\nTemperatura Actual: ${temp.temp}°\r\nMínima Hoy: ${temp.temp_min}°\r\nMáxima Hoy: ${temp.temp_max}°\r\nHumedad: ${temp.humidity}%`);
            })
    }
})

const regex1 = new RegExp(/.*bot.*/i);
const regex2 = new RegExp(/.*Bot.*/i);
const regex3 = new RegExp(/.*BOT.*/i);

bot.hears([regex1,regex2,regex3], ctx => {
    if (!ctx.message.text.includes('@horse_luis_bot')){
        ctx.reply('He visto que me has mencionado. ¿Tienes algún problema, pedazo de subnormal?');
    }
})

bot.on('new_chat_participant', ctx => {
    const user = ctx.update.message.new_chat_participant.first_name;
    ctx.reply(`Bienvenid@, ${user}. No toques mucho los huevos o te mando a la mierda.`);
})

bot.on('left_chat_participant', ctx => {
    const user = ctx.update.message.left_chat_participant.first_name;
    ctx.reply(`Venga, ${user}, a tomar por culo.`);
})

bot.launch()