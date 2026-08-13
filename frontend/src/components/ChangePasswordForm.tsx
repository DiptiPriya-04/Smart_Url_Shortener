import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChangePassword } from "@/hooks/useUserQueries";
import { LockIcon } from "lucide-react";
import toast from "react-hot-toast";

const ChangePasswordForm = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { mutate: changePassword, isPending } = useChangePassword();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }

        changePassword({ oldPassword, newPassword });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LockIcon className="w-5 h-5" />
                    Change Password
                </CardTitle>
                <CardDescription>
                    Update your account password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="oldPassword">Current Password</Label>
                        <Input
                            id="oldPassword"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter your current password"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Changing Password..." : "Change Password"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ChangePasswordForm;