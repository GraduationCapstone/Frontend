import { useTestFileSelectModel } from "./TestFileSelectModel";
import TestFileSelectView from "./TestFileSelectView";

export default function TestFileSelectController() {
  const model = useTestFileSelectModel();

  return <TestFileSelectView {...model} />;
}