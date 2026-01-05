import { useState } from 'react';
import TestCodeListItem from '../components/common/ListItem/TestCodeListItem';
import TestCodeListItemSimple from '../components/common/ListItem/TestCodeListItemSimple'; // Import 추가

export default function Home() {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [selectedSimpleId, setSelectedSimpleId] = useState<string | null>(null); // Simple용 상태

  const handleSelect = (id: string, isSelected: boolean, setFn: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (isSelected) {
      setFn(id);
    } else {
      setFn((prev) => (prev === id ? null : prev));
    }
  };

  return (
    <div className="p-10 flex flex-col gap-12 bg-gray-50 min-h-screen overflow-x-auto">
      <h1 className="text-extra-eng text-grayscale-black mb-6">Component Test Page</h1>

      {/* 3. Test Code List Item (Complex) */}
      <section className="flex flex-col gap-6 w-[1200px]"> 
        <h2 className="text-h1-eng text-grayscale-black border-b border-grayscale-gy300 pb-2">
          3. Test Code List Item (Complex)
        </h2>
        {/* ... (기존 complex 컴포넌트 테스트 코드 유지) ... */}
        <div className="bg-white border border-grayscale-gy300 flex flex-col">
          <TestCodeListItem 
            codeId="C5678"
            title="Complex_Item_Test"
            status="Pass"
            duration="48s"
            user="User1234"
            date="2025-09-09"
            selected={selectedTestId === 'C5678'}
            onSelectChange={(checked) => handleSelect('C5678', checked, setSelectedTestId)}
          />
        </div>
      </section>

      {/* -------------------------------------------------------------------------------- */}
      {/* 4. Test Code List Item (Simple) - NEW! */}
      {/* -------------------------------------------------------------------------------- */}
      <section className="flex flex-col gap-6 w-[1200px]"> 
        <h2 className="text-h1-eng text-grayscale-black border-b border-grayscale-gy300 pb-2">
          4. Test Code List Item (Simple)
        </h2>
        
        <div className="flex flex-col gap-2">
          <h3 className="text-h3-eng text-grayscale-gy600">A. Untest & Interaction</h3>
          <p className="text-medium-eng text-grayscale-gy500">
             클릭하면 <strong>배경이 연한 민트색(Secondary-SG100)</strong>으로 변하고, 글자색이 초록색으로 바뀝니다.
          </p>

          <div className="bg-white border border-grayscale-gy300 flex flex-col">
            {/* Simple Item 1: Untest */}
            <TestCodeListItemSimple 
              codeId="C0001"
              title="simple_untest_case"
              status="Untest"
              duration="0s"
              selected={selectedSimpleId === 'C0001'}
              onSelectChange={(checked) => handleSelect('C0001', checked, setSelectedSimpleId)}
            />

            {/* Simple Item 2: Pass (Default) */}
            <TestCodeListItemSimple 
              codeId="C1234"
              title="simple_pass_case"
              status="Pass"
              duration="48s"
              selected={selectedSimpleId === 'C1234'}
              onSelectChange={(checked) => handleSelect('C1234', checked, setSelectedSimpleId)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}