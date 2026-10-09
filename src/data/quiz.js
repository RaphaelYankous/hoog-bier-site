// Quiz "Qual Hoog é a sua?" — cada resposta soma pontos nas cervejas.
export const QUIZ = [
  {
    q: 'Como você curte uma cerveja?',
    options: [
      { label: 'Leve e bem gelada', score: { pilsen: 3, weiss: 2 } },
      { label: 'Aromática e cítrica', score: { paleale: 3, ipa: 2, weiss: 1 } },
      { label: 'Amarga, com personalidade', score: { ipa: 3, stout: 1, paleale: 1 } },
      { label: 'Encorpada e maltada', score: { seculo: 2, california: 3, stout: 2 } },
    ],
  },
  {
    q: 'O que vai ter na mesa?',
    options: [
      { label: 'Petiscos, saladas e frutos do mar', score: { pilsen: 2, weiss: 3 } },
      { label: 'Hambúrguer e comida apimentada', score: { ipa: 3, paleale: 3 } },
      { label: 'Churrasco, carnes e queijos', score: { california: 3, seculo: 3 } },
      { label: 'Sobremesa ou queijos fortes', score: { stout: 3 } },
    ],
  },
  {
    q: 'Qual o clima?',
    options: [
      { label: 'Calor e conversa solta', score: { pilsen: 3, weiss: 2 } },
      { label: 'Happy hour com os amigos', score: { paleale: 2, ipa: 2, seculo: 1 } },
      { label: 'Noite fria, ritmo devagar', score: { stout: 3, california: 2 } },
      { label: 'Quero experimentar algo novo', score: { california: 2, ipa: 2, weiss: 1 } },
    ],
  },
]

export function pickBeer(answers) {
  const total = {}
  answers.forEach((opt) => Object.entries(opt.score).forEach(([id, n]) => (total[id] = (total[id] || 0) + n)))
  return Object.entries(total).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'pilsen'
}
