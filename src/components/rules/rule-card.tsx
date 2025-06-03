import { Button } from "@/components/ui/button";
import { Play, Pause, Edit3, Trash2 } from "lucide-react";

interface RuleCardProps {
    rule: {
        name: string;
        status: string;
        description: string;
        lastModified: string;
        id: string;
    };
    onToggle: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function RuleCard({ rule, onToggle, onEdit, onDelete }: RuleCardProps) {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <h3 className="font-medium text-foreground">{rule.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${rule.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }`}>
                        {rule.status}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                <p className="text-xs text-muted-foreground mt-2">Last modified: {rule.lastModified}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onToggle(rule.id)}>
                    {rule.status === "active" ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Activate</>}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(rule.id)}><Edit3 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => onDelete(rule.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
