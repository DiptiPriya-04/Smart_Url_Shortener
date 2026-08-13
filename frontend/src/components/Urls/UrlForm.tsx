import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UrlEditFormProps {
    editUrlValue: string;
    onEditUrlChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

export const UrlEditForm = ({
    editUrlValue,
    onEditUrlChange,
    onSave,
    onCancel
}: UrlEditFormProps) => {
    return (
        <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex gap-2 mb-2">
                <Input
                    value={editUrlValue}
                    onChange={(e) => onEditUrlChange(e.target.value)}
                    placeholder="Enter new target URL"
                    className="flex-1"
                />
                <Button onClick={onSave}>
                    Save
                </Button>
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};