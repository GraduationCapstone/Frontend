import { useState } from "react";
import CheckboxButton from "../components/common/CheckButton/CheckButton"

export default function Home() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="p-8 flex items-center gap-4">
      <CheckboxButton
        ariaLabel="checkbox"
        checked={checked}
        onCheckedChange={setChecked}
      />

      <CheckboxButton ariaLabel="checkbox disabled" disabled />
    </div>
  );
}