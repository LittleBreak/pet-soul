import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold">我的</h1>
        <p className="text-muted-foreground max-w-xs">
          登录后可查看个人信息和使用记录
        </p>
      </div>
    </div>
  );
}
