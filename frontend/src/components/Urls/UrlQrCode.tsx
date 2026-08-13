import { Button } from "@/components/ui/button";
import { QrCode, Download } from "lucide-react";

interface UrlQrCodeProps {
    qrCodeUrl: string;
    shortCode: string;
}

export const UrlQrCode = ({ qrCodeUrl, shortCode }: UrlQrCodeProps) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `qr-code-${shortCode}.png`;
        link.click();
    };

    return (
        <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
            </h4>
            
            {/* QR Code Image on Top */}
            <div className="flex justify-center mb-4">
                <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48 border rounded-lg"
                />
            </div>

            {/* Download Button on Bottom */}
            <div className="flex justify-center">
                <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                >
                    <Download className="h-4 w-4" />
                    Download QR Code
                </Button>
            </div>
        </div>
    );
};