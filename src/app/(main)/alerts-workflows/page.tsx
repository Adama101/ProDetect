'use client';

import { useState } from 'react';
import { AlertsList } from '@/components/alerts/alerts-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, BotMessageSquare, FileText } from 'lucide-react';
import { RulesWorkflowModal } from '@/components/compliance/rules-workflow-modal';
import { AutomatedComplianceEngineModal } from '@/components/compliance/automated-compliance-engine-modal';
import { AIAssistedInvestigationsModal } from '@/components/compliance/ai-assisted-investigations-modal';
import { RegulatoryReportingModal } from '@/components/compliance/regulatory-reporting-modal';

export default function ComplianceOperationsCenterPage() {
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showAutomatedEngineModal, setShowAutomatedEngineModal] = useState(false);
  const [showAIInvestigationsModal, setShowAIInvestigationsModal] = useState(false);
  const [showRegulatoryReportingModal, setShowRegulatoryReportingModal] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Compliance Operations Center</h1>
        </div>
        <Button 
          variant="outline"
          onClick={() => setShowRulesModal(true)}
          className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Manage Rules & Workflows
        </Button>
      </header>

      <section>
        <AlertsList />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer" onClick={() => setShowAutomatedEngineModal(true)}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Automated Compliance Engine</CardTitle>
            <CardDescription>
              Configure no-code, dynamic risk-based rules, automate task assignments, and manage policy enforcement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 transition-all duration-300">
              <SlidersHorizontal className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Rule & Workflow Configuration</h3>
              <p className="text-sm text-muted-foreground mt-2">AI-powered automation with 87.5% efficiency</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer" onClick={() => setShowAIInvestigationsModal(true)}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">AI-Assisted Investigations</CardTitle>
            <CardDescription>
              Enhance case management with AI-driven insights and automation. (Features rolling out)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 transition-all duration-300">
              <BotMessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">AI Agents & Narrative Generation</h3>
              <p className="text-sm text-muted-foreground mt-2">94.2% accuracy with intelligent case analysis</p>
            </div>
          </CardContent>
        </Card>
      </section>
      <section>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer " onClick={() => setShowRegulatoryReportingModal(true)}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Regulatory Reporting</CardTitle>
            <CardDescription>
              Utilize integrated reporting tools to streamline SAR/STR filings and maintain comprehensive, audit-ready compliance records. (Automation features rolling out)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg p-8 text-center bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 transition-all duration-300">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Automated Filings & Audit Trails</h3>
              <p className="text-sm text-muted-foreground mt-2">98.5% on-time submissions with full automation</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <RulesWorkflowModal 
        open={showRulesModal} 
        onOpenChange={setShowRulesModal} 
      />
      
      <AutomatedComplianceEngineModal 
        open={showAutomatedEngineModal} 
        onOpenChange={setShowAutomatedEngineModal} 
      />
      
      <AIAssistedInvestigationsModal 
        open={showAIInvestigationsModal} 
        onOpenChange={setShowAIInvestigationsModal} 
      />
      
      <RegulatoryReportingModal 
        open={showRegulatoryReportingModal} 
        onOpenChange={setShowRegulatoryReportingModal} 
      />
    </div>
  );
}