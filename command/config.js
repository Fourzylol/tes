const fs = require('fs')
const chalk = require('chalk')

//━━━━━━━━━━━━━━━[ WEBSITE API ]━━━━━━━━━━━━━━━━━//

global.APIs = {
helga: 'https://zeroyt7-api.xyz',
zenz: 'https://zenzapi.xyz',
nrtm: 'https://nurutomo.herokuapp.com',
xteam: 'https://api.xteam.xyz',
zahir: 'https://zahirr-web.herokuapp.com',
zeks: 'https://api.zeks.xyz',
pencarikode: 'https://pencarikode.xyz',
}

//━━━━━━━━━━━━━━━[ APIKEY WEBSITE API ]━━━━━━━━━━━━━━━━━//

global.APIKeys = {
'https://zeroyt7-api.xyz': 'Ra37jv2j',
'https://zenzapi.xyz': 'f2116e96b4',
'https://api.xteam.xyz': '1995b2f2a9fdebac',
'https://zahirr-web.herokuapp.com': 'zahirgans',
'https://api.zeks.xyz': 'apivinz',
'https://pencarikode.xyz': 'pais',
}

//━━━━━━━━━━━━━━━[ OTHER ]━━━━━━━━━━━━━━━━━//

global.ownername = 'Matsu🅥︎'
global.owner = ['6285748600473']
global.packname = 'Ig'
global.author = 'Fourzy'
global.prefa = ['','!','.','🐦','🐤','🗿']
global.sp = '➱'
global.mess = {
admin: '_Fitur Khusus Admin Group!_',
botAdmin: '$Bot Harus Menjadi Admin Terlebih Dahulu!_',
owner: '_Fitur Khusus Owner Bot!_',
group: '_Fitur Digunakan Hanya Untuk Group!_',
private: '_Fitur Digunakan Hanya Untuk Private Chat!_',
bot: '_Fitur Khusus Pengguna Nomor Bot_',
wait: '_Sebentar Sedang Loading..._',
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update'${__filename}'`))
delete require.cache[file]
require(file)
})