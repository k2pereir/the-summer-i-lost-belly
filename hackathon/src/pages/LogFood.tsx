import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Camera, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface FoodLog {
  id: string;
  date: Date;
  time: string;
  photoUrl: string;
  analysis: string;
}

const LogFood = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>(format(new Date(), "HH:mm"));
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!photoPreview) {
      toast({
        title: "Photo required",
        description: "Please take or upload a photo of your food.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const foodLog: FoodLog = {
        id: Date.now().toString(),
        date,
        time,
        photoUrl: photoPreview,
        analysis: "Two burgers.",
      };

      const existingLogs = JSON.parse(localStorage.getItem("foodLogs") || "[]");
      localStorage.setItem("foodLogs", JSON.stringify([...existingLogs, foodLog]));

      toast({
        title: "Food logged successfully",
        description: `Your meal on ${format(date, "PPP")} at ${time} has been recorded.`,
      });

      setPhotoPreview("");
      setTime(format(new Date(), "HH:mm"));
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Log Your Meal</h1>
          <p className="text-muted-foreground">Take a photo and let AI analyze your food</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meal Details</CardTitle>
            <CardDescription>When did you eat this meal?</CardDescription>
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
              <Camera className="w-5 h-5 text-primary" />
              Food Photo
            </CardTitle>
            <CardDescription>Take or upload a photo of your meal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 space-y-4">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Food preview"
                  className="max-w-full max-h-64 object-contain rounded-lg"
                />
              ) : (
                <Camera className="w-16 h-16 text-muted-foreground" />
              )}
              <Label
                htmlFor="photo-upload"
                className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                {photoPreview ? "Change Photo" : "Take or Upload Photo"}
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoCapture}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isAnalyzing || !photoPreview}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing..." : "Log Meal"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogFood;
