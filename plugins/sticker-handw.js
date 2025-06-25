import axios from 'axios'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const fetchImage = async (text, attempt = 1) => {
    try {
        const response = await axios.get(`https://api.nekorinn.my.id/maker/left-handwriting`, {
            params: { text },
            responseType: 'arraybuffer',
        })
        return response.data
    } catch (error) {
        if (error.response?.status === 429 && attempt <= 3) {
            const retryAfter = error.response.headers['retry-after'] || 5
            await delay(retryAfter * 1000)
            return fetchImage(text, attempt + 1)
        }
        throw error
    }
}

let handler = async (m, { conn, text }) => {
    if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else if (!text) {
        return conn.sendMessage(m.chat, {
            text: `❀ Por favor, responde a un mensaje o escribe un texto para generar la imagen.`,
        }, { quoted: m })
    }

    try {
        const buffer = await fetchImage(text)

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: `🖋️ Aquí tienes tu texto escrito a mano.`,
        }, { quoted: m })

    } catch (error) {
        return conn.sendMessage(m.chat, {
            text: `⚠︎ Ocurrió un error: ${error.message}`,
        }, { quoted: m })
    }
}

handler.command = ['handw']
handler.tags = ['maker', 'img']
handler.help = ['handw *<texto>*']

export default handler
