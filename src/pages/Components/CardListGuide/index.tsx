import '../Components.scss'

import WeekCard from '@/components/WeekCard'
import WeekCardList from '@/components/WeekCard/WeekCardList'
import CompletedTaskCard from '@/components/CompletedTaskCard'
import CompletedTaskCardList from '@/components/CompletedTaskCard/CompletedTaskCardList'

const WEEK_CARD_CONTENT = `1. 업무보고 시스템 개발 완료
2. ERP 연동 설계 진행중
3. 모바일 앱 검토 예정
4. 디자인 가이드 정리 예정`

const TASK_ITEMS = [
    '등록페이지 화면 설계 정리 완료',
    '업무 내용 항목명 확정',
]

function CardListGuide() {
    return (
        <div className="guide-content">
            <h1 className="guide-title">CardList</h1>
            <div className="guide-section">
                <h2 className="guide-section-title">메인 카드 리스트</h2>
                <div className="guide-example">
                    <WeekCardList>
                        <WeekCard
                            week="6월 2주"
                            priority="important"
                            content={WEEK_CARD_CONTENT}
                            status="unsent"
                        />
                        <WeekCard
                            week="6월 2주"
                            priority="normal"
                            content={WEEK_CARD_CONTENT}
                            status="partial"
                        />
                        <WeekCard
                            week="6월 2주"
                            priority="urgent"
                            content={WEEK_CARD_CONTENT}
                            status="sent"
                        />
                    </WeekCardList>
                </div>
            </div>

            <div className="guide-section">
                <h2 className="guide-section-title">상세 카드 리스트</h2>
                <div className="guide-example">
                    <CompletedTaskCardList>
                        <CompletedTaskCard
                            status="todo"
                            sent={false}
                            items={TASK_ITEMS}
                            onSend={() => console.log('전송')}
                        />
                        <CompletedTaskCard
                            status="doing"
                            sent={false}
                            items={TASK_ITEMS}
                            onSend={() => console.log('전송')}
                        />
                        <CompletedTaskCard
                            status="done"
                            sent={true}
                            items={TASK_ITEMS}
                            onSend={() => console.log('전송')}
                        />
                    </CompletedTaskCardList>
                </div>
            </div>
        </div>
    )
}

export default CardListGuide
