/**
 * 국가보훈부 웹 애플리케이션 인터랙티브 스크립트
 * 프레임워크 없는 순수 바닐라 자바스크립트 (Vanilla JS)
 * 더블클릭 로컬 파일 실행(file://)에 완벽 호환
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 주요 업무 탭 전환 인터랙션
  initMissionTabs();

  // 2. 알림 롤링 티커 효과
  initNoticeTicker();

  // 3. 맞춤형 보훈 혜택 찾기 (시뮬레이터)
  initBenefitFinder();

  // 4. 뉴스 카테고리 필터링 기능
  initNewsFilter();

  // 5. 자주 묻는 질문(FAQ) 아코디언 기능
  initFaqAccordion();

  // 6. 스크롤 네비게이션 스파이
  initScrollSpy();

  // 7. 인터랙티브 자가진단 체크리스트 & 설문 시스템
  initChecklistSurvey();
});

/* ================= 1. 주요 업무 탭 ================= */
function initMissionTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.mission-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 탭 활성화 변경
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ================= 2. 알림 티커 롤링 ================= */
function initNoticeTicker() {
  const ticker = document.getElementById('noticeTicker');
  if (!ticker) return;

  const notices = [
    '국가유공자 공설화장시설 사용료 면제 증빙서류 온라인 발급이 시작되었습니다.',
    '2029년 아시아 최초 상이군경 국제대회 "인빅터스 게임" 대전 개최 확정!',
    '취약계층 유공자 대상 국립묘지 외 안장시설 선제 발굴 지원 중입니다.',
    '국가보훈부-롯데백화점, 일상 속 보훈문화 확산 민관 협력 협약 체결'
  ];

  let currentIndex = 0;
  setInterval(() => {
    currentIndex = (currentIndex + 1) % notices.length;
    ticker.style.opacity = '0';
    ticker.style.transform = 'translateY(-6px)';
    
    setTimeout(() => {
      ticker.innerHTML = `<span>${notices[currentIndex]}</span>`;
      ticker.style.transition = 'all 0.3s ease';
      ticker.style.opacity = '1';
      ticker.style.transform = 'translateY(0)';
    }, 300);
  }, 4000);
}

