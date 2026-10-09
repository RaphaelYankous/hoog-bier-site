// Contorno aproximado da garrafa (px da imagem original) para recorte com fundo transparente.
// cx = centro, cap = [topo, largura], neck = [largura, y onde o ombro começa],
// body = [largura, y onde o corpo reto começa], bottom = y da base.
export const bottles = {
  pilsen:     { file: 'pilsen.jpg',     cx: 200, ncx: 202, cap: [45, 84],   neck: [80, 150],  body: [234, 300], bottom: 766 },
  ipa:        { file: 'ipa.jpg',        cx: 136, ncx: 137, cap: [6, 54],    neck: [50, 85],   body: [138, 190], bottom: 434 },
  seculo:     { file: 'red.jpg',        cx: 255, ncx: 250, cap: [15, 76],   neck: [76, 110],  body: [246, 290], bottom: 778 },
  weiss:      { file: 'weiss.jpg',      cx: 263, ncx: 265, cap: [20, 98],   neck: [92, 120],  body: [262, 290], bottom: 842 },
  paleale:    { file: 'paleale.jpg',    cx: 243, ncx: 244, cap: [22, 94],   neck: [86, 110],  body: [258, 290], bottom: 824 },
  stout:      { file: 'stout.jpg',      cx: 251, ncx: 241, cap: [18, 72],   neck: [68, 130],  body: [254, 300], bottom: 810 },
  california: { file: 'california.jpg', cx: 885, ncx: 885, cap: [512, 112], neck: [98, 640],  body: [254, 870], bottom: 1350, flat: true },
}

export function bottlePath({ cx, ncx = cx, cap, neck, body, bottom, flat }) {
  const [capTop, capW] = cap
  const [neckW, shoulderY] = neck
  const [bodyW, bodyY] = body
  const capBottom = capTop + 30
  const r = flat ? 0 : 26
  const L = cx - bodyW / 2
  const R = cx + bodyW / 2
  return [
    `M ${ncx - capW / 2} ${capTop + 4}`,
    `Q ${ncx - capW / 2} ${capTop} ${ncx - capW / 2 + 5} ${capTop}`,
    `L ${ncx + capW / 2 - 5} ${capTop}`,
    `Q ${ncx + capW / 2} ${capTop} ${ncx + capW / 2} ${capTop + 4}`,
    `L ${ncx + capW / 2} ${capBottom}`,
    `L ${ncx + neckW / 2} ${capBottom + 4}`,
    `L ${ncx + neckW / 2} ${shoulderY}`,
    `C ${ncx + neckW / 2} ${shoulderY + (bodyY - shoulderY) * 0.55} ${R} ${bodyY - (bodyY - shoulderY) * 0.35} ${R} ${bodyY}`,
    `L ${R} ${bottom - r}`,
    `Q ${R} ${bottom} ${R - r} ${bottom}`,
    `L ${L + r} ${bottom}`,
    `Q ${L} ${bottom} ${L} ${bottom - r}`,
    `L ${L} ${bodyY}`,
    `C ${L} ${bodyY - (bodyY - shoulderY) * 0.35} ${ncx - neckW / 2} ${shoulderY + (bodyY - shoulderY) * 0.55} ${ncx - neckW / 2} ${shoulderY}`,
    `L ${ncx - neckW / 2} ${capBottom + 4}`,
    `L ${ncx - capW / 2} ${capBottom}`,
    'Z',
  ].join(' ')
}

