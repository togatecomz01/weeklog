import ButtonContainer from '@/components/ButtonContainer'
import './Components.scss'
import Button from '@/components/Button'
import SendIcon from '@/components/icons/SendIcon'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon'
import LogoutIcon from '@/components/icons/LogoutIcon'

function Components() {
    return (
        <div>
            <h1>공통</h1>
            <h2>하단 2단 버튼</h2>
            <div className='section'>
                <h3>기본</h3>
                <ButtonContainer>
                    <Button variant="secondary">임시저장</Button>
                    <Button>등록</Button>
                </ButtonContainer>
            </div>

            <div className='section'>
                <h3>disabled</h3>
                <ButtonContainer>
                    <Button variant="secondary" disabled>임시저장</Button>
                    <Button disabled>등록</Button>
                </ButtonContainer>
            </div>

            <h2>full 버튼</h2>
            <div className='section'>
                <Button variant="secondary" fullWidth >더보기</Button>
                <Button fullWidth>로그인</Button>
                <Button variant="inbox" fullWidth startIcon={<SendIcon />}>스윗으로 보내기</Button>
                <Button variant="inbox" fullWidth startIcon={<CheckCircleIcon />} disabled>전송 완료</Button>
            </div>

            <h2>기타</h2>
            <div className='section'>
                <Button variant="secondary" logout startIcon={<LogoutIcon />}>로그아웃</Button>
            </div>
            <h2>뱃지</h2>

        </div>
    )
}

export default Components
