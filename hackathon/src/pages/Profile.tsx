import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Heart, Moon, Utensils } from "lucide-react";

interface ProfileData {
  name: string;
  gender: string;
  age: string;
  weight: string;
  dietType: string;
  healthConditions: string;
  familyHistory: string;
  allergies: string;
  menstrualInfo: string;
  sleepHabits: string;
  doctorEmail: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    gender: "",
    age: "",
    weight: "",
    dietType: "",
    healthConditions: "",
    familyHistory: "",
    allergies: "",
    menstrualInfo: "",
    sleepHabits: "",
    doctorEmail: "",
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem("healthProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("healthProfile", JSON.stringify(profile));
    toast({
      title: "Profile saved",
      description: "Your health information has been securely stored.",
    });
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      localStorage.removeItem("healthProfile");
      localStorage.removeItem("foodLogs");
      localStorage.removeItem("symptomLogs");
      setProfile({
        name: "",
        gender: "",
        age: "",
        weight: "",
        dietType: "",
        healthConditions: "",
        familyHistory: "",
        allergies: "",
        menstrualInfo: "",
        sleepHabits: "",
        doctorEmail: "",
      });
      toast({
        title: "Data cleared",
        description: "All your health data has been removed.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Health Profile</h1>
          <p className="text-muted-foreground">Manage your personal health information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Basic details about you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  placeholder="Your age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                  placeholder="Your weight"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dietType">Diet Type</Label>
              <Select value={profile.dietType} onValueChange={(value) => setProfile({ ...profile, dietType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="omnivore">Omnivore</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Health Information
            </CardTitle>
            <CardDescription>Medical history and conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="healthConditions">Previous Health Conditions</Label>
              <Textarea
                id="healthConditions"
                value={profile.healthConditions}
                onChange={(e) => setProfile({ ...profile, healthConditions: e.target.value })}
                placeholder="Pre-diabetic, diseases, etc."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyHistory">Family Health History</Label>
              <Textarea
                id="familyHistory"
                value={profile.familyHistory}
                onChange={(e) => setProfile({ ...profile, familyHistory: e.target.value })}
                placeholder="Hereditary conditions"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={profile.allergies}
                onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                placeholder="Food allergies, medication allergies, etc."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary" />
              Lifestyle Information
            </CardTitle>
            <CardDescription>Sleep and menstrual cycle details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="menstrualInfo">Menstrual Cycle Info (Optional)</Label>
              <Textarea
                id="menstrualInfo"
                value={profile.menstrualInfo}
                onChange={(e) => setProfile({ ...profile, menstrualInfo: e.target.value })}
                placeholder="Frequency, cramps, symptoms, etc."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleepHabits">Sleep Habits</Label>
              <Textarea
                id="sleepHabits"
                value={profile.sleepHabits}
                onChange={(e) => setProfile({ ...profile, sleepHabits: e.target.value })}
                placeholder="Hours per night, typical bedtime, sleep quality, etc."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-primary" />
              Doctor Information
            </CardTitle>
            <CardDescription>Where AI reports will be sent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctorEmail">Doctor's Email</Label>
              <Input
                id="doctorEmail"
                type="email"
                value={profile.doctorEmail}
                onChange={(e) => setProfile({ ...profile, doctorEmail: e.target.value })}
                placeholder="doctor@example.com"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1">
            Save Profile
          </Button>
          <Button onClick={handleClear} variant="destructive">
            Clear All Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
