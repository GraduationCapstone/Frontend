import { Route, Routes, useNavigate, useParams } from "react-router-dom";

import useProjectManagementModel from "./ProjectManagementModel";
import ProjectManagementView from "./ProjectManagementView";
import type { Member, TestCodeItem } from "./types";

export default function ProjectManagementController() {
  const nav = useNavigate();
  const model = useProjectManagementModel();

  const goList = () => nav("/project-management");
  const goCreateProject = () => nav("/new-project");
  const goDetail = (projectId: string) => nav(`/project-management/${projectId}`);
  const goSettings = (projectId: string) => nav(`/project-management/${projectId}/settings`);
  const goTestDashboard = (projectId: string, test: TestCodeItem) => {
    const groupId = test.groupId;
    const executionId = test.executionId ?? groupId;
    const params = new URLSearchParams({ projectId });

    if (groupId) params.set("groupId", groupId);
    if (executionId) params.set("executionId", executionId);
    if (test.title) params.set("groupName", test.title);

    nav(`/test-dashboard?${params.toString()}`, {
      state: {
        projectId,
        groupId,
        executionId,
        groupName: test.title,
      },
    });
  };

  const ListRoute = () => (
    <ProjectManagementView
      mode="list"
      projects={model.projects}
      onOpenProject={goDetail}
      onCreateProject={goCreateProject}
    />
  );

  const DetailRoute = () => {
    const { projectId } = useParams();
    const id = projectId ?? "";
    const detail = model.getDetail(id);

    if (!detail) {
      goList();
      return null;
    }

    return (
      <ProjectManagementView
        mode="detail"
        detail={detail}
        onOpenSettings={() => goSettings(id)}
        onBackToList={goList}
        onOpenTestDashboard={(test) => goTestDashboard(id, test)}
      />
    );
  };

  const SettingsRoute = () => {
    const { projectId } = useParams();
    const id = projectId ?? "";
    const detail = model.getDetail(id);

    if (!detail) {
      goList();
      return null;
    }

    const handleSave = (nextName: string, nextMembers: Member[]) => {
      model.saveSettings(id, nextName, nextMembers);
    };
    const handleLeaveProject = async () => {
      await model.leaveOrDeleteProject(id);
    };
    const handleLeaveDone = () => {
      model.removeProjectLocally(id);
      goList();
    };

    return (
      <ProjectManagementView
        mode="settings"
        detail={detail}
        onCancelSettings={() => goDetail(id)}
        onSaveSettings={handleSave}
        onLeaveProject={handleLeaveProject}
        onLeaveDone={handleLeaveDone}
        allGithubCandidates={model.allGithubCandidates}
      />
    );
  };

  return (
    <Routes>
      <Route index element={<ListRoute />} />
      <Route path=":projectId" element={<DetailRoute />} />
      <Route path=":projectId/settings" element={<SettingsRoute />} />
    </Routes>
  );
}
