import '../Components.scss'

import ButtonContainer from '@/components/ButtonContainer'
import Button from '@/components/Button'
import SendIcon from '@/components/icons/SendIcon'

function ButtonGuide() {
    return (
        <div className="guide-content">
            <h1 className="guide-title">Button</h1>
            <div className="guide-section">
                <h2 className="guide-section-title">하단 2단 버튼</h2>
                <div className="guide-example">
                    <ButtonContainer>
                        <Button variant="secondary">임시저장</Button>
                        <Button>등록</Button>
                    </ButtonContainer>
                </div>
            </div>

            <div className="guide-section">
                <h2 className="guide-section-title">하단 1단 버튼</h2>
                <div className="guide-example">
                    <ButtonContainer>
                        <Button>비밀번호 등록</Button>
                    </ButtonContainer>
                </div>
            </div>

            <div className="guide-section">
                <h2 className="guide-section-title">disabled</h2>
                <div className="guide-example">
                    <ButtonContainer>
                        <Button variant="secondary" disabled>임시저장</Button>
                        <Button disabled>등록</Button>
                    </ButtonContainer>
                </div>
            </div>

            <div className="guide-section">
                <h2 className="guide-section-title">full 버튼</h2>
                <div className="guide-example">
                    <Button variant="more" fullWidth >더보기</Button>
                    <Button fullWidth>로그인</Button>
                </div>
            </div>

            <div className="guide-section">
                <h2 className="guide-section-title">기타</h2>
                <div className="guide-example">
                    <Button variant="send"><SendIcon /> 보내기</Button>
                    <Button variant="secondary" logout>로그아웃</Button>
                </div>
            </div>
        </div>
    )
}

export default ButtonGuide