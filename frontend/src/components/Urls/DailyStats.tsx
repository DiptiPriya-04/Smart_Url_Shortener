import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { AnalyticsData } from "@/types/types";

interface DailyStatsProps {
    dailyStats: AnalyticsData['analytics']['dailyStats'];
}

export const DailyStats = ({ dailyStats }: DailyStatsProps) => {
    if (!dailyStats || dailyStats.length === 0) return null;

    const maxCount = Math.max(...dailyStats.map(d => d.count));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-4 w-4" />
                    Daily Clicks
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {dailyStats.slice(-7).map((day, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">
                                {new Date(day.date).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-2">
                                <div 
                                    className="bg-primary h-2 rounded-full"
                                    style={{ 
                                        width: `${(day.count / maxCount) * 100}px` 
                                    }}
                                />
                                <span className="text-sm font-medium w-8 text-right">
                                    {day.count}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};