const telegraf = require('telegraf')
const axios = require('axios')
const dotenv = require('dotenv')
const translate = require('translate')

dotenv.config();

const api_key = process.env.API_KEY;
const weather_key = process.env.WEATHER_KEY;

var startBot;

module.exports = {
    startBot: function() {
        const bot = new telegraf.Telegraf(api_key);

bot.catch((err) => {
    console.log('ERROR: ', err.message);
})

bot.start((ctx) => {
    ctx.reply('Bienvenido. Espero poder ser de ayuda.');
})

bot.command('help', (ctx) => {
    ctx.reply("Soy como una navaja suiza, sirvo para muchas cosas. ¿No me crees? Echa un vistazo a mis increibles funcionalidades:\r\n\r\n" +
    "/help - Puedes pedirme ayuda si quieres.\r\n" +
    "/random valor1,valor2... - Devuelve un valor aleatorio de la lista proporcionada. Ejemplo: galletas,magdalenas,crepes\r\n" +
    "/meme - Te mando un meme de me_irl.\r\n" +
    "/weahter ubicación - El tiempo en la ubicación seleccionada. Ejemplo: Madrid\r\n" +
    "/translate idioma1,idioma2,texto - Traduzo el texto que me envíes. Idiomas soportados: Español, Árabe, Chino, Francés, Alemán, Italiano, Portugués, Ruso. Ejemplo: es,en,Me gustan las galletas\r\n" +
    "\r\nEsto es todo. Tal vez tenga nuevas funciones en el futuro. Stay tuned.");
})

bot.command('random', (ctx) => {
    var texto = ctx.message.text;
    texto = texto.replace('/random', '').trim();
     if(texto === '') {
         ctx.reply('Debes proporcionarme una lista de valores.');
        //  ctx.replyWithSticker('https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/4.webp');
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
                ctx.reply('Hoy no hay memes.');
            }

            var rand = Math.floor(Math.random() * 100);

            try {
                var img = data.children[rand].data.url;
                if (img.endsWith('jpg') || img.endsWith('png')){
                    ctx.replyWithPhoto({url: data.children[rand].data.url});
                } else if (img.endsWith('gif')) {
                    ctx.replyWithAnimation({url: data.children[rand].data.url});
                } else if (img.endsWith('mp4')) {
                    ctx.replyWithVideo({url: data.children[rand].data.url});
                } else {
                    ctx.reply('Hoy no hay memes.');
                }
            } catch (error) {
                ctx.reply('Hoy no hay memes.');
            }
        })
})

bot.command('weather', (ctx) => {
    var texto = ctx.message.text.replace('/weather', '').trim();
    if(texto === '') {
        ctx.reply('Necesito una ubicación para poder proporcionarte datos del clima.');
    } else {
        let city = texto;
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weather_key}&units=metric&lang=es`
        axios
            .get(url)
            .then(res => {
                const data = res.data;
                const temp = data.main;
                const weather = data.weather[0].description;

                ctx.reply(`Estado del Cielo: ${weather}\r\nTemperatura Actual: ${temp.temp}°\r\nMínima Hoy: ${temp.temp_min}°\r\nMáxima Hoy: ${temp.temp_max}°\r\nHumedad: ${temp.humidity}%`);
            })
    }
})

bot.command('translate', (ctx) => {
    // var user = ctx.message.text.replace('/votekick', '').trim();
        const values = ctx.message.text.replace('/translate', '').trim();
        if (values != '' && values.split(',').length == 3) {
            const lang_from = values.split(',')[0];
            const lang_to = values.split(',')[1];
            const text = values.split(',')[2];

            translator(text, lang_from, lang_to).then((res) => {
                ctx.reply(res);
            })
        } else {
            ctx.reply('Asegúrate de introducir todos los datos correctamente.');
        }
})

let translator = async(text, from, to) => {
    const res = await translate(text, {from: `${from}`, to: `${to}`, engine: 'libre'});
    return res;
};

const regex1 = new RegExp(/.*bot.*/i);
const regex2 = new RegExp(/.*Bot.*/i);
const regex3 = new RegExp(/.*BOT.*/i);

bot.hears([regex1,regex2,regex3], ctx => {
    if (!ctx.message.text.includes('@horse_luis_bot')){
        ctx.reply('He visto que me has mencionado. ¿Tienes algún problema?');
    }
})

bot.on('new_chat_participant', ctx => {
    const user = ctx.update.message.new_chat_participant.first_name;
    ctx.reply(`Bienvenid@, ${user}. Disfruta de la estancia.`);
})

bot.on('left_chat_participant', ctx => {
    const user = ctx.update.message.left_chat_participant.first_name;
    ctx.reply(`Nos vemos, ${user}.`);
})

bot.launch();

pingBot();

    }
}

function pingBot() {
    var http = new XMLHttpRequest();
}