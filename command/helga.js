require('../command/config')
var { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys-md')
var fs = require('fs')
var util = require('util')
var chalk = require('chalk')
var { exec, spawn, execSync } = require("child_process")
var axios = require('axios')
var { fromBuffer } = require('file-type')
var path = require('path')
var os = require('os')
var request = require('request')
var speed = require('performance-now')
var { performance } = require('perf_hooks')
var { smsg, getGroupAdmins, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, delay, format, logic, generateProfilePicture, parseMention, getRandom } = require('../message/myfunc')
var database = require('../json/database.json')
var simbol = 'メ'
var setting = require('../json/setting.json')
let {
ownername,
ownernomer,
myweb,
botname,
donasi
} = setting

//━━━━━━━━━━━━━━━[ MODULE EXPORTS ]━━━━━━━━━━━━━━━━━//

module.exports = helga = async (helga, m, chatUpdate) => {
try {
var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? m.message.buttonsResponseMessage.selectedButtonId : ''
var budy = (typeof m.text == 'string' ? m.text : '')
var prefix = prefa ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : prefa ?? global.prefix
var isCmd = body.startsWith(prefix)
var command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()        
var isGroup = m.key.remoteJid.endsWith('@g.us')
var sender = isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
var args = body.trim().split(/ +/).slice(1)
var pushname = m.pushName || "No Name"
var isCreator = [helga.user.id, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
var itsMe = m.sender == helga.user.id ? true : false
var isOwner = ownernomer.includes(m.sender)
var text = q = args.join(" ")
var quoted = m.quoted ? m.quoted : m
var mime = (quoted.msg || quoted).mimetype || ''
var isMedia = /image|video|sticker|audio/.test(mime)
var groupMetadata = m.isGroup ? await helga.groupMetadata(m.chat).catch(e => {}) : ''
var groupName = m.isGroup ? groupMetadata.subject : ''
var groupMembers = isGroup ? groupMetadata.participants : ''
var participants = m.isGroup ? await groupMetadata.participants : ''
var groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
var isBotAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
var isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false

//━━━━━━━━━━━━━━━[ STATUS BOT ]━━━━━━━━━━━━━━━━━//

var used = process.memoryUsage()
var cpus = os.cpus().map(cpu => {
cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
return cpu
})
var cpu = cpus.reduce((last, cpu, _, { length }) => {
last.total += cpu.total
last.speed += cpu.speed / length
last.times.user += cpu.times.user
last.times.nice += cpu.times.nice
last.times.sys += cpu.times.sys
last.times.idle += cpu.times.idle
last.times.irq += cpu.times.irq
return last
}, {
speed: 0,
total: 0,
times: {
user: 0,
nice: 0,
sys: 0,
idle: 0,
irq: 0
}
})

//━━━━━━━━━━━━━━━[ SELF AND PUBLIC ]━━━━━━━━━━━━━━━━━//

if (!helga.public) {
if (!m.key.fromMe) return 
}

//━━━━━━━━━━━━━━━[ CONSOLE MESSAGE ]━━━━━━━━━━━━━━━━━//

if (m.message) {
console.log(chalk.black(chalk.bgWhite('[ Matsu Botz ]')), chalk.black(chalk.bgGreen(new Date)), chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' + chalk.magenta('=> Dari'), chalk.green(pushname), chalk.yellow(m.sender) + '\n' + chalk.blueBright('=> Di'), chalk.green(m.isGroup ? pushname : 'Private Chat', m.chat))
}
        
//━━━━━━━━━━━━━━━[ SEND MESSAGE ]━━━━━━━━━━━━━━━━━//

var sendMess = (from, teks) => {
return helga.sendMessage(from, { text: teks })
}
var sendFileFromUrl = async (from, url, caption, msg, men) => {
let mime = '';
let res = await axios.head(url)
mime = res.headers['content-type']
if (mime.split("/")[1] === "gif") {
return helga.sendMessage(m.chat, { video: await convertGif(url), caption: caption, gifPlayback: true, mentions: men ? men : []}, {quoted: m})
}
let type = mime.split("/")[0]+"Message"
if(mime.split("/")[0] === "image"){
return helga.sendMessage(m.chat, { image: await getBuffer(url), caption: caption, mentions: men ? men : []}, {quoted: m})
} else if(mime.split("/")[0] === "video"){
return helga.sendMessage(m.chat, { video: await getBuffer(url), caption: caption, mentions: men ? men : []}, {quoted: m})
} else if(mime.split("/")[0] === "audio"){
return helga.sendMessage(m.chat, { audio: await getBuffer(url), caption: caption, mentions: men ? men : [], mimetype: 'audio/mpeg'}, {quoted: m })
} else {
return helga.sendMessage(m.chat, { document: await getBuffer(url), mimetype: mime, caption: caption, mentions: men ? men : []}, {quoted: m })
}
}

helga.sendReadReceipt(m.chat, sender, [m.key.id])        

//━━━━━━━━━━━━━━━[ FAKE ]━━━━━━━━━━━━━━━━━//

const ftroli ={key: {fromMe: false,"participant":"0@s.whatsapp.net", "remoteJid": "6285748600473-15672057253@g.us"}, "message": {orderMessage: {itemCount: 2021,status: 200, thumbnail: fs.readFileSync('./image/zuka.jpg'), surface: 200, message: `MatsuBotz`, orderTitle: 'Please Follow jmer.frzy', sellerJid: '0@s.whatsapp.net'}}, contextInfo: {"forwardingScore":999,"isForwarded":true},sendEphemeral: true}
		
//━━━━━━━━━━━━━━━[ FITURNYA ]━━━━━━━━━━━━━━━━━//
        
switch(command) {

case 'menu': case 'help': {
let timestamp = speed()
let latensi = speed() - timestamp
txt =`*━━━━━━[ Matsu Botz ]━━━━━━*

Haii Kak👋, Perkenalkan Saya MatsuBotz, 
Ada Yang Bisa Saya Bantu?


╭─「 *Ｂｏｔ Ｉｎｆｏｒｍａｔｉｏｎ* 」
│>> Author : *Fourzy-Dev*
│>> Library : *Baileys-MD*
│>> Prefix : ( ${prefix} )
│>> RunTime : ${runtime(process.uptime())}
│>> Kecepatan Respon : ${latensi.toFixed(4)} _Second_
╰───────────⭓


*✿━━━[「 📚 」Group Menu ]━━━✿*
${simbol} ${prefix}revoke
${simbol} ${prefix}add
${simbol} ${prefix}kick
${simbol} ${prefix}promote
${simbol} ${prefix}demote
${simbol} ${prefix}setname
${simbol} ${prefix}setprofile
${simbol} ${prefix}group
${simbol} ${prefix}linkgroup
${simbol} ${prefix}hidetag
${simbol} ${prefix}tagall 
*✿━━━[「 🎨 」Sticker Menu ]━━━✿*
${simbol} ${prefix}sticker
${simbol} ${prefix}togif
${simbol} ${prefix}tomp4
${simbol} ${prefix}toimage
*✿━━━[「 🗺 」Owner Menu ]━━━✿*
${simbol} ${prefix}block
${simbol} ${prefix}unblock
${simbol} ${prefix}eval
${simbol} ${prefix}public
${simbol} ${prefix}self
${simbol} ${prefix}ping
${simbol} ${prefix}owner
*✿━━━[「 🕋 」Islam Menu ]━━━✿*
${simbol} ${prefix}doaharian
${simbol} ${prefix}tahlil
${simbol} ${prefix}wirid
${simbol} ${prefix}ayatkursi
${simbol} ${prefix}bacaansholat
${simbol} ${prefix}niatsholat
${simbol} ${prefix}asmaulhusna
*✿━━━[「 🎢 」Anime Menu ]━━━✿*
${simbol} ${prefix}kusonimesearch
${simbol} ${prefix}manggatoon
${simbol} ${prefix}chara
${simbol} ${prefix}anime
*✿━━━[「 💻 」Downloader Menu ]━━━✿*
${simbol} ${prefix}ytmp4
${simbol} ${prefix}ytmp3
${simbol} ${prefix}ytplay
${simbol} ${prefix}tiktokdl
${simbol} ${prefix}mediafiredl
${simbol} ${prefix}igfoto
${simbol} ${prefix}igvideo
*✿━━━[「 🥁 」Random Menu ]━━━✿*
${simbol} ${prefix}katabijak
${simbol} ${prefix}fakta
${simbol} ${prefix}motivasi
${simbol} ${prefix}quotes
${simbol} ${prefix}bucin
${simbol} ${prefix}pantun
${simbol} ${prefix}cerpen
${simbol} ${prefix}quotesanime
*✿━━━[「 🎊 」Image Maker ]━━━✿*
${simbol} ${prefix}ttp
${simbol} ${prefix}blackpink
${simbol} ${prefix}neon
${simbol} ${prefix}matrix
${simbol} ${prefix}joker
${simbol} ${prefix}devil
${simbol} ${prefix}transformer
${simbol} ${prefix}thunder
${simbol} ${prefix}harry
${simbol} ${prefix}gradient
*✿━━━[「 🔍 」Search Menu ]━━━✿*
${simbol} ${prefix}liriklagu
${simbol} ${prefix}wikisearch
${simbol} ${prefix}herodetails
${simbol} ${prefix}dafontsearch
${simbol} ${prefix}pinterest
${simbol} ${prefix}linkwa
${simbol} ${prefix}playstore
${simbol} ${prefix}artinama
${simbol} ${prefix}cariresep
*✿━━━[「 📺 」Stalk Menu ]━━━✿*
${simbol} ${prefix}ghstalk
${simbol} ${prefix}igstalk
*✿━━━[「 🖨 」Information Menu ]━━━✿*
${simbol} ${prefix}covid
${simbol} ${prefix}gempa
${simbol} ${prefix}tribunnews
${simbol} ${prefix}kompas
${simbol} ${prefix}film
${simbol} ${prefix}jadwalbola
${simbol} ${prefix}jadwaltv
${simbol} ${prefix}jadwalsholat
*✿━━━[「 🃏 」Wallpaper Menu ]━━━✿*
${simbol} ${prefix}accelworld
${simbol} ${prefix}animegirl
${simbol} ${prefix}codegeas
${simbol} ${prefix}naruto
${simbol} ${prefix}onepiece
${simbol} ${prefix}samuraix
${simbol} ${prefix}tokyoghoul
${simbol} ${prefix}tokyorevenger
${simbol} ${prefix}transformerwp
${simbol} ${prefix}vocaloid`
let message = await prepareWAMessageMedia({ image: fs.readFileSync('./image/zuka.jpg') }, { upload: helga.waUploadToServer })
const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
imageMessage: message.imageMessage,
hydratedContentText: txt,
hydratedButtons: [{
urlButton: {
displayText: 'Ｖｏｔｅ Ｍｅ',
url: 'https://instgram.com/jmer.frzy'
}
}, {
urlButton: {
displayText: 'Ｍｙ G i t h u b',
url: 'https://github.com/fourzylol'
}
}, {
quickReplyButton: {
displayText: 'Ｓｔａｔｕｓ Ｂｏｔｚ',
id: 'ping'
}
}, {
quickReplyButton: {
displayText: 'Ｎｏｍｏｒ Ｏｗｎｅｒ',
id: 'owner'
}  
}, {
quickReplyButton: {
displayText: 'Ｄｏｎａｓｉ Ｂｏｔｚ',
id: 'sc'
}
}]
}
}
}), { userJid: m.chat, quoted: m })
helga.relayMessage(m.chat, template.message, { messageId: template.key.id })
}
break

case 'revoke':
if (!m.isGroup) throw mess.group
if (!isBotAdmins && !m.key.fromMe) throw mess.botAdmin
if (!isGroupAdmins && !m.key.fromMe) throw mess.admin                                               
let link = await helga.groupRevokeInvite(m.chat)
await m.reply( `*New Link For ${groupName}* :\n https://chat.whatsapp.com/${link}`)
case 'kick': {
if (!m.isGroup) throw mess.group
if (!isBotAdmins && !m.key.fromMe) throw mess.botAdmin
if (!isGroupAdmins && !m.key.fromMe) throw mess.admin
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await helga.groupParticipantsUpdate(m.chat, [users], 'remove').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
}
break
case 'add': {
if (!m.isGroup) throw mess.group
if (!isBotAdmins && !m.key.fromMe) throw mess.botAdmin
if (!isGroupAdmins && !m.key.fromMe) throw mess.admin
let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await helga.groupParticipantsUpdate(m.chat, [users], 'add').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
}
break
case 'promote': {
if (!m.isGroup) throw mess.group
if (!isBotAdmins && !m.key.fromMe) throw mess.botAdmin
if (!isGroupAdmins && !m.key.fromMe) throw mess.admin
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await helga.groupParticipantsUpdate(m.chat, [users], 'promote').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
}
break
case 'demote': {
if (!m.isGroup) throw mess.group
if (!isBotAdmins && !m.key.fromMe) throw mess.botAdmin
if (!isGroupAdmins && !m.key.fromMe) throw mess.admin
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await helga.groupParticipantsUpdate(m.chat, [users], 'demote').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
}
break
case 'setname': case 'setsubject': {
if (!m.isGroup) throw mess.group
if (!isBotAdmins && !m.key.fromMe) throw mess.botAdmin
if (!isGroupAdmins && !m.key.fromMe) throw mess.admin
if (!text) throw 'Text ?'
await helga.groupUpdateSubject(m.chat, text).then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
}
break
case 'setprofile': case 'setpp': {
if (!isCreator && !m.key.fromMe) throw mess.owner
if (!quoted) throw 'Reply Image'
if (/image/.test(mime)) throw `balas image dengan caption *${prefix + command}*`
let media = await helga.downloadAndSaveMediaMessage(quoted)
if (!m.isGroup && !isBotAdmins && !isGroupAdmins) {
await helga.updateProfilePicture(m.chat, { url: media }).catch((err) => fs.unlinkSync(media))
await fs.unlinkSync(media)
} else if (!isCreator && !m.key.fromMe) {
await helga.updateProfilePicture(helga.user.id, { url: media }).catch((err) => fs.unlinkSync(media))
await fs.unlinkSync(media)
}
}
break
case 'group': case 'grup': {
if (!m.isGroup) throw mess.group
if (!isBotAdmins && !m.key.fromMe) throw mess.botAdmin
if (!isGroupAdmins && !m.key.fromMe) throw mess.admin
if (!text) throw 'Masukkan value open/close'
if (args[0].toLowerCase() === 'close') {
await helga.groupSettingUpdate(m.chat, 'announcement').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
} else if (args[0].toLowerCase() === 'open') {
await helga.groupSettingUpdate(m.chat, 'not_announcement').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
}
}
break
case 'linkgroup': case 'linkgc': {
if (!m.isGroup) throw mess.group
let response = await helga.groupInviteCode(m.chat)
helga.sendText(m.chat, `https://chat.whatsapp.com/${response}\n\nLink Group : ${groupMetadata.subject}`, m, { detectLink: true })
}
break
case 'hidetag':
if (!m.isGroup) throw mess.group
if (!isGroupAdmins && !m.key.fromMe) throw mess.admin
var group = await helga.groupMetadata(m.chat)
var member = group['participants']
var mem = []
member.map(async adm => {
mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
})
var optionshidetag = {
text: q,
contextInfo: { mentionedJid: mem },
quoted: m
}
helga.sendMessage(m.chat, optionshidetag, text)
break
case 'tagall': case 'infoall':
if (!m.isGroup) throw mess.group
if (!isGroupAdmins && !m.key.fromMe) throw mess.admin
let startnum = 1
let teks = `*_Tag All Member_*\n*Pesan : ${q ? q : '-'}*\n\n`
for (let mem of groupMembers) {
teks += `${startnum++}. @${mem.id.split('@')[0]}\n`
}
teks += `\n⋙ Zuka Beta ⋘`
helga.sendMessage(m.chat, { text: teks, mentions: groupMembers.map(a => a.id) }, { quoted: m })
break

case 'sticker': case 's': case 'stickergif': case 'sgif': {
if (!quoted) throw `Balas Video/Image Dengan Caption ${prefix + command}`
m.reply(mess.wait)
if (/image/.test(mime)) {
let media = await quoted.download()
let encmedia = await helga.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
await fs.unlinkSync(encmedia)
} else if (/video/.test(mime)) {
if ((quoted.msg || quoted).seconds > 11) return m.reply('Maksimal 10 detik!')
let media = await quoted.download()
let encmedia = await helga.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
await fs.unlinkSync(encmedia)
} else {
throw `Kirim Gambar/Video Dengan Caption ${prefix + command}\nDurasi Video 1-9 Detik`
}
}
break
case 'toimage': case 'toimg': {
if (!quoted) throw 'Reply Image'
if (!/webp/.test(mime)) throw `balas stiker dengan caption *${prefix + command}*`
m.reply(mess.wait)
let media = await helga.downloadAndSaveMediaMessage(quoted)
let ran = await getRandom('.png')
exec(`ffmpeg -i ${media} ${ran}`, (err) => {
fs.unlinkSync(media)
if (err) throw err
let buffer = fs.readFileSync(ran)
helga.sendMessage(m.chat, { image: buffer }, { quoted: m })
fs.unlinkSync(ran)
})
}
break
case 'tomp4': case 'tovideo': {
if (!quoted) throw 'Reply Image'
if (!/webp/.test(mime)) throw `balas stiker dengan caption *${prefix + command}*`
m.reply(mess.wait)
let media = await helga.downloadAndSaveMediaMessage(quoted)
let webpToMp4 = await webp2mp4File(media)
await helga.sendMessage(m.chat, { video: { url: webpToMp4.result, caption: 'Convert Webp To Video' } }, { quoted: m })
await fs.unlinkSync(media)
}
break
case 'togif': {
if (!quoted) throw 'Reply Image'
if (!/webp/.test(mime)) throw `balas stiker dengan caption *${prefix + command}*`
m.reply(mess.wait)
let media = await helga.downloadAndSaveMediaMessage(quoted)
let webpToMp4 = await webp2mp4File(media)
await helga.sendMessage(m.chat, { video: { url: webpToMp4.result, caption: 'Convert Webp To Video' }, gifPlayback: true }, { quoted: m })
await fs.unlinkSync(media)
}
break

case 'public': {
if (!isCreator && !m.key.fromMe) throw mess.owner
helga.public = true
m.reply('Sukses Change To Public Usage')
}
break
case 'self': {
if (!isCreator && !m.key.fromMe) throw mess.owner
helga.public = false
m.reply('Sukses Change To Self Usage')
}
break
case 'ping': case 'botstatus': case 'statusbot': {
let timestamp = speed()
let latensi = speed() - timestamp
neww = performance.now()
oldd = performance.now()
respon = `
Kecepatan Respon ${latensi.toFixed(4)} _Second_ \n ${oldd - neww} _miliseconds_\n\nRuntime : ${runtime(process.uptime())}

💻 Info Server
RAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}

_NodeJS Memory Usaage_
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')}

${cpus[0] ? `_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
_CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
`.trim()
m.reply(respon)
}
break
case 'owner': case 'creator': {
let vcard = `BEGIN:VCARD\n` // metadata of the contact card
+ `VERSION:3.0\n`
+ `N:;${ownername}.;;;`
+ `FN:${ownername}.\n` // full name
+ `ORG:${ownername};\n` // the organization of the contact
+ `TEL;type=CELL;type=VOICE;waid=${ownernomer}:${ownernomer}\n` // WhatsApp ID + phone number
+ `END:VCARD`
let msg = await helga.sendMessage(m.chat, { contacts: { displayName: `${ownername}`, contacts: [{ vcard }] } }, { quoted: m })
let buttons3 = [
{buttonId: `menu`, buttonText: {displayText: 'KEMBALI KE MENU'}, type: 1},
]
let buttonMessage3 = {
text: `MOHON TIDAK SPAM OWNER!! `,
footerText: 'Press The Button Below',
buttons: buttons3,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage3, { quoted: m })                        
}
break
case 'eval': {
if (!isCreator && !m.key.fromMe) return m.reply(mess.owner)
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)
}
return m.reply(bang)
}
try {
m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
m.reply(String(e))
}
}
break
case 'block': {
if (!isCreator && !m.key.fromMe) throw mess.owner
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await helga.updateBlockStatus(users, 'block').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
}
break
case 'unblock': {
if (!isCreator && !m.key.fromMe) throw mess.owner
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await helga.updateBlockStatus(users, 'unblock').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
}
break
case 'sc': {
m.reply('Dana : 085748600473')
}
break

case 'doaharian': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/doaharian', {}, 'apikey'))
resultnya = webapi.result
txt =`Title : ${resultnya.Title}
Arabic : ${resultnya.Arabic}
Latin : ${resultnya.Latin}
Translate : ${resultnya.Translate}`
let buttons = [{buttonId: `doaharian`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: txt,
footerText: `Matsu botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'tahlil': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/tahlil', {}, 'apikey'))
resultnya = webapi.result
txt =`Id : ${resultnya.id}
Title : ${resultnya.title}
Arabic : ${resultnya.arabic}
Translation : ${resultnya.translation}`
let buttons = [{buttonId: `tahlil`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: txt,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'wirid': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/wirid', {}, 'apikey'))
resultnya = webapi.result
txt =`Id : ${resultnya.id}
Times : ${resultnya.times}
Arabic : ${resultnya.arabic}
Tnc : ${resultnya.tnc}`
let buttons = [{buttonId: `wirid`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: txt,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'ayatkursi': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/ayatkursi', {}, 'apikey'))
resultnya = webapi.result
txt =`Tafsir : ${resultnya.tafsir}
Translation : ${resultnya.translation}
Arabic : ${resultnya.arabic}
Latin : ${resultnya.latin}`
m.reply(txt)
}
break
case 'bacaansholat': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/bacaansholat', {}, 'apikey'))
resultnya = webapi.result
txt =`Id : ${resultnya.id}
Name : ${resultnya.name}
Arabic : ${resultnya.arabic}
Latin : ${resultnya.latin}
Terjemahan : ${resultnya.terjemahan}`
let buttons = [{buttonId: `bacaansholat`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: txt,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'niatsholat': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/niatsholat', {}, 'apikey'))
resultnya = webapi.result
txt =`Id : ${resultnya.id}
Name : ${resultnya.name}
Arabic : ${resultnya.arabic}
Latin : ${resultnya.latin}
Terjemahan : ${resultnya.terjemahan}`
let buttons = [{buttonId: `niatsholat`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: txt,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'asmaulhusna': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/asmaulhusna', {}, 'apikey'))
resultnya = webapi.result
txt =`Number : ${resultnya.number}
Latin : ${resultnya.latin}
Arabic : ${resultnya.arabic}
Translate Id : ${resultnya.translate_id}
Translate En : ${resultnya.translate_en}`
let buttons = [{buttonId: `asmaulhusna`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: txt,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break

case 'ytmp4': {
if (!text) throw 'Masukkan Link Youtube Nya'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/ytMp4', { url: text }, 'apikey'))
imagenya = await getBuffer(webapi.result.thumb)
var template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
locationMessage: { 
degreesLatitude: 0,
degreesLongitude: 0, 
jpegThumbnail: imagenya,
},
hydratedContentText: `Title : ${webapi.result.title}\nQuality : ${webapi.result.quality}\nSize : ${webapi.result.size}\nViews : ${webapi.result.views}\nLikes : ${webapi.result.likes}\nDislike : ${webapi.result.dislike}\nChannel : ${webapi.result.channel}\nUpload Date : ${webapi.result.uploadDate}\nDesc : ${webapi.result.desc}`,
hydratedFooterText: `Matsu Botz`,
hydratedButtons: [{
urlButton: {
displayText: 'Ｖｏｔｅ Ｍｅ',
url: `https://instgram.com/jmer.frzy`
}
}, {
urlButton: {
displayText: 'Ｍｙ G i t h u b',
url: 'https://github.com/fourzylol'
}
}, {
quickReplyButton: {
displayText: 'Ａｕｄｉｏ',
id: `ytmp33 ${q}`
}
}, {
quickReplyButton: {
displayText: 'Ｖｉｄｅｏ',
id: `ytmp44 ${q}`
}
}]
}
}
}), { userJid: m.chat, quoted: ftroli })
helga.relayMessage(m.chat, template.message, { messageId: template.key.id })
}
break
case 'ytmp44': {
if (!text) throw 'Masukkan Link Youtube Nya'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/ytMp4', { url: text }, 'apikey'))
helga.sendMessage(m.chat, { video: { url: webapi.result.result }, caption: `𝑫𝒐𝒏𝒆.. 𝑫𝒐𝒏'𝒕 𝒇𝒐𝒓𝒈𝒆𝒕 𝒕𝒐 𝒇𝒐𝒍𝒍𝒐𝒘 𝒎𝒚 𝒊𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 @jmer.frzy`}, { quoted: ftroli })
}
break
case 'ytmp3': {
if (!text) throw 'Masukkan Link Youtube Nya'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/ytMp3', { url: text }, 'apikey'))
imagenya = await getBuffer(webapi.result.thumb)
var template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
locationMessage: { 
degreesLatitude: 0,
degreesLongitude: 0, 
jpegThumbnail: imagenya,
},
hydratedContentText: `Title : ${webapi.result.title}\nSize : ${webapi.result.size}\nViews : ${webapi.result.views}\nLikes : ${webapi.result.likes}\nDislike : ${webapi.result.dislike}\nChannel : ${webapi.result.channel}\nUpload Date : ${webapi.result.uploadDate}\nDesc : ${webapi.result.desc}`,
hydratedFooterText: `Matsu Botz`,
hydratedButtons: [{
urlButton: {
displayText: 'Ｖｏｔｅ Ｍｅ',
url: `https://instagram.com/jmer.frzy`
}
}, {
urlButton: {
displayText: 'Ｍｙ G i t h u b',
url: 'https://github.com/fourzylol'
}
}, {
quickReplyButton: {
displayText: 'Ａｕｄｉｏ',
id: `ytmp33 ${q}`
}
}, {
quickReplyButton: {
displayText: 'Ｖｉｄｅｏ',
id: `ytmp44 ${q}`
}
}]
}
}
}), { userJid: m.chat, quoted: ftroli })
helga.relayMessage(m.chat, template.message, { messageId: template.key.id })
}
break
case 'ytmp33': {
if (!text) throw 'Masukkan Link Youtube Nya'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/ytMp3', { url: text }, 'apikey'))
helga.sendMessage(m.chat, { audio: { url: webapi.result.result } }, { quoted: ftroli })
}
break
case 'play': {
if (!text) throw 'Masukkan Judul Youtube Nya'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/ytPlay', { query: text }, 'apikey'))
helga.sendMessage(m.chat, { image: { url: webapi.result.thumb }, caption: `Title : ${webapi.result.title}\nSize : ${webapi.result.size}\nViews : ${webapi.result.views}\nLikes : ${webapi.result.likes}\nDislike : ${webapi.result.dislike}\nChannel : ${webapi.result.channel}\nUpload Date : ${webapi.result.uploadDate}\nDesc : ${webapi.result.desc}`}, { quoted: ftroli })
helga.sendMessage(m.chat, { audio: { url: webapi.result.result } }, { quoted: ftroli })
}
break
case 'tiktokdl': {
if (!text) throw 'Masukkan Link Tiktok Nya'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/tiktokvideo', { url: text }, 'apikey'))
let buttons = [{buttonId: `nowm ${q}`, buttonText: {displayText: 'NO WM'}, type: 1},{buttonId: `wm ${q}`, buttonText: {displayText: 'WM'}, type: 1}]
let buttonMessage = {
text: `Silahkan Pilih File Yang Ingin Di Download`,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'nowm': {
if (!text) throw 'Masukkan Link Tiktok Nya'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/tiktokvideo', { url: text }, 'apikey'))
helga.sendMessage(m.chat, { video: { url: webapi.result.result.nowm }, caption: `𝑫𝒐𝒏𝒆.. 𝑫𝒐𝒏'𝒕 𝒇𝒐𝒓𝒈𝒆𝒕 𝒕𝒐 𝒇𝒐𝒍𝒍𝒐𝒘 𝒎𝒚 𝒊𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 @jmer.frzy`}, { quoted: ftroli })
}
break
case 'wm': {
if (!text) throw 'Masukkan Link Tiktok Nya'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/tiktokvideo', { url: text }, 'apikey'))
helga.sendMessage(m.chat, { video: { url: webapi.result.result.wm }, caption: `𝑫𝒐𝒏𝒆.. 𝑫𝒐𝒏'𝒕 𝒇𝒐𝒓𝒈𝒆𝒕 𝒕𝒐 𝒇𝒐𝒍𝒍𝒐𝒘 𝒎𝒚 𝒊𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 @jmer.frzy`}, { quoted: ftroli })
}
break
case 'mediafiredl': {
if (!text) throw 'Masukkan Link Mediafire Nya'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/mediafireD', { url: text }, 'apikey'))
let buttons = [{buttonId: `mddl ${q}`, buttonText: {displayText: 'DOWNLOAD'}, type: 1}]
let buttonMessage = {
text: `File Berhasil Di Dapatkan\n\nNama : ${webapi.result.nama}\nSize : ${webapi.result.size}\nLink : ${webapi.result.link}\n\nSilahkan Klik Tombol Download Di Bawah Ini`,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'mddl': {
if (!text) throw 'Masukkan Link Mediafire Nya'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/mediafireD', { url: text }, 'apikey'))
sendFileFromUrl(m.chat, webapi.result.link, {quoted: ftroli, mimetype: webapi.result.mime, filename: webapi.result.nama})
}
break
case 'igfoto': {
if (!text) throw 'Masukkan Link Foto Instragram'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/igfoto', { link: text }, 'apikey'))
helga.sendMessage(m.chat, { image: { url: webapi.result.link }, caption: `𝑫𝒐𝒏𝒆.. 𝑫𝒐𝒏'𝒕 𝒇𝒐𝒓𝒈𝒆𝒕 𝒕𝒐 𝒇𝒐𝒍𝒍𝒐𝒘 𝒎𝒚 𝒊𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 @jmer.frzy`}, { quoted: ftroli })
}
break
case 'igvideo': {
if (!text) throw 'Masukkan Link Video Instragram'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/igtv', { link: text }, 'apikey'))
helga.sendMessage(m.chat, { video: { url: webapi.result.link }, caption: `𝑫𝒐𝒏𝒆.. 𝑫𝒐𝒏'𝒕 𝒇𝒐𝒓𝒈𝒆𝒕 𝒕𝒐 𝒇𝒐𝒍𝒍𝒐𝒘 𝒎𝒚 𝒊𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 @jmer.frzy`}, { quoted: ftroli })
}
break

case 'katabijak': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/bijak', {},'apikey'))
let buttons = [{buttonId: `katabijak`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: `Kata Bijak : ${webapi.result}`,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'fakta': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/fakta', {},'apikey'))
let buttons = [{buttonId: `fakta`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: `Fakta : ${webapi.result}`,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'motivasi': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/motivasi', {},'apikey'))
let buttons = [{buttonId: `motivasi`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: `Motivasi : ${webapi.result}`,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'quotes': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/quotes', {},'apikey'))
let buttons = [{buttonId: `quotes`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: `Quotes : ${webapi.quotes}\n\nAuthor : ${webapi.author}`,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'bucin': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/bucin', {},'apikey'))
let buttons = [{buttonId: `bucin`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: `Author : ${webapi.result.Author}\nBucin : ${webapi.result.Bucin}`,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'pantun': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/Pantun', {},'apikey'))
let buttons = [{buttonId: `pantun`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: `Author : ${webapi.result.Author}\nPantun : ${webapi.result.Pantun}`,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'cerpen': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/cerpen', {},'apikey'))
let buttons = [{buttonId: `cerpen`, buttonText: {displayText: 'NEXT⏩'}, type: 1}]
let buttonMessage = {
text: `Title : ${webapi.result.title}\nPengarang : ${webapi.result.pengarang}\nKategori : ${webapi.result.kategori}\nCerpen : ${webapi.result.cerpen}`,
footerText: `Matsu Botz`,
buttons: buttons,
headerType: 2
}
helga.sendMessage(m.chat, buttonMessage, { quoted: ftroli })
}
break
case 'quotesanime': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/quotesAnime', {},'apikey'))
resultnya = webapi.result
for (var x of resultnya) {
txt =`Link : ${x.link}\nKarakter : ${x.karakter}\nAnime : ${x.anime}\nEpisode: ${x.episode}\nUp At : ${x.up_at}\nQuotes : ${x.quotes}`
imagenya = await getBuffer(x.gambar)
}
var template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
locationMessage: { 
degreesLatitude: 0,
degreesLongitude: 0, 
jpegThumbnail: imagenya,
},
hydratedContentText: txt,
hydratedFooterText: `Matsu Botz`,
hydratedButtons: [{
urlButton: {
displayText: 'Ｖｏｔｅ Ｍｅ',
url: `https://instagram.com/jmer.frzy`
}
}, {
urlButton: {
displayText: 'Ｍｙ G i t h u b',
url: 'https://github.com/fourzylol'
}
}, {
quickReplyButton: {
displayText: 'NEXT⏩',
id: `quotesanime`
}
}]
}
}
}), { userJid: m.chat, quoted: ftroli })
helga.relayMessage(m.chat, template.message, { messageId: template.key.id })
}
break

case 'ttp': {
if (!text) throw 'Teks Nya Mana ?'
m.reply(mess.wait)
webapi = await getBuffer(api('helga', '/ttp', { text: text }, 'apikey'))
helga.sendMessage(m.chat, {image: webapi, caption: `𝑫𝒐𝒏𝒆.. 𝑫𝒐𝒏'𝒕 𝒇𝒐𝒓𝒈𝒆𝒕 𝒕𝒐 𝒇𝒐𝒍𝒍𝒐𝒘 𝒎𝒚 𝒊𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 @jmer.frzy`}, {quoted:ftroli})
}
break
case 'blackpink':
case 'neon':
case 'matrix':
case 'joker':
case 'devil':
case 'transformer':
case 'thunder':
case 'harry':
case 'gradient': {
if (!text) throw 'Teks Nya Mana ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', `/${command}`, { text: text }, 'apikey'))
helga.sendMessage(m.chat, { image: { url: webapi.data }, caption: `D𝑫𝒐𝒏𝒆.. 𝑫𝒐𝒏'𝒕 𝒇𝒐𝒓𝒈𝒆𝒕 𝒕𝒐 𝒇𝒐𝒍𝒍𝒐𝒘 𝒎𝒚 𝒊𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 @jmer.frzy`}, { quoted: ftroli })
}
break

case 'artinama': {
if (!text) throw 'Nama Nya Mana ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/artinama', { nama: text }, 'apikey'))
txt =`Arti : ${webapi.result.arti}`
m.reply(txt)
}
break
case 'cariresep': {
if (!text) throw 'Mau Cari Resep Apa ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/cariresep', { query: text }, 'apikey'))
resultnya = webapi.result.data
for (var x of resultnya) {
txt =`Creator : ${webapi.result.creator}
Judul : ${x.judul}
Link : ${x.link}`
}
m.reply(txt)
}
break

case 'liriklagu': {
if (!text) throw 'Judul Lagu Nya Apa ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/liriklagu', { query: text }, 'apikey'))
resultnya = webapi.result
for (var x of resultnya) {
txt =`Lirik : ${x.result}`
}
m.reply(txt)
}
break
case 'wikisearch': {
if (!text) throw 'Mau Cari Apa ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/wikisearch', { query: text }, 'apikey'))
resultnya = webapi.result
for (var x of resultnya) {
txt =`Wiki : ${x.wiki}
Judul : ${x.judul}`
imagenya = await getBuffer(x.thumb)
}
helga.sendMessage(m.chat, {image: imagenya, caption: txt}, {quoted:ftroli})
}
break
case 'herodetails': {
if (!text) throw 'Nama Hero Nya Mana ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/herodetails', { name: text }, 'apikey'))
helga.sendMessage(m.chat, { image: { url: webapi.result.image }, caption: `Hero Name : ${webapi.result.hero_name}\nEtrance Quotes : ${webapi.result.etrance_quotes}\nHero Feature : ${webapi.result.hero_feature}\nMovement Speed : ${webapi.result.attributes.movement_speed}\nPhysical Attack : ${webapi.result.attributes.physical_attack}\nMagic Power : ${webapi.result.attributes.magic_power}\nAttack Speed : ${webapi.result.attributes.attack_speed}\nPhysical Defense : ${webapi.result.attributes.physical_defense}\nMagic Defense : ${webapi.result.attributes.magic_defense}\nBasic Attack Crit Rate : ${webapi.result.attributes.basic_atk_crit_rate}\nHp : ${webapi.result.attributes.hp}\nMana : ${webapi.result.attributes.mana}\nAbility Crit Rate : ${webapi.result.attributes.ability_crit_rate}\nHp Regen : ${webapi.result.attributes.hp_regen}\nMana Regen : ${webapi.result.attributes.mana_regen}\nBattle Point : ${webapi.result.price.battle_point}\nDiamond : ${webapi.result.price.diamond}\nHero Fragment : ${webapi.result.price.hero_fragment}\nRole : ${webapi.result.role}\nDurability : ${webapi.result.skill.durability}\nOffense : ${webapi.result.skill.offense}\nSkill Effects : ${webapi.result.skill.skill_effects}\nDifficulty : ${webapi.result.skill.difficulty}\nSpeciality : ${webapi.result.speciality}\nLaning Recommendation : ${webapi.result.laning_recommendation}\nRelease Date : ${webapi.result.release_date}\nBackground Story : ${webapi.result.background_story}`}, { quoted: ftroli })
}
break
case 'dafontsearch': {
if (!text) throw 'Nama Font Nya Mana ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/dafontsearch', { query: text }, 'apikey'))
resultnya = webapi.result
for (var x of resultnya) {
txt =`Judul : ${x.judul}
Style : ${x.style}
Link : ${x.link}
Total : ${x.total}`
}
m.reply(txt)
}
break
case 'pinterest': {
if (!text) throw 'Mau Cari Gambar Apa ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/pinterest', { query: text }, 'apikey'))
helga.sendMessage(m.chat, { image: { url: webapi.result.url }, caption: `Author : ${webapi.result.author}\nDone Nih... Don't forget to follow my instagram @jmer.frzy`}, { quoted: ftroli })
}
break
case 'linkwa': {
if (!text) throw 'Mau Cari Group Wa Apa ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/linkwa', { nama: text }, 'apikey'))
resultnya = webapi.result
for (var x of resultnya) {
txt =`Nama : ${x.nama}\nLink : ${x.link}`
}
m.reply(txt)
}
break
case 'playstore': {
if (!text) throw 'Mau Cari Aplikasi Atau Game Apa ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/playstore', { name: text }, 'apikey'))
resultnya = webapi.result
for (var x of resultnya) {
txt =`Nama : ${x.name}\nLink : ${x.link}\nDeveloper : ${x.developer}\nLink Developer : ${x.link_dev}`
}
m.reply(txt)
}
break

