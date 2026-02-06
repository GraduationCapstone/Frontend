// src/pages/Home/TA/UserRqInputModel.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ScenarioItem {
  id: string;
  label: string;
}

export interface ScenarioCategory {
  title: string;
  iconType: 'member' | 'auth' | 'content' | 'ui' | 'network' | 'etc';
  items: ScenarioItem[];
}

const SCENARIO_DATA: ScenarioCategory[] = [
  {
    title: '회원 관련',
    iconType: 'member',
    items: [
      { id: 'signup', label: '회원가입' },
      { id: 'login', label: '로그인' },
      { id: 'find_pw', label: '비밀번호 찾기/재설정' },
      { id: 'logout', label: '로그아웃' },
    ],
  },
  {
    title: '사용자 정보/권한 관련',
    iconType: 'auth',
    items: [
      { id: 'profile_edit', label: '프로필 수정' },
      { id: 'pw_change', label: '비밀번호 변경' },
      { id: 'rbac', label: '권한 기반 접근 제어' },
      { id: 'session', label: '세션 만료/토큰 만료' },
    ],
  },
  {
    title: '게시판/콘텐츠 관련',
    iconType: 'content',
    items: [
      { id: 'post_create', label: '게시글 작성' },
      { id: 'post_edit_delete', label: '게시글 수정/삭제' },
      { id: 'comment', label: '댓글 작성/수정/삭제' },
      { id: 'like', label: '좋아요/즐겨찾기' },
      { id: 'search', label: '검색' },
      { id: 'filter', label: '필터/정렬' },
    ],
  },
  {
    title: 'UI/UX/반응형/브라우저',
    iconType: 'ui',
    items: [
      { id: 'responsive', label: '반응형 레이아웃' },
      { id: 'browser_compat', label: '브라우저 호환성' },
      { id: 'error_page', label: '404/500 에러 페이지 동작' },
    ],
  },
  {
    title: '네트워크/예외 상황',
    iconType: 'network',
    items: [
      { id: 'offline', label: '네트워크 끊김 상태' },
      { id: 'latency', label: '서버 응답 지연' },
      { id: 'api_error', label: 'API 에러 응답 처리' },
    ],
  },
  {
    title: '그 외',
    iconType: 'etc',
    items: [
      { id: 'ab_test', label: 'A/B 테스트 요소 확인' },
      { id: 'validation', label: '입력값 유효성 검사' },
      { id: 'i18n', label: '다국어 지원 시 언어 변경 테스트' },
      { id: 'file_io', label: '파일 업로드/다운로드' },
      { id: 'push', label: '푸시 알림' },
      { id: 'concurrency', label: '다중 사용자 동시 접속' },
    ],
  },
];

export type TestProcessStage = "idle" | "generating" | "testing" | "complete" | "report_generating" | "report_complete";

export const useUserRqInputModel = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [testName] = useState('Test A'); // 실제로는 state나 context에서 가져옴

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planStatus, setPlanStatus] = useState<"generating" | "complete">("generating");
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  const [isTestProcessModalOpen, setIsTestProcessModalOpen] = useState(false);
  const [testProcessStage, setTestProcessStage] = useState<TestProcessStage>("idle");
  const [codeGenTime, setCodeGenTime] = useState(0); // 코드 생성 타이머
  const [testRunTime, setTestRunTime] = useState(0); // 테스트 진행 타이머
  const [isTestPaused, setIsTestPaused] = useState(false); // 일시정지 여부

  const [reportGenTime, setReportGenTime] = useState(0);

  const toggleScenario = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const canProceed = selectedIds.size > 0;

  const handleNext = () => {
    if (!canProceed) return;
    // 1. 모달 열기 및 초기화
    setIsModalOpen(true);
    setPlanStatus("generating");
    setElapsedTime(0);

    // 2. 타이머 시작 (1초마다 증가)
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // 3. (임시 시뮬레이션) 3초 후 완료 상태로 변경
    setTimeout(() => {
      setPlanStatus("complete");
      if (timerRef.current) clearInterval(timerRef.current);
    }, 3000);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleDownload = () => {
    console.log("테스트 계획서 다운로드");
    // 다운로드 로직 추가 가능
  };

  const handleStartTest = () => {
    console.log("테스트 시작 -> 진행 모달 오픈");
    handleCloseModal(); // 기존 계획서 모달 닫기
    
    // 새 모달 열기 및 초기화
    setIsTestProcessModalOpen(true);
    setTestProcessStage("generating");
    setCodeGenTime(0);
    setTestRunTime(0);
    setIsTestPaused(false);
  };

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    testName,
    scenarios: SCENARIO_DATA,
    selectedIds,
    toggleScenario,
    canProceed,
    handleNext,
    isModalOpen,
    handleCloseModal,
    planStatus,
    elapsedTime,
    handleDownload,
    handleStartTest,
    isTestProcessModalOpen,
    setIsTestProcessModalOpen,
    testProcessStage,
    setTestProcessStage,
    codeGenTime,
    setCodeGenTime,
    testRunTime,
    setTestRunTime,
    isTestPaused,
    setIsTestPaused,
    reportGenTime, setReportGenTime,
  };
};