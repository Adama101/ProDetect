'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Minus, Save, Download, Eye, Settings, Layout, Columns, Rows, Type, Calendar, Clock, User, Building, MapPin, DollarSign, Zap, Sparkles, Lightbulb, ArrowRight, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FIUReportTemplate } from './fiu-report-template';

export function ReportBuilder() {
  const [activeTab, setActiveTab] = useState('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customSections, setCustomSections] = useState<any[]>([
    { title: 'Report Information', fields: [
      { name: 'reportTitle', label: 'Report Title', type: 'text', required: true },
      { name: 'reportDate', label: 'Report Date', type: 'date', required: true },
      { name: 'reportPeriod', label: 'Reporting Period', type: 'daterange', required: true },
    ]},
    { title: 'Summary', fields: [
      { name: 'executiveSummary', label: 'Executive Summary', type: 'textarea', required: true },
    ]},
  ]);
  const { toast } = useToast();

  const handleAddSection = () => {
    setCustomSections([
      ...customSections,
      { title: 'New Section', fields: [] }
    ]);
  };

  const handleAddField = (sectionIndex: number) => {
    const updatedSections = [...customSections];
    updatedSections[sectionIndex].fields.push({
      name: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false
    });
    setCustomSections(updatedSections);
  };

  const handleRemoveField = (sectionIndex: number, fieldIndex: number) => {
    const updatedSections = [...customSections];
    updatedSections[sectionIndex].fields.splice(fieldIndex, 1);
    setCustomSections(updatedSections);
  };

  const handleUpdateSection = (sectionIndex: number, field: string, value: any) => {
    const updatedSections = [...customSections];
    updatedSections[sectionIndex][field] = value;
    setCustomSections(updatedSections);
  };

  const handleUpdateField = (sectionIndex: number, fieldIndex: number, property: string, value: any) => {
    const updatedSections = [...customSections];
    updatedSections[sectionIndex].fields[fieldIndex][property] = value;
    setCustomSections(updatedSections);
  };

  const handleSaveTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Your custom report template has been saved successfully.",
    });
  };

  const standardTemplates = [
    { id: 'str', name: 'Suspicious Transaction Report (STR)', description: 'NFIU Format', icon: FileText },
    { id: 'sar', name: 'Suspicious Activity Report (SAR)', description: 'CBN Format', icon: FileText },
    { id: 'ctr', name: 'Currency Transaction Report (CTR)', description: 'CBN/NFIU Format', icon: FileText },
    { id: 'aml', name: 'Monthly AML Summary', description: 'Internal/Regulatory Format', icon: FileText },
    { id: 'pep', name: 'PEP Screening Report', description: 'Internal/Regulatory Format', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="template">Select Template</TabsTrigger>
          <TabsTrigger value="custom">Custom Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="template" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all ${
                  selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <template.icon className="h-5 w-5 text-primary" />
                    {template.name}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end">
                    <Button 
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template.id);
                        setActiveTab('preview');
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="cursor-pointer border-dashed" onClick={() => setActiveTab('custom')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plus className="h-5 w-5 text-primary" />
                  Create Custom Template
                </CardTitle>
                <CardDescription>Build a custom report template from scratch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setActiveTab('custom')}>
                    <Zap className="mr-2 h-4 w-4" />
                    Start Building
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Settings className="h-5 w-5" />
                Custom Report Builder
              </CardTitle>
              <CardDescription>
                Design your own report template by adding sections and fields
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input id="template-name" placeholder="Enter template name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-category">Category</Label>
                    <Select>
                      <SelectTrigger id="template-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regulatory">Regulatory</SelectItem>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="audit">Audit</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea id="template-description" placeholder="Enter template description" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Template Sections</h3>
                  <Button variant="outline" size="sm" onClick={handleAddSection}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Section
                  </Button>
                </div>

                <div className="space-y-6">
                  {customSections.map((section, sectionIndex) => (
                    <Card key={sectionIndex}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <Input 
                            value={section.title} 
                            onChange={(e) => handleUpdateSection(sectionIndex, 'title', e.target.value)}
                            className="font-medium text-base border-none p-0 h-auto focus-visible:ring-0"
                          />
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Rows className="h-4 w-4" />
                            </Button>
                            {customSections.length > 1 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  const updatedSections = [...customSections];
                                  updatedSections.splice(sectionIndex, 1);
                                  setCustomSections(updatedSections);
                                }}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {section.fields.map((field: any, fieldIndex: number) => (
                          <div key={fieldIndex} className="grid grid-cols-12 gap-4 items-start">
                            <div className="col-span-3">
                              <Input 
                                value={field.label} 
                                onChange={(e) => handleUpdateField(sectionIndex, fieldIndex, 'label', e.target.value)}
                                placeholder="Field Label"
                              />
                            </div>
                            <div className="col-span-3">
                              <Select 
                                value={field.type} 
                                onValueChange={(value) => handleUpdateField(sectionIndex, fieldIndex, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Field Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="textarea">Text Area</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="date">Date</SelectItem>
                                  <SelectItem value="daterange">Date Range</SelectItem>
                                  <SelectItem value="select">Dropdown</SelectItem>
                                  <SelectItem value="checkbox">Checkbox</SelectItem>
                                  <SelectItem value="radio">Radio</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-3">
                              <Input 
                                value={field.name} 
                                onChange={(e) => handleUpdateField(sectionIndex, fieldIndex, 'name', e.target.value)}
                                placeholder="Field Name"
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`required-${sectionIndex}-${fieldIndex}`} 
                                  checked={field.required}
                                  onCheckedChange={(checked) => handleUpdateField(sectionIndex, fieldIndex, 'required', !!checked)}
                                />
                                <Label htmlFor={`required-${sectionIndex}-${fieldIndex}`}>Required</Label>
                              </div>
                            </div>
                            <div className="col-span-1 flex justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleRemoveField(sectionIndex, fieldIndex)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAddField(sectionIndex)}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Field
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab('template')}>
                  Back to Templates
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSaveTemplate}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Template
                  </Button>
                  <Button onClick={() => setActiveTab('preview')}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6 mt-6">
          {selectedTemplate && ['str', 'sar', 'ctr'].includes(selectedTemplate) ? (
            <FIUReportTemplate 
              reportType={selectedTemplate.toUpperCase() as 'STR' | 'SAR' | 'CTR'} 
              onSave={(data) => {
                toast({
                  title: "Report Saved",
                  description: "Your report has been saved as a draft.",
                });
              }}
              onSubmit={(data) => {
                toast({
                  title: "Report Submitted",
                  description: "Your report has been submitted to the regulatory body.",
                });
                setActiveTab('template');
              }}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Eye className="h-5 w-5" />
                  Template Preview
                </CardTitle>
                <CardDescription>
                  Preview how your report template will look when filled out
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {customSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-4">
                    <h3 className="font-medium text-lg">{section.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.fields.map((field: any, fieldIndex: number) => (
                        <div key={fieldIndex} className="space-y-2">
                          <Label>{field.label} {field.required && <span className="text-destructive">*</span>}</Label>
                          {field.type === 'text' && <Input placeholder={`Enter ${field.label.toLowerCase()}`} />}
                          {field.type === 'textarea' && <Textarea placeholder={`Enter ${field.label.toLowerCase()}`} />}
                          {field.type === 'number' && <Input type="number" placeholder={`Enter ${field.label.toLowerCase()}`} />}
                          {field.type === 'date' && (
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <Calendar className="mr-2 h-4 w-4" />
                              <span>Pick a date</span>
                            </Button>
                          )}
                          {field.type === 'select' && (
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="option1">Option 1</SelectItem>
                                <SelectItem value="option2">Option 2</SelectItem>
                                <SelectItem value="option3">Option 3</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          {field.type === 'checkbox' && (
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`preview-${sectionIndex}-${fieldIndex}`} />
                              <Label htmlFor={`preview-${sectionIndex}-${fieldIndex}`}>{field.label}</Label>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {sectionIndex < customSections.length - 1 && <Separator />}
                  </div>
                ))}

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setActiveTab(selectedTemplate ? 'template' : 'custom')}>
                    Back to {selectedTemplate ? 'Templates' : 'Builder'}
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}