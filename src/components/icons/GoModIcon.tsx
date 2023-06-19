import { BookOpenIcon } from "@heroicons/react/20/solid";
import GoIcon from "./GoIcon";

export default function GoModIcon() {
  return (
    <div className="relative flex items-center justify-center">
      <BookOpenIcon className="h-full w-full scale-125 text-primary" />
      <GoIcon className="absolute h-4 w-4" />
    </div>
  );
}
