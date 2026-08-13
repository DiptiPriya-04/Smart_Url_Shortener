import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup, useSendVerificationCode } from "@/hooks/useUserQueries";

export function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    
    // Use ref to track if signup was successful to prevent duplicate sends
    const signupSuccessRef = useRef(false);

    const { mutate: signup, isPending: isSigningUp } = useSignup();
    const { mutate: sendVerificationCode, isPending: isSendingCode } = useSendVerificationCode();
    const isPending = isSigningUp || isSendingCode;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset the ref
        signupSuccessRef.current = false;

        signup(
            {
                firstname: formData.firstName,
                lastname: formData.lastName,
                email: formData.email,
                password: formData.password,
            },
            {
                onSuccess: () => {
                    // Prevent multiple executions
                    if (signupSuccessRef.current) return;
                    signupSuccessRef.current = true;
                    
                    toast.success("Account created successfully!");

                    // Send verification code
                    sendVerificationCode(formData.email, {
                        onSuccess: () => {
                            toast.success("Verification code sent to your email!");
                            navigate("/otp", {
                                state: {
                                    email: formData.email,
                                    purpose: "verify-email",
                                },
                            });
                        },
                        onError: (error: any) => {
                            console.error(error);
                            toast.error("Failed to send verification code. You can retry on the next page.");
                            navigate("/otp", {
                                state: {
                                    email: formData.email,
                                    purpose: "verify-email",
                                },
                            });
                        },
                    });
                },
                onError: (err: any) => {
                    console.error("Signup error:", err);
                    const message =
                        err?.response?.data?.message ||
                        err?.message ||
                        "Signup failed. Please try again.";
                    toast.error(message);
                },
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-4 text-center pb-2">
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            Create your account
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Enter your details to get started
                        </CardDescription>
                    </div>
                    <div className="flex justify-center">
                        <Button
                            onClick={() => navigate("/signin")}
                            variant="link"
                            className="text-sm text-primary hover:text-primary/80"
                        >
                            Already have an account? Sign in
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-sm font-medium">
                                    First Name *
                                </Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="John"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="transition-colors focus-visible:ring-primary"
                                    disabled={isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-sm font-medium">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="transition-colors focus-visible:ring-primary"
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="transition-colors focus-visible:ring-primary"
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password *
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="transition-colors focus-visible:ring-primary"
                                placeholder="Enter your password"
                                disabled={isPending}
                            />
                        </div>
                        
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 h-11 text-sm font-medium"
                            disabled={isPending}
                        >
                            {isPending ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-4 pt-4">
                    <div className="text-center space-y-2">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            By creating an account, you agree to our{" "}
                            <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                Terms of Service
                            </Button>{" "}
                            and{" "}
                            <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                Privacy Policy
                            </Button>
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            * A verification code will be sent to your email
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}