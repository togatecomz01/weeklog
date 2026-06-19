import { useEffect, useState } from 'react'
import './ScrollTop.scss'

function ScrollTop() {
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsShow(window.scrollY > 50)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function handleClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isShow) return null

  return (
    <button type="button" className="scroll-top" onClick={handleClick}>
      <span className="scroll-top-line"></span>
      <span className="scroll-top-arrow"></span>
    </button>
  )
}

export default ScrollTop
