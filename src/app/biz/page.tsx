'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import Head from 'next/head';

// In a real application, this data would come from an API
const MOCK_DATA = {
    notifications: [
        { text: "공고 '반도체 생산직' 마감이 3일 남았습니다.", time: "오늘", type: "urgent" },
        { text: "새로운 면접 신청자가 있습니다. (3명)", time: "오늘", type: "info" },
        { text: "오늘 오후 2시 면접 일정이 있습니다.", time: "3시간 전", type: "alert" }
    ],
    applicants: [
        {id:1, name:'Nguyen Van', visa:'E-9', date:'2026.01.25 14:00', topik:'3급', nationality: '베트남', note:'기숙사 필수', history:'- 2020~2022: 삼성전자 1차 협력사 근무 (조립)<br>- 2023: 경기도 소재 제조업체 근무<br>- 성실하고 야근 가능함'},
        {id:2, name:'Aditya Singh', visa:'E-7', date:'2026.01.26 10:00', topik:'4급', nationality: '인도', note:'즉시 출근 가능', history:'용접 기능사 자격증 보유'},
        {id:3, name:'Bui Tuan', visa:'D-2', date:'2026.01.28 16:00', topik:'2급', nationality: '베트남', note:'주말 근무 선호', history:'유학생, 아르바이트 경력 다수'}
    ],
    schedules: {
        upcoming: [
            {name: 'Nguyen Van', time: '01.25 (금) 14:00', status: 'scheduled'},
            {name: 'Aditya Singh', time: '01.26 (토) 10:00', status: 'scheduled'}
        ],
        past: [
            {name: 'Tran Minh', time: '01.10 14:00', status: 'passed'},
            {name: 'Kim Chul', time: '01.05 11:00', status: 'failed'},
            {name: 'Li Wei', time: '01.02 15:00', status: 'completed'}
        ]
    }
};

// This is a placeholder for your actual authentication check.
// Replace this with your actual authentication logic (e.g., from a context or session).
const useAuth = () => {
    return { isLoggedIn: true, user: { name: '삼성전자 평택', type: '기업회원' } };
};