/* ================= 3. 맞춤형 보훈 혜택 찾기 ================= */
const benefitDatabase = {
  veteran: {
    name: '참전유공자 (6·25 / 월남전 참전)',
    medical: {
      title: '참전유공자 의료 지원 안내',
      benefits: [
        '전국 보훈병원 진료비 90% 감면 (본인 부담 10%)',
        '전국 2,000여 개 지정 위탁병원 진료비 감면 혜택 (75세 이상)',
        '보훈요양원 입소 시 본인부담금 감면 지원'
      ],
      guide: '신분증 및 국가유공자증을 지참하여 가까운 보훈병원 또는 지정 위탁병원에 방문하시면 즉시 감면됩니다.'
    },
    money: {
      title: '참전명예수당 및 생활안정 지원',
      benefits: [
        '국가보훈부 매월 참전명예수당 지급',
        '지자체별 추가 참전보훈수당 중복 수령 가능',
        '생계곤란 시 생활조정수당 및 양로지원 신청 가능'
      ],
      guide: '주소지 관할 보훈(지)청 보상과에 유공자 등록신청 또는 수당 지급계좌를 등록하시면 매월 지급됩니다.'
    },
    job: {
      title: '취업 및 일상 지원',
      benefits: [
        '고령 참전용사를 위한 보훈섬김이 재가복지 가사간병 지원',
        '교통시설(KTX, 시외버스, 지하철) 운임 감면 혜택',
        '국공립 고궁, 박물관, 자연휴양림 무료 입장'
      ],
      guide: '국가유공자 신분증을 제시하시면 현장에서 즉시 감면 및 무료 혜택이 적용됩니다.'
    },
    honor: {
      title: '국립묘지 안장 및 장례 예우',
      benefits: [
        '국립호국원(영천, 임실, 이천, 산청, 괴산, 제주 등) 안장',
        '공설화장시설 이용료 100% 면제 (온라인 증빙 발급 가능)',
        '영구용 태극기 증정 및 대통령 명의 근조화환 지원'
      ],
      guide: '임종 시 국가보훈상담센터(1577-0606)로 연락하시면 장례의전 및 국립묘지 안장 심사가 원스톱 진행됩니다.'
    }
  },
  disabled: {
    name: '상이군경 및 전상자 (군·경 공상)',
    medical: {
      title: '상이군경 국비 진료 및 재활 혜택',
      benefits: [
        '전국 보훈병원 진료비 100% 국비 지원 (전상·공상 상이처)',
        '보훈병원 외 위탁병원 이용 시에도 국비 감면 지원',
        '첨단 로봇의수·보조기 무상 지급 및 전문 재활센터 우선 이용'
      ],
      guide: '국가유공자증(상이등급)을 제시하시면 보훈병원 진료비가 국비로 자동 처리됩니다.'
    },
    money: {
      title: '보훈급여금(보상금) 및 수당',
      benefits: [
        '상이등급(1급~7급)에 따른 매월 보훈급여금 지급',
        '중상이자 간호수당 및 부양가족수당 추가 지급',
        '주택구입 및 생활안정 장기저리 대부(대출) 지원'
      ],
      guide: '신체검사를 통해 판정된 상이등급에 따라 매월 15일 지정 계좌로 보상금이 입금됩니다.'
    },
    job: {
      title: '취업 지원 및 가산점',
      benefits: [
        '공무원 및 공공기관, 공기업 채용 시험 5~10% 가산점 적용',
        '국가유공자 법정 취업지원(의무고용제) 추천',
        '본인 및 자녀 중·고·대학교 등록금 면제 및 장학금 혜택'
      ],
      guide: '보훈(지)청 취업과에서 취업희망 신청서 및 대학수업료 면제대상자 증명서를 발급받으실 수 있습니다.'
    },
    honor: {
      title: '국립묘지 안장',
      benefits: [
        '국립대전현충원 또는 국립호국원 안장 지원',
        '배우자 합장 가능',
        '영구용 태극기 및 장례의전 전액 지원'
      ],
      guide: '국립묘지안장신청시스템(ncms.korea.kr)을 통해 온라인으로 사전 안장 신청이 가능합니다.'
    }
  },
  miu: {
    name: '제복근무자 (경찰·소방·해경·군인)',
    medical: {
      title: '제복근무자 건강 및 부상 케어',
      benefits: [
        '위험 직무 중 부상 시 경찰병원·소방전문병원 및 보훈병원 협약 진료',
        '외상후스트레스장애(PTSD) 마음건강 치유 프로그램 무상 제공',
        '민간 위탁병원 이용 지원 확대'
      ],
      guide: '공상 승인 신청 후 보훈심사위원회의 심사를 통해 국가보훈대상자로 등록될 수 있습니다.'
    },
    money: {
      title: '공상·순직 보상 및 공무원재해보상 연계',
      benefits: [
        '위험직무 순직유족급여 및 특별위로금 상향 지급',
        '상이 발생 시 보훈급여금 또는 보훈보상금 지급',
        '민관 협력 제복근무자 전용 생활 복지 우대 혜택'
      ],
      guide: '인사혁신처 공무원재해보상 및 보훈부 등록신청을 병행하여 다각도의 보상을 보장받습니다.'
    },
    job: {
      title: '전직 및 자녀 교육 지원',
      benefits: [
        '장기근속 제복근무자 전직 지원 컨설팅 및 자격증 지원 바우처',
        '순직·공상 제복근무자 미성년 자녀 장학재단 매칭 지원',
        '공공부문 취업 경력 가점 인정'
      ],
      guide: '제대군인지원센터(Vnet) 및 보훈 취업포털을 통해 맞춤형 커리어 컨설팅을 받으실 수 있습니다.'
    },
    honor: {
      title: '숭고한 마지막 가시는 길 예우',
      benefits: [
        '위험직무 순직 소방관·경찰관 국립서울현충원·대전현충원 안장',
        '대통령 명의 조화 및 최고의 국가장례의전 절차 준용',
        '국립묘지 충혼당 봉안 지원'
      ],
      guide: '순직 확인 시 국가보훈부에서 유가족과 협의하여 장례부터 안장까지 전 과정을 직접 전담 지원합니다.'
    }
  },
  independent: {
    name: '독립유공자 및 애국지사 후손',
    medical: {
      title: '애국지사 및 유족 의료지원',
      benefits: [
        '생존 애국지사 본인 보훈병원 전액 국비 진료 및 특별건강관리',
        '독립유공자 선순위 유족 보훈병원 진료비 60% 감면',
        '전문 보훈요양원 우선 입소 혜택'
      ],
      guide: '독립유공자증 또는 유족 확인증을 지참하여 보훈의료망을 이용하실 수 있습니다.'
    },
    money: {
      title: '독립유공자 보상금 및 영예수당',
      benefits: [
        '건국훈장·포장 등 훈격에 따른 매월 독립유공자 보상금 지급',
        '독립유공자 후손(손자녀 등) 생활지원금 지급 체계 운영',
        '주택 우선 분양 및 주거안정 금융 지원'
      ],
      guide: '관할 보훈(지)청에 독립유공자 유족 등록 후 보상금 수급권자로 지정받으실 수 있습니다.'
    },
    job: {
      title: '후손 교육 및 취업 지원',
      benefits: [
        '독립유공자 손자녀까지 대학 등록금 면제 및 국비 장학금',
        '공공·민간기업 채용 시 취업지원 가산점(5~10%) 부여',
        '독립운동 사적지 탐방 프로그램 우선 참여권'
      ],
      guide: '정부24 또는 보훈부 누리집에서 대학수업료 면제증명서 발급이 가능합니다.'
    },
    honor: {
      title: '국립묘지 안장 예우',
      benefits: [
        '국립서울현충원 또는 대전현충원 애국지사 묘역 안장',
        '국외 거주 후손 유해 봉환 전액 국비 지원',
        '정부 공식 기념식(광복절, 3·1절) 귀빈 초청 예우'
      ],
      guide: '국립서울현충원 및 대전현충원에 전용 애국지사 묘역이 조성되어 있습니다.'
    }
  },
  family: {
    name: '순직·전몰 유공자 유가족',
    medical: {
      title: '유가족 의료 감면',
      benefits: [
        '선순위 유족(배우자, 부모 등) 보훈병원 진료비 60% 감면',
        '지정 위탁병원 이용 시에도 감면 혜택 제공',
        '심리 재활 및 트라우마 치유 상담 무상 제공'
      ],
      guide: '보훈 유족증을 지참하시면 지정 병의원에서 진료비가 즉시 감면됩니다.'
    },
    money: {
      title: '유족 보상금 및 생활안정',
      benefits: [
        '매월 유족보상금 및 고령수당 지급',
        '자녀 양육비 및 부양가족 가산금 지급',
        '상속 및 세제 감면 혜택'
      ],
      guide: '선순위 유족 1인에게 보상금이 지급되며, 관할 보훈청에서 승계 신청이 가능합니다.'
    },
    job: {
      title: '유가족 취업·학비 지원',
      benefits: [
        '유자녀 대학 학비 전액 감면 및 학습보조비 지급',
        '공공기관 및 기업 채용 취업지원 대상자 지정 (가산점)',
        '직업훈련비 전액 국비 지원'
      ],
      guide: '보훈청 취업지원과를 통해 맞춤형 1:1 취업 알선을 받으실 수 있습니다.'
    },
    honor: {
      title: '안장 및 추모 행사',
      benefits: [
        '국립묘지 배우자 합장 예우',
        '매년 현충일 및 보훈의 달 중앙추념식 초청',
        '국가유공자의 집 명패 달아드리기 사업 지원'
      ],
      guide: '가까운 읍·면·동 행정복지센터 또는 보훈청에서 국가유공자 명패를 정중히 부착해 드립니다.'
    }
  },
  discharged: {
    name: '청년 제대군인 (의무복무 완료자)',
    medical: {
      title: '복무 중 질병·부상 사후 케어',
      benefits: [
        '전역 후 복무 중 발병 질환에 대한 군 병원 및 보훈병원 진료 연계',
        '제대군인 정신건강 힐링 프로그램 안내',
        '상이 발생 시 보훈대상자 신속 심사 연결'
      ],
      guide: '전역 후 질병이나 부상이 발견된 경우 공상 재심사 및 보훈 신청 상담을 받으실 수 있습니다.'
    },
    money: {
      title: '청년 정책 나이 연장 혜택',
      benefits: [
        '군 복무 기간(최대 3년)만큼 청년 주택·창업·채용 정책 연령 상한 연장',
        '장병내일준비적금 만기 매칭지원금 수령',
        '제대군인 전직지원금 및 자격증 응시료 지원'
      ],
      guide: '병적증명서를 제출하시면 모든 정부 청년지원 사업에서 만 34세 기준이 최대 만 37세까지 연장됩니다.'
    },
    job: {
      title: '군 복무 경력 인정 & 취업 지원',
      benefits: [
        '공공기관 채용 시 군 복무 기간 호봉 및 경력 의무 반영',
        '제대군인지원센터(Vnet) 1:1 진로 상담 및 직무 교육',
        '국가기술자격증 응시료 바우처 지원'
      ],
      guide: 'vnet.go.kr(제대군인지원센터)에 회원가입 후 다양한 청년 취업 특화 프로그램을 신청하세요.'
    },
    honor: {
      title: '청년 제대군인 감사 문화',
      benefits: [
        '‘히어로즈 카드’ 등 청년 제대군인 전용 체크·신용카드 할인 혜택',
        '문화·예술 관람료 청년 할인 프로모션',
        '제대군인 주간(10월) 다채로운 감사 페스티벌 참여'
      ],
      guide: '협약 은행(국민, 신한, 하나 등)에서 제대군인 확인 후 전용 우대 카드를 발급받으실 수 있습니다.'
    }
  }
};

