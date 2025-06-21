"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BotMessageSquare,
  Brain,
  Target,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  Play,
  Save,
  Download,
  Plus,
  Eye,
  Filter,
  BarChart3,
  Lightbulb,
  ThumbsUp,
  Flag,
  MessageSquare,
  Send,
  Paperclip,
} from "lucide-react";

interface AIAssistedInvestigationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for AI investigations
const activeInvestigations = [
  {
    id: "INV001",
    title: "High-Value Transaction Pattern Analysis",
    priority: "Critical",
    status: "AI Analysis",
    aiAgent: "Transaction Analyzer Pro",
    progress: 75,
    findings: 8,
    riskScore: 92,
    estimatedCompletion: "2 hours",
    assignedTo: "Sarah Chen",
    createdAt: "2024-01-16 09:30",
    lastUpdate: "5 minutes ago",
    description: "Investigating unusual transaction patterns involving multiple high-value transfers",
    tags: ["AML", "High-Value", "Pattern Analysis"],
  },
  {
    id: "INV002",
    title: "Sanctions Screening Deep Dive",
    priority: "High",
    status: "Human Review",
    aiAgent: "Sanctions Intelligence",
    progress: 90,
    findings: 3,
    riskScore: 88,
    estimatedCompletion: "30 minutes",
    assignedTo: "Michael Rodriguez",
    createdAt: "2024-01-16 08:15",
    lastUpdate: "12 minutes ago",
    description: "AI-assisted review of potential sanctions violations with enhanced name matching",
    tags: ["Sanctions", "OFAC", "Name Matching"],
  },
  {
    id: "INV003",
    title: "Behavioral Anomaly Investigation",
    priority: "Medium",
    status: "Evidence Collection",
    aiAgent: "Behavioral Analyst",
    progress: 45,
    findings: 12,
    riskScore: 67,
    estimatedCompletion: "4 hours",
    assignedTo: "Emma Thompson",
    createdAt: "2024-01-16 07:45",
    lastUpdate: "18 minutes ago",
    description: "Analyzing customer behavioral changes using ML-powered pattern recognition",
    tags: ["Behavioral", "ML", "Customer Analysis"],
  },
];

const aiAgents = [
  {
    id: "agent_001",
    name: "Transaction Analyzer Pro",
    type: "Deep Learning Model",
    specialization: "Transaction pattern analysis and risk assessment",
    accuracy: 94.2,
    casesHandled: 1567,
    avgInvestigationTime: "2.3 hours",
    status: "Active",
    capabilities: [
      "Pattern Recognition",
      "Anomaly Detection",
      "Risk Scoring",
      "Narrative Generation",
    ],
    lastUpdate: "2 minutes ago",
  },
  {
    id: "agent_002",
    name: "Sanctions Intelligence",
    type: "NLP + Rule Engine",
    specialization: "Sanctions screening and compliance verification",
    accuracy: 99.1,
    casesHandled: 2341,
    avgInvestigationTime: "45 minutes",
    status: "Active",
    capabilities: [
      "Name Matching",
      "Entity Resolution",
      "Sanctions Analysis",
      "Compliance Reporting",
    ],
    lastUpdate: "1 minute ago",
  },
  {
    id: "agent_003",
    name: "Behavioral Analyst",
    type: "Ensemble Model",
    specialization: "Customer behavior analysis and profiling",
    accuracy: 87.5,
    casesHandled: 892,
    avgInvestigationTime: "3.8 hours",
    status: "Training",
    capabilities: [
      "Behavioral Modeling",
      "Trend Analysis",
      "Risk Profiling",
      "Predictive Analytics",
    ],
    lastUpdate: "15 minutes ago",
  },
];

