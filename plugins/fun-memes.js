import hispamemes from 'hispamemes'

let handler = async (m, { conn }) => {
    const meme = await hispamemes.meme()
    conn.sendFile(m.chat, meme, '', '', m)
    m.react('🤣')
}

handler.help = ['meme']
handler.tags = ['fun']
handler.command = ['meme', 'memes']
handler.group = true
handler.register = true

export default handler
