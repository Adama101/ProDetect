import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

interface RuleCategoryCardProps {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    count: number;
}

export function RuleCategoryCard({
    icon: Icon,
    title,
    description,
    count,
}: RuleCategoryCardProps) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8">
                    <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-sm text-muted-foreground">Active Rules</p>
                </div>
            </CardContent>
        </Card>
    );
}
