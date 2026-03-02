import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

export const StatCard = ({ label, value, icon, trend, className }: StatCardProps) => (
  <div className={cn("glass-panel rounded-xl p-5 flex flex-col gap-2 group hover:border-primary/30 transition-all duration-300", className)}>
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm font-body uppercase tracking-wider">{label}</span>
      <div className="text-primary/70 group-hover:text-primary transition-colors">{icon}</div>
    </div>
    <div className="font-display text-2xl lg:text-3xl font-bold text-foreground">
      {typeof value === "number" ? value.toLocaleString() : value}
    </div>
    {trend && <span className="text-accent text-xs font-mono">{trend}</span>}
  </div>
);