function initBenefitFinder() {
  const btn = document.getElementById('btnFindBenefit');
  const userTypeSelect = document.getElementById('userType');
  const resultContainer = document.getElementById('finderResult');

  if (!btn || !userTypeSelect || !resultContainer) return;

  btn.addEventListener('click', () => {
    const selectedType = userTypeSelect.value;
    const selectedInterest = document.querySelector('input[name="interest"]:checked')?.value || 'medical';

    const group = benefitDatabase[selectedType];
    if (!group) return;

    const data = group[selectedInterest];
    if (!data) return;

    resultContainer.innerHTML = `
      <div class="result-card-inner">
        <span class="result-tag">선택 대상: ${group.name}</span>
        <h5>${data.title}</h5>
        <ul class="result-benefits">
          ${data.benefits.map(b => `<li>${b}</li>`).join('')}
        </ul>
        <div class="result-guide">
          <strong>📌 신청 및 이용 팁:</strong> ${data.guide}
        </div>
      </div>
    `;

    resultContainer.style.animation = 'fadeIn 0.3s ease';
  });
}

/* ================= 4. 뉴스 필터링 ================= */
function initNewsFilter() {
  const filterBtns = document.querySelectorAll('.news-filter');
  const cards = document.querySelectorAll('.news-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.25s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ================= 5. FAQ 아코디언 ================= */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // 다른 아이템 닫기
      faqItems.forEach(i => i.classList.remove('active'));

      // 토글
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ================= 6. 스크롤 네비 스파이 ================= */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ================= 7. 인터랙티브 자가진단 체크리스트 시스템 ================= */
// 단계 이동 전역 함수 (인라인 onclick 지원)
window.goToStep = function(stepNumber) {
  const stepTabs = document.querySelectorAll('.s-tab-btn');
  const stepContents = document.querySelectorAll('.survey-step');

  stepTabs.forEach(t => t.classList.remove('active'));
  stepContents.forEach(c => c.classList.remove('active'));

  const activeTab = document.querySelector(`.s-tab-btn[data-step="${stepNumber}"]`);
  const activeContent = document.getElementById(`step-${stepNumber}`);

  if (activeTab) activeTab.classList.add('active');
  if (activeContent) activeContent.classList.add('active');
};

// 설문 리셋 전역 함수
window.resetSurvey = function() {
  const form = document.getElementById('checklistForm');
  if (form) form.reset();

  const resContainer = document.getElementById('surveyResultContainer');
  if (resContainer) resContainer.style.display = 'none';

  window.goToStep(1);

  // 스크롤 상단 이동
  const surveySection = document.getElementById('checklist-survey');
  if (surveySection) {
    surveySection.scrollIntoView({ behavior: 'smooth' });
  }
};

function initChecklistSurvey() {
  // 스텝 탭 클릭 이벤트 바인딩
  const stepTabs = document.querySelectorAll('.s-tab-btn');
  stepTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = tab.getAttribute('data-step');
      window.goToStep(step);
    });
  });

  const btnCalc = document.getElementById('btnCalculateReport');
  if (!btnCalc) return;

  btnCalc.addEventListener('click', () => {
    generateDiagnosticReport();
  });
}