case 'ghstalk': {
if (!text) throw 'Username Nya Mana ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/ghstalk', { username: text }, 'apikey'))
helga.sendMessage(m.chat, { image: { url: webapi.result.avatar_url }, caption: `Login : ${webapi.result.login}\nId : ${webapi.result.id}\nUrl : ${webapi.result.url}\nType : ${webapi.result.type}\nSite Admin : ${webapi.result.site_admin}\nName : ${webapi.result.name}\nCompany : ${webapi.result.company}\nBlog : ${webapi.result.blog}\nLocation : ${webapi.result.location}\nEmail : ${webapi.result.email}\nHireable : ${webapi.result.hireable}\nBio : ${webapi.result.bio}\nTwitter Username : ${webapi.result.twitter_username}\nPublic Repos : ${webapi.result.public_repos}\nPublic Gists : ${webapi.result.public_gists}\nFollowers : ${webapi.result.followers}\nFollowing : ${webapi.result.following}\nCreated At : ${webapi.result.created_at}\nUpdated At : ${webapi.result.updated_at}`}, { quoted: ftroli })
}
break
case 'igstalk': {
if (!text) throw 'Username Nya Mana ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/igstalk', { username: text }, 'apikey'))
helga.sendMessage(m.chat, { image: { url: webapi.result.thumbnail }, caption: `Creator : ${webapi.result.creator}\nUsername : ${webapi.result.username}\nFull Name : ${webapi.result.fullname}\nVerified : ${webapi.result.verified}\nVideo Count Reel : ${webapi.result.video_count_reel}\nFollowers : ${webapi.result.followers}\nFollow : ${webapi.result.follow}\nIs Bussines : ${webapi.result.is_bussines}\nIs Professional : ${webapi.result.is_professional}\nCategory : ${webapi.result.category}`}, { quoted: ftroli })
}
break

