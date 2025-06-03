"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Settings, BookText, Shield, Cog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RuleCard } from "@/components/rules/rule-card";
import { RuleCategoryCard } from "@/components/rules/rule-category-card";

export default function RulesEnginePage({ onBack }: { onBack: () => void }) {
    const [rules, setRules] = useState([
        { 
            id: 1, 
            name: "High Risk Transaction Alert", 
            description: "Trigger alert for transactions above $10,000", 
            status: "active", 
            lastModified: "2024-01-15" 
        },
        { 
            id: 2, 
            name: "Compliance Document Review", 
            description: "Auto-route compliance documents for review", 
            status: "active", 
            lastModified: "2024-01-12" 
        },
        { 
            id: 3, 
            name: "Risk Assessment Workflow", 
            description: "Automated risk scoring for new clients", 
            status: "inactive", 
            lastModified: "2024-01-08" 
        },
    ]);

    const toggleRuleStatus = (id: number) =>
        setRules(rules.map(rule => 
            rule.id === id 
                ? { ...rule, status: rule.status === "active" ? "inactive" : "active" } 
                : rule
        ));

    return (
        <div className="flex flex-col gap-4">
            <header className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Settings
                </Button>
                <div>
                </div>
            </header>

            {/* Quick Actions */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-4">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Create New Rule
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" /> Import Template
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <BookText className="h-4 w-4" /> Rule Documentation
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Rules List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Active Rules</CardTitle>
                    <CardDescription>Currently deployed compliance and risk management rules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {rules.map(rule => (
                        <RuleCard
                            key={String(rule.id)}
                            rule={{...rule, id: String(rule.id)}}
                            onToggle={(id) => toggleRuleStatus(Number(id))}
                            onEdit={() => console.log("edit", rule.id)}
                            onDelete={() => console.log("delete", rule.id)}
                        />
                    ))}
                </CardContent>
            </Card>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RuleCategoryCard 
                    icon={Shield} 
                    title="Compliance Rules" 
                    description="Regulatory compliance workflows" 
                    count={12} 
                />
                <RuleCategoryCard 
                    icon={Settings} 
                    title="Risk Management" 
                    description="Risk assessment and monitoring" 
                    count={8} 
                />
                <RuleCategoryCard 
                    icon={Cog} 
                    title="AI Agent Parameters" 
                    description="Machine learning model rules" 
                    count={5} 
                />
            </div>
        </div>
    );
}