import { ImageOff } from "lucide-react";

export default function NoImagePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
      <ImageOff className="h-36 w-36" />
    </div>
  );
}
