import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, DollarSign, ArrowUpRight } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    icon: Users,
    trend: "+12%",
  },
  {
    title: "Products",
    value: "56",
    icon: Package,
    trend: "+2",
  },
  {
    title: "Revenue",
    value: "Tk. 4,56,789",
    icon: DollarSign,
    trend: "+18%",
  },
];

export function DashboardTab() {
  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-none border border-zinc-200/60 dark:border-zinc-800/60 bg-card transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-zinc-950 dark:text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-zinc-700 dark:text-zinc-300 mt-1 font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.trend} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-none border border-zinc-200/60 dark:border-zinc-800/60 bg-card transition-colors duration-300">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New User Registered</p>
                    <p className="text-xs text-muted-foreground">User #00{i} joined the platform</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{i * 2} hours ago</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
