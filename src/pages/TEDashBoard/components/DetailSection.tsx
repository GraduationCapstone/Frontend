import { useEffect, useMemo, useState } from "react";
import type { TestCodeItem } from "../types";
import {
  fetchTestDashboardResultFullView,
  type TestDashboardResultFullViewResponse,
} from "../../../api/testDashboard";

import { Button } from "../../../components/common/Button";
import StatusBadge, {
  type StatusBadgeType,
} from "../../../components/common/StatusBadge";
import Tabs from "../../../components/common/Tabs";

import CloseIcon from "../../../assets/icons/close.svg?react";
import proofImg from "../../../assets/bg/proofImg.png";

type TabKey = "result" | "failCode" | "scenario" | "proof";

type Props = {
  projectId?: string | number;
  item: TestCodeItem;
  onClose: () => void;
};

const getBadgeType = (status: TestCodeItem["status"]): StatusBadgeType => {
  switch (status) {
    case "Pass":
      return "pass";
    case "Block":
      return "block";
    case "Fail":
      return "fail";
    case "Untest":
    default:
      return "untest";
  }
};

const toText = (value: string | null | undefined): string => {
  const text = value?.trim() ?? "";
  return text.length > 0 ? text : "-";
};

const toTestStatus = (status: string | null | undefined): TestCodeItem["status"] => {
  const normalized = status?.replace(/[\s_-]/g, "").toUpperCase() ?? "";
  if (["PASS", "PASSED", "SUCCESS", "COMPLETED"].includes(normalized)) return "Pass";
  if (["FAIL", "FAILED", "ERROR"].includes(normalized)) return "Fail";
  if (["BLOCK", "BLOCKED"].includes(normalized)) return "Block";
  return "Untest";
};

const formatCompletedAt = (value: string | null | undefined): { datePart: string; timePart: string } => {
  const text = value?.trim() ?? "";
  if (!text) return { datePart: "-", timePart: "" };

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return { datePart: "-", timePart: "" };

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return {
    datePart: `${year}-${month}-${day}`,
    timePart: `${hours}:${minutes}`,
  };
};

