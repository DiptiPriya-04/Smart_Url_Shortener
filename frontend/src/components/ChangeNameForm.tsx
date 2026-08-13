import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChangeName } from "@/hooks/useUserQueries";
import { UserIcon } from "lucide-react";

const ChangeNameForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const { mutate: changeName, isPending } = useChangeName();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        changeName({ firstname: firstName, lastname: lastName });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Update Name
                </CardTitle>
                <CardDescription>
                    Change your first and last name
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your first name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter your last name"
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Updating..." : "Update Name"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ChangeNameForm;