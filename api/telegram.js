export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({
      success: false,
      message: 'Método no permitido.',
    })
  }

  const { BOT_TOKEN, CHAT_ID } = process.env

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Faltan las variables de entorno BOT_TOKEN o CHAT_ID.')
    return res.status(500).json({
      success: false,
      message: 'El servidor no está configurado correctamente.',
    })
  }

  try {
    const { emoji, title, description } = req.body || {}

    if (!emoji || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Información incompleta.',
      })
    }

    if (
      typeof emoji !== 'string' ||
      typeof title !== 'string' ||
      typeof description !== 'string' ||
      title.length > 200 ||
      description.length > 500 ||
      emoji.length > 20
    ) {
      return res.status(400).json({
        success: false,
        message: 'Información inválida.',
      })
    }

    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'Desconocida'

    const userAgent = req.headers['user-agent'] || 'Desconocido'
    const so = detectOS(userAgent)

    const fecha = new Date().toLocaleString('es-CO', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'America/Bogota',
    })

    const mensaje = [
      '💌 Emily confirmó un plan ❤️',
      '━━━━━━━━━━━━━━━━━━',
      `📍 ${title}`,
      `${emoji} ${title}`,
      `📝 ${description}`,
      '━━━━━━━━━━━━━━━━━━',
      `🕒 ${fecha}`,
      `🌐 ${ip}`,
      `📱 ${userAgent}`,
      `💻 ${so}`,
      '━━━━━━━━━━━━━━━━━━',
      '❤️ Ya puedes empezar a planear la cita.',
    ].join('\n')

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensaje,
      }),
    })

    if (!telegramResponse.ok) {
      const errorBody = await telegramResponse.text().catch(() => '')
      console.error('Telegram respondió con error:', telegramResponse.status, errorBody)
      throw new Error('Telegram respondió con error.')
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error en /api/telegram:', error)
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    })
  }
}

function detectOS(userAgent) {
  const ua = userAgent.toLowerCase()
  if (ua.includes('windows')) return 'Windows'
  if (ua.includes('android')) return 'Android'
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) return 'iOS'
  if (ua.includes('mac os')) return 'macOS'
  if (ua.includes('linux')) return 'Linux'
  return 'Desconocido'
}
