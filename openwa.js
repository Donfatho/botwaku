const qrcode = require('qrcode-terminal');
const fs = require("fs")
const DonFatho = ['+6282138480743'];
const { Client, LegacySessionAuth, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const { EditPhotoHandler } = require('./editfoto.js');
const { getSystemErrorMap } = require('util');
const { Configuration, OpenAIApi } = require("openai");
const { url } = require('inspector');
const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);
const client = new Client({
     authStrategy: new LocalAuth({
          clientId: "client-one" //Un identificador(Sugiero que no lo modifiques)
     })
})

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    console.log(session);
});
 
client.initialize();
client.on("qr", qr => {
    qrcode.generate(qr, {small: true} );
})

client.on('ready', () => {
    console.log("ready to message")
});

client.on('message', async msg => {
    
    const text = msg.body.toLowerCase() || '';
    // #edit_bg/bg_color
    if (text.includes("#edit_bg/")) {
        await EditPhotoHandler(text, msg);

    }
});

client.initialize();

function man(){
    client.on('message', async message => {
        if(message.body.includes('/Eris')) {
            let text = message.body.split('/Eris')[1];
            var qst = `Q: ${text}\nA:`;
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: qst,
                temperature: 0,
                max_tokens: 300,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
            });
            message.reply(response.data.choices[0].text);
        }
        else if(message.body.includes('/draw')) {
            let text = message.body.split('/draw')[1];
            var qst = `Q: ${text}\nA:`;
            const response = await openai.createImage({
                prompt: text,
                n: 1,
                size: '512x512'
            });
            var imgUrl = response.data.data[0].url;
            const media = await MessageMedia.fromUrl(imgUrl);
            await client.sendMessage(message.from, media, {caption: "your image"})
        }
        else {
          message.reply("Hallo, Namaku Eris, Saya assisstant Ai pribadi yang dibuat DonFatho untuk dapat membantumu dengan pertanyaan tentang berbagai topik, misalnya teknologi, sains, matematika, sosial, hukum, budaya, sejarah, dan banyak lagi. Kamu juga bisa memintaku memberi penjelasan tentang konsep yang asing buatmu. Saya juga bisa memberikanmu solusi, saran atau recommendasi. ketik /Eris sebelum bertanya selanjutnya Saya akan menjawabnya sebaik mungkin!");

        }              
    });
}

man();