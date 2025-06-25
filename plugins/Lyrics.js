import axios from 'axios'

let handler = async (m, { text, command }) => {
  if (!text || !text.includes('-')) {
    return m.reply('❀ Usa el formato: *artista - canción*\nEjemplo: `/letra Bad Bunny - Dakiti`')
  }

  let [artist, title] = text.split('-').map(s => s.trim())

  try {
    let res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`)
    if (res.data && res.data.lyrics) {
      m.reply(`🎵 *${artist} - ${title}*\n\n${res.data.lyrics}`)
    } else {
      m.reply('✧ No se encontró la letra de esa canción.')
    }
  } catch (error) {
    m.reply('⚠︎ No se pudo obtener la letra. Asegúrate de escribir bien el nombre del artista y la canción.')
  }
}

handler.command = ['letra', 'lyrics']
handler.help = ['letra artista - canción']
handler.tags = ['musica']

export default handler
