window.onload = function() {
  var tileWidth = 100
  var tileHeight = 66
  var draw = SVG('drawing').size(tileWidth*20, tileHeight*10)


  var tileCode = {}

  function Tile(id, options = {}) {
    this.id = id
    this.border = options.border === undefined ? true : options.border
    this.optics = {}
    this.tracks = [3]
    this.colors = ['red', 'green', 'yellow', 'white']
  }
  Tile.prototype.draw = function(drawing) {
    e = drawing.nested()
    r = e.rect(tileWidth, tileHeight)
    r.addClass("tile-box")
    if (this.border)
      r.addClass("tile-box-border")
    if (this.id !== undefined)
      r.id(this.id)
    return e
  }


  function inheritTile(parentTile, childTileName, code, context, drawFunction, consFunction) {
    context[childTileName] = function(id, options) {
      parentTile.apply(this, arguments)
      this.rev = childTileName.indexOf('Reverse') >= 0
      if (consFunction !== undefined)
        consFunction.call(this)
    }
    context[childTileName].prototype = (function(parent){
      function protoCreator(){};
      protoCreator.prototype = parent.prototype;
      return new protoCreator();
    })(parentTile)
    context[childTileName].prototype.draw = function(drawing) {
      e = parentTile.prototype.draw.call(this, drawing)
      r = drawFunction.call(this, e)
      return r === undefined ? e : r
    }
    tileCode[code] = context[childTileName]
  }

  inheritTile(Tile, "EmptyTile", "e", this, function() {})

  inheritTile(EmptyTile, "StraightTile", "s", this, function() {
    this.tracks[0] = e.rect(tileWidth * 0.3, tileHeight * 0.06)
     .id(this.id + "-t1")
     .addClass('tile-track')
     .move(tileWidth * 0.1, tileHeight * 0.47)
     .radius(tileWidth * 0.02)
    this.tracks[1] = e.rect(tileWidth * 0.3, tileHeight * 0.06)
     .id(this.id + "-t2")
     .addClass('tile-track')
     .move(tileWidth * 0.6, tileHeight * 0.47)
     .radius(tileWidth * 0.02)
  })

  inheritTile(EmptyTile, "LeftTile", "l", this, function() {
    this.tracks[0] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .id(this.id + "-t1")
     .addClass('tile-track')
     .move(tileWidth * 0.06, tileHeight * 0.20)
     .rotate(-34).radius(tileWidth * 0.02)
  })

  inheritTile(EmptyTile, "RightTile", "r", this, function() {
    this.tracks[0] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .id(this.id + "-t1")
     .addClass('tile-track')
     .move(tileWidth * 0.08, tileHeight * 0.74)
     .rotate(34).radius(tileWidth * 0.02)
  })

  inheritTile(EmptyTile, "LeftReverseTile", "lr", this, function() {
    this.tracks[0] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .id(this.id + "-t1")
     .addClass('tile-track')
     .move(tileWidth * 0.54, tileHeight * 0.74)
     .rotate(-34)
     .radius(tileWidth * 0.02)
  })

  inheritTile(EmptyTile, "RightReverseTile", "rr", this, function() {
    this.tracks[0] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .id(this.id + "-t1")
     .addClass('tile-track')
     .move(tileWidth * 0.54, tileHeight * 0.2)
     .rotate(34)
     .radius(tileWidth * 0.02)
  })

  inheritTile(StraightTile, "AbstractTurnoutTile", "tl", this, function() {})

  AbstractTurnoutTile.prototype.setSwitch = function(p) {
    idx = this.rev ? [1, 2] : [0, 2]
    if (p) {
      this.tracks[idx[0]].removeClass("tile-track-switch")
      this.tracks[idx[1]].addClass("tile-track-switch")
    } else {
      this.tracks[idx[0]].addClass("tile-track-switch")
      this.tracks[idx[1]].removeClass("tile-track-switch")
    }
  }

  inheritTile(AbstractTurnoutTile, "TurnoutLeftTile", "tl", this, function() {
    this.tracks[2] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .id(this.id + "-t3")
     .addClass('tile-track').addClass('tile-track-switch')
     .move(tileWidth * 0.06, tileHeight * 0.20)
     .rotate(-34).radius(tileWidth * 0.02)
  })

  inheritTile(AbstractTurnoutTile, "TurnoutRightTile", "tr", this, function() {
    this.tracks[2] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .id(this.id + "-t3")
     .addClass('tile-track').addClass('tile-track-switch')
     .move(tileWidth * 0.08, tileHeight * 0.74)
     .rotate(34).radius(tileWidth * 0.02)
  })

  inheritTile(AbstractTurnoutTile, "TurnoutLeftReverseTile", "tlr", this, function() {
    this.tracks[2] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .id(this.id + "-t3")
     .addClass('tile-track').addClass('tile-track-switch')
     .move(tileWidth * 0.54, tileHeight * 0.74)
     .rotate(-34)
     .radius(tileWidth * 0.02)
  })

  inheritTile(AbstractTurnoutTile, "TurnoutRightReverseTile", "trr", this, function() {
    this.tracks[2] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .id(this.id + "-t3")
     .addClass('tile-track').addClass('tile-track-switch')
     .move(tileWidth * 0.54, tileHeight * 0.2)
     .rotate(34)
     .radius(tileWidth * 0.02)
  })

  inheritTile(StraightTile, "AbstractSignalTile", "ass", this, function() {})
  AbstractSignalTile.prototype.signalMain = function(s) {
    s.rect(tileWidth * 0.02, tileWidth * 0.08) // foot
     .addClass('tile-signal-mast')
     .move(0, tileHeight * 0.04)
    s.rect(tileWidth * 0.70, tileWidth * 0.02) // mast
     .addClass('tile-signal-mast')
     .move(0, tileHeight * 0.08)
    s.rect(tileWidth * 0.23, tileWidth * 0.11) // main
     .addClass('tile-signal-mast')
     .move(tileWidth * 0.47, tileHeight * 0.015)
    this.optics['halt'] = s.circle(tileWidth * 0.05)
     .move(tileWidth * 0.51, tileHeight * 0.06)
     .id(this.id + "-halt")
     .addClass('tile-signal-red')
    this.optics['proceed'] = s.circle(tileWidth * 0.05)
     .move(tileWidth * 0.61, tileHeight * 0.06)
     .id(this.id + "-proceed")
     .addClass('tile-signal-green')
  }

  AbstractSignalTile.prototype.signalAlt = function(s) {
    s.polygon([0, tileHeight * 0.07,  tileWidth * 0.09, 0,  0, tileHeight * -0.07]) // alternate
     .addClass('tile-signal-mast')
     .move(tileWidth * 0.35, tileHeight * 0.03)
    var alternate = s.group()
     .id(this.id + "-alt")
     .addClass('tile-signal-white')
    this.optics['alternate'] = alternate
    alternate.circle(tileWidth * 0.02).move(tileWidth * 0.39, tileHeight * 0.08)
    alternate.circle(tileWidth * 0.02).move(tileWidth * 0.36, tileHeight * 0.055)
    alternate.circle(tileWidth * 0.02).move(tileWidth * 0.36, tileHeight * 0.115)
  }

  AbstractSignalTile.prototype.setAspectOff = function() {
    for (const optic in this.optics) {
      for (var i=0; i < this.colors.length; i++) {
        this.optics[optic].removeClass("tile-signal-" + this.colors[i])
      }
    }
  }

  AbstractSignalTile.prototype.setAspectHalt = function() {
    this.setAspectOff()
    this.optics['halt'].addClass('tile-signal-red')
  }

  inheritTile(AbstractSignalTile, "SignalTile", "ss", this, function() {
    var s = e.group()
    this.signalMain(s)
    this.signalAlt(s)
    s.move(tileWidth * 0.10, tileHeight * 0.64)
  })

  inheritTile(AbstractSignalTile, "SignalReverseTile", "ssr", this, function() {
    var s = e.group()
    this.signalMain(s)
    this.signalAlt(s)
    s.move(tileWidth * 0.20, tileHeight * 0.15).rotate(180)
  })



  const layout = [
    ['s',   's',   's',   'tr',  's',   'ssr', 's',   's',   's',   's',   's'],
    ['s',   'ss',  's',   'trr', 'tr',  's',   's',   's',   's',   's',   's'],
    ['e',   'e',   'lr',  'ss',  'trr', 'tr',  's',   'ssr', 's',   's',   's'],
    ['lr',   's',  'l',   'e',   'e',   'rr',  'tlr', 's', 's',     's',   's'],
  ]

  var tiles = []

  function forAllTiles(f) {
    for (let y=0, ly=layout.length; y < ly; y++) {
      for (let x=0, lx=layout[y].length; x < lx; x++) {
        f(tiles[y][x])
      }
    }
  }

  for (let y=0, ly=layout.length; y < ly; y++) {
    var tileLine = []
    for (let x=0, lx=layout[y].length; x < lx; x++) {
      var tclass = tileCode[layout[y][x]]
      if (tclass === undefined) {
        console.log("Unknown tile code " + layout[y][x])
        tclass = EmptyTile
      }
      var t = new (tclass)("tile-" + x + "-" + y)
      t.draw(draw).move(x * tileWidth, y * tileHeight)
      tileLine.push(t)
    }
    tiles.push(tileLine)
    tileLine = []
  }


  function setSomeState(e) {
    console.log("setSignalsToHalt")
    forAllTiles(function(e) {
      if (e instanceof AbstractSignalTile) {
        e.setAspectHalt()
      }
      if (e instanceof AbstractTurnoutTile) {
        e.setSwitch(false)
      }
    })
  }

  setTimeout(setSomeState, 2000)
}
