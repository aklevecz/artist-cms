export const lerpTranslateY = (el, start, finish) => {
  let frame
  let counter = 0
  let val = start
  const animate = () => {
    if (counter > 1) {
      return cancelAnimationFrame(frame)
    }
    val = start + (finish - start) * easeIn(counter)
    el.setAttribute("transform", `translate(0, ${val})`)
    counter += 0.1
    requestAnimationFrame(animate)
  }
  animate()
}

function easeIn(x) {
  return 1 - Math.cos((x * Math.PI) / 2)
}
