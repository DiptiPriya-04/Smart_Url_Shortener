import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    ArrowUpDown, 
    Copy, 
    ExternalLink, 
    MoreHorizontal,
    Edit3,
    QrCode,
    Trash2,
    BarChart3
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Url } from "@/types/types"

interface UrlTableColumnsProps {
    onCopy: (text: string) => void;
    onTest: (url: string) => void;
    onEdit: (url: Url) => void;
    onGenerateQR: (url: Url) => void;
    onDelete: (url: Url) => void;
    onViewAnalytics: (url: Url) => void;
    getShortUrl: (shortCode: string) => string;
    formatDate: (dateString: string) => string;
}

export const createUrlTableColumns = ({
    onCopy,
    onTest,
    onEdit,
    onGenerateQR,
    onDelete,
    onViewAnalytics,
    getShortUrl,
    formatDate
}: UrlTableColumnsProps): ColumnDef<Url>[] => [
    {
        accessorKey: "shortCode",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Short Code
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const url = row.original
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                        {url.shortCode}
                    </Badge>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onCopy(getShortUrl(url.shortCode))}
                        >
                            <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onTest(getShortUrl(url.shortCode))}
                        >
                            <ExternalLink className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "targetURL",
        header: "Destination URL",
        cell: ({ row }) => {
            const url = row.original
            return (
                <div className="max-w-[300px]">
                    <p className="text-sm truncate" title={url.targetURL}>
                        {url.targetURL}
                    </p>
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <div className="text-sm text-muted-foreground">
                    {formatDate(row.getValue("createdAt"))}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const url = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onCopy(getShortUrl(url.shortCode))}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Short URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onTest(getShortUrl(url.shortCode))}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Test URL
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewAnalytics(url)}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onGenerateQR(url)}>
                            <QrCode className="h-4 w-4 mr-2" />
                            Generate QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(url)}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit URL
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={() => onDelete(url)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]