case 'covid': {
if (!text) throw 'Nama Negaranya Mana ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/covid', { negara: text }, 'apikey'))
txt =`Author : ${webapi.result.author}\nKasus : ${webapi.result.result.kasus}\nMeninggal : ${webapi.result.result.meninggal}\nSembuh : ${webapi.result.result.sembuh}`
m.reply(txt)
}
break
case 'gempa': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/gempa', {}, 'apikey'))
txt =`Waktu : ${webapi.result.Waktu}\nLintang : ${webapi.result.Lintang}\nBujur : ${webapi.result.Bujur}\nMagnitudo : ${webapi.result.Magnitudo}\nKedalaman : ${webapi.result.Kedalaman}\nWilayah : ${webapi.result.Wilayah}`
m.reply(txt)
}
break
case 'kompas': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/kompas', {}, 'apikey'))
resultnya = webapi.result
for (var x of resultnya) {
txt =`Title : ${x.title}\nDesc : ${x.desc}\nDate : ${x.date}\nLink : ${x.link}`
}
m.reply(txt)
}
break
case 'film': {
if (!text) throw 'Masukan Judul Film Nya'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/film', { query: text }, 'apikey'))
resultnya = webapi.result
for (var x of resultnya) {
txt =`Author : ${x.author}\nJudul : ${x.judul}\nQuality : ${x.quality}\nType : ${x.type}\nUpload : ${x.upload}\nLink : ${x.link}`
imagenya = await getBuffer(x.thumb)
}
helga.sendMessage(m.chat, {image: imagenya, caption: txt}, {quoted:ftroli})
}
break
case 'tribunnews': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/tribunnews', {},'apikey'))
resultnya = webapi.result
for (var x of resultnya) {
txt =`Title : ${x.title}\nDesc : ${x.desc}\nDate : ${x.date}\nLink : ${x.link}`
}
m.reply(txt)
}
break
case 'jadwalbola': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/jadwalbola', {},'apikey'))
resultnya = webapi.result
for (var x of resultnya) {
txt =`Author : ${x.author}\nJadwal : ${x.jadwal}\nTanggal : ${x.tanggal}\nJam : ${x.jam}\nUrl : ${x.url}`
}
m.reply(txt)
}
break
case 'jadwaltv': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/jadwaltv', {},'apikey'))
resultnya = webapi.result
for (var x of resultnya) {
txt =`Author : ${x.author}\nAcara : ${x.acara}\nChannel : ${x.channel}\nJam : ${x.jam}\nSource : ${x.source}`
}
m.reply(txt)
}
break
case 'jadwalsholat': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/jadwalsholat', {},'apikey'))
txt =`Author : ${webapi.result.author}\nTanggal : ${webapi.result.tanggal}\nImsyak : ${webapi.result.imsyak}\nSubuh : ${webapi.result.subuh}\nDzuhur : ${webapi.result.dzuhur}\nAshar : ${webapi.result.ashar}\nMaghrib : ${webapi.result.maghrib}\nIsya : ${webapi.result.isya}`
m.reply(txt)
}
break

