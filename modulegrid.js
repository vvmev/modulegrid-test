window.onload = function() {
  const tileWidth = 100
  const tileHeight = 66
  const numTilesHorizontally = 15
  const numTilesVertically = 4
  var draw = SVG('drawing').size(tileWidth*numTilesHorizontally, tileHeight*numTilesVertically)


  function Tile(name, options = {}) {
    this.border = options.border === undefined ? true : options.border
    this.optics = {}
    this.tracks = []
    this.colors = ['red', 'green', 'yellow', 'white']
    this.name = name
  }

  Tile.prototype.draw = function(drawing) {
    e = drawing.nested()
    r = e.rect(tileWidth, tileHeight)
    r.addClass("tile-box")
    if (this.border)
      r.addClass("tile-box-border")
    return e
  }

  Tile.prototype.setOccupied = function(o) {
    for (var i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i] !== undefined) {
        if (o)
          this.tracks[i].addClass('tile-track-occupied')
        else
          this.tracks[i].removeClass('tile-track-occupied')
      }
    }
  }


  function inheritTile(parentTile, childTileName, context, drawFunction, consFunction) {
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
  }

  inheritTile(Tile, "EmptyTile", this, function() {})

  inheritTile(EmptyTile, "StraightTile", this, function() {
    this.tracks[0] = e.rect(tileWidth * 0.3, tileHeight * 0.06)
     .addClass('tile-track')
     .addClass('tile-track-occupied')
     .move(tileWidth * 0.1, tileHeight * 0.47)
     .radius(tileWidth * 0.02)
    this.tracks[1] = e.rect(tileWidth * 0.3, tileHeight * 0.06)
     .addClass('tile-track')
     .addClass('tile-track-occupied')
     .move(tileWidth * 0.6, tileHeight * 0.47)
     .radius(tileWidth * 0.02)
  })

  inheritTile(EmptyTile, "LeftTile", this, function() {
    this.tracks[0] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .addClass('tile-track')
     .addClass('tile-track-occupied')
     .move(tileWidth * 0.06, tileHeight * 0.20)
     .rotate(-34).radius(tileWidth * 0.02)
  })

  inheritTile(EmptyTile, "RightTile", this, function() {
    this.tracks[0] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .addClass('tile-track')
     .addClass('tile-track-occupied')
     .move(tileWidth * 0.08, tileHeight * 0.74)
     .rotate(34).radius(tileWidth * 0.02)
  })

  inheritTile(EmptyTile, "LeftReverseTile", this, function() {
    this.tracks[0] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .addClass('tile-track')
     .addClass('tile-track-occupied')
     .move(tileWidth * 0.54, tileHeight * 0.74)
     .rotate(-34)
     .radius(tileWidth * 0.02)
  })

  inheritTile(EmptyTile, "RightReverseTile", this, function() {
    this.tracks[0] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .addClass('tile-track')
     .addClass('tile-track-occupied')
     .move(tileWidth * 0.54, tileHeight * 0.2)
     .rotate(34)
     .radius(tileWidth * 0.02)
  })

  inheritTile(StraightTile, "AbstractTurnoutTile", this, function() {})

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

  inheritTile(AbstractTurnoutTile, "TurnoutLeftTile", this, function() {
    this.tracks[this.rev ? [1] : [0]].addClass('tile-track-switch')
    this.tracks[2] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .addClass('tile-track')
     .addClass('tile-track-occupied')
     .addClass('tile-track-switch')
     .move(tileWidth * 0.06, tileHeight * 0.20)
     .rotate(-34).radius(tileWidth * 0.02)
    e.plain(this.name)
     .addClass("tile-label")
     .move(tileWidth * 0.1, tileHeight * 0.65)
  })

  inheritTile(AbstractTurnoutTile, "TurnoutRightTile", this, function() {
    this.tracks[this.rev ? [1] : [0]].addClass('tile-track-switch')
    this.tracks[2] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .addClass('tile-track')
     .addClass('tile-track-occupied')
     .addClass('tile-track-switch')
     .move(tileWidth * 0.08, tileHeight * 0.74)
     .rotate(34).radius(tileWidth * 0.02)
    e.plain(this.name)
     .addClass("tile-label")
     .move(tileWidth * 0.1, tileHeight * 0.15)
  })

  inheritTile(AbstractTurnoutTile, "TurnoutLeftReverseTile", this, function() {
    this.tracks[this.rev ? [1] : [0]].addClass('tile-track-switch')
    this.tracks[2] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .addClass('tile-track')
     .addClass('tile-track-occupied')
     .addClass('tile-track-switch')
     .move(tileWidth * 0.54, tileHeight * 0.74)
     .rotate(-34)
     .radius(tileWidth * 0.02)
    e.plain(this.name)
     .addClass("tile-label")
     .addClass("tile-label-right")
     .move(tileWidth * 0.9, tileHeight * 0.15)
  })

  inheritTile(AbstractTurnoutTile, "TurnoutRightReverseTile", this, function() {
    this.tracks[this.rev ? [1] : [0]].addClass('tile-track-switch')
    this.tracks[2] = e.rect(tileWidth * 0.38, tileHeight * 0.06)
     .addClass('tile-track')
     .addClass('tile-track-occupied')
     .addClass('tile-track-switch')
     .move(tileWidth * 0.54, tileHeight * 0.2)
     .rotate(34)
     .radius(tileWidth * 0.02)
   e.plain(this.name)
    .addClass("tile-label")
    .addClass("tile-label-right")
    .move(tileWidth * 0.9, tileHeight * 0.65)
  })

  inheritTile(StraightTile, "AbstractSignalTile", this, function(e) {
    if (this.rev) {
      e.plain(this.name)
       .addClass("tile-label")
       .addClass("tile-label-right")
       .move(tileWidth * 0.9, tileHeight * 0.65)
    } else {
      e.plain(this.name)
       .addClass("tile-label")
       .move(tileWidth * 0.1, tileHeight * 0.15)
    }
  })

  AbstractSignalTile.prototype.signalMast = function(s, short) {
    height = short ? tileWidth * 0.20 : tileWidth * 0.70
    s.rect(tileWidth * 0.02, tileWidth * 0.08) // foot
     .addClass('tile-signal-mast')
     .move(0, tileHeight * 0.04)
    s.rect(height, tileWidth * 0.02) // mast
     .addClass('tile-signal-mast')
     .move(0, tileHeight * 0.08)
  }

  AbstractSignalTile.prototype.signalMain = function(s) {
    s.rect(tileWidth * 0.23, tileWidth * 0.11) // main
     .addClass('tile-signal-mast')
     .move(tileWidth * 0.47, tileHeight * 0.015)
    this.optics['home-l'] = s.circle(tileWidth * 0.05)
     .move(tileWidth * 0.51, tileHeight * 0.06)
     .addClass('tile-signal-red')
    this.optics['home-u'] = s.circle(tileWidth * 0.05)
     .move(tileWidth * 0.61, tileHeight * 0.06)
     .addClass('tile-signal-green')
  }

  AbstractSignalTile.prototype.signalAlt = function(s) {
    s.polygon([0, tileHeight * 0.07,  tileWidth * 0.09, 0,  0, tileHeight * -0.07]) // alternate
     .addClass('tile-signal-mast')
     .move(tileWidth * 0.37, tileHeight * 0.03)
    var alternate = s.group()
     .addClass('tile-signal-white')
    this.optics['alternate'] = alternate
    alternate.circle(tileWidth * 0.02).move(tileWidth * 0.41, tileHeight * 0.08)
    alternate.circle(tileWidth * 0.02).move(tileWidth * 0.38, tileHeight * 0.055)
    alternate.circle(tileWidth * 0.02).move(tileWidth * 0.38, tileHeight * 0.115)
  }

  AbstractSignalTile.prototype.signalDistant = function(s) {
    s.rect(tileWidth * 0.20, tileWidth * 0.09)
     .addClass('tile-signal-mast')
     .radius(tileWidth * 0.05)
     .move(tileWidth * 0.165, tileHeight * 0.035)
     .rotate(45)
     this.optics['distant-ll'] = s.circle(tileWidth * 0.05)
      .move(tileWidth * 0.2, tileHeight * 0.00)
      .addClass('tile-signal-yellow')
     this.optics['distant-ur'] = s.circle(tileWidth * 0.05)
      .move(tileWidth * 0.28, tileHeight * 0.12)
      .addClass('tile-signal-green')
  }

  AbstractSignalTile.prototype.withOptic = function(o, f) {
    if (this.optics[o] === undefined)
      return false
    return f(this.optics[o])
  }

  AbstractSignalTile.prototype.setAspectOff = function() {
    for (const optic in this.optics) {
      for (var i=0; i < this.colors.length; i++) {
        this.optics[optic].removeClass("tile-signal-" + this.colors[i])
      }
    }
  }

  inheritTile(AbstractSignalTile, "SignalHomeTile", this, function() {
    var s = e.group()
    this.signalMast(s)
    this.signalMain(s)
    s.move(tileWidth * 0.10, tileHeight * 0.64)
  })

  inheritTile(AbstractSignalTile, "SignalHomeReverseTile", this, function() {
    var s = e.group()
    this.signalMast(s)
    this.signalMain(s)
    s.move(tileWidth * 0.20, tileHeight * 0.15).rotate(180)
  })

  inheritTile(AbstractSignalTile, "SignalHomeDistantTile", this, function() {
    var s = e.group()
    this.signalMast(s)
    this.signalDistant(s)
    this.signalMain(s)
    s.move(tileWidth * 0.10, tileHeight * 0.64)
  })

  inheritTile(AbstractSignalTile, "SignalHomeDistantReverseTile", this, function() {
    var s = e.group()
    this.signalMast(s)
    this.signalDistant(s)
    this.signalMain(s)
    s.move(tileWidth * 0.20, tileHeight * 0.15).rotate(180)
  })

  inheritTile(AbstractSignalTile, "SignalAltTile", this, function() {
    var s = e.group()
    this.signalMast(s)
    this.signalMain(s)
    this.signalAlt(s)
    s.move(tileWidth * 0.10, tileHeight * 0.64)
  })

  inheritTile(AbstractSignalTile, "SignalAltReverseTile", this, function() {
    var s = e.group()
    this.signalMast(s)
    this.signalMain(s)
    this.signalAlt(s)
    s.move(tileWidth * 0.20, tileHeight * 0.15).rotate(180)
  })

  inheritTile(AbstractSignalTile, "SignalHomeDistantAltTile", this, function() {
    var s = e.group()
    this.signalMast(s)
    this.signalDistant(s)
    this.signalAlt(s)
    this.signalMain(s)
    s.move(tileWidth * 0.10, tileHeight * 0.64)
  })

  inheritTile(AbstractSignalTile, "SignalHomeDistantAltReverseTile", this, function() {
    var s = e.group()
    this.signalMast(s)
    this.signalDistant(s)
    this.signalAlt(s)
    this.signalMain(s)
    s.move(tileWidth * 0.20, tileHeight * 0.15).rotate(180)
  })

  SignalHomeTile.prototype.setAspectHalt =
  SignalHomeReverseTile.prototype.setAspectHalt =
  SignalHomeDistantTile.prototype.setAspectHalt =
  SignalHomeDistantReverseTile.prototype.setAspectHalt =
  SignalAltTile.prototype.setAspectHalt =
  SignalAltReverseTile.prototype.setAspectHalt =
  SignalHomeDistantAltTile.prototype.setAspectHalt =
  SignalHomeDistantAltReverseTile.prototype.setAspectHalt = function() {
    this.setAspectOff()
    this.withOptic('home-l', function(o) {o.addClass('tile-signal-red')})
  }

  inheritTile(AbstractSignalTile, "SignalDistantTile", this, function() {
    var s = e.group()
    this.signalMast(s, true)
    this.signalDistant(s)
    s.move(tileWidth * 0.10, tileHeight * 0.64)
  })

  inheritTile(AbstractSignalTile, "SignalDistantReverseTile", this, function() {
    var s = e.group()
    this.signalMast(s, true)
    this.signalDistant(s)
    s.move(tileWidth * 0.53, tileHeight * 0.15).rotate(180)
  })

  SignalDistantTile.prototype.setAspectHalt =
  SignalDistantReverseTile.prototype.setAspectHalt = function() {
    this.setAspectOff()
    this.withOptic('distant-ll', function(o) {o.addClass('tile-signal-yellow')})
    this.withOptic('distant-ur', function(o) {o.addClass('tile-signal-yellow')})
  }


  const emptyTile = new EmptyTile()
  var tiles = Array(numTilesVertically).fill().map(() => Array(numTilesHorizontally).fill(emptyTile))

  tiles[0][0] = new StraightTile()
  tiles[0][1] = new StraightTile()
  tiles[0][2] = new StraightTile()
  tiles[0][3] = new TurnoutRightTile("W1")
  tiles[0][4] = new StraightTile()
  tiles[0][5] = new SignalHomeDistantReverseTile("P4")
  tiles[0][6] = new StraightTile()
  tiles[0][7] = new StraightTile()
  tiles[0][8] = new StraightTile()
  tiles[0][9] = new StraightTile()
  tiles[0][10] = new StraightTile()
  tiles[0][11] = new TurnoutLeftReverseTile("W6")
  tiles[0][12] = new SignalHomeDistantAltReverseTile("F")
  tiles[0][13] = new StraightTile()
  tiles[0][14] = new SignalDistantReverseTile("f")

  tiles[1][0] = new SignalDistantTile("a")
  tiles[1][1] = new StraightTile()
  tiles[1][2] = new SignalAltTile("A")
  tiles[1][3] = new TurnoutRightReverseTile("W2a/b")
  tiles[1][4] = new TurnoutRightTile("W2c/d")
  tiles[1][5] = new StraightTile()
  tiles[1][6] = new StraightTile()
  tiles[1][7] = new StraightTile()
  tiles[1][8] = new StraightTile()
  tiles[1][9] = new SignalHomeDistantTile("N3")
  tiles[1][10] = new TurnoutLeftReverseTile("W5a/b")
  tiles[1][11] = new TurnoutLeftTile("W5c/d")
  tiles[1][12] = new StraightTile()
  tiles[1][13] = new StraightTile()
  tiles[1][14] = new StraightTile()

  // tiles[2][0] = new StraightTile()
  // tiles[2][1] = new StraightTile()
  tiles[2][2] = new LeftReverseTile()
  tiles[2][3] = new SignalAltTile("B")
  tiles[2][4] = new TurnoutRightReverseTile("W3a/b")
  tiles[2][5] = new TurnoutRightTile("W3c/d")
  tiles[2][6] = new SignalHomeDistantReverseTile("P2")
  tiles[2][7] = new StraightTile()
  tiles[2][8] = new StraightTile()
  tiles[2][9] = new SignalHomeDistantTile("N2")
  tiles[2][10] = new LeftTile()
  //tiles[2][11] = new StraightTile()

  tiles[3][0] = new StraightTile()
  tiles[3][1] = new SignalDistantTile("b")
  tiles[3][2] = new LeftTile()
  // tiles[3][3] = new StraightTile()
  // tiles[3][4] = new StraightTile()
  tiles[3][5] = new RightReverseTile()
  tiles[3][6] = new TurnoutLeftReverseTile("GS1")
  tiles[3][7] = new StraightTile()
  tiles[3][8] = new StraightTile()
  // tiles[3][9] = new StraightTile()
  // tiles[3][10] = new StraightTile()
  // tiles[3][11] = new StraightTile()

  function forAllTiles(f) {
    for (let y=0, ly=tiles.length; y < ly; y++) {
      for (let x=0, lx=tiles[y].length; x < lx; x++) {
        f(tiles[y][x], x, y)
      }
    }
  }

  forAllTiles(function(e, x, y) {
    e.draw(draw).move(x * tileWidth, y * tileHeight)
  })

  function setSomeState(e) {
    console.log("setSignalsToHalt")
    forAllTiles(function(e) {
      e.setOccupied(false)
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
