import React, { useRef, useEffect } from "react"
import "./popup.scss"

const Popup = ({ children, title }) => {
  const popRef = useRef()
  useEffect(() => {
    const { height, width } = popRef.current.getBoundingClientRect()
    popRef.current.style.marginLeft = (width / 2) * -1 + "px"
    popRef.current.style.marginTop = (height / 2) * -1 + "px"
  })
  return (
    <>
      <div ref={popRef} className="popup">
        <div className="popup-header">{title}</div>
        {children}
      </div>
    </>
  )
}

export default Popup
