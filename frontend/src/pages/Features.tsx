import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, QrCode, BarChart, Shield, Zap, Users, Globe, Clock, Lock, Star } from "lucide-react";

const Features = () => {
    const features = [
        {
            icon: <Zap className="h-8 w-8" />,
            title: "Lightning Fast",
            description: "Generate short URLs instantly with our optimized infrastructure. No delays, no waiting."
        },
        {
            icon: <Link className="h-8 w-8" />,
            title: "URL Shortening",
            description: "Convert long, messy URLs into clean, shareable links that are easy to remember and distribute."
        },
        {
            icon: <QrCode className="h-8 w-8" />,
            title: "QR Code Generation",
            description: "Create QR codes for your shortened URLs instantly. Perfect for print materials and digital sharing."
        },
        {
            icon: <BarChart className="h-8 w-8" />,
            title: "Analytics",
            description: "Track clicks, geographic locations, and referral sources for your shortened URLs."
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: "Secure & Reliable",
            description: "Enterprise-grade security with SSL encryption and 99.9% uptime guarantee."
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "Team Collaboration",
            description: "Share and manage URLs with your team. Perfect for marketing campaigns and business use."
        }
    ];

    const stats = [
        { number: "10M+", label: "URLs Shortened" },
        { number: "500K+", label: "Active Users" },
        { number: "99.9%", label: "Uptime" },
        { number: "50+", label: "Countries" }
    ];

    const useCases = [
        {
            category: "Social Media",
            examples: ["Twitter", "Instagram", "Facebook", "LinkedIn"],
            description: "Perfect for character-limited platforms where every character counts."
        },
        {
            category: "Marketing",
            examples: ["Email Campaigns", "Print Materials", "Digital Ads", "SMS Marketing"],
            description: "Track campaign performance and create clean, professional-looking links."
        },
        {
            category: "Business",
            examples: ["Internal Links", "Documentation", "Presentations", "Reports"],
            description: "Share long internal URLs with ease and maintain professionalism."
        },
        {
            category: "Personal Use",
            examples: ["Blog Posts", "Personal Projects", "Resume Links", "Portfolio"],
            description: "Organize and share your personal links with custom short codes."
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        Powerful Features for
                        <span className="block text-primary">Modern Link Management</span>
                    </h1>
                    <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
                        Everything you need to create, manage, and track short URLs. 
                        Built for individuals, teams, and enterprises.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl font-bold">{stat.number}</div>
                            <div className="text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Features Grid */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Core Features</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Everything you need in one powerful platform
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center">
                                <CardHeader>
                                    <div className="flex justify-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Use Cases Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Perfect For</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Discover how our URL shortener can help you
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {useCases.map((useCase, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="h-5 w-5" />
                                        {useCase.category}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <h4 className="font-semibold mb-2">Examples:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {useCase.examples.map((example, idx) => (
                                                <span 
                                                    key={idx}
                                                    className="bg-muted px-3 py-1 rounded-full text-sm"
                                                >
                                                    {example}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <CardDescription className="text-base">
                                        {useCase.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Additional Features */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Advanced Capabilities</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Professional features for power users
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center">
                            <CardHeader>
                                <Clock className="h-8 w-8 mx-auto mb-4" />
                                <CardTitle className="text-lg">Real-time Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Monitor clicks and engagement as they happen with live dashboards.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <Lock className="h-8 w-8 mx-auto mb-4" />
                                <CardTitle className="text-lg">Password Protection</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Add an extra layer of security to your sensitive links with password protection.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <Globe className="h-8 w-8 mx-auto mb-4" />
                                <CardTitle className="text-lg">Custom Domains</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Use your own domain for branded short links that build trust and recognition.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <Users className="h-8 w-8 mx-auto mb-4" />
                                <CardTitle className="text-lg">Team Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Collaborate with team members and manage URLs together in shared workspaces.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* CTA Section */}
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
                        <CardDescription className="text-lg">
                            Join thousands of users who trust our platform for their link management needs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild>
                                <a href="/">Start Shortening URLs</a>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <a href="/signin">Sign In to Your Account</a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Features;