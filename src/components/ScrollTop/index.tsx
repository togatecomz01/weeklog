import { useEffect, useState } from 'react'
import './ScrollTop.scss'

interface ScrollTopProps {
  scrollTargetRef?: React.RefObject<HTMLElement | null>
}

function ScrollTop({ scrollTargetRef }: ScrollTopProps) {
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    const target = scrollTargetRef?.current
    const scrollElement = target || window
    const getScrollTop = () => (target ? target.scrollTop : window.scrollY)
    const handleScroll = () => {
      setIsShow(getScrollTop() > 50)
    }

    handleScroll()
    scrollElement.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [scrollTargetRef])

  function handleClick() {
    const target = scrollTargetRef?.current

    if (target) {
      target.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

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
