import { Button } from "@/components/ui/button";
import { Edit3, QrCode, Trash2 } from "lucide-react";
import type { Url } from "@/types/types";

interface UrlActionsProps {
    url: Url;
    onEdit: (url: Url) => void;
    onGenerateQR: (shortCode: string) => void;
    onDelete: (urlId: string, urlShortCode: string) => void;
}

export const UrlActions = ({ url, onEdit, onGenerateQR, onDelete }: UrlActionsProps) => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(url)}
            >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit URL
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onGenerateQR(url.shortCode)}
            >
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR
            </Button>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(url.id, url.shortCode)}
            >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
            </Button>
        </div>
    );
};