case 'accelworld':
case 'animegirl':
case 'codegeas':
case 'naruto':
case 'onepiece':
case 'samuraix':
case 'tokyoghoul':
case 'tokyorevenger':
case 'transformerwp':
case 'vocaloid': {
m.reply(mess.wait)
webapi = await fetchJson(api('helga', `/${command}`, {},'apikey'))
helga.sendMessage(m.chat, { image: { url: webapi.result.url }, caption: `𝑫𝒐𝒏𝒆.. 𝑫𝒐𝒏'𝒕 𝒇𝒐𝒓𝒈𝒆𝒕 𝒕𝒐 𝒇𝒐𝒍𝒍𝒐𝒘 𝒎𝒚 𝒊𝒏𝒔𝒕𝒂𝒈𝒓𝒂𝒎 @jmer.frzy`}, { quoted: ftroli })
}
break

case 'kusonimesearch': {
if (!text) throw 'Judul Anime Nya Mana ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/scrapKusonime', { query: text },'apikey'))
txt =`Creator : ${webapi.result.creator}\nTitle : ${webapi.result.title}\nTitle Japan : ${webapi.result.title_jp}\nView : ${webapi.result.view}\nGenre : ${webapi.result.genre}\nSeason : ${webapi.result.season}\nProducers : ${webapi.result.producers}\nType : ${webapi.result.type}\nStatus Anime : ${webapi.result.status_anime}\nTotal Episode : ${webapi.result.total_episode}\nScore : ${webapi.result.score}\nDuration : ${webapi.result.duration}\nReleased : ${webapi.result.released}\nDescription : ${webapi.result.description}`
helga.sendMessage(m.chat, { image: { url: webapi.result.thumb }, caption: txt}, { quoted: ftroli })
}
break
case 'manggatoon': {
if (!text) throw 'Judul Anime Nya Mana ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/manggaToon', { judul: text },'apikey'))
txt =`Judul : ${webapi.result.judul}\nGenre : ${webapi.result.genre}\nAuthor : ${webapi.result.Author}\nLink : ${webapi.result.Link}`
helga.sendMessage(m.chat, { image: { url: webapi.result.thumb }, caption: txt}, { quoted: ftroli })
}
break
case 'chara': {
if (!text) throw 'Judul Anime Nya Mana ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/chara', { query: text },'apikey'))
txt =`Nama : ${webapi.result.nama}\nGender : ${webapi.result.gender}\nWarna Rambut : ${webapi.result.warna_rambut}\nDescription : ${webapi.result.description}`
m.reply(txt)
}
break
case 'anime': {
if (!text) throw 'Judul Anime Nya Mana ?'
m.reply(mess.wait)
webapi = await fetchJson(api('helga', '/anime', { query: text },'apikey'))
resultnya = webapi.result
for (var x of resultnya) {
txt =`Judul : ${x.judul}\nLink : ${x.link}`
}
m.reply(txt)
}
break

//━━━━━━━━━━━━━━━[ AKHIR FITUR ]━━━━━━━━━━━━━━━━━//

default:
if (budy.startsWith('=>')) {
if (!isCreator && !m.key.fromMe) return m.reply(mess.owner)
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)
}
return m.reply(bang)
}
try {
m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
m.reply(String(e))
}
}

if (budy.startsWith('>')) {
if (!isCreator && !m.key.fromMe) return m.reply(mess.owner)
try {
let evaled = await eval(budy.slice(2))
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
m = String(err)
await m.reply(m)
}
}

if (budy.startsWith('$')) {
if (!isCreator && !m.key.fromMe) return reply(mess.owner)
exec(budy.slice(2), (err, stdout) => {
if(err) return m.reply(err)
if (stdout) return m.reply(stdout)
})
}
}
        

} catch (err) {
m.reply(util.format(err))
}
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})