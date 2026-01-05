import { useState } from 'react';

// 0. 레포지토리 리스트
import RepositoryListItem from '../components/common/ListItem/RepositoryListItem';
import CommitActivityGraph from '../components/common/Graph/CommitActivityGraph';

// 1. 프로젝트 리스트
import ProjectListItem from '../components/common/ListItem/ProjectListItem';

// 2. 테스트 "코드" 리스트 (Chips: Pass/Fail)
import TestCodeListItem from '../components/common/ListItem/TestCodeListItem';
import TestCodeListItemSimple from '../components/common/ListItem/TestCodeListItemSimple';

// 3. 테스트 리스트 (No Chips, Has Coverage)
import TestListItem from '../components/common/ListItem/TestListItem';
import TestListItemSimple from '../components/common/ListItem/TestListItemSimple';

export default function Home() {
  // === 상태 관리 ===
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTestCodeId, setSelectedTestCodeId] = useState<string | null>(null);
  const [selectedTestCodeSimpleId, setSelectedTestCodeSimpleId] = useState<string | null>(null);
  const [selectedTestListId, setSelectedTestListId] = useState<string | null>(null);
  const [selectedTestListSimpleId, setSelectedTestListSimpleId] = useState<string | null>(null);

  // === 공통 선택 핸들러 ===
  const handleSelect = (
    id: string, 
    isSelected: boolean, 
    setFn: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (isSelected) {
      setFn(id);
    } else {
      setFn((prev) => (prev === id ? null : prev));
    }
  };

  return (
    <div className="p-10 flex flex-col gap-12 bg-gray-50 min-h-screen overflow-x-auto pb-40">
      <h1 className="text-extra-eng text-grayscale-black mb-6">Component Gallery</h1>

      {/* ================================================================================== */}
      {/* 0. Repository List Item */}
      {/* ================================================================================== */}
      <section className="flex flex-col gap-6 w-[1300px]"> 
        <h2 className="text-h1-eng text-grayscale-black border-b border-grayscale-gy300 pb-2">
          0. Repository List Item
        </h2>
        <div className="flex flex-col gap-4">
          
          {/* Case 1: Full Data (Stats + Graph) */}
          <RepositoryListItem 
            title="frontend-monorepo" 
            description="Main frontend repository for the dashboard project. Includes React components and utility libraries."
            isPublic={true}
            // ✨ [수정됨] TypeScript 색상: #3078C6
            language={{ name: 'TypeScript', color: '#3078C6' }}
            stats={{
              forks: 12,
              stars: 128,
              issues: 5,
              pullRequests: 2
            }}
            updatedAt="2025-01-05 14:30"
            activityGraph={<CommitActivityGraph />}
            
            selected={selectedRepoId === 'repo1'}
            onSelectChange={(checked) => handleSelect('repo1', checked, setSelectedRepoId)}
          />

           {/* Case 2: Private, Java */}
           <RepositoryListItem 
            title="backend-api-server"
            description="Spring Boot API Server handling data processing and authentication."
            isPublic={false}
            language={{ name: 'Java', color: '#B07219' }}
            stats={{
              forks: 4,
              stars: 45,
              issues: 12,
            }}
            updatedAt="2025-01-04 09:15"
            activityGraph={<CommitActivityGraph />}
            
            selected={selectedRepoId === 'repo2'}
            onSelectChange={(checked) => handleSelect('repo2', checked, setSelectedRepoId)}
          />
        </div>
      </section>

      {/* ================================================================================== */}
      {/* 1. Project List Item */}
      {/* ================================================================================== */}
      <section className="flex flex-col gap-6 w-[1000px]"> 
        <h2 className="text-h1-eng text-grayscale-black border-b border-grayscale-gy300 pb-2">
          1. Project List Item
        </h2>
        <div className="flex flex-col gap-4">
          <ProjectListItem 
            code="P1234"
            title="Repository_Name_Example"
            updatedAt="2025-01-05"
            languages={[
              { name: 'TypeScript', color: '#3178C6' },
              { name: 'CSS', color: '#563D7C' }
            ]}
            selected={selectedProjectId === 'P1234'}
            onSelectChange={(checked) => handleSelect('P1234', checked, setSelectedProjectId)}
          />
          <ProjectListItem 
            code="P5678"
            title="Legacy_Project_Build"
            updatedAt="2024-12-25"
            languages={[{ name: 'Java', color: '#B07219' }]}
            disabled={true}
          />
        </div>
      </section>

      {/* ================================================================================== */}
      {/* 2. Test Code List Item (Has Status Chips) */}
      {/* ================================================================================== */}
      <section className="flex flex-col gap-6 w-[1200px]"> 
        <h2 className="text-h1-eng text-grayscale-black border-b border-grayscale-gy300 pb-2">
          2. Test Code List Item (Chips: Pass/Fail)
        </h2>
        
        {/* 2-1. Complex Version */}
        <div className="flex flex-col gap-2">
          <h3 className="text-h3-eng text-grayscale-gy600">A. Complex Version</h3>
          <div className="bg-white border border-grayscale-gy300 flex flex-col">
            <TestCodeListItem 
              codeId="C1234"
              title="test_code_complex_pass"
              status="Pass"
              duration="12s"
              user="DevUser"
              date="2025-09-09 12:00"
              selected={selectedTestCodeId === 'C1234'}
              onSelectChange={(checked) => handleSelect('C1234', checked, setSelectedTestCodeId)}
            />
             <TestCodeListItem 
              codeId="C5678"
              title="test_code_complex_fail"
              status="Fail"
              duration="5s"
              user="Tester"
              date="2025-09-09 12:05"
              selected={selectedTestCodeId === 'C5678'}
              onSelectChange={(checked) => handleSelect('C5678', checked, setSelectedTestCodeId)}
            />
          </div>
        </div>

        {/* 2-2. Simple Version */}
        <div className="flex flex-col gap-2 mt-4">
          <h3 className="text-h3-eng text-grayscale-gy600">B. Simple Version (Mint Background)</h3>
          <div className="bg-white border border-grayscale-gy300 flex flex-col">
            <TestCodeListItemSimple 
              codeId="S0001"
              title="simple_untest"
              status="Untest"
              duration="0s"
              selected={selectedTestCodeSimpleId === 'S0001'}
              onSelectChange={(checked) => handleSelect('S0001', checked, setSelectedTestCodeSimpleId)}
            />
            <TestCodeListItemSimple 
              codeId="S0002"
              title="simple_pass_selected"
              status="Pass"
              duration="24s"
              selected={selectedTestCodeSimpleId === 'S0002'}
              onSelectChange={(checked) => handleSelect('S0002', checked, setSelectedTestCodeSimpleId)}
            />
          </div>
        </div>
      </section>

      {/* ================================================================================== */}
      {/* 3. Test List Item (Has Coverage) */}
      {/* ================================================================================== */}
      <section className="flex flex-col gap-6 w-[1200px]"> 
        <h2 className="text-h1-eng text-grayscale-black border-b border-grayscale-gy300 pb-2">
          3. Test List Item (Has Coverage, No Chips)
        </h2>
        
        {/* 3-1. Complex Version */}
        <div className="flex flex-col gap-2">
          <h3 className="text-h3-eng text-grayscale-gy600">A. Complex Version (Green Text)</h3>
          <div className="bg-white border border-grayscale-gy300 flex flex-col">
            <TestListItem 
              testId="T0000"
              title="test_scenario_untest"
              coverage="0%"
              duration="0s"
              user="User"
              date="2025-01-01 00:00"
              status="Untest"
            />
            <TestListItem 
              testId="T1234"
              title="test_scenario_integration"
              coverage="70.7%"
              duration="48s"
              user="User1234"
              date="2025-09-09 15:34"
              status="Default"
              selected={selectedTestListId === 'T1234'}
              onSelectChange={(checked) => handleSelect('T1234', checked, setSelectedTestListId)}
            />
          </div>
        </div>

        {/* 3-2. Simple Version */}
        <div className="flex flex-col gap-2 mt-6">
          <h3 className="text-h3-eng text-grayscale-gy600">B. Simple Version (Mint Background)</h3>
          <div className="bg-white border border-grayscale-gy300 flex flex-col">
            <TestListItemSimple 
               testId="TS001"
               title="simple_list_untest"
               coverage="0%"
               duration="0s"
               status="Untest"
            />
            <TestListItemSimple 
               testId="TS002"
               title="simple_list_clicked"
               coverage="80.5%"
               duration="32s"
               status="Default"
               selected={selectedTestListSimpleId === 'TS002'}
               onSelectChange={(checked) => handleSelect('TS002', checked, setSelectedTestListSimpleId)}
            />
          </div>
        </div>
      </section>

    </div>
  );
}