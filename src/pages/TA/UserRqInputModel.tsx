// src/pages/Home/TA/UserRqInputModel.tsx
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setupTest, downloadTestPlan, dispatchTest } from '../../api/test';

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
      { id: '01', label: '회원가입' },
      { id: '02', label: '로그인' },
      { id: '03', label: '비밀번호 찾기/재설정' },
      { id: '04', label: '로그아웃' },
    ],
  },
  {
    title: '사용자 정보/권한 관련',
    iconType: 'auth',
    items: [
      { id: '05', label: '프로필 수정' },
      { id: '06', label: '비밀번호 변경' },
      { id: '07', label: '권한 기반 접근 제어' },
      { id: '08', label: '세션 만료/토큰 만료' },
    ],
  },
  {
    title: '게시판/콘텐츠 관련',
    iconType: 'content',
    items: [
      { id: '09', label: '게시글 작성' },
      { id: '10', label: '게시글 수정/삭제' },
      { id: '11', label: '댓글 작성/수정/삭제' },
      { id: '12', label: '좋아요/즐겨찾기' },
      { id: '13', label: '검색' },
      { id: '14', label: '필터/정렬' },
    ],
  },
  {
    title: 'UI/UX/반응형/브라우저',
    iconType: 'ui',
    items: [
      { id: '15', label: '반응형 레이아웃' },
      { id: '16', label: '브라우저 호환성' },
      { id: '17', label: '에러 페이지 동작' },
    ],
  },
  {
    title: '네트워크/예외 상황',
    iconType: 'network',
    items: [
      { id: '18', label: '네트워크 끊김 상태' },
      { id: '19', label: '서버 응답 지연' },
      { id: '20', label: 'API 에러 응답 처리' },
    ],
  },
  {
    title: '그 외',
    iconType: 'etc',
    items: [
      { id: '21', label: 'A/B 테스트 요소 확인' },
      { id: '22', label: '입력값 유효성 검사' },
      { id: '23', label: '다국어 지원 시 언어 변경 테스트' },
      { id: '24', label: '파일 업로드/다운로드' },
      { id: '25', label: '푸시 알림' },
      { id: '26', label: '다중 사용자 동시 접속' },
    ],
  },
];

export type TestProcessStage = "idle" | "generating" | "testing" | "complete" | "report_generating" | "report_complete";

export const useUserRqInputModel = () => {
  const location = useLocation();
  const state = location.state as { 
    testName?: string;
    targetProjectId?: string;
    selectedRepoIds?: string[];
  };
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [testName] = useState(state?.testName || 'Test A');

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

  // ✨ 생성된 executionId들을 저장할 상태 추가 (레포지토리가 2개면 2개 저장)
  const [executionIds, setExecutionIds] = useState<number[]>([]);

  const handleNext = async () => {
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

    try {
      const projectId = state?.targetProjectId;
      const repoIds = state?.selectedRepoIds || [];

      if (!projectId) throw new Error("프로젝트 ID를 찾을 수 없습니다.");
      if (repoIds.length === 0) throw new Error("선택된 타겟 레포지토리가 없습니다.");

      // Request Body에 맞춰 Set에 저장된 시나리오 문자열 ID들을 배열로 변환
      const scenarioIdsAsStrings = Array.from(selectedIds);

      // 3. 선택된 타겟 레포지토리 수만큼 병렬로 API (POST) 반복 호출
          const promises = repoIds.map((repoId) => {
            return setupTest(projectId, {
              baseTestGroupName: testName,
              targetRepoId: Number(repoId), 
              scenarioSerials: scenarioIdsAsStrings,
              targetBranch: "main", // 하드코딩 반영
        });
      });

      // API 실제 대기 (AI가 계획서를 다 만들 때까지 여기서 코드가 멈춰서 기다림)
      // 이 기간 동안 화면의 elapsedTime은 계속 1초씩 올라갑니다.
      const responses = await Promise.all(promises);

      // 3. AI 처리가 끝나고 응답이 오면 executionId 저장
      const ids = responses.map(res => res.executionId);
      setExecutionIds(ids);

      // 4. 모든 API 통신이 성공하면 모달 상태를 "완료"로 변경
      setPlanStatus("complete");

    } catch (error) {
      console.error("테스트 설정 API 호출 실패:", error);
      setIsModalOpen(false); // 실패 시 모달 닫기
      alert("테스트를 생성하는 중 오류가 발생했습니다.");
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleDownload = async () => {
    const projectId = state?.targetProjectId;
    
    if (!projectId || executionIds.length === 0) {
      alert("다운로드할 테스트 계획서 정보가 없습니다.");
      return;
    }

    try {
      // 레포지토리를 여러 개 선택해 executionId가 여러 개라면, 순차적으로 모두 다운로드
      for (const exId of executionIds) {
        await downloadTestPlan(projectId, exId);
      }
    } catch (error) {
      console.error("테스트 계획서 다운로드 실패:", error);
      alert("테스트 계획서 다운로드 중 오류가 발생했습니다.");
    }
  };

  const handleStartTest = async () => { // ✨ async 추가
    if (executionIds.length === 0) {
      alert("실행할 테스트 정보가 없습니다. 계획서 생성을 먼저 완료해주세요.");
      return;
    }

    try {
      // 1. 저장된 모든 executionId에 대해 테스트 실행 요청 (비동기 접수)
      const promises = executionIds.map((exId) => dispatchTest(exId));
      await Promise.all(promises);

      // 2. 요청 성공 시 기존 계획서 모달 닫기
      handleCloseModal(); 
      
      // 3. 새 모달(진행 과정) 열기 및 상태 초기화
      setIsTestProcessModalOpen(true);
      setTestProcessStage("generating");
      setCodeGenTime(0);
      setTestRunTime(0);
      setReportGenTime(0);
      setIsTestPaused(false);

      console.log("🚀 테스트 실행 요청(Dispatch) 완료");

    } catch (error: any) {
      console.error("테스트 실행 요청 실패:", error);
      // 400(미완료), 404(정보 없음) 등 에러 처리
      const errorMsg = error.response?.status === 400 
        ? "테스트 계획서가 아직 준비되지 않았거나 잘못된 요청입니다." 
        : "테스트 실행을 시작할 수 없습니다.";
      alert(errorMsg);
    }
  };

  // --- 2. 테스트 진행 타이머 로직 (Model로 이동됨) ---
  useEffect(() => {
    let timer: number;

    if (isTestProcessModalOpen && !isTestPaused) {
      timer = window.setInterval(() => {
        // 1단계: 코드 생성 (5초)
        if (testProcessStage === "generating") {
          setCodeGenTime((prev) => {
            if (prev >= 4) {
              setTestProcessStage("testing");
              return 5;
            }
            return prev + 1;
          });
        }
        // 2단계: 테스트 진행 (5초)
        else if (testProcessStage === "testing") {
          setTestRunTime((prev) => {
            if (prev >= 4) {
              setTestProcessStage("complete");
              return 5;
            }
            return prev + 1;
          });
        }
        // 3단계: 보고서 생성 (5초)
        else if (testProcessStage === "report_generating") {
          setReportGenTime((prev) => {
            if (prev >= 4) {
              setTestProcessStage("report_complete");
              return 5;
            }
            return prev + 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestProcessModalOpen, isTestPaused, testProcessStage]);

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