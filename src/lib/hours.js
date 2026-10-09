import { SITE } from '../config/site'

const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// Retorna { open, text } com base no horário de Brasília.
export function openStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)
  const get = (t) => parts.find((p) => p.type === t)?.value
  const dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  const minutes = (Number(get('hour')) % 24) * 60 + Number(get('minute'))
  const today = SITE.hours.find((h) => h.days.includes(dayIdx))
  if (today && minutes >= toMin(today.open) && minutes < toMin(today.close)) {
    return { open: true, text: `Aberto agora · fecha às ${today.close.replace(':00', 'h')}` }
  }
  return { open: false, text: 'Fechado agora' }
}