const investigationTemplates = [
  {
    id: "template_001",
    name: "AML Investigation Workflow",
    description: "Comprehensive AML investigation with AI assistance",
    steps: [
      "Initial Data Collection",
      "AI Pattern Analysis",
      "Risk Assessment",
      "Evidence Compilation",
      "Expert Review",
      "Decision & Documentation",
    ],
    estimatedDuration: "4-6 hours",
    automationLevel: 75,
    usageCount: 234,
  },
  {
    id: "template_002",
    name: "Sanctions Screening Investigation",
    description: "Deep dive sanctions investigation with enhanced AI matching",
    steps: [
      "Entity Identification",
      "AI-Enhanced Screening",
      "False Positive Analysis",
      "Compliance Verification",
      "Regulatory Reporting",
    ],
    estimatedDuration: "1-2 hours",
    automationLevel: 90,
    usageCount: 156,
  },
  {
    id: "template_003",
    name: "Fraud Pattern Investigation",
    description: "AI-powered fraud detection and investigation workflow",
    steps: [
      "Anomaly Detection",
      "Pattern Recognition",
      "Historical Analysis",
      "Risk Correlation",
      "Investigation Summary",
    ],
    estimatedDuration: "3-5 hours",
    automationLevel: 80,
    usageCount: 89,
  },
];

const aiInsights = [
  {
    id: "insight_001",
    type: "Pattern Discovery",
    title: "Unusual Transaction Velocity Detected",
    description: "AI identified a 340% increase in transaction frequency for customer group X",
    confidence: 94,
    impact: "High",
    recommendation: "Immediate investigation recommended for 12 flagged accounts",
    timestamp: "2 minutes ago",
    agent: "Transaction Analyzer Pro",
  },
  {
    id: "insight_002",
    type: "Risk Correlation",
    title: "Geographic Risk Clustering",
    description: "Multiple high-risk transactions originating from similar geographic regions",
    confidence: 87,
    impact: "Medium",
    recommendation: "Enhanced monitoring for transactions from identified regions",
    timestamp: "15 minutes ago",
    agent: "Behavioral Analyst",
  },
  {
    id: "insight_003",
    type: "Compliance Alert",
    title: "Potential Sanctions Evasion Pattern",
    description: "AI detected potential sanctions evasion through entity name variations",
    confidence: 96,
    impact: "Critical",
    recommendation: "Immediate escalation to compliance team required",
    timestamp: "8 minutes ago",
    agent: "Sanctions Intelligence",
  },
];

const chatMessages = [
  {
    id: "msg_001",
    sender: "AI Assistant",
    type: "ai",
    content: "I've completed the initial analysis of the transaction patterns. Found 8 potential anomalies that require human review.",
    timestamp: "2 minutes ago",
    attachments: ["pattern_analysis.pdf", "risk_assessment.json"],
  },
  {
    id: "msg_002",
    sender: "Sarah Chen",
    type: "human",
    content: "Can you provide more details on the highest risk transactions?",
    timestamp: "3 minutes ago",
    attachments: [],
  },
  {
    id: "msg_003",
    sender: "AI Assistant",
    type: "ai",
    content: "The top 3 transactions show velocity patterns 300% above baseline. Transaction TXN-4567 involves $50K to a new beneficiary with limited KYC data.",
    timestamp: "4 minutes ago",
    attachments: ["transaction_details.xlsx"],
  },
];

