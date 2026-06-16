import { useState } from 'react'
import './Components.scss'

import ButtonContainer from '@/components/ButtonContainer'
import Button from '@/components/Button'
import SendIcon from '@/components/icons/SendIcon'
import CheckCircleIcon from '@/components/icons/CheckCircleIcon'
import LogoutIcon from '@/components/icons/LogoutIcon'
import Badge from '@/components/Badge'
import Input from '@/components/Input'
import Radio from '@/components/Radio'
import Select from '@/components/Select'
import RadioGroup from '@/components/Radio/RadioGroup'

function Components() {
    const [selected, setSelected] = useState('a')
    const [value, setValue] = useState('')

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
            <ButtonContainer>
                <Badge type="normal" />
                <Badge type="important" />
                <Badge type="urgent" />
            </ButtonContainer>

            <h2>input</h2>
            <div className='section'>
                <Input placeholder="placeholder" />
                <Input type="password" placeholder="password" />
                <Input disabled placeholder="disabled" />
                <Input
                    placeholder="placeholder"
                    error={true}
                    errorMessage="유효성 체크 문구"
                />
            </div>

            <h2>radio</h2>
            <RadioGroup>
                <Radio
                    label="일반"
                    value="a"
                    checked={selected === 'a'}
                    onChange={() => setSelected('a')}
                />
                <Radio
                    label="중요"
                    value="b"
                    checked={selected === 'b'}
                    onChange={() => setSelected('b')}
                />
                <Radio
                    label="높음"
                    value="c"
                    checked={selected === 'c'}
                    onChange={() => setSelected('c')}
                />
            </RadioGroup>

            <h2>select</h2>
            <div className='section'>
                <Select
                    options={[
                        { value: '1', label: '옵션 1' },
                        { value: '2', label: '옵션 2' },
                        { value: '3', label: '옵션 3' },
                    ]}
                    value={value}
                    onChange={setValue}
                    placeholder="선택하세요"
                />
                <Select options={[
                    { value: '1', label: '옵션 1' },
                    { value: '2', label: '옵션 2' },
                    { value: '3', label: '옵션 3' },
                ]} disabled />
            </div>
        </div>
    )
}

export default Components
