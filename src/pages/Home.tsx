import RepositoryListItem from '../components/common/ListItem/RepositoryListItem';

export default function Home() {
  return (
    <div className="p-10 flex flex-col gap-8 bg-gray-50 min-h-screen">
      <h1 className="text-h1-eng mb-4">Component Test</h1>
      
      <section>
        <h2 className="text-h2-eng mb-4">1. Deactive State (DActv)</h2>
        <div className="w-[800px] border border-gray-200">
          <RepositoryListItem 
            title="List Header"
            description="This is a description."
            language={{ name: "TypeScript", color: "#3178C6" }}
            stats={{ stars: 2, forks: 2, issues: 1, pullRequests: 0 }}
            updatedAt="Updated 1 hour ago"
            
            // 핵심: 비활성화 상태
            disabled={true} 
            
            // 선택된 상태여도 disabled가 우선되어야 함
            selected={false} 
          />
        </div>
      </section>

      <section>
        <h2 className="text-h2-eng mb-4">2. Default State (Comparison)</h2>
        <div className="w-[800px] border border-gray-200">
           <RepositoryListItem 
            title="List Header Active"
            description="This is a description for the active state."
            language={{ name: "TypeScript", color: "#3178C6" }}
            stats={{ forks: 10, stars: 5, issues: 2, pullRequests: 1 }}
            updatedAt="Updated 4 hours ago"
            disabled={false}
          />
        </div>
      </section>
    </div>
  );
}