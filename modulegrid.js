window.onload = function() {
  var tileWidth = 100
  var tileHeight = 66
  var draw = SVG('drawing').size(tileWidth*20, tileHeight*10)

  function signalMain(s) {
    s.rect(tileWidth * 0.02, tileWidth * 0.08).move(0, tileHeight * 0.04).fill('#333') // foot
    s.rect(tileWidth * 0.70, tileWidth * 0.02).move(0, tileHeight * 0.08).fill('#333') // mast
    s.rect(tileWidth * 0.23, tileWidth * 0.11).move(tileWidth * 0.47, tileHeight * 0.015).fill('#333') // main
    s.circle(tileWidth * 0.05).move(tileWidth * 0.51, tileHeight * 0.06).fill('#f00') // halt
    s.circle(tileWidth * 0.05).move(tileWidth * 0.61, tileHeight * 0.06).fill('#888') // proceed
  }
  function signalAlt(s) {
    s.polygon([0, tileHeight * 0.07,  tileWidth * 0.09, 0,  0, tileHeight * -0.07]).move(tileWidth * 0.35, tileHeight * 0.03).fill('#333') // alternate
    s.circle(tileWidth * 0.02).move(tileWidth * 0.39, tileHeight * 0.08).fill('#888') // halt
    s.circle(tileWidth * 0.02).move(tileWidth * 0.36, tileHeight * 0.055).fill('#888') // halt
    s.circle(tileWidth * 0.02).move(tileWidth * 0.36, tileHeight * 0.115).fill('#888') // halt
  }
  var tile = {}
  tile['e'] = function() {
    t = draw.symbol()
    t.rect(tileWidth, tileHeight).fill('#aa9').stroke('#999')
    return t
  }()
  tile['s'] = function() {
    t = draw.symbol()
    t.use(tile['e'])
    t.rect(tileWidth * 0.3, tileHeight * 0.06).move(tileWidth * 0.1, tileHeight * 0.47).radius(tileWidth * 0.02).fill('#888')
    t.rect(tileWidth * 0.3, tileHeight * 0.06).move(tileWidth * 0.6, tileHeight * 0.47).radius(tileWidth * 0.02).fill('#888')
    return t
  }()
  tile['l'] = function() {
    t = draw.symbol()
    t.use(tile['e'])
    t.rect(tileWidth * 0.38, tileHeight * 0.06).move(tileWidth * 0.06, tileHeight * 0.20).rotate(-34).radius(tileWidth * 0.02).fill('#888')
    return t
  }()
  tile['r'] = function() {
    t = draw.symbol()
    t.use(tile['e'])
    t.rect(tileWidth * 0.38, tileHeight * 0.06).move(tileWidth * 0.08, tileHeight * 0.74).rotate(34).radius(tileWidth * 0.02).fill('#888')
    return t
  }()
  tile['lr'] = function() {
    t = draw.symbol()
    t.use(tile['e'])
    t.rect(tileWidth * 0.38, tileHeight * 0.06).move(tileWidth * 0.54, tileHeight * 0.74).rotate(-34).radius(tileWidth * 0.02).fill('#888')
    return t
  }()
  tile['rr'] = function() {
    t = draw.symbol()
    t.use(tile['e'])
    t.rect(tileWidth * 0.38, tileHeight * 0.06).move(tileWidth * 0.54, tileHeight * 0.2).rotate(34).radius(tileWidth * 0.02).fill('#888')
    return t
  }()
  tile['tl'] = function() {
    t = draw.symbol()
    t.use(tile['s'])
    t.rect(tileWidth * 0.38, tileHeight * 0.06).move(tileWidth * 0.06, tileHeight * 0.20).rotate(-34).radius(tileWidth * 0.02).fill('#888')
    return t
  }()
  tile['tr'] = function() {
    t = draw.symbol()
    t.use(tile['s'])
    t.rect(tileWidth * 0.38, tileHeight * 0.06).move(tileWidth * 0.08, tileHeight * 0.74).rotate(34).radius(tileWidth * 0.02).fill('#888')
    return t
  }()
  tile['tlr'] = function() {
    t = draw.symbol()
    t.use(tile['s'])
    t.rect(tileWidth * 0.38, tileHeight * 0.06).move(tileWidth * 0.54, tileHeight * 0.74).rotate(-34).radius(tileWidth * 0.02).fill('#888')
    return t
  }()
  tile['trr'] = function() {
    t = draw.symbol()
    t.use(tile['s'])
    t.rect(tileWidth * 0.38, tileHeight * 0.06).move(tileWidth * 0.54, tileHeight * 0.2).rotate(34).radius(tileWidth * 0.02).fill('#888')
    return t
  }()
  tile['ss'] = function() {
    t = draw.symbol()
    t.use(tile['s'])
    var s = t.group()
    signalMain(s)
    signalAlt(s)
    s.move(tileWidth * 0.10, tileHeight * 0.64)
    return t
  }()
  tile['ssr'] = function() {
    t = draw.symbol()
    t.use(tile['s'])
    var s = t.group()
    signalMain(s)
    signalAlt(s)
    s.move(tileWidth * 0.20, tileHeight * 0.15).rotate(180)
    return t
  }()


  const layout = [
    ['s',   's',   's',   'tr',  's',   'ssr', 's',   's',   's',   's',   's'],
    ['s',   'ss',  's',   'trr', 'tr',  's',   's',   's',   's',   's',   's'],
    ['e',   'e',   'lr',  'ss',  'trr', 'tr',  's',   'ssr', 's',   's',   's'],
    ['s',   's',  'l',   'e',   'e',   'rr',  'tlr', 'ssr', 's',   's',   's'],
  ]

console.log("Foo")
  for (let y=0, ly=layout.length; y < ly; y++) {
    for (let x=0, lx=layout[y].length; x < lx; x++) {
      draw.use(tile[layout[y][x]]).move(x * tileWidth, y * tileHeight)
    }
  }

  // draw.use(tile['s'  ]).move(0 * tileWidth, 0 * tileHeight)
  // draw.use(tile['s'  ]).move(0 * tileWidth, 1 * tileHeight)
  // draw.use(tile['s'  ]).move(1 * tileWidth, 0 * tileHeight)
  // draw.use(tile['s'  ]).move(1 * tileWidth, 1 * tileHeight)
  // draw.use(tile['s'  ]).move(2 * tileWidth, 0 * tileHeight)
  // draw.use(tile['s'  ]).move(2 * tileWidth, 1 * tileHeight)
  // draw.use(tile['tlr']).move(3 * tileWidth, 0 * tileHeight)
  // draw.use(tile['tl' ]).move(3 * tileWidth, 1 * tileHeight)
  // draw.use(tile['tr' ]).move(4 * tileWidth, 0 * tileHeight)
  // draw.use(tile['trr']).move(4 * tileWidth, 1 * tileHeight)
  // draw.use(tile['l'  ]).move(5 * tileWidth, 0 * tileHeight)
  // draw.use(tile['r'  ]).move(5 * tileWidth, 1 * tileHeight)
}
