import { useState } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "@/hooks/useUserQueries";
import { toast } from "react-hot-toast";

export function SignIn() {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { mutate: login, isPending } = useLogin();

    // Check for verification success message from navigation state
    useState(() => {
        if (location.state?.message) {
            toast.success(location.state.message);
            // Clear the state to prevent showing again on refresh
            window.history.replaceState({}, document.title);
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        login(
            {
                email: formData.email,
                password: formData.password,
            },
            {
                onSuccess: () => {
                    toast.success("Logged in successfully!");
                    // Navigate to home page
                    navigate("/"); 
                },
                onError: (err: any) => {
                    console.error("Login error:", err);
                    const message =
                        err?.response?.data?.error ||
                        err?.response?.data?.message ||
                        err?.message ||
                        "Login failed. Please try again.";
                    toast.error(message);
                },
            }
        );
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-4 text-center pb-2">
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Enter your credentials to access your account
                        </CardDescription>
                    </div>
                    <div className="flex justify-center">
                        <Button 
                            onClick={() => navigate("/signup")} 
                            variant="link"
                            className="text-sm text-primary hover:text-primary/80"
                        >
                            Don't have an account? Sign up
                        </Button>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-5">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="transition-colors focus-visible:ring-primary h-11"
                                disabled={isPending}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <Button
                                    type="button"
                                    variant="link"
                                    className="p-0 h-auto text-xs text-primary hover:text-primary/80"
                                    onClick={handleForgotPassword}
                                    disabled={isPending}
                                >
                                    Forgot your password?
                                </Button>
                            </div>
                            <Input 
                                id="password" 
                                type="password" 
                                required
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="transition-colors focus-visible:ring-primary h-11"
                                disabled={isPending}
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-primary hover:bg-primary/90 h-11 text-sm font-medium"
                            disabled={isPending}
                        >
                            {isPending ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
                
                <CardFooter className="flex-col gap-4 pt-2">
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            By continuing, you agree to our{" "}
                            <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                Terms of Service
                            </Button>{" "}
                            and{" "}
                            <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                Privacy Policy
                            </Button>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}