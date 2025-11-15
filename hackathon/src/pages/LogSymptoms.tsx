import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SymptomLog {
  id: string;
  date: Date;
  time: string;
  discomfortLevel: number;
  symptoms: string[];
}

const symptomOptions = [
  "Gas",
  "Bloating",
  "Cramps",
  "Pain",
  "Nausea",
  "Heartburn",
  "Diarrhea",
  "Constipation",
  "Headache",
  "Fatigue",
];

const LogSymptoms = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>(format(new Date(), "HH:mm"));
  const [discomfortLevel, setDiscomfortLevel] = useState<number>(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "No symptoms selected",
        description: "Please select at least one symptom.",
        variant: "destructive",
      });
      return;
    }

    const symptomLog: SymptomLog = {
      id: Date.now().toString(),
      date,
      time,
      discomfortLevel,
      symptoms: selectedSymptoms,
    };

    const existingLogs = JSON.parse(localStorage.getItem("symptomLogs") || "[]");
    localStorage.setItem("symptomLogs", JSON.stringify([...existingLogs, symptomLog]));

    toast({
      title: "Symptoms logged",
      description: `Your symptoms on ${format(date, "PPP")} at ${time} have been recorded.`,
    });

    setSelectedSymptoms([]);
    setDiscomfortLevel(5);
    setTime(format(new Date(), "HH:mm"));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Log Your Symptoms</h1>
          <p className="text-muted-foreground">Track how you're feeling</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>When did you experience these symptoms?</CardTitle>
            <CardDescription>Select date and time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Discomfort Level
            </CardTitle>
            <CardDescription>Rate your discomfort from 1 (mild) to 10 (severe)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Mild</span>
                <span className="text-2xl font-bold text-foreground">{discomfortLevel}</span>
                <span>Severe</span>
              </div>
              <Slider
                value={[discomfortLevel]}
                onValueChange={(value) => setDiscomfortLevel(value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Symptoms</CardTitle>
            <CardDescription>Check all that apply</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {symptomOptions.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={symptom}
                    checked={selectedSymptoms.includes(symptom)}
                    onCheckedChange={() => handleSymptomToggle(symptom)}
                  />
                  <Label htmlFor={symptom} className="cursor-pointer">
                    {symptom}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSubmit} className="w-full">
          Log Symptoms
        </Button>
      </div>
    </div>
  );
};

export default LogSymptoms;
