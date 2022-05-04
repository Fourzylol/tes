require('./command/config')
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage } = require("@adiwajshing/baileys-md")
const { state, saveState } = useSingleFileAuthState(`./session/qrnya.json`)
const pino = require('pino')
const fs = require('fs')
const moment = require('moment-timezone')
const chalk = require('chalk')
const fetch = require('node-fetch')
const FileType = require('file-type')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./message/exif')
const { smsg, getBuffer, isUrl, generateMessageTag } = require('./message/myfunc')

//━━━━━━━━━━━━━━━[ GLOBAL API ]━━━━━━━━━━━━━━━━━//

global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query,
    ...(apikeyqueryname ? {
        [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]
    } : {})
})) : '')

//━━━━━━━━━━━━━━━[ CONNECTION ]━━━━━━━━━━━━━━━━━//

async function starthelga() {
    const helga = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: ['Matsu Multi Device'],
        auth: state,
        version: [2, 2204, 13]
    })

    //━━━━━━━━━━━━━━━[ CHAT UPDATE ]━━━━━━━━━━━━━━━━━//

    helga.ev.on('messages.upsert', async chatUpdate => {
        //console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
            nizzz = chatUpdate.messages[0]
            if (!nizzz.message) return
            nizzz.message = (Object.keys(nizzz.message)[0] === 'ephemeralMessage') ? nizzz.message.ephemeralMessage.message : nizzz.message
            if (nizzz.key && nizzz.key.remoteJid === 'status@broadcast') return
            if (!helga.public && !nizzz.key.fromMe && chatUpdate.type === 'notify') return
            if (nizzz.key.id.startsWith('BAE5') && nizzz.key.id.length === 16) return
            m = smsg(helga, nizzz)
            require("./command/helga")(helga, m, chatUpdate)
        } catch (err) {
            console.log(err)
        }
    })

    helga.ev.on('group-participants.update', async(anu) => {
        console.log(anu)
        try {
            let metadata = await helga.groupMetadata(anu.id)
            memeg = metadata.participants.length;
            let participants = anu.participants
            const jamnyy = moment.tz('Asia/Jakarta').format('HH:mm:ss')
            let d = new Date
            let locale = 'id'
            let gmt = new Date(0).getTime() - new Date('1 Januari 2021').getTime()
            let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]
            let week = d.toLocaleDateString(locale, { weekday: 'long' })
            let calender = d.toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
                /*num = anu.participants[0];
                let v = helga.contacts[num] || { notify: num.replace(/@.+/, "") };
                anu_user = v.vname || v.notify || num.split("@")[0];*/
            for (let num of participants) {
                try {
                    ppuser = await helga.profilePictureUrl(num, 'image')
                } catch {
                    ppuser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                }
                try {
                    ppgroup = await helga.profilePictureUrl(anu.id, 'image')
                } catch {
                    ppgroup = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                }
                let buffu = Buffer.isBuffer(ppuser) ? ppuser : /^data:.*?\/.*?;base64,/i.test(ppuser) ? Buffer.from(ppuser.split `,` [1], 'base64') : /^https?:\/\//.test(ppuser) ? await (await fetch(ppuser)).buffer() : fs.existsSync(ppuser) ? fs.readFileSync(ppuser) : Buffer.alloc(0)

                let biffu = await getBuffer(ppgroup)

                if (anu.action == 'add') {
                    teks = `Welcome To *${metadata.subject}* @${num.split("@")[0]}
Silahkan Intro Dulu Kak😆

🌍Nama :
🗺Umur :
☎Asal Kota :
📦Gender :

Semoga Betah Ya Kak
Jangan Lupa Patuhi Rules Groupnya`
                    var buatpesan = generateWAMessageFromContent(m.chat, {
                        "templateMessage": {
                            "hydratedTemplate": {
                                "locationMessage": {
                                    "degreesLatitude": 0,
                                    "degreesLongitude": 0,
                                    "jpegThumbnail": buffu
                                },
                                "hydratedContentText": teks,
                                "hydratedFooterText": `Matsu Botz`,
                                "hydratedButtons": [{
                                        "urlButton": {
                                            "displayText": "Ｖｏｔｅ Ｍｅ",
                                            "url": `https://instagram.com/jmer.frzy`
                                        }
                                    },
                                    {
                                        "urlButton": {
                                            "displayText": "Ｍｙ G i t h u b",
                                            "url": `https://github.com/fourzylol`

                                        }
                                    },
                                    {
                                        "quickReplyButton": {
                                            "displayText": "Ｓｔａｔｕｓ Ｂｏｔｚ",
                                            "id": 'ping'
                                        }
                                    },
                                    {
                                        "quickReplyButton": {
                                            "displayText": "Ｎｏｍｏｒ Ｏｗｎｅｒ",
                                            "id": 'owner'
                                        }
                                    },
                                    {
                                        "quickReplyButton": {
                                            "displayText": "Ｄｏｎａｓｉ Ｂｏｔｚ",
                                            "id": 'sc'
                                        }
                                    }
                                ]
                            }
                        }
                    }, { contextInfo: { mentionedJid: [num] } })
                    helga.relayMessage(anu.id, buatpesan.message, { messageId: buatpesan.key.id })
                } else if (anu.action == 'remove') {
                    var outt = `Yah Kok Keluar Dari *${metadata.subject}*, Sayonara @${num.split("@")[0]} :(`
                    var buatpesan = generateWAMessageFromContent(m.chat, {
                        "templateMessage": {
                            "hydratedTemplate": {
                                "locationMessage": {
                                    "degreesLatitude": 0,
                                    "degreesLongitude": 0,
                                    "jpegThumbnail": buffu
                                },
                                "hydratedContentText": outt,
                                "hydratedFooterText": `Matsu Botz`,
                                "hydratedButtons": [{
                                        "urlButton": {
                                            "displayText": "Ｖｏｔｅ Ｍｅ",
                                            "url": `https://instagram.com/jmer.frzy`
                                        }
                                    },
                                    {
                                        "urlButton": {
                                            "displayText": "Ｍｙ G i t h u b",
                                            "url": `https://github.com/fourzylol`

                                        }
                                    },
                                    {
                                        "quickReplyButton": {
                                            "displayText": "Ｓｔａｔｕｓ Ｂｏｔｚ",
                                            "id": 'ping'
                                        }
                                    },
                                    {
                                        "quickReplyButton": {
                                            "displayText": "Ｎｏｍｏｒ Ｏｗｎｅｒ",
                                            "id": 'owner'
                                        }
                                    },
                                    {
                                        "quickReplyButton": {
                                            "displayText": "Ｄｏｎａｓｉ",
                                            "id": 'sc'
                                        }
                                    }
                                ]
                            }
                        }
                    }, { contextInfo: { mentionedJid: [num] } })
                    helga.relayMessage(anu.id, buatpesan.message, { messageId: buatpesan.key.id })
                }
            }
        } catch (err) {
            console.log(err)
        }
    })

    //━━━━━━━━━━━━━━━[ SETTING ]━━━━━━━━━━━━━━━━━//

    helga.public = true

    helga.ev.on('connection.update', async(update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode) {
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut ? starthelga() : console.log('Koneksi Terputus...')
            }
        }
        console.log('Koneksi Terhubung...', update)
    })

    helga.ev.on('creds.update', saveState)

    //━━━━━━━━━━━━━━━[ ADD OTHER ]━━━━━━━━━━━━━━━━━//

    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    helga.sendText = (jid, text, quoted = '', options) => helga.sendMessage(jid, { text: text, ...options }, { quoted })

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} caption 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    helga.sendImage = async(jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await helga.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} caption 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    helga.sendVideo = async(jid, path, caption = '', quoted = '', gif = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await helga.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} mime 
     * @param {*} options 
     * @returns 
     */
    helga.sendAudio = async(jid, path, quoted = '', ptt = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await helga.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    helga.sendTextWithMentions = async(jid, text, quoted, options = {}) => helga.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    helga.sendImageAsSticker = async(jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await helga.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    helga.sendVideoAsSticker = async(jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await helga.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }

    /**
     * 
     * @param {*} message 
     * @param {*} filename 
     * @param {*} attachExtension 
     * @returns 
     */
    helga.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = mime.split('/')[0].replace('application', 'document') ? mime.split('/')[0].replace('application', 'document') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
            // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    helga.sendMedia = async(jid, path, quoted, options = {}) => {
        let { ext, mime, data } = await helga.getFile(path)
        messageType = mime.split("/")[0]
        pase = messageType.replace('application', 'document') || messageType
        return await helga.sendMessage(m.chat, {
            [`${pase}`]: data,
            mimetype: mime,
            ...options
        }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} message 
     * @param {*} forceForward 
     * @param {*} options 
     * @returns 
     */
    helga.copyNForward = async(jid, message, forceForward = false, options = {}) => {
        let vtype
        if (options.readViewOnce) {
            message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
            vtype = Object.keys(message.message.viewOnceMessage.message)[0]
            delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
            delete message.message.viewOnceMessage.message[vtype].viewOnce
            message.message = {
                ...message.message.viewOnceMessage.message
            }
        }

        let mtype = Object.keys(message.message)[0]
        let content = await generateForwardMessageContent(message, forceForward)
        let ctype = Object.keys(content)[0]
        let context = {}
        if (mtype != "conversation") context = message.message[mtype].contextInfo
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        }
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {})
        await helga.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
        return waMessage
    }

    /**
     * 
     * @param {*} path 
     * @returns 
     */
    helga.getFile = async(path) => {
        let res
        let data = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (res = await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : typeof path === 'string' ? path : Buffer.alloc(0)
        if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }

        return {
            res,
            ...type,
            data
        }
    }

    return helga
}

starthelga()


let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})