export default function BizPage() {
    const { isLoggedIn, user } = useAuth();
    const [view, setView] = useState('dashboard');
    const [pageTitle, setPageTitle] = useState('대시보드');
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
    const [selectedAmount, setSelectedAmount] = useState(50000);
    const [points, setPoints] = useState(150000);
    const [modalApplicant, setModalApplicant] = useState(null);

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        // Initialize I'mport
        if (window.IMP) {
            window.IMP.init("imp05203088");
        }

        // Set posting end date
        const today = new Date();
        const future = new Date(new Date().setMonth(today.getMonth() + 3));
        const yyyy = future.getFullYear();
        const mm = String(future.getMonth() + 1).padStart(2, '0');
        const dd = String(future.getDate()).padStart(2, '0');
        const postingEndDateInput = document.getElementById('posting-end-date') as HTMLInputElement;
        if (postingEndDateInput) {
            postingEndDateInput.value = `${yyyy}-${mm}-${dd}`;
        }
    }, []);

    useEffect(() => {
        if (view === 'dashboard' && chartRef.current && window.Chart) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new window.Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['1주', '2주', '3주', '4주'],
                    datasets: [
                        { label: '지원자 수', data: [5, 12, 8, 15], borderColor: '#0ea5e9', backgroundColor: '#0ea5e9', tension: 0, borderWidth: 2, pointStyle: 'circle', pointRadius: 4, pointHoverRadius: 6 },
                        { label: '조회수', data: [20, 45, 30, 60], borderColor: '#cbd5e1', backgroundColor: '#cbd5e1', tension: 0, borderWidth: 2, pointStyle: 'rectRot', pointRadius: 4, pointHoverRadius: 6 }
                    ]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { grid: { borderDash: [4, 4] }, beginAtZero: true },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    }, [view]);

    if (!isLoggedIn) {
        // In a real app, you would redirect to the login page.
        // For example, using Next.js navigation:
        // import { redirect } from 'next/navigation';
        // redirect('/login');
        return <div className="flex h-screen w-full items-center justify-center">Please log in to view the business dashboard.</div>;
    }

    const handleRouteChange = (newView, title) => {
        setView(newView);
        setPageTitle(title);
    };

    const execDaumPostcode = () => {
        if (window.daum) {
            new window.daum.Postcode({
                oncomplete: function(data) {
                    (document.getElementById("address_input") as HTMLInputElement).value = data.address;
                }
            }).open();
        }
    };

    const requestPayment = () => {
        if (window.IMP) {
            window.IMP.request_pay({
                pg: 'html5_inicis', pay_method: 'card', merchant_uid: 'jobchaja_biz_' + new Date().getTime(), 
                name: selectedAmount === 50000 ? 'JobChaja 일반 공고' : 'JobChaja 프리미엄 공고',
                amount: selectedAmount,
                buyer_email: 'admin@yedangin.com', buyer_name: '최운아', buyer_tel: '010-7209-7488',
                buyer_addr: '경기도 안산시 상록구 조구나리 1길 58', buyer_postcode: '15585'
            }, (rsp) => {
                if (rsp.success) {
                    alert('결제가 성공하였습니다! 공고가 등록됩니다.');
                    handleRouteChange('jobs', '공고 관리');
                } else {
                    alert('결제 실패: ' + rsp.error_msg);
                }
            });
        }
    };
    
    const openApplicantModal = (id) => {
        const applicant = MOCK_DATA.applicants.find(p => p.id === id);
        if (applicant) setModalApplicant(applicant);
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`}></div>);
        
        for (let i = 1; i <= lastDate; i++) {
            let eventHtml = null;
            if (year === 2026 && month === 0 && i === 25) {
                eventHtml = <div className="mt-1 text-[9px] bg-brand-500 text-white rounded px-1 truncate">Nguyen 면접</div>;
            }
            days.push(
                <div key={i} className="calendar-day bg-white border border-slate-100 rounded-lg p-1 hover:bg-slate-50 transition cursor-pointer relative flex flex-col" onClick={() => handleRouteChange('applicants', '지원자 현황')}>
                    <span className="font-bold text-slate-700 ml-1 mt-1">{i}</span>
                    {eventHtml}
                </div>
            );
        }
        return days;
    };

    const changeMonth = (diff) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + diff);
            return newDate;
        });
    };

    return (
        <>
            <Head>
                <title>JobChaja - 기업용 대시보드</title>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>
            <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js" strategy="lazyOnload" />
            <Script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js" strategy="lazyOnload" />
            <Script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js" strategy="lazyOnload" />
            <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />

            <style jsx global>{`
                body { background-color: #F8FAFC; color: #1E293B; font-family: 'Pretendard', sans-serif; }
                .dashboard-card { background: white; border-radius: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #E2E8F0; }
                .nav-item.active { background-color: #0ea5e9; color: white; font-weight: 600; box-shadow: 0 4px 6px rgba(14, 165, 233, 0.25); }
                .nav-item.active i { color: white; }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
                .fade-in { animation: fadeIn 0.3s ease-out forwards; opacity: 0; transform: translateY(10px); }
                @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
                .plan-card { transition: all 0.2s; border: 2px solid #E2E8F0; cursor: pointer; }
                .plan-card:hover { border-color: #94A3B8; }
                .plan-card.selected { border-color: #0ea5e9; background-color: #f0f9ff; }
                .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; }
                .calendar-day { min-height: 8rem; }
                .status-badge { padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 700; }
                .status-scheduled { background-color: #DBEAFE; color: #1D4ED8; }
                .status-completed { background-color: #F3F4F6; color: #374151; }
                .status-passed { background-color: #D1FAE5; color: #047857; }
                .status-failed { background-color: #FEE2E2; color: #B91C1C; }
            `}</style>
            
            <div className="flex h-screen overflow-hidden text-slate-800">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 flex-col z-30 hidden md:flex shrink-0">
                    <div className="h-16 flex items-center px-6 border-b border-slate-100 cursor-pointer" onClick={() => handleRouteChange('dashboard', '대시보드')}>
                        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white mr-2 shadow-sm">
                            <i className="fa-solid fa-paper-plane"></i>
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">JobChaja Biz</span>
                    </div>

                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl">{user.name.charAt(0)}</div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">{user.name}</h4>
                                <p className="text-xs text-slate-500">{user.type}</p>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-medium">잔여 포인트</span>
                            <span className="text-sm font-bold text-brand-600">{points.toLocaleString()} P</span>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        <button onClick={() => handleRouteChange('dashboard', '대시보드')} className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 text-sm transition-all ${view === 'dashboard' && 'active'}`}>
                            <i className="fa-solid fa-chart-pie w-5 text-slate-400"></i> 대시보드
                        </button>
                        
                        <div className="pt-4 pb-1 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">채용 관리</div>
                        
                        <button onClick={() => handleRouteChange('posting', '공고 등록')} className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 text-sm transition-all ${view === 'posting' && 'active'}`}>
                            <i className="fa-solid fa-pen-to-square w-5 text-slate-400"></i> 공고 등록
                        </button>
                        <button onClick={() => handleRouteChange('jobs', '공고 관리')} className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 text-sm transition-all ${view === 'jobs' && 'active'}`}>
                            <i className="fa-solid fa-briefcase w-5 text-slate-400"></i> 공고 관리
                        </button>
                        <button onClick={() => handleRouteChange('applicants', '지원자 현황')} className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 text-sm transition-all ${view === 'applicants' && 'active'}`}>
                            <i className="fa-solid fa-users w-5 text-slate-400"></i> 지원자 현황
                        </button>

                        <div className="pt-4 pb-1 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">자산 및 일정</div>

                        <button onClick={() => handleRouteChange('schedule', '면접 일정')} className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 text-sm transition-all ${view === 'schedule' && 'active'}`}>
                            <i className="fa-regular fa-calendar-check w-5 text-slate-400"></i> 면접 일정
                        </button>
                        <button onClick={() => handleRouteChange('points', '포인트 관리')} className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 text-sm transition-all ${view === 'points' && 'active'}`}>
                            <i className="fa-solid fa-receipt w-5 text-slate-400"></i> 포인트 관리
                        </button>
                        <button onClick={() => handleRouteChange('settings', '설정')} className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 text-sm transition-all ${view === 'settings' && 'active'}`}>
                            <i className="fa-solid fa-gear w-5 text-slate-400"></i> 설정
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
                    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 shrink-0 z-20">
                        <h2 className="text-lg font-bold text-slate-800 md:hidden">JobChaja Biz</h2>
                        <div className="hidden md:block text-slate-500 text-sm">{pageTitle}</div>
                        
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button className="relative p-2 text-slate-400 hover:text-brand-600 transition">
                                    <i className="fa-regular fa-bell text-xl"></i>
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                </button>
                            </div>
                            <div className="w-px h-8 bg-slate-200"></div>
                            <button className="text-sm font-bold text-slate-600 hover:text-slate-900">로그아웃</button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
                        {view === 'dashboard' && (
                            <div className="fade-in max-w-7xl mx-auto">
                                <div className="flex justify-between items-end mb-6">
                                    <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
                                    <span className="text-sm text-slate-500">오늘: {new Date().toLocaleDateString('ko-KR')}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                                    <div onClick={() => handleRouteChange('jobs', '공고 관리')} className="dashboard-card p-5 cursor-pointer hover:shadow-lg transition group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">진행 중 공고</div>
                                                <div className="text-3xl font-bold text-slate-900 mt-2">3 <span className="text-sm font-normal text-slate-400">건</span></div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition">
                                                <i className="fa-solid fa-briefcase"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div onClick={() => handleRouteChange('applicants', '지원자 현황')} className="dashboard-card p-5 cursor-pointer hover:shadow-lg transition group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-brand-600 text-xs font-bold uppercase tracking-wide">신규 지원자</div>
                                                <div className="text-3xl font-bold text-brand-600 mt-2">12 <span className="text-sm font-normal text-slate-400">명</span></div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition">
                                                <i className="fa-solid fa-users"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div onClick={() => handleRouteChange('schedule', '면접 일정')} className="dashboard-card p-5 cursor-pointer hover:shadow-lg transition group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-purple-600 text-xs font-bold uppercase tracking-wide">면접 예정</div>
                                                <div className="text-3xl font-bold text-slate-900 mt-2">5 <span className="text-sm font-normal text-slate-400">건</span></div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition">
                                                <i className="fa-regular fa-calendar-check"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div onClick={() => handleRouteChange('points', '포인트 관리')} className="dashboard-card p-5 cursor-pointer hover:shadow-lg transition group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">포인트 잔액</div>
                                                <div className="text-3xl font-bold text-slate-900 mt-2">150,000</div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition">
                                                <i className="fa-solid fa-coins"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 dashboard-card p-6 h-96">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-bold text-slate-800">주간 현황</h3>
                                            <div className="flex gap-4 text-xs">
                                                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-brand-500"></span> 지원자 수</div>
                                                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-300"></span> 조회수</div>
                                            </div>
                                        </div>
                                        <canvas ref={chartRef} height="250"></canvas>
                                    </div>
                                    <div className="dashboard-card p-6">
                                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <i className="fa-regular fa-bell text-brand-500"></i> 주요 알림
                                        </h3>
                                        <div className="space-y-4">
                                            {MOCK_DATA.notifications.map((n, i) => (
                                                <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                    <div className={`w-2 h-2 mt-2 rounded-full ${n.type === 'urgent' ? 'bg-red-500' : n.type === 'alert' ? 'bg-yellow-500' : 'bg-brand-500'} shrink-0`}></div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800">{n.text}</p>
                                                        <span className="text-xs text-slate-400">{n.time}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {view === 'posting' && (
                            <div className="fade-in max-w-5xl mx-auto">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">새 채용공고 등록</h2>
                                <div className="dashboard-card p-8 md:p-10">
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <div className="col-span-full">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">공고 제목</label>
                                                <input type="text" className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-brand-500 transition" placeholder="예: 반도체 생산직 사원 모집" />
                                            </div>
                                            <div className="col-span-full">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">비자 요건 (필수 선택)</label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {['E-9 (비전문)', 'E-7 (숙련)', 'D-2 (유학)', 'F-4/5/6'].map(visa => (
                                                        <label key={visa} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition">
                                                            <input type="checkbox" className="w-4 h-4 text-brand-600 rounded" /> <span className="font-bold text-sm">{visa}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="col-span-full">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">근무 지역</label>
                                                <div className="flex gap-2">
                                                    <input type="text" id="address_input" className="flex-1 border border-slate-300 rounded-xl px-4 py-3 bg-slate-50" placeholder="주소 검색 버튼을 눌러주세요" readOnly />
                                                    <button type="button" onClick={execDaumPostcode} className="bg-slate-800 text-white px-4 rounded-xl font-bold text-sm hover:bg-slate-700">주소 검색</button>
                                                </div>
                                            </div>
                                            <div className="col-span-full">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">근무 특이사항</label>
                                                <textarea className="w-full border border-slate-300 rounded-xl px-4 py-3 h-24 resize-none" placeholder="예: 야간 근무 가능자 우대, 기숙사 제공 등"></textarea>
                                            </div>
                                            <div className="col-span-full">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">복리후생</label>
                                                <div className="flex flex-wrap gap-3">
                                                    {['기숙사 제공', '식사 제공', '통근버스', '4대보험'].map(benefit => (
                                                        <label key={benefit} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-full cursor-pointer hover:border-brand-500 text-sm">
                                                            <input type="checkbox" className="rounded text-brand-600" /> {benefit}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="col-span-full">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">공고 마감일</label>
                                                <input type="date" id="posting-end-date" className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-600 bg-slate-50" readOnly />
                                                <p className="text-xs text-brand-600 mt-2 font-bold"><i className="fa-solid fa-circle-info"></i> 공고는 등록일로부터 3개월간 유지됩니다.</p>
                                            </div>
                                        </div>
                                        <div className="mb-8">
                                            <label className="block text-sm font-bold text-slate-700 mb-4">상품 선택</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div onClick={() => setSelectedAmount(50000)} className={`plan-card bg-white rounded-2xl p-6 relative group ${selectedAmount === 50000 && 'selected'}`}>
                                                    <div className="flex justify-between mb-4">
                                                        <h4 className="text-lg font-bold text-slate-800">일반 공고</h4>
                                                        <div className={`w-6 h-6 border-2 rounded-full ${selectedAmount === 50000 ? 'bg-brand-500 border-brand-500' : 'border-slate-200'}`}></div>
                                                    </div>
                                                    <p className="text-sm text-slate-500 mb-4">기본 노출 + 3개월 게시</p>
                                                    <div className="text-xl font-bold border-t pt-4">50,000원</div>
                                                </div>
                                                <div onClick={() => setSelectedAmount(130000)} className={`plan-card bg-brand-50/50 rounded-2xl p-6 relative group ${selectedAmount === 130000 && 'selected'}`}>
                                                    <div className="absolute -top-3 left-6 bg-brand-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">추천</div>
                                                    <div className="flex justify-between mb-4">
                                                        <h4 className="text-lg font-bold text-brand-700">프리미엄 패키지</h4>
                                                        <div className={`w-6 h-6 border-2 rounded-full ${selectedAmount === 130000 ? 'bg-brand-500 border-brand-500' : 'border-slate-200'}`}></div>
                                                    </div>
                                                    <p className="text-sm text-brand-600 mb-4">상단 노출 + 3개월 게시</p>
                                                    <div className="text-xl font-bold border-t border-brand-200 pt-4 text-brand-700">130,000원</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-4 border-t border-slate-100">
                                            <button type="button" onClick={requestPayment} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 transition">결제 및 등록</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {view === 'jobs' && (
                            <div className="fade-in max-w-6xl mx-auto">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">공고 관리</h2>
                                <div className="dashboard-card overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                                            <tr><th className="p-4">상태</th><th className="p-4">제목</th><th className="p-4">마감일</th><th className="p-4">지원자</th><th className="p-4">관리</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">진행중</span></td>
                                                <td className="p-4 font-bold">반도체 생산라인 (E-9)</td>
                                                <td className="p-4 text-slate-500">2026.04.22</td>
                                                <td className="p-4"><button onClick={() => handleRouteChange('applicants', '지원자 현황')} className="text-brand-600 font-bold underline hover:text-brand-800">8명</button></td>
                                                <td className="p-4 text-slate-400"><i className="fa-solid fa-ellipsis-vertical cursor-pointer"></i></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        
                        {view === 'applicants' && (
                            <div className="fade-in max-w-6xl mx-auto">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">지원자 현황</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {MOCK_DATA.applicants.map(a => (
                                        <div key={a.id} className="dashboard-card p-5 flex items-center gap-4 hover:shadow-md transition cursor-pointer" onClick={() => openApplicantModal(a.id)}>
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl text-slate-400 font-bold">{a.name.charAt(0)}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-800 text-lg">{a.name}</h4>
                                                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{a.visa}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1">면접 요청: {a.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-xs font-bold text-brand-600 mb-1">상세보기</span>
                                                <i className="fa-solid fa-chevron-right text-slate-300"></i>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {view === 'schedule' && (
                            <div className="fade-in max-w-6xl mx-auto">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">면접 일정 관리</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 dashboard-card p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold text-slate-800">{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
                                            <div className="flex gap-2">
                                                <button onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-full border hover:bg-slate-50"><i className="fa-solid fa-chevron-left"></i></button>
                                                <button onClick={() => changeMonth(1)} className="w-8 h-8 rounded-full border hover:bg-slate-50"><i className="fa-solid fa-chevron-right"></i></button>
                                            </div>
                                        </div>
                                        <div className="calendar-grid text-center text-xs font-bold text-slate-400 mb-2">
                                            <div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div>
                                        </div>
                                        <div className="calendar-grid text-sm">{renderCalendar()}</div>
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        <div className="dashboard-card p-6 flex-1">
                                            <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">예정된 일정</h3>
                                            <div className="space-y-3">
                                                {MOCK_DATA.schedules.upcoming.map((s, i) => (
                                                    <div key={i} className="p-3 rounded-xl bg-brand-50 border border-brand-100 flex justify-between items-center cursor-pointer hover:bg-brand-100 transition" onClick={() => handleRouteChange('applicants', '지원자 현황')}>
                                                        <div className="flex gap-3 items-center">
                                                            <div className="bg-brand-500 text-white w-10 h-10 rounded-lg flex items-center justify-center text-lg"><i className="fa-regular fa-clock"></i></div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                                                                <p className="text-xs text-brand-700">{s.time}</p>
                                                            </div>
                                                        </div>
                                                        <span className="status-badge status-scheduled">면접예정</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="dashboard-card p-6 flex-1">
                                            <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">면접일정 (지난 기록)</h3>
                                            <div className="space-y-3 overflow-y-auto max-h-60 pr-2">
                                                {MOCK_DATA.schedules.past.map((s, i) => {
                                                    const badgeClass = s.status === 'passed' ? 'status-passed' : s.status === 'failed' ? 'status-failed' : 'status-completed';
                                                    const badgeText = s.status === 'passed' ? '합격' : s.status === 'failed' ? '불합격' : '면접완료';
                                                    return (
                                                        <div key={i} className="flex justify-between items-center text-sm p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => handleRouteChange('applicants', '지원자 현황')}>
                                                            <div>
                                                                <span className="font-bold block text-slate-800">{s.name}</span>
                                                                <span className="text-xs text-slate-400">{s.time}</span>
                                                            </div>
                                                            <span className={`status-badge ${badgeClass}`}>{badgeText}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {view === 'points' && (
                            <div className="fade-in max-w-5xl mx-auto">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">포인트 관리</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="dashboard-card p-6 text-center bg-slate-900 text-white border-none">
                                        <p className="text-sm text-slate-400 mb-2">현재 보유 포인트</p>
                                        <h3 className="text-3xl font-bold">150,000 P</h3>
                                        <button className="mt-4 w-full bg-brand-600 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 transition">충전하기</button>
                                    </div>
                                    <div className="dashboard-card p-6 flex flex-col justify-center items-center">
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-2">이번 달 충전</p>
                                        <h3 className="text-2xl font-bold text-slate-900">+ 300,000 P</h3>
                                    </div>
                                    <div className="dashboard-card p-6 flex flex-col justify-center items-center">
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-2">이번 달 사용</p>
                                        <h3 className="text-2xl font-bold text-red-500">- 150,000 P</h3>
                                    </div>
                                </div>
                                <div className="dashboard-card overflow-hidden">
                                    <div className="p-4 border-b border-slate-100 font-bold text-slate-800">포인트 이용 내역</div>
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500">
                                            <tr><th className="p-4">일시</th><th className="p-4">구분</th><th className="p-4">내용</th><th className="p-4 text-right">금액</th><th className="p-4 text-right">잔액</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="p-4 text-slate-500">2026.01.20 14:00</td>
                                                <td className="p-4"><span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold">사용</span></td>
                                                <td className="p-4">면접 확정 (김철수)</td>
                                                <td className="p-4 text-right font-bold text-red-500">- 30,000 P</td>
                                                <td className="p-4 text-right text-slate-600">150,000 P</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 text-slate-500">2026.01.15 09:30</td>
                                                <td className="p-4"><span className="bg-blue-50 text-brand-600 px-2 py-1 rounded text-xs font-bold">충전</span></td>
                                                <td className="p-4">포인트 충전 (신용카드)</td>
                                                <td className="p-4 text-right font-bold text-brand-600">+ 300,000 P</td>
                                                <td className="p-4 text-right text-slate-600">180,000 P</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {view === 'settings' && (
                            <div className="fade-in max-w-4xl mx-auto">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">설정</h2>
                                <div className="dashboard-card p-8">
                                    <h3 className="font-bold text-lg mb-4">계정 설정</h3>
                                    <div className="space-y-4 max-w-md">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">현재 비밀번호</label>
                                            <input type="password" className="w-full border border-slate-200 rounded-lg p-3" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">새 비밀번호</label>
                                            <input type="password" className="w-full border border-slate-200 rounded-lg p-3" />
                                        </div>
                                        <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold">변경하기</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {modalApplicant && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden fade-in">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <span>{modalApplicant.name}</span>
                                        <span className="text-xs bg-slate-100 px-2 py-1 rounded font-normal text-slate-600">{modalApplicant.visa}</span>
                                    </h3>
                                    <p className="text-sm text-brand-600 font-bold mt-1">면접 요청일: <span>{modalApplicant.date}</span></p>
                                </div>
                                <button onClick={() => setModalApplicant(null)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark text-xl"></i></button>
                            </div>
                            
                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-500 font-bold mb-1">한국어 레벨</p>
                                        <p className="font-bold text-slate-800">TOPIK {modalApplicant.topik}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-500 font-bold mb-1">국적</p>
                                        <p className="font-bold text-slate-800">{modalApplicant.nationality}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700 mb-2">이력 요약</p>
                                    <div className="p-4 border border-slate-200 rounded-lg text-sm text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: modalApplicant.history }}></div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700 mb-2">특이사항</p>
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">{modalApplicant.note}</div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                                <div className="text-sm">
                                    <span className="font-bold text-slate-500">차감 포인트:</span>
                                    <span className="font-bold text-red-600 text-lg ml-1">30,000 P</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setModalApplicant(null)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-200 rounded-lg transition">닫기</button>
                                    <button onClick={() => { alert('면접이 확정되었습니다.'); setModalApplicant(null); }} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-brand-700 transition">면접 확정하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
