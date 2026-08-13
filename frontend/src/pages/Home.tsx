import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, QrCode, Link, ExternalLink, User } from "lucide-react";
import { useUserInfo } from "@/hooks/useUserQueries";
import { useCreateShortUrl, useGenerateQRCode } from "@/hooks/useUrlQueries";
import { toast } from "react-hot-toast";

export const Home = () => {
    const navigate = useNavigate();
    const { data: userData, isLoading: userLoading } = useUserInfo();
    const { mutate: createShortUrl, isPending: isCreating } = useCreateShortUrl();
    const { mutate: generateQRCode, isPending: isGeneratingQR } = useGenerateQRCode();

    const [longUrl, setLongUrl] = useState("");
    const [shortCode, setShortCode] = useState("");
    const [generatedUrl, setGeneratedUrl] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [error, setError] = useState("");
    const [showSignInPrompt, setShowSignInPrompt] = useState(false);

    const isLoggedIn = !userLoading && userData?.data;

    // Show sign-in prompt when user starts interacting with the form but isn't logged in
    useEffect(() => {
        if (!isLoggedIn && (longUrl || shortCode)) {
            const timer = setTimeout(() => {
                setShowSignInPrompt(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [longUrl, shortCode, isLoggedIn]);

    const validateUrl = (url: string): string | null => {
        if (!url) return "Please enter a URL to shorten";

        try {
            let formattedUrl = url;
            if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
                formattedUrl = 'https://' + formattedUrl;
            }
            new URL(formattedUrl);
            return formattedUrl;
        } catch {
            return "Please enter a valid URL";
        }
    };

    const handleShortenUrl = async () => {
        if (!isLoggedIn) {
            toast.error("Please sign in to shorten URLs");
            setShowSignInPrompt(true);
            return;
        }

        const urlValidation = validateUrl(longUrl);
        if (typeof urlValidation === "string" && urlValidation.startsWith("http")) {
            // Valid URL with formatting applied
            setLongUrl(urlValidation);
        } else if (typeof urlValidation === "string") {
            // Error message
            setError(urlValidation);
            return;
        }

        setError("");

        createShortUrl(
            {
                url: longUrl.startsWith('http') ? longUrl : `https://${longUrl}`,
                code: shortCode || undefined,
            },
            {
                onSuccess: (data) => {
                    const receivedShortCode = data?.shortCode;

                    if (receivedShortCode) {
                        // Use backend URL instead of frontend origin
                        const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
                        const shortUrl = `${backendUrl}/${receivedShortCode}`;
                        setGeneratedUrl(shortUrl);
                        toast.success("URL shortened successfully!");
                    } else {
                        console.error("No shortCode found in response:", data);
                        setError("Failed to generate short URL - no code returned");
                        toast.error("Failed to generate short URL");
                    }
                },
                onError: (err: any) => {
                    const message = err?.response?.data?.error || err?.message || "Failed to shorten URL. Please try again.";
                    setError(message);
                    toast.error(message);

                    // If it's a duplicate code error, clear the short code field
                    if (message.includes("already exists") || message.includes("already taken")) {
                        setShortCode("");
                    }
                },
            }
        );
    };

    const handleGenerateQRCode = async () => {
        if (!generatedUrl) {
            setError("Please generate a short URL first");
            return;
        }

        if (!isLoggedIn) {
            toast.error("Please sign in to generate QR codes");
            setShowSignInPrompt(true);
            return;
        }

        const shortCode = generatedUrl.split('/').pop();
        if (!shortCode) {
            setError("Invalid short URL");
            return;
        }

        generateQRCode(shortCode, {
            onSuccess: (qrCodeData) => {
                if (qrCodeData) {
                    setQrCodeUrl(qrCodeData);
                    toast.success("QR code generated successfully!");
                } else {
                    toast.error("Failed to generate QR code");
                }
            },
            onError: (err: any) => {
                const message = err?.response?.data?.message || "Failed to generate QR code";
                toast.error(message);
                console.error("QR generation error:", err);
            },
        });
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy to clipboard:", err);
            toast.error("Failed to copy to clipboard");
        }
    };

    const resetForm = () => {
        setLongUrl("");
        setShortCode("");
        setGeneratedUrl("");
        setQrCodeUrl("");
        setError("");
        setShowSignInPrompt(false);
    };

    const handleSignIn = () => {
        navigate("/signin", { state: { from: "home" } });
    };

    const handleTryDemo = () => {
        toast.success("Try the URL shortener! Sign in for full features.");
    };

    if (userLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">URL Shortener</h1>
                    <p className="mt-2 text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <h1 className="text-3xl font-bold">URL Shortener</h1>
                </div>
                <p className="mt-2 text-muted-foreground">
                    {isLoggedIn
                        ? "Shorten your long URLs and generate QR codes instantly."
                        : "Try our URL shortener! Sign in to save and manage your links."
                    }
                </p>

                {!isLoggedIn && (
                    <div className="flex gap-3 justify-center mt-4">
                        <Button onClick={handleSignIn} className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Sign In
                        </Button>
                        <Button variant="outline" onClick={handleTryDemo}>
                            See How It Works
                        </Button>
                    </div>
                )}
            </div>

            {/* Main URL Shortener Card - Always visible */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Link className="h-5 w-5" />
                        Shorten Your URL
                        {!isLoggedIn && (
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                Demo
                            </span>
                        )}
                    </CardTitle>
                    <CardDescription>
                        {isLoggedIn
                            ? "Enter your long URL and optionally a custom short code"
                            : "Try our URL shortener. Sign in to save your links and access all features."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="longUrl">Long URL *</FieldLabel>
                                <Input
                                    id="longUrl"
                                    type="url"
                                    placeholder="https://example.com/very-long-url-path"
                                    value={longUrl}
                                    onChange={(e) => setLongUrl(e.target.value)}
                                    disabled={isCreating}
                                />
                                <FieldDescription>
                                    Enter the URL you want to shorten
                                </FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="shortCode">
                                    Custom Short Code {!isLoggedIn && "(Sign in to use)"}
                                </FieldLabel>
                                <Input
                                    id="shortCode"
                                    placeholder="my-custom-link"
                                    value={shortCode}
                                    onChange={(e) => setShortCode(e.target.value)}
                                    disabled={isCreating || !isLoggedIn}
                                />
                                <FieldDescription>
                                    {isLoggedIn
                                        ? "Leave empty for auto-generated code"
                                        : "Custom codes available after signing in"
                                    }
                                </FieldDescription>
                            </Field>

                            {error && (
                                <Field>
                                    <FieldError>{error}</FieldError>
                                </Field>
                            )}

                            {showSignInPrompt && !isLoggedIn && (
                                <div className="bg-muted border rounded-lg p-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">Sign in required</span>
                                    </div>
                                    <p className="text-sm mt-1">
                                        Please sign in to shorten URLs and access all features.
                                    </p>
                                    <Button
                                        onClick={handleSignIn}
                                        size="sm"
                                        className="mt-2"
                                    >
                                        Sign In Now
                                    </Button>
                                </div>
                            )}

                            <div className="flex gap-2 pt-4">
                                <Button
                                    onClick={isLoggedIn ? handleShortenUrl : handleSignIn}
                                    disabled={isCreating || !longUrl}
                                    className="flex items-center gap-2"
                                >
                                    <Link className="h-4 w-4" />
                                    {isCreating ? "Shortening..." : (isLoggedIn ? "Shorten URL" : "Sign In to Shorten")}
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={resetForm}
                                    disabled={isCreating}
                                >
                                    Reset
                                </Button>
                            </div>
                        </FieldGroup>
                    </FieldSet>
                </CardContent>
            </Card>

            {generatedUrl && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Short URL</CardTitle>
                        <CardDescription>
                            Here's your shortened URL ready to share
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="generatedUrl">Short URL</FieldLabel>
                                    <div className="flex gap-2">
                                        <Input
                                            id="generatedUrl"
                                            value={generatedUrl}
                                            readOnly
                                            className="flex-1 font-mono text-sm"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => copyToClipboard(generatedUrl)}
                                            title="Copy to clipboard"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => window.open(generatedUrl, '_blank')}
                                            title="Test URL"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Field>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        onClick={isLoggedIn ? handleGenerateQRCode : handleSignIn}
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        disabled={isGeneratingQR || !generatedUrl}
                                    >
                                        <QrCode className="h-4 w-4" />
                                        {isGeneratingQR ? "Generating..." : (isLoggedIn ? "Generate QR Code" : "Sign In for QR Code")}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={resetForm}
                                    >
                                        Create Another
                                    </Button>
                                </div>
                            </FieldGroup>
                        </FieldSet>

                        {qrCodeUrl && (
                            <div className="border rounded-lg p-4">
                                <FieldLabel>QR Code</FieldLabel>
                                <div className="mt-2 flex justify-center">
                                    <img
                                        src={qrCodeUrl}
                                        alt="QR Code"
                                        className="w-48 h-48 border rounded"
                                    />
                                </div>
                                <div className="flex justify-center mt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = qrCodeUrl;
                                            link.download = `qr-code-${generatedUrl.split('/').pop()}.png`;
                                            link.click();
                                        }}
                                    >
                                        Download QR Code
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Features card for non-logged in users */}
            {!isLoggedIn && (
                <Card>
                    <CardHeader>
                        <CardTitle>Unlock Full Features</CardTitle>
                        <CardDescription>
                            Sign in to access all powerful features
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-3">
                                <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Link className="h-4 w-4" />
                                </div>
                                <h4 className="font-semibold">URL Management</h4>
                                <p className="text-muted-foreground text-xs mt-1">Save and organize all your shortened URLs</p>
                            </div>
                            <div className="text-center p-3">
                                <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <QrCode className="h-4 w-4" />
                                </div>
                                <h4 className="font-semibold">QR Codes</h4>
                                <p className="text-muted-foreground text-xs mt-1">Generate and download QR codes for your links</p>
                            </div>
                            <div className="text-center p-3">
                                <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Copy className="h-4 w-4" />
                                </div>
                                <h4 className="font-semibold">Custom Codes</h4>
                                <p className="text-muted-foreground text-xs mt-1">Create memorable custom short codes</p>
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            <Button onClick={handleSignIn}>
                                Sign In to Get Started
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};