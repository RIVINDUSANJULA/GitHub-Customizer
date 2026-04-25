import { BuilderSidebar } from "@/components/builder/BuilderSidebar";
import { BuilderPreview } from "@/components/builder/BuilderPreview";

export const metadata = {
  title: "Builder | GitHub Profile Customizer",
};

export default function BuilderPage() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      {/* Mobile/Tablet Tab View logic can be added here if needed, but for now we'll do standard responsive stacking */}
      <div className="w-full lg:w-96 flex-shrink-0 h-1/2 lg:h-full overflow-hidden border-b lg:border-b-0 border-slate-200 dark:border-white/10 z-10">
        <BuilderSidebar />
      </div>
      <div className="flex-1 h-1/2 lg:h-full overflow-hidden relative">
        <BuilderPreview />
      </div>
    </div>
  );
}
