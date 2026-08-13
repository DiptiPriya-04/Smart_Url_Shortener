import { useState, useMemo } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type { ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BarChart3, User, Trash2, ChevronDown, Plus } from "lucide-react";
import { useUserUrls, useDeleteUrl, useUpdateUrl, useGenerateQRCode } from "@/hooks/useUrlQueries";
import { useUserInfo } from "@/hooks/useUserQueries";
import { toast } from "react-hot-toast";
import { createUrlTableColumns } from "@/components/Urls/UrlTableColumns";
import { UrlEditForm } from "@/components/Urls/UrlEditForm";
import { UrlQrCode } from "@/components/Urls/UrlQrCode";
import { UrlAnalytics } from "@/components/Urls/UrlAnalytics";
import type { Url } from "@/types/types";
import { useNavigate } from "react-router-dom";

const MyUrls = () => {
    const navigate = useNavigate();
    const { data: userData, isLoading: userLoading } = useUserInfo();
    const { data: urlsData, isLoading, error, refetch } = useUserUrls();
    const { mutate: deleteUrl } = useDeleteUrl();
    const { mutate: updateUrl } = useUpdateUrl();
    const { mutate: generateQRCode } = useGenerateQRCode();

    // Table states
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    // Component states
    const [editingUrl, setEditingUrl] = useState<Url | null>(null);
    const [editUrlValue, setEditUrlValue] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState<{ url: Url; data: string } | null>(null);
    const [analyticsUrl, setAnalyticsUrl] = useState<Url | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; url: Url | null }>({
        isOpen: false,
        url: null
    });

    const isLoggedIn = !userLoading && userData?.data;

    // Sort URLs by creation date in descending order (newest first)
    const sortedUrls: Url[] = useMemo(() => {
        const urls = urlsData?.codes || [];
        return [...urls].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [urlsData?.codes]);

    // Utility functions
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy to clipboard");
        }
    };

    const handleDeleteClick = (url: Url) => {
        setDeleteDialog({
            isOpen: true,
            url
        });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.url) return;

        deleteUrl(deleteDialog.url.id, {
            onSuccess: () => {
                toast.success("URL deleted successfully!");
                setDeleteDialog({ isOpen: false, url: null });
            },
            onError: () => {
                setDeleteDialog({ isOpen: false, url: null });
            }
        });
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ isOpen: false, url: null });
    };

    const handleEdit = (url: Url) => {
        setEditingUrl(url);
        setEditUrlValue(url.targetURL);
    };

    const handleSaveEdit = () => {
        if (!editingUrl || !editUrlValue.trim()) {
            toast.error("URL cannot be empty");
            return;
        }

        updateUrl({ id: editingUrl.id, newURL: editUrlValue }, {
            onSuccess: () => {
                toast.success("URL updated successfully!");
                setEditingUrl(null);
                setEditUrlValue("");
                refetch();
            }
        });
    };

    const handleCancelEdit = () => {
        setEditingUrl(null);
        setEditUrlValue("");
    };

    const handleGenerateQR = async (url: Url) => {
        generateQRCode(url.shortCode, {
            onSuccess: (qrData) => {
                setQrCodeUrl({ url, data: qrData as any });
                toast.success("QR code generated!");
            }
        });
    };

    const handleViewAnalytics = (url: Url) => {
        setAnalyticsUrl(url);
    };

    const handleCloseAnalytics = () => {
        setAnalyticsUrl(null);
    };

    const getShortUrl = (shortCode: string) => {
        const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        return `${backendUrl}/${shortCode}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSignIn = () => {
        navigate("/signin", { state: { from: "/my-urls" } });
    };

    // Create table columns
    const columns = useMemo(() => createUrlTableColumns({
        onCopy: copyToClipboard,
        onTest: (url) => window.open(url, '_blank'),
        onEdit: handleEdit,
        onGenerateQR: handleGenerateQR,
        onDelete: handleDeleteClick,
        onViewAnalytics: handleViewAnalytics,
        getShortUrl,
        formatDate
    }), []);

    // Initialize table
    const table = useReactTable({
        data: sortedUrls,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    // Show loading state for user authentication
    if (userLoading) {
        return <LoadingState />;
    }

    // Show login prompt if user is not logged in
    if (!isLoggedIn) {
        return <LoginRequiredState onSignIn={handleSignIn} />;
    }

    // Show loading state for URLs data
    if (isLoading) {
        return <LoadingState />;
    }

    // Show error state for URLs data
    if (error) {
        return <ErrorState error={error} onRetry={refetch} />;
    }

    return (
        <>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <Header urlsCount={sortedUrls.length} />

                {sortedUrls.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-4">
                        {/* Table Controls */}
                        <div className="flex items-center gap-4">
                            <Input
                                placeholder="Filter short codes..."
                                value={(table.getColumn("shortCode")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("shortCode")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto">
                                        Columns <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => {
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) =>
                                                        column.toggleVisibility(!!value)
                                                    }
                                                >
                                                    {column.id === "shortCode" && "Short Code"}
                                                    {column.id === "targetURL" && "Destination URL"}
                                                    {column.id === "createdAt" && "Created Date"}
                                                </DropdownMenuCheckboxItem>
                                            )
                                        })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button onClick={() => navigate("/")} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                New URL
                            </Button>
                        </div>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                )
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                No URLs found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-end space-x-2">
                            <div className="text-muted-foreground text-sm">
                                Showing {table.getRowModel().rows.length} of{" "}
                                {sortedUrls.length} URL(s)
                            </div>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit URL Modal */}
            {editingUrl && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-2xl">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Edit URL</h3>
                            <UrlEditForm
                                editUrlValue={editUrlValue}
                                onEditUrlChange={setEditUrlValue}
                                onSave={handleSaveEdit}
                                onCancel={handleCancelEdit}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* QR Code Modal */}
            {qrCodeUrl && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-md">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">QR Code</h3>
                                <Button variant="ghost" size="sm" onClick={() => setQrCodeUrl(null)}>
                                    ×
                                </Button>
                            </div>
                            <UrlQrCode
                                qrCodeUrl={qrCodeUrl.data}
                                shortCode={qrCodeUrl.url.shortCode}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Analytics Modal */}
            {analyticsUrl && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Analytics for {analyticsUrl.shortCode}</h3>
                                <Button variant="ghost" size="sm" onClick={handleCloseAnalytics}>
                                    ×
                                </Button>
                            </div>
                            <UrlAnalytics urlId={analyticsUrl.id} />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialog.isOpen} onOpenChange={handleDeleteCancel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-destructive" />
                            Delete Short URL
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the short URL{" "}
                            <span className="font-mono font-semibold text-foreground">
                                {deleteDialog.url?.shortCode}
                            </span>
                            ? This action cannot be undone and all analytics data will be permanently lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete URL
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};


// Login Required State
const LoginRequiredState = ({ onSignIn }: { onSignIn: () => void }) => (
    <div className="max-w-2xl mx-auto p-6">
        <Card>
            <CardContent className="text-center py-12">
                <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
                <p className="text-muted-foreground mb-6">
                    Please sign in to view and manage your shortened URLs.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={onSignIn} className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Sign In
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                    >
                        Go to Homepage
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
);

// Sub-components for different states
const LoadingState = () => (
    <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">My URLs</h1>
            <p className="text-muted-foreground">Loading your URLs...</p>
        </div>
    </div>
);

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
    <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">My URLs</h1>
            <p className="text-red-500">Error loading URLs: {error.message}</p>
            <Button onClick={onRetry} className="mt-4">
                Try Again
            </Button>
        </div>
    </div>
);

const Header = ({ urlsCount }: { urlsCount: number }) => (
    <div className="text-center">
        <h1 className="text-3xl font-bold">My URLs</h1>
        <p className="text-muted-foreground mt-2">
            Manage and track all your shortened URLs
        </p>
        <Badge variant="secondary" className="mt-2">
            {urlsCount} URL{urlsCount !== 1 ? 's' : ''}
        </Badge>
    </div>
);

const EmptyState = () => (
    <Card>
        <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No URLs yet</h3>
            <p className="text-muted-foreground mb-4">
                Start shortening URLs to see them here
            </p>
            <Button onClick={() => window.location.href = '/'}>
                Create Your First URL
            </Button>
        </CardContent>
    </Card>
);

export default MyUrls;