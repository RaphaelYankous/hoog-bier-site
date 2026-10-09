import { SITE } from '../config/site'

export const waLink = (text) =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const MSG = {
  generic: 'Olá! Vim pelo site da Hoog Bier e gostaria de fazer um pedido.',
  club: 'Olá! Quero entrar para o Clube Hoog VIP.',
  budget: 'Olá! Gostaria de um orçamento de chopp para evento.',
  beer: (name) => `Olá! Gostaria de pedir a ${name}.`,
}
