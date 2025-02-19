;(function () {
  var e = (function (e, t) {
    function T(e, t) {
      if (isNaN(t)) {
        t = 0
      }
      return Math.random() * e + t
    }

    function N(e) {
      return parseInt(T(2), 10) === 1 ? e * -1 : e
    }

    function C() {
      e.setTimeout(function () {
        n.start(true)
      }, 20)
      n.events.remove(i ? t : e, 'mousemove', C)
    }

    function k() {
      if (!n.excludeMobile || !o) {
        C()
      }
      n.events.remove(e, 'load', k)
    }

    this.autoStart = true
    this.excludeMobile = true
    this.flakesMax = 128
    this.flakesMaxActive = 64
    this.animationInterval = 33
    this.useGPU = true
    this.className = null
    this.excludeMobile = true
    this.flakeBottom = null
    this.followMouse = true
    this.snowColor = '#fff'
    this.snowCharacter = '&bull;'
    this.snowStick = true
    this.targetElement = null
    this.useMeltEffect = true
    this.useTwinkleEffect = false
    this.usePositionFixed = false
    this.usePixelPosition = false
    this.freezeOnBlur = true
    this.flakeLeftOffset = 0
    this.flakeRightOffset = 0
    this.flakeWidth = 8
    this.flakeHeight = 8
    this.vMaxX = 5
    this.vMaxY = 4
    this.zIndex = 0
    if (e.snowStormConfigs) {
      if (e.snowStormConfigs.snowColor) {
        this.snowColor = e.snowStormConfigs.snowColor
      }
      if (e.snowStormConfigs.snowCharacter) {
        this.snowCharacter = e.snowStormConfigs.snowCharacter
      }
    }
    var n = this,
      r,
      i = navigator.userAgent.match(/msie/i),
      s = navigator.userAgent.match(/msie 6/i),
      o = navigator.userAgent.match(/mobile|opera m(ob|in)/i),
      u = i && t.compatMode === 'BackCompat',
      a = u || s,
      f = null,
      l = null,
      c = null,
      h = null,
      p = null,
      d = null,
      v = null,
      m = 1,
      g = 2,
      y = 6,
      b = false,
      w = false,
      E = (function () {
        try {
          t.createElement('div').style.opacity = '0.5'
        } catch (e) {
          return false
        }
        return true
      })(),
      S = false,
      x = t.createDocumentFragment()
    r = (function () {
      function i(t) {
        e.setTimeout(t, 1e3 / (n.animationInterval || 20))
      }

      function u(e) {
        var t = o.style[e]
        return t !== undefined ? e : null
      }

      var r
      var s =
        e.requestAnimationFrame ||
        e.webkitRequestAnimationFrame ||
        e.mozRequestAnimationFrame ||
        e.oRequestAnimationFrame ||
        e.msRequestAnimationFrame ||
        i
      r = s
        ? function () {
            return s.apply(e, arguments)
          }
        : null
      var o
      o = t.createElement('div')
      var a = {
        transform: {
          ie: u('-ms-transform'),
          moz: u('MozTransform'),
          opera: u('OTransform'),
          webkit: u('webkitTransform'),
          w3: u('transform'),
          prop: null
        },
        getAnimationFrame: r
      }
      a.transform.prop = a.transform.w3 || a.transform.moz || a.transform.webkit || a.transform.ie || a.transform.opera
      o = null
      return a
    })()
    this.timer = null
    this.flakes = []
    this.disabled = false
    this.active = false
    this.meltFrameCount = 20
    this.meltFrames = []
    this.setXY = function (e, t, r) {
      if (!e) {
        return false
      }
      if (n.usePixelPosition || w) {
        e.style.left = t - n.flakeWidth + 'px'
        e.style.top = r - n.flakeHeight + 'px'
      } else if (a) {
        e.style.right = 100 - (t / f) * 100 + '%'
        e.style.top = Math.min(r, p - n.flakeHeight) + 'px'
      } else {
        if (!n.flakeBottom) {
          e.style.right = 100 - (t / f) * 100 + '%'
          e.style.bottom = 100 - (r / c) * 100 + '%'
        } else {
          e.style.right = 100 - (t / f) * 100 + '%'
          e.style.top = Math.min(r, p - n.flakeHeight) + 'px'
        }
      }
    }
    this.events = (function () {
      function i(e) {
        var r = n.call(e),
          i = r.length
        if (t) {
          r[1] = 'on' + r[1]
          if (i > 3) {
            r.pop()
          }
        } else if (i === 3) {
          r.push(false)
        }
        return r
      }

      function s(e, n) {
        var i = e.shift(),
          s = [r[n]]
        if (t) {
          i[s](e[0], e[1])
        } else {
          i[s].apply(i, e)
        }
      }

      function o() {
        s(i(arguments), 'add')
      }

      function u() {
        s(i(arguments), 'remove')
      }

      var t = !e.addEventListener && e.attachEvent,
        n = Array.prototype.slice,
        r = { add: t ? 'attachEvent' : 'addEventListener', remove: t ? 'detachEvent' : 'removeEventListener' }
      return { add: o, remove: u }
    })()
    this.randomizeWind = function () {
      var e
      d = N(T(n.vMaxX, 0.2))
      v = T(n.vMaxY, 0.2)
      if (this.flakes) {
        for (e = 0; e < this.flakes.length; e++) {
          if (this.flakes[e].active) {
            this.flakes[e].setVelocities()
          }
        }
      }
    }
    this.scrollHandler = function () {
      var r
      h = n.flakeBottom ? 0 : parseInt(e.scrollY || t.documentElement.scrollTop || (a ? t.body.scrollTop : 0), 10)
      if (isNaN(h)) {
        h = 0
      }
      if (!b && !n.flakeBottom && n.flakes) {
        for (r = 0; r < n.flakes.length; r++) {
          if (n.flakes[r].active === 0) {
            n.flakes[r].stick()
          }
        }
      }
    }
    this.resizeHandler = function () {
      if (e.innerWidth || e.innerHeight) {
        f = e.innerWidth - 16 - n.flakeRightOffset
        c = n.flakeBottom || e.innerHeight
      } else {
        f =
          (t.documentElement.clientWidth || t.body.clientWidth || t.body.scrollWidth) -
          (!i ? 8 : 0) -
          n.flakeRightOffset
        c = n.flakeBottom || t.documentElement.clientHeight || t.body.clientHeight || t.body.scrollHeight
      }
      p = t.body.offsetHeight
      l = parseInt(f / 2, 10)
    }
    this.resizeHandlerAlt = function () {
      f = n.targetElement.offsetWidth - n.flakeRightOffset
      c = n.flakeBottom || n.targetElement.offsetHeight
      l = parseInt(f / 2, 10)
      p = t.body.offsetHeight
    }
    this.freeze = function () {
      if (!n.disabled) {
        n.disabled = 1
      } else {
        return false
      }
      n.timer = null
    }
    this.resume = function () {
      if (n.disabled) {
        n.disabled = 0
      } else {
        return false
      }
      n.timerInit()
    }
    this.toggleSnow = function () {
      if (!n.flakes.length) {
        n.start()
      } else {
        n.active = !n.active
        if (n.active) {
          n.show()
          n.resume()
        } else {
          n.stop()
          n.freeze()
        }
      }
    }
    this.stop = function () {
      var r
      this.freeze()
      for (r = 0; r < this.flakes.length; r++) {
        this.flakes[r].o.style.display = 'none'
      }
      n.events.remove(e, 'scroll', n.scrollHandler)
      n.events.remove(e, 'resize', n.resizeHandler)
      if (n.freezeOnBlur) {
        if (i) {
          n.events.remove(t, 'focusout', n.freeze)
          n.events.remove(t, 'focusin', n.resume)
        } else {
          n.events.remove(e, 'blur', n.freeze)
          n.events.remove(e, 'focus', n.resume)
        }
      }
    }
    this.show = function () {
      var e
      for (e = 0; e < this.flakes.length; e++) {
        this.flakes[e].o.style.display = 'block'
      }
    }
    this.SnowFlake = function (e, i, s) {
      var o = this
      this.type = e
      this.x = i || parseInt(T(f - 20), 10)
      this.y = !isNaN(s) ? s : -T(c) - 12
      this.vX = null
      this.vY = null
      this.vAmpTypes = [1, 1.2, 1.4, 1.6, 1.8]
      this.vAmp = this.vAmpTypes[this.type] || 1
      this.melting = false
      this.meltFrameCount = n.meltFrameCount
      this.meltFrames = n.meltFrames
      this.meltFrame = 0
      this.twinkleFrame = 0
      this.active = 1
      this.fontSize = 10 + (this.type / 5) * 10
      this.o = t.createElement('div')
      this.o.innerHTML = n.snowCharacter
      if (n.className) {
        this.o.setAttribute('class', n.className)
      }
      this.o.style.color = n.snowColor
      this.o.style.position = b ? 'fixed' : 'absolute'
      if (n.useGPU && r.transform.prop) {
        this.o.style[r.transform.prop] = 'translate3d(0px, 0px, 0px)'
      }
      this.o.style.width = n.flakeWidth + 'px'
      this.o.style.height = n.flakeHeight + 'px'
      this.o.style.fontFamily = 'arial,verdana'
      this.o.style.cursor = 'default'
      this.o.style.overflow = 'hidden'
      this.o.style.fontWeight = 'normal'
      this.o.style.zIndex = n.zIndex
      x.appendChild(this.o)
      this.refresh = function () {
        if (isNaN(o.x) || isNaN(o.y)) {
          return false
        }
        n.setXY(o.o, o.x, o.y)
      }
      this.stick = function () {
        if (a || (n.targetElement !== t.documentElement && n.targetElement !== t.body)) {
          o.o.style.top = c + h - n.flakeHeight + 'px'
        } else if (n.flakeBottom) {
          o.o.style.top = n.flakeBottom + 'px'
        } else {
          o.o.style.display = 'none'
          o.o.style.bottom = '0%'
          o.o.style.position = 'fixed'
          o.o.style.display = 'block'
        }
      }
      this.vCheck = function () {
        if (o.vX >= 0 && o.vX < 0.2) {
          o.vX = 0.2
        } else if (o.vX < 0 && o.vX > -0.2) {
          o.vX = -0.2
        }
        if (o.vY >= 0 && o.vY < 0.2) {
          o.vY = 0.2
        }
      }
      this.move = function () {
        var e = o.vX * m,
          t
        o.x += e
        o.y += o.vY * o.vAmp
        if (o.x >= f || f - o.x < n.flakeWidth) {
          o.x = 0
        } else if (e < 0 && o.x - n.flakeLeftOffset < -n.flakeWidth) {
          o.x = f - n.flakeWidth - 1
        }
        o.refresh()
        t = c + h - o.y + n.flakeHeight
        if (t < n.flakeHeight) {
          o.active = 0
          if (n.snowStick) {
            o.stick()
          } else {
            o.recycle()
          }
        } else {
          if (n.useMeltEffect && o.active && o.type < 3 && !o.melting && Math.random() > 0.998) {
            o.melting = true
            o.melt()
          }
          if (n.useTwinkleEffect) {
            if (o.twinkleFrame < 0) {
              if (Math.random() > 0.97) {
                o.twinkleFrame = parseInt(Math.random() * 8, 10)
              }
            } else {
              o.twinkleFrame--
              if (!E) {
                o.o.style.visibility = o.twinkleFrame && o.twinkleFrame % 2 === 0 ? 'hidden' : 'visible'
              } else {
                o.o.style.opacity = o.twinkleFrame && o.twinkleFrame % 2 === 0 ? 0 : 1
              }
            }
          }
        }
      }
      this.animate = function () {
        o.move()
      }
      this.setVelocities = function () {
        o.vX = d + T(n.vMaxX * 0.12, 0.1)
        o.vY = v + T(n.vMaxY * 0.12, 0.1)
      }
      this.setOpacity = function (e, t) {
        if (!E) {
          return false
        }
        e.style.opacity = t
      }
      this.melt = function () {
        if (!n.useMeltEffect || !o.melting) {
          o.recycle()
        } else {
          if (o.meltFrame < o.meltFrameCount) {
            o.setOpacity(o.o, o.meltFrames[o.meltFrame])
            o.o.style.fontSize = o.fontSize - o.fontSize * (o.meltFrame / o.meltFrameCount) + 'px'
            o.o.style.lineHeight = n.flakeHeight + 2 + n.flakeHeight * 0.75 * (o.meltFrame / o.meltFrameCount) + 'px'
            o.meltFrame++
          } else {
            o.recycle()
          }
        }
      }
      this.recycle = function () {
        o.o.style.display = 'none'
        o.o.style.position = b ? 'fixed' : 'absolute'
        o.o.style.bottom = 'auto'
        o.setVelocities()
        o.vCheck()
        o.meltFrame = 0
        o.melting = false
        o.setOpacity(o.o, 1)
        o.o.style.padding = '0px'
        o.o.style.margin = '0px'
        o.o.style.fontSize = o.fontSize + 'px'
        o.o.style.lineHeight = n.flakeHeight + 2 + 'px'
        o.o.style.textAlign = 'center'
        o.o.style.verticalAlign = 'baseline'
        o.x = parseInt(T(f - n.flakeWidth - 20), 10)
        o.y = parseInt(T(c) * -1, 10) - n.flakeHeight
        o.refresh()
        o.o.style.display = 'block'
        o.active = 1
      }
      this.recycle()
      this.refresh()
    }
    this.snow = function () {
      var e = 0,
        t = null,
        i,
        s
      for (i = 0, s = n.flakes.length; i < s; i++) {
        if (n.flakes[i].active === 1) {
          n.flakes[i].move()
          e++
        }
        if (n.flakes[i].melting) {
          n.flakes[i].melt()
        }
      }
      if (e < n.flakesMaxActive) {
        t = n.flakes[parseInt(T(n.flakes.length), 10)]
        if (t.active === 0) {
          t.melting = true
        }
      }
      if (n.timer) {
        r.getAnimationFrame(n.snow)
      }
    }
    this.mouseMove = function (e) {
      if (!n.followMouse) {
        return true
      }
      var t = parseInt(e.clientX, 10)
      if (t < l) {
        m = -g + (t / l) * g
      } else {
        t -= l
        m = (t / l) * g
      }
    }
    this.createSnow = function (e, t) {
      var r
      for (r = 0; r < e; r++) {
        n.flakes[n.flakes.length] = new n.SnowFlake(parseInt(T(y), 10))
        if (t || r > n.flakesMaxActive) {
          n.flakes[n.flakes.length - 1].active = -1
        }
      }
      n.targetElement.appendChild(x)
    }
    this.timerInit = function () {
      n.timer = true
      n.snow()
    }
    this.init = function () {
      var r
      for (r = 0; r < n.meltFrameCount; r++) {
        n.meltFrames.push(1 - r / n.meltFrameCount)
      }
      n.randomizeWind()
      n.createSnow(n.flakesMax)
      n.events.add(e, 'resize', n.resizeHandler)
      n.events.add(e, 'scroll', n.scrollHandler)
      if (n.freezeOnBlur) {
        if (i) {
          n.events.add(t, 'focusout', n.freeze)
          n.events.add(t, 'focusin', n.resume)
        } else {
          n.events.add(e, 'blur', n.freeze)
          n.events.add(e, 'focus', n.resume)
        }
      }
      n.resizeHandler()
      n.scrollHandler()
      if (n.followMouse) {
        n.events.add(i ? t : e, 'mousemove', n.mouseMove)
      }
      n.animationInterval = Math.max(20, n.animationInterval)
      n.timerInit()
    }
    this.start = function (r) {
      if (!S) {
        S = true
      } else if (r) {
        return true
      }
      if (typeof n.targetElement === 'string') {
        var i = n.targetElement
        n.targetElement = t.getElementById(i)
        if (!n.targetElement) {
          throw new Error('Snowstorm: Unable to get targetElement "' + i + '"')
        }
      }
      if (!n.targetElement) {
        n.targetElement = t.body || t.documentElement
      }
      if (n.targetElement !== t.documentElement && n.targetElement !== t.body) {
        n.resizeHandler = n.resizeHandlerAlt
        n.usePixelPosition = true
      }
      n.resizeHandler()
      n.usePositionFixed = n.usePositionFixed && !a && !n.flakeBottom
      if (e.getComputedStyle) {
        try {
          w = e.getComputedStyle(n.targetElement, null).getPropertyValue('position') === 'relative'
        } catch (s) {
          w = false
        }
      }
      b = n.usePositionFixed
      if (f && c && !n.disabled) {
        n.init()
        n.active = true
      }
    }
    if (n.autoStart) {
      k()
    }
    return this
  })(window, document)
})()
