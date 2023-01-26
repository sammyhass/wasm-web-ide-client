import { BookOpenIcon } from '@heroicons/react/20/solid';
import GoIcon from './GoIcon';

export default function GoModIcon() {
  return (
    <div className="relative flex items-center justify-center">
      <BookOpenIcon className="text-primary w-full h-full scale-125" />
      <GoIcon className="absolute w-4 h-4" />
    </div>
  );
}
