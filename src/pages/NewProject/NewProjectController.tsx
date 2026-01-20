import useNewProjectModel from './NewProjectModel';
import NewProjectView from './NewProjectView';

export default function NewProjectController() {
  const {
    projectName,
    memberSearchQuery,
    canProceed,
    handleProjectNameChange,
    handleMemberSearchChange,
    handleNext,
  } = useNewProjectModel();

  return (
    <NewProjectView
      projectName={projectName}
      memberSearchQuery={memberSearchQuery}
      canProceed={canProceed}
      onProjectNameChange={handleProjectNameChange}
      onMemberSearchChange={handleMemberSearchChange}
      onNext={handleNext}
    />
  );
}