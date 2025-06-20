"use client";

import { useState } from "react";
import { FuzzyMatchForm } from "@/components/fuzzy-matching/fuzzy-match-form";
import { MatchResultsTable } from "@/components/fuzzy-matching/match-results-table";
import { EnhanceMatchingOutput } from "@/ai/flows/enhance-matching";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Database, History, FileText } from "lucide-react";

export default function FuzzyMatchingPage() {
  const [matchResults, setMatchResults] = useState<EnhanceMatchingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("screening");

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Fuzzy Matching & Sanctions Screening
          </h1>
          <p className="text-muted-foreground mt-1">
            Screen names against watchlists to identify potential matches, even with spelling variations or aliases.
          </p>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="screening" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Name Screening
          </TabsTrigger>
          <TabsTrigger value="databases" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Watchlist Databases
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Screening History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="screening" className="space-y-4 mt-4">
          <FuzzyMatchForm
            onResults={setMatchResults}
            onLoadingStateChange={setIsLoading}
          />

          <MatchResultsTable results={matchResults} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="databases" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Connected Watchlists
                </CardTitle>
                <CardDescription>
                  Currently connected sanctions and watchlist databases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {[
                    { name: "OFAC SDN List", status: "Connected", lastUpdated: "Today", entries: "10,523" },
                    { name: "UN Consolidated List", status: "Connected", lastUpdated: "Yesterday", entries: "8,745" },
                    { name: "EU Sanctions List", status: "Connected", lastUpdated: "3 days ago", entries: "7,892" },
                    { name: "Internal Watchlist", status: "Connected", lastUpdated: "Today", entries: "1,245" },
                  ].map((db, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        <div>
                          <p className="font-medium">{db.name}</p>
                          <p className="text-xs text-muted-foreground">Last updated: {db.lastUpdated}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {db.entries} entries
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Watchlist Statistics
                </CardTitle>
                <CardDescription>
                  Overview of watchlist data and screening performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Total Entities</p>
                      <p className="text-2xl font-bold">28,405</p>
                    </div>
                    <div className="p-4 border rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Last Update</p>
                      <p className="text-2xl font-bold">Today</p>
                    </div>
                    <div className="p-4 border rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Avg. Match Time</p>
                      <p className="text-2xl font-bold">0.8s</p>
                    </div>
                    <div className="p-4 border rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Match Accuracy</p>
                      <p className="text-2xl font-bold">94.7%</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Database Distribution</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>OFAC SDN List</span>
                        <span>37%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>UN Consolidated List</span>
                        <span>31%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>EU Sanctions List</span>
                        <span>28%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Internal Watchlist</span>
                        <span>4%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Recent Screening History
              </CardTitle>
              <CardDescription>
                Recent name screening activities and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Date/Time</th>
                      <th className="text-left py-3 px-4 font-medium">Name Screened</th>
                      <th className="text-left py-3 px-4 font-medium">Database</th>
                      <th className="text-left py-3 px-4 font-medium">Matches</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { 
                        datetime: "2023-07-15 14:32", 
                        name: "Abdul Qadir", 
                        database: "OFAC SDN List", 
                        matches: "3 matches", 
                        status: "Flagged" 
                      },
                      { 
                        datetime: "2023-07-15 11:15", 
                        name: "Global Trading LLC", 
                        database: "All Databases", 
                        matches: "2 matches", 
                        status: "Cleared" 
                      },
                      { 
                        datetime: "2023-07-14 16:45", 
                        name: "Ibrahim Al-Asiri", 
                        database: "UN Consolidated List", 
                        matches: "1 match", 
                        status: "Under Review" 
                      },
                      { 
                        datetime: "2023-07-14 10:22", 
                        name: "Viktor Petrov", 
                        database: "EU Sanctions List", 
                        matches: "4 matches", 
                        status: "Flagged" 
                      },
                      { 
                        datetime: "2023-07-13 15:10", 
                        name: "John Smith", 
                        database: "All Databases", 
                        matches: "No matches", 
                        status: "Cleared" 
                      },
                    ].map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm">{item.datetime}</td>
                        <td className="py-3 px-4 text-sm font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-sm">{item.database}</td>
                        <td className="py-3 px-4 text-sm">{item.matches}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "Flagged" ? "bg-destructive/10 text-destructive" :
                            item.status === "Under Review" ? "bg-warning/10 text-warning" :
                            "bg-success/10 text-success"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}