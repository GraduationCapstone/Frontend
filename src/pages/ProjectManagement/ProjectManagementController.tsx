import { Route, Routes, useNavigate, useParams } from "react-router-dom";

import useProjectManagementModel from "./ProjectManagementModel";
import ProjectManagementView from "./ProjectManagementView";
import type { Member } from "./types";

export default function ProjectManagementController() {
  const nav = useNavigate();
  const model = useProjectManagementModel();

  const goList = () => nav("/project-management");
  const goDetail = (projectId: string) => nav(`/project-management/${projectId}`);
  const goSettings = (projectId: string) => nav(`/project-management/${projectId}/settings`);

  const ListRoute = () => (
    <ProjectManagementView
      mode="list"
      projects={model.projects}
      onOpenProject={goDetail}
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
      goDetail(id);
    };

    return (
      <ProjectManagementView
        mode="settings"
        detail={detail}
        onCancelSettings={() => goDetail(id)}
        onSaveSettings={handleSave}
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
