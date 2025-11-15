import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FoodLog {
  id: string;
  date: Date;
  time: string;
  photoUrl: string;
  analysis: string;
}

interface SymptomLog {
  id: string;
  date: Date;
  time: string;
  discomfortLevel: number;
  symptoms: string[];
}

const History = () => {
  const { toast } = useToast();
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);

  useEffect(() => {
    const loadedFoodLogs = JSON.parse(localStorage.getItem("foodLogs") || "[]");
    const loadedSymptomLogs = JSON.parse(localStorage.getItem("symptomLogs") || "[]");
    
    setFoodLogs(
      loadedFoodLogs.map((log: FoodLog) => ({
        ...log,
        date: new Date(log.date),
      }))
    );
    
    setSymptomLogs(
      loadedSymptomLogs.map((log: SymptomLog) => ({
        ...log,
        date: new Date(log.date),
      }))
    );
  }, []);

  const handleExport = () => {
    const profile = JSON.parse(localStorage.getItem("healthProfile") || "{}");
    const exportData = {
      profile,
      foodLogs,
      symptomLogs,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `health-data-${format(new Date(), "yyyy-MM-dd")}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Data exported",
      description: "Your health history has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Your History</h1>
            <p className="text-muted-foreground">View your logged meals and symptoms</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        <Tabs defaultValue="food" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="food">Food Logs</TabsTrigger>
            <TabsTrigger value="symptoms">Symptom Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="food" className="space-y-4">
            {foodLogs.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No food logs yet. Start by logging your meals!
                </CardContent>
              </Card>
            ) : (
              foodLogs.map((log) => (
                <Card key={log.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {format(log.date, "PPP")} at {log.time}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={log.photoUrl}
                      alt="Food"
                      className="w-full max-h-64 object-contain rounded-lg mb-2"
                    />
                    <p className="text-sm text-muted-foreground">{log.analysis}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-4">
            {symptomLogs.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No symptom logs yet. Start tracking your symptoms!
                </CardContent>
              </Card>
            ) : (
              symptomLogs.map((log) => (
                <Card key={log.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      {format(log.date, "PPP")} at {log.time}
                    </CardTitle>
                    <CardDescription>Discomfort Level: {log.discomfortLevel}/10</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {log.symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default History;
