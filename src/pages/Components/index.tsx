import { useState } from 'react'
import ButtonGuide from './ButtonGuide'
import BadgeGuide from './BadgeGuide'
import InputGuide from './InputGuide'
import SelectGuide from './SelectGuide'
import RadioGuide from './RadioGuide'
import CardListGuide from './CardListGuide'
import AlertGuide from './AlertGuide'
import './Components.scss'

const MENU_LIST = [
    { id: 'button', label: 'Button', Component: ButtonGuide},
    { id: 'badge', label: 'Badge', Component: BadgeGuide},
    { id: 'input', label: 'Input', Component: InputGuide},
    { id: 'selectbox', label: 'Selectbox', Component: SelectGuide},
    { id: 'radio', label: 'Radio', Component: RadioGuide},
    { id: 'cardList', label: 'CardList', Component: CardListGuide},
    { id: 'popup', label: 'Popup', Component: AlertGuide},
]

function Components() {
    const [activeID, setAtiveID] = useState('button')
    const activeMenu = MENU_LIST.find((menu) => menu.id === activeID)
    const ActiveComponent = activeMenu?.Component
    return (
        <div>
            <div className="component-header">
                <h1>component guide</h1>
            </div>
            <div className="component-wrap">
                <aside className="component-side">
                    <p className="side-title">Components</p>
                    <ul className="side-nav">
                        {MENU_LIST.map((menu) => (
                        <li className="nav-item" key={menu.id}>
                            <button type="button" className={['nav-btn', activeID === menu.id ? 'is-active' : ''].filter(Boolean).join(' ')} onClick={() => setAtiveID(menu.id)}>{menu.label}</button>
                        </li>
                        ))}
                    </ul>
                </aside>

                <main className="component-content">
                    {ActiveComponent && <ActiveComponent />}
                </main>
            </div>
        </div>
    )
}

export default Components
