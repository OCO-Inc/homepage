const Slider = function (container, parameters) {
  parameters = parameters || {}
  let width = (undefined === parameters.width ? 0 : parameters.width)
  let height = (undefined === parameters.height ? 0 : parameters.height)
  const autoReturnToCenter = (undefined === parameters.autoReturnToCenter ? true : parameters.autoReturnToCenter)
  const orientation = (undefined === parameters.orientation ? 'vertical' : parameters.orientation)
  const minimum = (undefined === parameters.minimum ? 0 : parameters.minimum)
  const maximum = (undefined === parameters.maximum ? 100 : parameters.maximum)
  const initial = (undefined === parameters.initial ? 50 : parameters.initial)

  const objContainer = document.getElementById(container)
  const canvas = document.createElement('canvas')
  objContainer.appendChild(canvas)
  const context = canvas.getContext('2d')
  if (width === 0) { width = objContainer.clientWidth }
  if (height === 0) { height = objContainer.clientHeight }
  canvas.width = width
  canvas.height = height
  let pressed = 0
  let thumbY = 0
  let thumbX = 0
  if (orientation === 'vertical') {
    thumbY = height - (height * (initial - minimum) / (maximum - minimum))
  } else {
    thumbX = width * (initial - minimum) / (maximum - minimum)
  }
  let lastY = 0
  let lastX = 0
  let movedY = 0
  let movedX = 0
  let posX = thumbX
  let posY = thumbY

  let onChangeHandler = function (e) { }

  function drawExternal () {
    context.fillStyle = '#dddddd'
    context.fillRect(0, 0, width, height)
  }
  function drawInternal () {
    context.fillStyle = '#17a2b8'
    if (orientation === 'vertical') {
      context.fillRect(0, posY - 10, width, 20)
    } else {
      context.fillRect(posX - 10, 0, 20, height)
    }
  }

  function value () {
    if (orientation === 'vertical') {
      return (-1 * (posY - height) / height) * (maximum - minimum) + minimum
    } else {
      return (posX / width) * (maximum - minimum) + minimum
    }
  }
  /**
	 * @desc Events for manage touch
	 */
  function onTouchStart (event) {
    pressed = 1
    lastY = event.targetTouches[0].pageY
    lastX = event.targetTouches[0].pageX
    onChangeHandler({
      value: value()
    })
  }
  function onTouchMove (event) {
    // Prevent the browser from doing its default thing (scroll, zoom)
    event.preventDefault()
    if (pressed === 1) {
      movedY = lastY - event.targetTouches[0].pageY
      movedX = lastX - event.targetTouches[0].pageX
      lastY = event.targetTouches[0].pageY
      lastX = event.targetTouches[0].pageX
      if (orientation === 'vertical') {
        posY -= movedY
        if (posY < 0) {
          posY = 0
        } else if (posY > height) {
          posY = height
        }
      } else {
        posX -= movedX
        if (posX < 0) {
          posX = 0
        } else if (posX > width) {
          posX = width
        }
      }

      context.clearRect(0, 0, canvas.width, canvas.height)
      // Redraw object
      drawExternal()
      drawInternal()
      onChangeHandler({
        value: value()
      })
    }
  }
  function onTouchEnd (event) {
    pressed = 0
    // If required reset position store variable

    if (autoReturnToCenter) {
      posY = thumbY
      posX = thumbX
    }
    // Delete canvas
    context.clearRect(0, 0, canvas.width, canvas.height)
    // Redraw object
    drawExternal()
    drawInternal()
    onChangeHandler({
      value: value()
    })
  }
  /**
	 * @desc Events for manage mouse
	 */
  function onMouseDown (event) {
    pressed = 1
    lastY = event.pageY
    lastX = event.pageX
    onChangeHandler({
      value: value()
    })
  }
  function onMouseMove (event) {
    if (pressed === 1) {
      movedY = lastY - event.pageY
      movedX = lastX - event.pageX
      lastY = event.pageY
      lastX = event.pageX
      if (orientation === 'vertical') {
        posY -= movedY
        if (posY < 0) {
          posY = 0
        } else if (posY > height) {
          posY = height
        }
      } else {
        posX -= movedX
        if (posX < 0) {
          posX = 0
        } else if (posX > width) {
          posX = width
        }
      }
      // Delete canvas
      context.clearRect(0, 0, canvas.width, canvas.height)
      // Redraw object
      drawExternal()
      drawInternal()
      onChangeHandler({
        value: value()
      })
    }
  }
  function onMouseUp (event) {
    pressed = 0
    // If required reset position store variable
    if (autoReturnToCenter) {
      posY = thumbY
      posX = thumbX
    }
    // Delete canvas
    context.clearRect(0, 0, canvas.width, canvas.height)
    // Redraw object
    drawExternal()
    drawInternal()
    onChangeHandler({
      value: value()
    })
  }

  if ('ontouchstart' in document.documentElement) {
    canvas.addEventListener('touchstart', onTouchStart, false)
    canvas.addEventListener('touchmove', onTouchMove, false)
    canvas.addEventListener('touchend', onTouchEnd, false)
  } else {
    canvas.addEventListener('mousedown', onMouseDown, false)
    canvas.addEventListener('mousemove', onMouseMove, false)
    canvas.addEventListener('mouseup', onMouseUp, false)
  }
  drawExternal()
  drawInternal()

  this.getValue = function () {
    return value()
  }
  this.on = function (event, handler) {
    if (event === 'change') {
      onChangeHandler = handler
    }
  }
  this.rescale = function () {

  }
}
