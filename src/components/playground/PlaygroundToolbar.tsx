import { BookOpenIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePlaygroundEditor } from ".";
import { ToolbarButton } from "../ProjectEditor/Toolbar";
import SettingsButton from "../ProjectEditor/Toolbar/SettingsButton";
import NewNodeWrapper from "./NewNodeDialogue";
import CompileButton from "./PlaygroundCompileButton";

export default function PlaygroundToolbar() {
  const setSelectedFile = usePlaygroundEditor((s) => s.setSelectedFile);

  return (
    <ul className="group menu menu-horizontal max-w-fit" data-testid="toolbar">
      <NewNodeWrapper
        onComplete={(path, type) => type === "file" && setSelectedFile(path)}
      />
      <CompileButton />
      <SettingsButton />
      <Link
        href="/playground/examples"
        target={"_blank"}
        rel="noopener noreferrer"
      >
        <ToolbarButton
          onClick={() => void 0}
          title="Examples"
          icon={<BookOpenIcon className="h-5 w-5 text-amber-400" />}
        />
      </Link>
    </ul>
  );
}
