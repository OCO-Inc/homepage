window.onload = function () {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  let centerX, centerY
  let mousedown = false
  let X, Y
  const P = []

  const part = function (x, y, vx, vy, r, col, birthTime, dt) { // Assembler for particles
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.r = r
    this.col = col
    this.birthTime = birthTime
    this.dt = dt
  }

  const s = { // Default settings
    totalStars: 2000,
    dtMin: 10000,
    dtMax: 180000,
    velDecay: 0.985,
    rMin: 1,
    rMax: 6,
    rRepel: 100,
    rAttract: 200,
    repelStrength: 80,
    attractStrength: 15,
    elasticity: 0.45,
    startVelAmt: 1,
    col: '#f7eedf',
    bgCol: '#05050a',
    invMouseDown: false,
    spawnVel: false,
    showPrompt: true,
    collision: true,
    death: true
  }

  function hexToRGB (hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    return 'rgb(' + r + ', ' + g + ', ' + b + ')'
  }

  function livelyPropertyListener (name, val) { // Listens for Lively Wallpaper's configuration change calls
    if (s.hasOwnProperty(name)) {
      if (['elasticity', 'velDecay'].includes(name)) { // for percentage
        val = val * 100
      }
      if (['dtMin', 'dtMax'].includes(name)) { // for time in seconds
        val = val * 1000
      }
      if (['col', 'bgCol'].includes(name)) { // for hex color
        val = hexToRGB(val)
      }
      s[name] = val // apply setting globally, even if no operations were performed
    }
  }

  function checkCollision (p1, p2) { // If two stars are beside or clipping into each other, return true
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < (p1.r + p2.r)
  }

  function resolveCollision (p1, p2) {
    const dx = p1.x - p2.x // Calculates how far clipped in they are (touching = 0)
    const dy = p1.y - p2.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    const nx = dx / distance // find vector based on the distance variable
    const ny = dy / distance

    const overlap = (p1.r + p2.r) - distance // Calculate overlap and push the particles apart to avoid it
    p1.x += nx * overlap / 2
    p1.y += ny * overlap / 2
    p2.x -= nx * overlap / 2
    p2.y -= ny * overlap / 2

    const dvx = p1.vx - p2.vx // Check if the particles are already moving away from each other - if so, exit function
    const dvy = p1.vy - p2.vy
    const velocityAlongNormal = dvx * nx + dvy * ny
    if (velocityAlongNormal > 0) return

    const impulse = (2 * velocityAlongNormal) / (p1.r + p2.r) * s.elasticity // Determine how much particles should "bounce" and then subtract some based on their elasticity (0 = no velocity, 1 = perfect transfer)
    p1.vx -= impulse * p2.r * nx
    p1.vy -= impulse * p2.r * ny
    p2.vx += impulse * p1.r * nx
    p2.vy += impulse * p1.r * ny

    p1.vx *= 0.99 // Slightly decay velocity of both particles to make orbiting more realistic
    p1.vy *= 0.99
    p2.vx *= 0.99
    p2.vy *= 0.99
  }

  function rand (min, max) {
    return Math.random() * (max - min) + min
  }

  function size () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    centerX = canvas.width / 2
    centerY = canvas.height / 2
  }

  function init () { // Populate the screen with particles using specific values
    let x, y, vx, vy, r, col, birthTime, dt
    const particlesToAdd = s.totalStars - P.length

    for (let i = 0; i < particlesToAdd; i++) {
      x = rand(0, canvas.width)
      y = rand(0, canvas.height)

		 if (s.spawnVel) {
        vx = rand(-Math.abs(s.startVelAmt), Math.abs(s.startVelAmt))
        vy = rand(-Math.abs(s.startVelAmt), Math.abs(s.startVelAmt))
		 } else {
		   vx = 0
		   vy = 0
		 }
      r = rand(s.rMin, s.rMax / 2)
		 if (r > s.rMax / 2.8) {
		   r = rand(s.rMin, s.rMax)
		 }

      col = s.col
      birthTime = Date.now()
      dt = rand(s.dtMin, s.dtMax)

      P.push(new part(x, y, vx, vy, r, col, birthTime, dt))
    }
  }

  function bg () { // set background color
    ctx.fillStyle = 's.bgCol'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  function bounce (b) { // Check for collision with walls and bounce
    if (b.x < b.r) {
      b.x = b.r
      b.vx *= -1
    }
    if (b.x > canvas.width - b.r) {
      b.x = canvas.width - b.r
      b.vx *= -1
    }

    if (b.y - b.r < 0) {
      b.y = b.r
      b.vy *= -1
    }
    if (b.y > canvas.height - b.r) {
      b.y = canvas.height - b.r
      b.vy *= -1
    }
  }

  function attract (p) { // Simulate attraction and repelling between the mouse and particles
    dx = (p.x - X),
    dy = (p.y - Y),
    dist = Math.sqrt(dx * dx + dy * dy),
    angle = Math.atan2(dy, dx)

    if (!mousedown && dist < s.rAttract && dist > 7) {
      p.vx -= (s.attractStrength / (p.r * dist)) * Math.cos(angle)
      p.vy -= (s.attractStrength / (p.r * dist)) * Math.sin(angle)
    } else if (mousedown && dist < s.rRepel) {
      p.vx += (s.repelStrength / (p.r * dist)) * Math.cos(angle)
      p.vy += (s.repelStrength / (p.r * dist)) * Math.sin(angle)
    } else if (!mousedown && dist < 2) {
      p.vx = rand(-0.2, 0.2)
      p.vy = rand(-0.2, 0.2)
    }
  }

  function drawCircle (ctx, x, y, radius) { // function for drawing stars physically
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fill()
  }

  function draw () { // Calculates drawing particles.
	  let p
    const currentTime = Date.now()

	  if (s.showPrompt) {
	    ctx.fillStyle = 'white' // Instruction text
      ctx.font = '12px caption'
      ctx.fillText('Move your mouse around to collect stars, and click to release them!', 10, 10)
    }

    for (let i = P.length - 1; i >= 0; i--) { // work through every particle in the list
      p = P[i]

      if (death) {
        const age = currentTime - p.birthTime // Kill any particles who should be dead
        if (age > p.dt) {
          P.splice(i, 1)
          continue
        }
      }

      if (s.collision) { // check for collision
        for (let j = i - 1; j >= 0; j--) {
          const otherP = P[j]
          if (checkCollision(p, otherP)) {
            resolveCollision(p, otherP)
          }
        }
      }
      if (mouseover) attract(p)
      bounce(p)

      p.x += p.vx
      p.y += p.vy

      p.vx *= s.velDecay // velocity decay
      p.vy *= s.velDecay

      ctx.fillStyle = p.col
      drawCircle(ctx, p.x, p.y, p.r)
    }
  }

  function loop () { // Animation loop
    bg()
    draw()
    init()
    window.requestAnimationFrame(loop)
  }

  // Code ran when the website is opened
  window.onresize = size

  window.onmousemove = function (e) {
    X = e.clientX
    Y = e.clientY
  }

  window.onmouseup = function () {
    if (s.invMouseDown) {
      mousedown = false
    } else {
      mousedown = true
    }
  }

  window.onmousedown = function () {
    if (s.invMouseDown) {
      mousedown = true
    } else {
      mousedown = false
    }
  }

  var mouseover = false

  window.onmouseover = function () {
    mouseover = true
  }

  window.onmouseout = function () {
    mouseover = false
  }

  init()
  loop()
}
