import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";

export default function About() {
  return (
    <DialogContent>
      <DialogHeader>About Yozora</DialogHeader>
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl text-center hover:scale-110 transition-all duration-300 ease-in-out">Developer Toolkit For Everyone</p>
      </div>
      <DialogFooter>
        <div className="flex justify-between items-center w-full">
          <small className="text-gray-400">
            Copyright © {new Date().getFullYear()} HYPEWORKS Ltd. Co.
          </small>
          <DialogClose asChild>
            <Button type="submit">OK</Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
