import { useState } from 'react'
import '../Components.scss'
import Select from '@/components/Select'

function SelectGuide() {
    const [value, setValue] = useState('')
    return (
        <div className="guide-content">
            <h1 className="guide-title">Input</h1>
            <div className="guide-section">
                <div className="guide-example">
                    <div className='section'>
                        <div className="input-wrap">
                            <Select
                                label="기본"
                                options={[
                                    { value: '1', label: '옵션 1' },
                                    { value: '2', label: '옵션 2' },
                                    { value: '3', label: '옵션 3' },
                                ]}
                                value={value}
                                onChange={setValue}
                                placeholder="선택하세요"
                            />
                            <Select
                                label="disabled"
                                options={[
                                { value: '1', label: '옵션 1' },
                                { value: '2', label: '옵션 2' },
                                { value: '3', label: '옵션 3' },
                            ]} disabled />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectGuide