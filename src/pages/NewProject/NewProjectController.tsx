import useNewProjectModel from './NewProjectModel';
import NewProjectView from './NewProjectView';

export default function NewProjectController() {
  const {
    projectName,
    memberSearchQuery,
    searchResults,
    invitedMembers,
    canProceed,
    handleProjectNameChange,
    handleMemberSearchChange,
    handleSelectUser,
    handleRemoveInvitedUser,
    handleNext,
  } = useNewProjectModel();

  return (
    <NewProjectView
      projectName={projectName}
      memberSearchQuery={memberSearchQuery}
      searchResults={searchResults}
      invitedMembers={invitedMembers}
      canProceed={canProceed}
      onProjectNameChange={handleProjectNameChange}
      onMemberSearchChange={handleMemberSearchChange}
      onSelectUser={handleSelectUser}
      onRemoveInvitedUser={handleRemoveInvitedUser}
      onNext={handleNext}
    />
  );
}