/**
 * 체크리스트 입력 데이터를 바탕으로 맞춤형 리포트를 지능형 매핑 및 생성
 */
function generateDiagnosticReport() {
  const selectedIdentities = Array.from(document.querySelectorAll('input[name="identity"]:checked')).map(el => el.value);
  const selectedSituations = Array.from(document.querySelectorAll('input[name="situation"]:checked')).map(el => el.value);
  const selectedNeeds = Array.from(document.querySelectorAll('input[name="need"]:checked')).map(el => el.value);

  // 최소 선택 검증: 아무것도 체크하지 않은 경우 친절히 안내
  if (selectedIdentities.length === 0 && selectedSituations.length === 0 && selectedNeeds.length === 0) {
    alert('체크리스트에서 최소 1개 이상의 항목을 선택해 주세요!');
    window.goToStep(1);
    return;
  }

  const resultContainer = document.getElementById('surveyResultContainer');
  const reportCardsList = document.getElementById('reportCardsList');
  const actionStepsList = document.getElementById('actionStepsList');
  const userSummaryText = document.getElementById('reportUserSummary');

  if (!resultContainer || !reportCardsList || !actionStepsList) return;

  // 결과 카드 수집 배열
  const reportCards = [];
  const actionPlans = [];

  // 1. 군필 청년 제대군인 매칭
  if (selectedIdentities.includes('id_military_service') || selectedSituations.includes('sit_job_prep')) {
    reportCards.push({
      category: '청년·취업',
      catClass: 'cat-career',
      title: '청년 제대군인을 위한 일자리·취업 경력 연계 혜택',
      desc: '의무복무(현역·사회복무)를 마친 청년에게 청년 정책 나이 상한 연장과 취업 우대 혜택을 제공합니다.',
      items: [
        '청년연령 복무기간 연장: 주택청약, 채용, 창업 등 정부 청년 정책 기준 나이를 군 복무 기간만큼 최대 3년(만 37세까지) 연장',
        '공공기관 채용 시 군 복무 기간을 호봉 및 근무 경력으로 의무 반영',
        '제대군인지원센터(Vnet): 1:1 전문 직업상담사 배정, 이력서 첨삭 및 취업 알선 무상 제공',
        '국가기술자격증 응시료 지원 바우처 및 직업훈련비 국비 지원'
      ],
      tip: 'vnet.go.kr 회원가입 후 병적증명서를 등록하시면 청년 취업 특화 혜택이 열립니다.'
    });

    reportCards.push({
      category: '일상·생활',
      catClass: 'cat-life',
      title: '청년 제대군인 감사 우대 혜택 (히어로즈 카드)',
      desc: '국방의 의무를 성실히 마친 청년들에게 민관 협력 금융·문화 혜택을 드립니다.',
      items: [
        '제대군인 전용 "히어로즈 카드" 발급: 학원, 도서, 어학시험, 영화관, 대중교통 청구할인',
        '국공립 문화시설 및 국립자연휴양림, 박물관 무료 및 할인 입장',
        '제대군인 주간(매년 10월) 청년 응원 문화 이벤트 참여'
      ],
      tip: '협약 은행(IBK, KB국민, 신한 등)에서 전역증/병적증명서 지참 시 즉시 발급 가능합니다.'
    });
  }

  // 2. 복무 중 부상/질병 (공상, 상이)
  if (selectedSituations.includes('sit_injury') || selectedIdentities.includes('id_miu') || selectedNeeds.includes('need_medical')) {
    reportCards.push({
      category: '의료·건강',
      catClass: 'cat-medical',
      title: '국가유공자 / 보훈보상대상자 등록 및 평생 의료지원',
      desc: '군 복무나 공무 수행 중 입은 신체·정신적 부상에 대해 국가가 끝까지 치료와 보상을 책임집니다.',
      items: [
        '전국 6대 보훈병원(서울, 부산, 광주, 대구, 대전, 인천) 상이처 100% 국비 치료',
        '전국 2,000여 개 가까운 민간 위탁병원 진료비 대폭 감면',
        '첨단 로봇의수·보청기 등 보훈보조기구 무상 지급 및 전문 재활센터 물리치료',
        '외상후스트레스(PTSD) 및 심리 트라우마 전문 치유 상담'
      ],
      tip: '복무 당시의 의무기록사본 및 병상일지를 준비하여 관할 보훈청에 보훈심사를 접수하세요.'
    });
  }

  // 3. 참전용사 및 고령 복지 지원
  if (selectedIdentities.includes('id_war_veteran') || selectedSituations.includes('sit_elderly_care') || selectedSituations.includes('sit_hospital_bill')) {
    reportCards.push({
      category: '보상·생활',
      catClass: 'cat-money',
      title: '참전유공자 매월 수당 및 생활안정 지원',
      desc: '나라를 지켜낸 6·25 및 월남 참전용사 어르신들의 영예로운 노후를 든든하게 받칩니다.',
      items: [
        '국가보훈부 참전명예수당 매월 지정일(15일) 정기 지급',
        '거주지 지자체(시·군·구) 참전보훈수당 중복 수령 지원',
        '생활 곤란 참전유공자를 위한 생활조정수당 추가 지급',
        '독거·거동불편 어르신을 위한 "보훈섬김이" 주 1~2회 가사간병 방문 케어'
      ],
      tip: '주민센터 또는 관할 보훈청에 계좌등록 신청 시 매월 누락 없이 입금됩니다.'
    });

    reportCards.push({
      category: '의료·요양',
      catClass: 'cat-medical',
      title: '가까운 동네 위탁병원 진료비 감면 & 보훈요양원 입소',
      desc: '먼 보훈병원까지 가지 않아도 집 앞 협약 병·의원에서 감면받으실 수 있습니다.',
      items: [
        '전국 2,000개 위탁병원(내과, 안과, 정형외과 등) 진료비 본인부담 감면',
        '전국 8개 권역 최첨단 보훈요양원 장기요양 우선 입소 및 감면',
        '국가유공자 복지카드 발급 시 도시철도 무임승차 및 통신비 감면'
      ],
      tip: '병원 방문 시 국가유공자증 또는 신분증을 접수처에 제시하시면 즉시 할인됩니다.'
    });
  }

  // 4. 제복근무자 (경찰·소방·해경·군인)
  if (selectedIdentities.includes('id_miu')) {
    reportCards.push({
      category: '영웅예우',
      catClass: 'cat-career',
      title: '제복근무자(MIU) 감사 예우 및 순직·공상 안심 보장',
      desc: '국민의 생명과 안전을 지키는 경찰관, 소방관, 해양경찰, 직업군인을 최고로 예우합니다.',
      items: [
        '위험직무 순직 시 국가유공자 등록 및 국립서울현충원 충혼당 안장 보장',
        '순직 유가족 자녀 장학재단 매칭 및 미성년 자녀 생활지원금 지급',
        '민간 유통·쇼핑·문화 시설과 연계한 제복근무자 전용 생활 복지 우대',
        '공상 승인 시 공무원재해보상 및 보훈급여금 연계 심사 원스톱 서비스'
      ],
      tip: '국가보훈부 보훈심사포털에서 위험직무 순직·공상 절차를 신속 지원받으실 수 있습니다.'
    });
  }

  // 5. 독립유공자 후손 및 순직 유가족
  if (selectedIdentities.includes('id_independent') || selectedIdentities.includes('id_bereaved')) {
    reportCards.push({
      category: '보상·장학',
      catClass: 'cat-money',
      title: '독립유공자 후손 & 순직유가족 특별 보상 및 학비 감면',
      desc: '선열의 독립정신과 순직 영웅의 숭고한 희생을 대를 이어 기리고 예우합니다.',
      items: [
        '독립유공자 보상금 및 손자녀 생활지원금 매월 정기 지원',
        '중·고·대학교 등록금 전액 면제 및 학습보조비 국비 지급',
        '공공기관 및 국가시험 채용 시 5~10% 법정 가산점 부여',
        '보훈주택 특별공급(아파트 우선분양권) 및 저리 국민주택기금 대출'
      ],
      tip: '정부24에서 "대학수업료등면제대상자증명서"를 온라인으로 즉시 발급받을 수 있습니다.'
    });
  }

  // 6. 국립묘지 안장 및 장례 예우 (안장 희망 시)
  if (selectedNeeds.includes('need_cemetery') || selectedSituations.includes('sit_funeral')) {
    reportCards.push({
      category: '마지막예우',
      catClass: 'cat-cemetery',
      title: '국가가 끝까지 책임지는 국립묘지 안장 & 장례의전 서비스',
      desc: '영웅의 마지막 가시는 길, 유가족의 슬픔을 덜어드리고 국가가 직접 의전을 다합니다.',
      items: [
        '국립서울현충원, 대전현충원, 국립호국원(이천·영천·임실·산청·괴산·제주) 안장',
        '배우자 합장 지원 및 묘역 영구 관리',
        '공설화장시설 사용료 100% 면제 (온라인 증빙서류 원스톱 발급 개시)',
        '영구용 태극기 봉정, 대통령 명의 근조화환, 장례 지도사 무상 파견'
      ],
      tip: '임종 즉시 보훈상담센터(1577-0606)로 전화하시면 전문 장례의전이 즉각 출동합니다.'
    });
  }

  // 7. 일반 국민 / 학생 / 문화 참여
  if (selectedIdentities.includes('id_general_citizen') || selectedNeeds.includes('need_participation') || selectedSituations.includes('sit_culture') || reportCards.length === 0) {
    reportCards.push({
      category: '국민참여',
      catClass: 'cat-general',
      title: '온 국민이 함께하는 "모두의 보훈" & 역사문화 프로그램',
      desc: '보훈대상자가 아니더라도 모든 국민이 영웅을 기억하고 일상 속에서 참여할 수 있습니다.',
      items: [
        '‘모두의 보훈 드림’ 국민 기부 플랫폼: 참전용사 돕기 소액 기부 및 세액공제 혜택',
        '보훈벨트 스탬프투어 & 청소년 독립역사 캠프 참가 (우수 후기 장관상 수여)',
        '국립묘지 봉사활동(묘역 정화, 태극기 꽂기) 및 자원봉사 시간 인정',
        '2029 아시아 최초 "인빅터스 게임(Invictus Games) 대전" 서포터즈 참여'
      ],
      tip: 'mpva.go.kr에서 보훈문화 행사와 자원봉사 모집 공고를 상시 확인하실 수 있습니다.'
    });
  }

  // Action Plan 동적 생성
  actionPlans.push({
    step: 'STEP 1. 서류 확인',
    title: '자격 확인 및 서류 준비',
    desc: '신분증, 병적증명서(군필자), 가족관계증명서, 또는 부상 의무기록을 준비합니다.'
  });
  actionPlans.push({
    step: 'STEP 2. 원스톱 신청',
    title: '정부24 및 보훈청 접수',
    desc: '정부24 온라인 신청 또는 거주지 관할 보훈(지)청 보훈과에 방문하여 신청서를 제출합니다.'
  });
  actionPlans.push({
    step: 'STEP 3. 즉시 혜택 개시',
    title: '보훈 혜택 및 감면 적용',
    desc: '보훈대상자 등록증 또는 증명서를 발급받아 의료·수당·취업 가점을 즉시 누리세요.'
  });

  // UI 렌더링
  let userSummaryBadge = '국민 맞춤 분석';
  if (selectedIdentities.includes('id_military_service')) userSummaryBadge = '청년 제대군인';
  else if (selectedIdentities.includes('id_war_veteran')) userSummaryBadge = '참전용사 및 어르신';
  else if (selectedIdentities.includes('id_miu')) userSummaryBadge = '제복근무자(MIU)';
  else if (selectedIdentities.includes('id_independent')) userSummaryBadge = '독립유공자 가족';
  else if (selectedIdentities.includes('id_bereaved')) userSummaryBadge = '보훈 유가족';

  userSummaryText.innerHTML = `[${userSummaryBadge}] 맞춤형 지원 리포트 (${reportCards.length}개 핵심 분야 도출)`;

  // 카드 렌더링
  reportCardsList.innerHTML = reportCards.map(c => `
    <div class="report-benefit-card">
      <div class="rb-header">
        <span class="rb-category ${c.catClass}">${c.category}</span>
        <span class="rb-badge">국가보훈부 지원</span>
      </div>
      <h5>${c.title}</h5>
      <p class="rb-desc">${c.desc}</p>
      <ul class="rb-items">
        ${c.items.map(it => `<li>${it}</li>`).join('')}
      </ul>
      <div class="rb-footer">
        <span>💡 <strong>이용 팁:</strong> ${c.tip}</span>
      </div>
    </div>
  `).join('');

  // 액션 플랜 렌더링
  actionStepsList.innerHTML = actionPlans.map(ap => `
    <div class="action-step-item">
      <div class="as-num">${ap.step}</div>
      <h6>${ap.title}</h6>
      <p>${ap.desc}</p>
    </div>
  `).join('');

  // 결과창 표시 및 부드러운 스크롤 이동
  resultContainer.style.display = 'block';
  resultContainer.scrollIntoView({ behavior: 'smooth' });
}

