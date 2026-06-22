import { useState } from 'react'
import '../Components.scss'

import RadioGroup from '@/components/Radio/RadioGroup'
import Radio from '@/components/Radio'

function RadioGuide() {
    const [selected, setSelected] = useState('a')
    return (
        <div className="guide-content">
            <h1 className="guide-title">Radio</h1>
            <div className="guide-section">
                <h2 className="guide-section-title">기본</h2>
                <div className="guide-example">
                    <RadioGroup>
                        <Radio
                            label="보통"
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
                </div>
            </div>
            <div className="guide-section">
                <h2 className="guide-section-title">label있을 때</h2>
                <div className="guide-example">
                    <RadioGroup label="구분" required>
                        <Radio
                            label="라디오1"
                            name="type"
                            value="d"
                            checked={selected === 'd'}
                            onChange={() => setSelected('d')}
                        />
                        <Radio
                            label="라디오2"
                            name="type"
                            value="f"
                            checked={selected === 'f'}
                            onChange={() => setSelected('f')}
                        />
                    </RadioGroup>
                </div>
            </div>
        </div>
    )
}

export default RadioGuide