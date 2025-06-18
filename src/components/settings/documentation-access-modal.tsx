"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookText,
  FileText,
  Code,
  Search,
  ExternalLink,
  Download,
  Star,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Copy,
  Share2,
  Printer,
  Eye,
  Clock,
  Calendar,
  User,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Info,
  MessageSquare,
  Video,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Zap,
  Lightbulb,
  Sparkles,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Filter,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Save,
  Edit,
  Trash2,
  Settings,
  RotateCcw,
  RefreshCw,
  Database,
  Server,
  Globe,
  Shield,
  Lock,
  Unlock,
  Key,
} from "lucide-react";

interface DocumentationAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for documentation
const documentCategories = [
  {
    id: "cat_001",
    name: "Getting Started",
    icon: Zap,
    documents: [
      {
        id: "doc_001",
        title: "Quick Start Guide",
        description: "Get up and running with ProDetect in minutes",
        type: "Guide",
        lastUpdated: "2024-01-15",
        author: "ProDetect Team",
        readTime: "5 min",
        popularity: 4.8,
        tags: ["Beginner", "Setup", "Configuration"],
      },
      {
        id: "doc_002",
        title: "System Requirements",
        description: "Hardware and software requirements for ProDetect",
        type: "Reference",
        lastUpdated: "2024-01-10",
        author: "ProDetect Team",
        readTime: "3 min",
        popularity: 4.2,
        tags: ["Requirements", "Setup", "Infrastructure"],
      },
      {
        id: "doc_003",
        title: "Installation Guide",
        description: "Step-by-step installation instructions",
        type: "Guide",
        lastUpdated: "2024-01-12",
        author: "ProDetect Team",
        readTime: "10 min",
        popularity: 4.5,
        tags: ["Installation", "Setup", "Configuration"],
      },
    ],
  },
  {
    id: "cat_002",
    name: "API Reference",
    icon: Code,
    documents: [
      {
        id: "doc_004",
        title: "API Overview",
        description: "Introduction to the ProDetect API",
        type: "Reference",
        lastUpdated: "2024-01-05",
        author: "API Team",
        readTime: "7 min",
        popularity: 4.6,
        tags: ["API", "Integration", "Developer"],
      },
      {
        id: "doc_005",
        title: "Authentication",
        description: "API authentication methods and security",
        type: "Reference",
        lastUpdated: "2024-01-08",
        author: "Security Team",
        readTime: "8 min",
        popularity: 4.9,
        tags: ["API", "Security", "Authentication"],
      },
      {
        id: "doc_006",
        title: "Endpoints Reference",
        description: "Complete list of API endpoints and parameters",
        type: "Reference",
        lastUpdated: "2024-01-14",
        author: "API Team",
        readTime: "15 min",
        popularity: 4.7,
        tags: ["API", "Endpoints", "Developer"],
      },
    ],
  },
  {
    id: "cat_003",
    name: "Compliance Guides",
    icon: Shield,
    documents: [
      {
        id: "doc_007",
        title: "CBN Compliance Guide",
        description: "Meeting CBN regulatory requirements with ProDetect",
        type: "Guide",
        lastUpdated: "2024-01-03",
        author: "Compliance Team",
        readTime: "12 min",
        popularity: 4.9,
        tags: ["Compliance", "Regulatory", "CBN"],
      },
      {
        id: "doc_008",
        title: "AML Best Practices",
        description: "Anti-Money Laundering best practices and implementation",
        type: "Guide",
        lastUpdated: "2024-01-07",
        author: "Compliance Team",
        readTime: "20 min",
        popularity: 4.8,
        tags: ["AML", "Compliance", "Best Practices"],
      },
      {
        id: "doc_009",
        title: "Regulatory Reporting",
        description: "Guide to regulatory reporting with ProDetect",
        type: "Guide",
        lastUpdated: "2024-01-09",
        author: "Compliance Team",
        readTime: "15 min",
        popularity: 4.7,
        tags: ["Reporting", "Compliance", "Regulatory"],
      },
    ],
  },
  {
    id: "cat_004",
    name: "User Guides",
    icon: Users,
    documents: [
      {
        id: "doc_010",
        title: "Dashboard Guide",
        description: "Understanding and using the ProDetect dashboard",
        type: "Guide",
        lastUpdated: "2024-01-11",
        author: "Product Team",
        readTime: "8 min",
        popularity: 4.5,
        tags: ["Dashboard", "UI", "User Guide"],
      },
      {
        id: "doc_011",
        title: "Case Management",
        description: "Managing compliance cases effectively",
        type: "Guide",
        lastUpdated: "2024-01-13",
        author: "Product Team",
        readTime: "10 min",
        popularity: 4.6,
        tags: ["Cases", "Investigation", "Workflow"],
      },
      {
        id: "doc_012",
        title: "Rules Configuration",
        description: "Creating and managing compliance rules",
        type: "Guide",
        lastUpdated: "2024-01-16",
        author: "Product Team",
        readTime: "12 min",
        popularity: 4.7,
        tags: ["Rules", "Configuration", "Compliance"],
      },
    ],
  },
];

