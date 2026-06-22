import '../Components.scss'

import Input from '@/components/Input'
import Textarea from '@/components/Textarea'

function InputGuide() {
    return (
        <div className="guide-content">
            <h1 className="guide-title">Input</h1>
            <div className="guide-section">
                <div className="guide-example">
                    <div className='section'>
                        <div className="input-wrap">
                            <Input label="기본" placeholder="placeholder" />
                            <Input label="패스워드" type="password" placeholder="password" />
                            <Input label="focus" className="is-focus" placeholder="placeholder" />
                            <Input label="disabled" disabled placeholder="disabled" />
                            <Input label="유효성 체크"
                            placeholder="placeholder"
                            error={true}
                            errorMessage="유효성 체크 문구"
                            />
                            <Textarea label="Textarea" placeholder="textarea" />
                            <Textarea label="Textarea disabled" disabled placeholder="disabled" />
                            <Textarea
                            label="Textarea 유효성 체크"
                            placeholder="textarea"
                            error={true}
                            errorMessage="유효성 체크 문구"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InputGuide
