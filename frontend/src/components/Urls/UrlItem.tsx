import { Card, CardContent } from "@/components/ui/card";
import type { Url } from "@/types/types";
import { UrlHeader } from "./UrlHeader";
import { UrlActions } from "./UrlActions";
import { UrlEditForm } from "./UrlEditForm";
import { UrlQrCode } from "./UrlQrCode";
import { UrlAnalytics } from "./UrlAnalytics";

interface UrlItemProps {
    url: Url;
    expandedUrl: string | null;
    editingUrl: string | null;
    editUrlValue: string;
    qrCodeUrl: string;
    onCopy: (text: string) => void;
    onTest: (url: string) => void;
    onToggleExpand: (urlId: string) => void;
    onEdit: (url: Url) => void;
    onEditUrlChange: (value: string) => void;
    onSaveEdit: (id: string) => void;
    onCancelEdit: () => void;
    onGenerateQR: (shortCode: string) => void;
    onDelete: (id: string) => void;
    getShortUrl: (shortCode: string) => string;
    formatDate: (dateString: string) => string;
}

export const UrlItem = ({
    url,
    expandedUrl,
    editingUrl,
    editUrlValue,
    qrCodeUrl,
    onCopy,
    onTest,
    onToggleExpand,
    onEdit,
    onEditUrlChange,
    onSaveEdit,
    onCancelEdit,
    onGenerateQR,
    onDelete,
    getShortUrl,
    formatDate
}: UrlItemProps) => {
    const isExpanded = expandedUrl === url.id;

    return (
        <Card key={url.id} className="overflow-hidden transition-all duration-300 ease-in-out">
            <UrlHeader
                url={url}
                expandedUrl={expandedUrl}
                onCopy={onCopy}
                onTest={onTest}
                onToggleExpand={onToggleExpand}
                getShortUrl={getShortUrl}
                formatDate={formatDate}
            />

            <div className={`
                transition-all duration-300 ease-in-out overflow-hidden
                ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <CardContent className="pt-4 border-t">
                    <div className="space-y-6">
                        <UrlActions
                            url={url}
                            onEdit={onEdit}
                            onGenerateQR={onGenerateQR}
                            onDelete={onDelete}
                        />

                        {editingUrl === url.id && (
                            <UrlEditForm
                                editUrlValue={editUrlValue}
                                onEditUrlChange={onEditUrlChange}
                                onSave={() => onSaveEdit(url.id)}
                                onCancel={onCancelEdit}
                            />
                        )}

                        {qrCodeUrl && (
                            <UrlQrCode
                                qrCodeUrl={qrCodeUrl}
                                shortCode={url.shortCode}
                            />
                        )}

                        <UrlAnalytics urlId={url.id} />
                    </div>
                </CardContent>
            </div>
        </Card>
    );
};