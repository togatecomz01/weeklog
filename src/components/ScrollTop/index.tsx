import { useEffect, useState } from 'react'
import './ScrollTop.scss'

interface ScrollTopProps {
  scrollTargetRef?: React.RefObject<HTMLElement | null>
  hasBottomButton?: boolean
}

function ScrollTop({ scrollTargetRef, hasBottomButton = false }: ScrollTopProps) {
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    const target = scrollTargetRef?.current
    const scrollElement = target || window
    
    function getScrollTop() {
      return target ? target.scrollTop : window.scrollY
    }
    function handleScroll() {
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
    <button type="button" className={`scroll-top${hasBottomButton ? ' scroll-top-with-button' : ''}`} onClick={handleClick} aria-label="맨 위로 이동" >
      <span className="scroll-top-line" aria-hidden="true"></span>
      <span className="scroll-top-arrow" aria-hidden="true"></span>
    </button>
  )
}

export default ScrollTop
