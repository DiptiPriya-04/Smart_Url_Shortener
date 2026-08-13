import { BarChart3 } from "lucide-react";
import { useAnalytics } from "@/hooks/useUrlQueries";
import { AnalyticsCards } from "./AnalyticsCards";
import { DailyStats } from "./DailyStats";
import type { AnalyticsData } from "@/types/types";

interface UrlAnalyticsProps {
    urlId: string;
}

export const UrlAnalytics = ({ urlId }: UrlAnalyticsProps) => {
    const { data: analyticsData, isLoading } = useAnalytics(urlId);

    if (isLoading) {
        return (
            <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                </h4>
                <p className="text-muted-foreground">Loading analytics...</p>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                </h4>
                <p className="text-muted-foreground">No analytics data available yet.</p>
            </div>
        );
    }

    const { analytics } = analyticsData as AnalyticsData;

    return (
        <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
            </h4>
            
            <AnalyticsCards analytics={analytics} />
            <DailyStats dailyStats={analytics.dailyStats} />
        </div>
    );
};