export function AIAssistedInvestigationsModal({ open, onOpenChange }: AIAssistedInvestigationsModalProps) {
  const [selectedInvestigation, setSelectedInvestigation] = useState(activeInvestigations[0]);
  const [chatInput, setChatInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartInvestigation = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      // Add message logic here
      setChatInput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BotMessageSquare className="h-6 w-6 text-primary" />
            AI-Assisted Investigations
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="active">Active Cases</TabsTrigger>
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Active Investigations</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button onClick={handleStartInvestigation} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Activity className="h-4 w-4 mr-1 animate-pulse" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      New Investigation
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {activeInvestigations.map((investigation) => (
                  <Card 
                    key={investigation.id} 
                    className={`cursor-pointer transition-all ${
                      selectedInvestigation.id === investigation.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedInvestigation(investigation)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold">{investigation.title}</h4>
                            <Badge
                              variant={
                                investigation.priority === "Critical"
                                  ? "destructive"
                                  : investigation.priority === "High"
                                  ? "warning"
                                  : "secondary"
                              }
                            >
                              {investigation.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">ID: {investigation.id}</p>
                        </div>
                        <Badge
                          variant={
                            investigation.status === "AI Analysis"
                              ? "outline"
                              : investigation.status === "Human Review"
                              ? "warning"
                              : "secondary"
                          }
                          className={
                            investigation.status === "AI Analysis" ? "text-primary" : ""
                          }
                        >
                          {investigation.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {investigation.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{investigation.progress}%</span>
                        </div>
                        <Progress value={investigation.progress} className="h-2" />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">AI Agent:</span>
                            <p className="font-medium">{investigation.aiAgent}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Risk Score:</span>
                            <p className="font-medium">{investigation.riskScore}/100</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Findings:</span>
                            <p className="font-medium">{investigation.findings} items</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ETA:</span>
                            <p className="font-medium">{investigation.estimatedCompletion}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {investigation.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Investigation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Assigned To</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {selectedInvestigation.assignedTo.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{selectedInvestigation.assignedTo}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">AI Agent</Label>
                      <p className="text-sm text-muted-foreground">{selectedInvestigation.aiAgent}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Risk Assessment</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Risk Score</span>
                          <span>{selectedInvestigation.riskScore}/100</span>
                        </div>
                        <Progress 
                          value={selectedInvestigation.riskScore} 
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Timeline</Label>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Created</span>
                          <span>{selectedInvestigation.createdAt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Update</span>
                          <span>{selectedInvestigation.lastUpdate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ETA</span>
                          <span>{selectedInvestigation.estimatedCompletion}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Priority Action</p>
                          <p className="text-xs text-muted-foreground">
                            Review transactions TXN-4567 and TXN-4568 for potential structuring
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-warning/5 border border-warning/20 rounded">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Risk Alert</p>
                          <p className="text-xs text-muted-foreground">
                            Customer shows 300% increase in transaction velocity
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">AI Investigation Agents</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Brain className="h-4 w-4 mr-1" />
                  Train Agent
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Deploy Agent
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {aiAgents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{agent.name}</h4>
                          <Badge variant="outline">{agent.type}</Badge>
                          <Badge
                            variant={
                              agent.status === "Active"
                                ? "outline"
                                : agent.status === "Training"
                                ? "warning"
                                : "secondary"
                            }
                            className={
                              agent.status === "Active" ? "text-success" : ""
                            }
                          >
                            {agent.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {agent.specialization}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Accuracy:</span>
                            <span className="ml-2 font-medium">{agent.accuracy}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Cases:</span>
                            <span className="ml-2 font-medium">{agent.casesHandled}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg Time:</span>
                            <span className="ml-2 font-medium">{agent.avgInvestigationTime}</span>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Capabilities</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {agent.capabilities.map((capability, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {capability}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Metrics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Investigation Templates</h3>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                New Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investigationTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="ml-2 font-medium">{template.estimatedDuration}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Automation:</span>
                        <span className="ml-2 font-medium">{template.automationLevel}%</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Investigation Steps</Label>
                      <div className="space-y-1">
                        {template.steps.map((step, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Play className="h-3 w-3 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {aiInsights.map((insight) => (
                <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge variant="outline">{insight.type}</Badge>
                          <Badge
                            variant={
                              insight.impact === "Critical"
                                ? "destructive"
                                : insight.impact === "High"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {insight.impact} Impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Generated by {insight.agent} • {insight.timestamp}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{insight.confidence}%</span>
                      </div>
                    </div>

                    <p className="text-sm mb-3">{insight.description}</p>

                    <div className="p-3 bg-accent/5 border border-accent/20 rounded mb-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-accent mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Recommendation</p>
                          <p className="text-xs text-muted-foreground">{insight.recommendation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Flag className="h-3 w-3 mr-1" />
                        Create Case
                      </Button>
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Helpful
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Investigation Assistant
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Chat with AI agents for real-time investigation support and analysis
                </p>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'human' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'human' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{message.sender}</span>
                          <span className="text-xs opacity-70">{message.timestamp}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        {message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center gap-1 text-xs">
                                <Paperclip className="h-3 w-3" />
                                <span>{attachment}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask the AI assistant about your investigation..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!chatInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Active Cases</span>
                  </div>
                  <div className="text-2xl font-bold">23</div>
                  <div className="text-xs text-success">+5 this week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">AI Accuracy</span>
                  </div>
                  <div className="text-2xl font-bold">94.2%</div>
                  <div className="text-xs text-success">+2.1% this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Avg Resolution</span>
                  </div>
                  <div className="text-2xl font-bold">2.3h</div>
                  <div className="text-xs text-success">-45min this month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold">96.8%</div>
                  <div className="text-xs text-success">+1.5% this month</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Investigation Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Investigation analytics visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-1" />
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}