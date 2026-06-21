import { useEffect, useState } from 'react'
import arrowIcon from '@/assets/svg/ico_h_arr.svg'
import closeIcon from '@/assets/svg/ico_close.svg'
import './DetailHeader.scss'

type DetailHeaderType = 'back' | 'close'

interface DetailHeaderProps {
  title: string
  type?: DetailHeaderType
  scrollTargetRef?: React.RefObject<HTMLElement | null>
  className?: string
  onClick?: () => void
}

function DetailHeader({
  title,
  type = 'back',
  scrollTargetRef,
  className = '',
  onClick,
}: DetailHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const isClose = type === 'close'
  const classes = [
    'detail-header',
    isClose ? 'header-popup' : '',
    isScrolled ? 'is-scroll' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    const target = scrollTargetRef?.current
    const scrollElement = target || window
    const getScrollTop = () => (target ? target.scrollTop : window.scrollY)
    const handleScroll = () => {
      setIsScrolled(getScrollTop() > 0)
    }

    handleScroll()
    scrollElement.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [scrollTargetRef])

  return (
    <header className={classes}>
      <button type="button" className="header-button" onClick={onClick}>
        <img className="header-icon" src={isClose ? closeIcon : arrowIcon} alt="" />
      </button>
      <strong className="header-title">{title}</strong>
    </header>
  )
}

export default DetailHeader
