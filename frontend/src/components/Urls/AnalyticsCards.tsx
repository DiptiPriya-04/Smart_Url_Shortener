import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Globe, Monitor } from "lucide-react";
import type { AnalyticsData } from "@/types/types";

interface AnalyticsCardsProps {
    analytics: AnalyticsData['analytics'];
}

export const AnalyticsCards = ({ analytics }: AnalyticsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Clicks */}
            <Card>
                <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                        {analytics.totalClicks}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Clicks</div>
                </CardContent>
            </Card>

            {/* Devices */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Smartphone className="h-4 w-4" />
                        <span className="font-semibold">Devices</span>
                    </div>
                    <div className="space-y-1">
                        {analytics.byDevice.map((device, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="capitalize">{device.deviceType || 'desktop'}</span>
                                <span className="font-medium">{device.count}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Browsers */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-4 w-4" />
                        <span className="font-semibold">Browsers</span>
                    </div>
                    <div className="space-y-1">
                        {analytics.byBrowser.slice(0, 3).map((browser, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span>{browser.browser}</span>
                                <span className="font-medium">{browser.count}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Countries */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Monitor className="h-4 w-4" />
                        <span className="font-semibold">Top Countries</span>
                    </div>
                    <div className="space-y-1">
                        {analytics.byCountry.slice(0, 3).map((country, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span>{country.country}</span>
                                <span className="font-medium">{country.count}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};