const recentlyViewed = [
  {
    id: "doc_007",
    title: "CBN Compliance Guide",
    viewedAt: "2 hours ago",
    category: "Compliance Guides",
  },
  {
    id: "doc_005",
    title: "Authentication",
    viewedAt: "Yesterday",
    category: "API Reference",
  },
  {
    id: "doc_012",
    title: "Rules Configuration",
    viewedAt: "3 days ago",
    category: "User Guides",
  },
];

const popularSearches = [
  "API authentication",
  "CBN compliance",
  "Transaction monitoring",
  "Rules configuration",
  "Webhook setup",
];

export function DocumentationAccessModal({ open, onOpenChange }: DocumentationAccessModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(documentCategories[0]);
  const [selectedDocument, setSelectedDocument] = useState(documentCategories[0].documents[0]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BookText className="h-6 w-6 text-primary" />
            Documentation Center
          </DialogTitle>
          <DialogDescription>
            Access comprehensive guides, API references, and best practices for ProDetect
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search documentation..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm === "" && (
            <div className="absolute top-full left-0 mt-1 w-full bg-background border rounded-md p-2 z-10">
              <p className="text-xs font-medium text-muted-foreground mb-1">Popular Searches</p>
              <div className="flex flex-wrap gap-1">
                {popularSearches.map((search, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setSearchTerm(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {documentCategories.map((category) => {
                      const CategoryIcon = category.icon;
                      return (
                        <div
                          key={category.id}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${
                            selectedCategory.id === category.id ? 'bg-muted' : ''
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          <CategoryIcon className="h-4 w-4 text-primary" />
                          <span className="font-medium">{category.name}</span>
                          <Badge className="ml-auto">{category.documents.length}</Badge>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Need Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span className="text-sm">Contact Support</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                      <Video className="h-4 w-4 text-primary" />
                      <span className="text-sm">Video Tutorials</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm">Community Forum</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{selectedCategory.name}</h3>
                  <div className="flex gap-2">
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="az">A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCategory.documents.map((document) => (
                    <Card 
                      key={document.id} 
                      className={`cursor-pointer transition-all ${
                        selectedDocument.id === document.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedDocument(document)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{document.title}</h4>
                            <p className="text-sm text-muted-foreground">{document.description}</p>
                          </div>
                          <Badge variant="outline">{document.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{document.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{document.lastUpdated}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-warning" />
                            <span>{document.popularity}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {document.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedDocument.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{selectedDocument.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Updated {selectedDocument.lastUpdated}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{selectedDocument.readTime} read</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-3 w-3 mr-1" />
                          Bookmark
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-muted/20">
                      <div className="space-y-4">
                        <h3 className="font-semibold">Document Preview</h3>
                        <p className="text-sm">
                          This is a preview of the selected document. In a real implementation, 
                          this would display the actual content of the document with proper formatting, 
                          images, code samples, and interactive elements.
                        </p>
                        <div className="flex justify-center">
                          <Button>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open Full Document
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Related Documents</h4>
                      <div className="space-y-2">
                        {documentCategories
                          .flatMap(category => category.documents)
                          .filter(doc => 
                            doc.id !== selectedDocument.id && 
                            doc.tags.some(tag => selectedDocument.tags.includes(tag))
                          )
                          .slice(0, 3)
                          .map(doc => (
                            <div key={doc.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer">
                              <FileText className="h-4 w-4 text-primary" />
                              <span className="text-sm">{doc.title}</span>
                              <ArrowRight className="h-3 w-3 ml-auto" />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recently Viewed Documents</h3>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear History
              </Button>
            </div>

            <div className="space-y-4">
              {recentlyViewed.map((document) => {
                const fullDoc = documentCategories
                  .flatMap(category => category.documents)
                  .find(doc => doc.id === document.id);
                
                return (
                  <Card key={document.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{document.title}</h4>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>{document.category}</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Viewed {document.viewedAt}</span>
                            </div>
                            {fullDoc && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Updated {fullDoc.lastUpdated}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Bookmarked Documents</h3>
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

            <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
              <div className="text-center">
                <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No bookmarks yet</p>
                <p className="text-sm text-muted-foreground mt-2">Bookmark documents for quick access</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Downloaded Documents</h3>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear History
              </Button>
            </div>

            <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
              <div className="text-center">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No downloads yet</p>
                <p className="text-sm text-muted-foreground mt-2">Downloaded documents will appear here</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}