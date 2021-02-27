const express = require('express')
const bot = require('./bot')

const app = express()
const port = 3000

app.get('/', (req, res) => {
    bot.startBot();
    res.send('Bot iniciado correctamente!');
})

app.listen(process.env.PORT || port, () => {
  console.log(`Aplicación escuchando en el puerto ${port}`);
})