export default function DetailSection({ projectId, item, onClose }: Props) {
  const [detail, setDetail] = useState<TestDashboardResultFullViewResponse | null>(null);
  const [tab, setTab] = useState<TabKey>("result");
  const resolvedStatus = detail?.status ? toTestStatus(detail.status) : item.status;
  const isFail = resolvedStatus === "Fail";

  const { datePart, timePart } = useMemo(() => {
    if (detail?.completedAt) return formatCompletedAt(detail.completedAt);
    const raw = item.date ?? "";
    const [d, t] = raw.split(" ");
    return { datePart: d || "-", timePart: t || "" };
  }, [detail?.completedAt, item.date]);

  const tabItems = useMemo(() => {
    if (isFail) {
      return [
        { value: "result", label: "결과" },
        { value: "failCode", label: "Fail 테스트 코드" },
        { value: "scenario", label: "테스트 시나리오" },
        { value: "proof", label: "증명" },
      ];
    }
    return [
      { value: "result", label: "결과" },
      { value: "scenario", label: "테스트 시나리오" },
      { value: "proof", label: "증명" },
    ];
  }, [isFail]);

  useEffect(() => {
    const exists = tabItems.some((t) => t.value === tab);
    if (!exists) setTab("result");
  }, [tabItems, tab]);

  useEffect(() => {
    let cancelled = false;

    const loadDetail = async () => {
      if (!projectId || !item.resultId) {
        setDetail(null);
        return;
      }

      try {
        const response = await fetchTestDashboardResultFullView(projectId, item.resultId);
        if (cancelled) return;
        setDetail(response);
      } catch (error) {
        if (cancelled) return;
        setDetail(null);
        console.error("[TEDashBoard] 상세 조회 실패:", error);
      }
    };

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [projectId, item.resultId]);

  const showOutputBox =
    isFail && (tab === "result" || tab === "failCode");

  return (
    <aside className="w-layout-split self-stretch bg-grayscale-gy50 shadow-[inset_0px_0px_32px_0px_rgba(31,35,40,0.10)] inline-flex flex-col justify-start items-start px-layout-margin py-8 gap-10 ">
      {/* top: close */}
      <div className="p-1 rounded-lg inline-flex justify-start items-center gap-2">
        <Button
          variant="staticClearXsIcon"
          children={undefined}
          Icon={CloseIcon}
          ariaLabel="close"
          onClick={onClose}
        />
      </div>

      {/* info Frame */}
      <div className="self-stretch px-4 inline-flex flex-col justify-start items-start gap-6">
        {/* header row */}
        <div className="self-stretch inline-flex justify-start items-center gap-5">
          <div className="text-grayscale-black text-large400-ko">
            {item.codeId}
          </div>

          <div className="self-stretch p-1 inline-flex flex-col justify-start items-start">
            <div className="w-0 flex-1 outline outline-1 outline-offset-[-0.5px] outline-grayscale-gy400" />
          </div>

          <div className="justify-center text-grayscale-black text-h3-ko line-clamp-1">
            {item.title}
          </div>
        </div>

        {/* output frame */}
        <div className="self-stretch min-h-28 px-3 py-2 bg-grayscale-white rounded-lg outline outline-1 outline-offset-[-1px] outline-grayscale-gy400 inline-flex flex-col justify-start items-start">
          <div className="self-stretch justify-center text-grayscale-black text-medium500-ko">
            Test Code Generation Basis
          </div>
          {/* TODO: 실제 데이터 바인딩 */}
        </div>
      </div>

      {/* Tab + Content */}
      <div className="self-stretch inline-flex flex-col justify-start items-start gap-4">
        <Tabs
          items={tabItems}
          value={tab}
          onValueChange={(next) => setTab(next as TabKey)}
        />

        <div className="self-stretch p-4 inline-flex flex-col justify-center items-start gap-4">
          {/* status/time row (항상 노출) */}
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex justify-start items-center gap-3">
              <div className="text-grayscale-black text-medium500-ko">상태</div>
              <StatusBadge type={getBadgeType(resolvedStatus)} />
            </div>

            <div className="px-2 inline-flex justify-start items-center gap-2 overflow-hidden">
              <div className="text-grayscale-black text-medium500-ko">
                {datePart}
              </div>
              {timePart && (
                <div className="text-grayscale-black text-medium500-ko line-clamp-1">
                  {timePart}
                </div>
              )}
            </div>
          </div>
          
          {showOutputBox && (
            <OutputBox
              title={tab === "result" ? "Error Message" : "Fail Test Code"}
              content={
                tab === "result" ? toText(detail?.result) : toText(detail?.executionSteps)
              }
            />
          )}

          {tab === "scenario" && (
            <ScenarioTable
              scenarioName={toText(detail?.scenarioName)}
              description={toText(detail?.description)}
              testCaseId={toText(detail?.testCodeId)}
              testCaseName={toText(detail?.testCaseName)}
              precondition={toText(detail?.precondition)}
              testData={toText(detail?.testData)}
              steps={toText(detail?.executionSteps)}
              result={toText(detail?.result)}
            />
          )}

          {tab === "proof" && <ProofPanel proofImageUrl={proofImg} />}
        </div>
      </div>
    </aside>
  );
}

// 
function OutputBox(props: { title: string; content: string }) {
  const { title, content } = props;
  return (
    <div className="self-stretch min-h-80 px-3 py-2 bg-grayscale-white rounded-lg outline outline-1 outline-offset-[-1px] outline-grayscale-gy400 inline-flex flex-col justify-start items-start gap-2">
      <div className="self-stretch justify-center text-grayscale-black text-medium500-ko">
        {title}
      </div>
      <div className="self-stretch whitespace-pre-wrap text-grayscale-black text-medium400-ko">
        {content}
      </div>
    </div>
  );
}

// 증명 탭
function ProofPanel(props: { proofImageUrl?: string }) {
  const { proofImageUrl } = props;
  return (
    <div className="self-stretch bg-grayscale-white">
      <img
        src={proofImageUrl}
        className="w-full h-auto block"
      />
    </div>
  );
}

// 테스트 시나리오 
type ScenarioTableProps = {
  scenarioName: string;
  description: string;
  testCaseId: string;
  testCaseName: string;
  precondition: string;
  testData: string;
  steps: string;
  result: string;
};


function ScenarioTable(props: ScenarioTableProps) {
  const {
    scenarioName,
    description,
    testCaseId,
    testCaseName,
    precondition,
    testData,
    steps,
    result,
  } = props;

  return (
    <div className="self-stretch rounded outline outline-1 outline-offset-[-1px] outline-grayscale-gy400 inline-flex flex-col justify-start items-start overflow-hidden bg-grayscale-white">
      <Row label="테스트 시나리오명" value={scenarioName} />
      <Row label="설명" value={description} />
      <Row label="테스트 케이스 ID" value={testCaseId} />
      <Row label="테스트 케이스명" value={testCaseName} />
      <Row label="전제 조건" value={precondition} />
      <Row label="테스트 데이터" value={testData} />
      <Row label="실행 단계" value={steps} />
      <Row label="결과" value={result} isLast />
    </div>
  );
}

function Row(props: { label: string; value: string; isLast?: boolean }) {
  const { label, value, isLast } = props;
  return (
    <div
      className={[
        "self-stretch inline-flex justify-start items-stretch",
        !isLast ? "border-b border-grayscale-gy400" : "",
      ].join(" ")}
    >
      <div className="w-xs self-stretch px-3 py-2 border-r border-grayscale-gy400 inline-flex flex-col justify-start items-start">
        <div className="text-grayscale-black text-medium500-ko">
          {label}
        </div>
      </div>

      <div className="self-stretch flex-1 min-h-14 px-3 py-2 flex justify-start items-start gap-2.5">
        <div className="flex-1 text-grayscale-black text-medium500-ko">
          {value}
        </div>
      </div>
    </div>
  );
}
