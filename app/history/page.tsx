import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
          <History className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold">历史记录</h1>
        <p className="text-muted-foreground max-w-xs">
          你的宠物内心戏创作记录将显示在这里
        </p>
      </div>
    </div>
  );
}
