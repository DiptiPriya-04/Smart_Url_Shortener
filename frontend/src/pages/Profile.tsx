import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfo } from "@/hooks/useUserQueries";
import { UserIcon, MailIcon, CalendarIcon, ShieldIcon, RefreshCwIcon, Settings } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ChangeNameForm from "@/components/ChangeNameForm";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const Profile = () => {
    const navigate = useNavigate();
    const { data: userData, isLoading, error, refetch } = useUserInfo();

    const handleRefresh = () => {
        refetch();
        toast.success("Profile updated!");
    };

    const handleSignIn = () => {
        navigate("/signin", { state: { from: "/profile" } });
    };

    // Show loading state for user authentication
    if (isLoading) {
        return <ProfileLoadingState />;
    }

    // Show login prompt if user is not logged in
    if (!userData?.data) {
        return (
            <div className="container mx-auto p-6 max-w-2xl">
                <Card>
                    <CardContent className="text-center py-12">
                        <UserIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
                        <p className="text-muted-foreground mb-6">
                            Please sign in to view and manage your profile information.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={handleSignIn} className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
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
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <Card className="border-destructive/50">
                    <CardContent className="pt-6">
                        <div className="text-center text-destructive">
                            <p>Failed to load profile information.</p>
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                className="mt-4"
                            >
                                <RefreshCwIcon className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your account information and settings
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isLoading}
                >
                    <RefreshCwIcon className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Personal Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="w-5 h-5" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>
                            Your basic profile details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            First Name
                                        </label>
                                        <div className="p-3 rounded-lg border bg-muted/50">
                                            {userData?.data?.firstname || "Not provided"}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Last Name
                                        </label>
                                        <div className="p-3 rounded-lg border bg-muted/50">
                                            {userData?.data?.lastname || "Not provided"}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <MailIcon className="w-4 h-4" />
                                        Email Address
                                    </label>
                                    <div className="p-3 rounded-lg border bg-muted/50">
                                        {userData?.data?.email}
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Account Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldIcon className="w-5 h-5" />
                            Account Information
                        </CardTitle>
                        <CardDescription>
                            Your account status and details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Account Status
                                    </label>
                                    <div>
                                        <Badge
                                            variant={userData?.data?.verified ? "default" : "secondary"}
                                            className={userData?.data?.verified
                                                ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                                                : ""
                                            }
                                        >
                                            {userData?.data?.verified ? "Verified" : "Not Verified"}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Role
                                    </label>
                                    <div>
                                        <Badge variant="outline" className="capitalize bg-blue-600">
                                            {userData?.data?.role || "user"}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        Member Since
                                    </label>
                                    <div className="p-2 text-sm">
                                        {userData?.data?.createdAt
                                            ? new Date(userData.data.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : "N/A"
                                        }
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Last Updated
                                    </label>
                                    <div className="p-2 text-sm">
                                        {userData?.data?.updatedAt
                                            ? new Date(userData.data.updatedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : "N/A"
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Settings Accordion */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Account Settings
                        </CardTitle>
                        <CardDescription>
                            Manage your account preferences and security
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {/* Change Name Accordion Item */}
                            <AccordionItem value="change-name">
                                <AccordionTrigger className="py-4 hover:no-underline">
                                    <div className="flex items-center gap-3 text-left">
                                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Change Name</div>
                                            <div className="text-sm text-muted-foreground">
                                                Update your first and last name
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4">
                                    <ChangeNameForm />
                                </AccordionContent>
                            </AccordionItem>

                            {/* Change Password Accordion Item */}
                            <AccordionItem value="change-password">
                                <AccordionTrigger className="py-4 hover:no-underline">
                                    <div className="flex items-center gap-3 text-left">
                                        <ShieldIcon className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Change Password</div>
                                            <div className="text-sm text-muted-foreground">
                                                Update your account password
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-4">
                                    <ChangePasswordForm />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                {/* User ID Card */}
                <Card className="bg-muted/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>User ID</span>
                            <Badge variant="outline" className="text-xs bg-muted">Technical</Badge>
                        </CardTitle>
                        <CardDescription className="text-xs">
                            For support and reference purposes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-6 w-64" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="font-mono text-xs p-2 bg-background rounded border break-all flex-1">
                                    {userData?.data?.id || "N/A"}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(userData?.data?.id);
                                        toast.success("User ID copied to clipboard!");
                                    }}
                                >
                                    Copy
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Loading state component
const ProfileLoadingState = () => (
    <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
            <div>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-6 w-32 mb-4" />
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-6 w-32" />
                </CardContent>
            </Card>
            {/* Settings Accordion Loading State */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Change Name Accordion Loading */}
                    <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-4 w-4 rounded" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-4 rounded" />
                        </div>
                    </div>
                    {/* Change Password Accordion Loading */}
                    <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-4 w-4 rounded" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-36" />
                                    <Skeleton className="h-3 w-40" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-4 rounded" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default Profile;