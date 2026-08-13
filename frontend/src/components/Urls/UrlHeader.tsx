import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import type { Url } from "@/types/types";

interface UrlHeaderProps {
    url: Url;
    expandedUrl: string | null;
    onCopy: (text: string) => void;
    onTest: (url: string) => void;
    onToggleExpand: (urlId: string) => void;
    getShortUrl: (shortCode: string) => string;
    formatDate: (dateString: string) => string;
}

export const UrlHeader = ({
    url,
    expandedUrl,
    onCopy,
    onTest,
    onToggleExpand,
    getShortUrl,
    formatDate
}: UrlHeaderProps) => {
    return (
        <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg truncate">
                            {getShortUrl(url.shortCode)}
                        </CardTitle>
                        <Badge variant="outline" className="shrink-0">
                            {url.shortCode}
                        </Badge>
                    </div>
                    <CardDescription className="truncate">
                        {url.targetURL}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Created: {formatDate(url.createdAt)}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onCopy(getShortUrl(url.shortCode))}
                        title="Copy short URL"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onTest(getShortUrl(url.shortCode))}
                        title="Test URL"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onToggleExpand(url.id)}
                        title="View analytics"
                    >
                        {expandedUrl === url.id ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </CardHeader>
    );
};