import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSendForgotPasswordCode, useVerifyForgotPasswordCode } from "@/hooks/useUserQueries";
import { MailIcon, ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { mutate: sendCode, isPending: isSending } = useSendForgotPasswordCode();
    const { mutate: verifyCode, isPending: isVerifying } = useVerifyForgotPasswordCode();

    const handleSendCode = (e: React.FormEvent) => {
        e.preventDefault();
        sendCode(email, {
            onSuccess: () => {
                setCodeSent(true);
            }
        });
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        verifyCode({ 
            email, 
            providedCode: parseInt(code, 10), 
            newPassword 
        }, {
            onSuccess: () => {
                navigate("/signin", {
                    state: { 
                        message: "Password reset successfully. Please sign in.",
                        showToast: true
                    }
                });
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Button
                        variant="ghost"
                        className="absolute left-4 top-4"
                        onClick={() => navigate("/signin")}
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <CardTitle className="text-2xl font-bold">
                        Reset Password
                    </CardTitle>
                    <CardDescription>
                        {codeSent 
                            ? "Enter the code sent to your email and your new password"
                            : "Enter your email to receive a reset code"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!codeSent ? (
                        <form onSubmit={handleSendCode} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <MailIcon className="w-4 h-4" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSending}>
                                {isSending ? "Sending Code..." : "Send Reset Code"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Verification Code</Label>
                                <Input
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
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
                            <Button type="submit" className="w-full" disabled={isVerifying}>
                                {isVerifying ? "Resetting Password..." : "Reset Password"}
                            </Button>
                            <Button
                                variant="link"
                                className="w-full"
                                onClick={() => setCodeSent(false)}
                            >
                                Use different email
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;