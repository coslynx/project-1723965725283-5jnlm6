"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";

const WorkoutLogForm = ({ goalId }) => {
  const [activityType, setActivityType] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const store = useStore();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goalId,
          activityType,
          duration,
          intensity,
          notes,
        }),
      });

      if (response.ok) {
        // Workout logged successfully
        const data = await response.json();
        store.addWorkoutLog(data);
        setActivityType("");
        setDuration("");
        setIntensity("");
        setNotes("");
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Log Workout</h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="activityType">Activity Type</Label>
              <Input
                type="text"
                id="activityType"
                name="activityType"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                type="number"
                id="duration"
                name="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="intensity">Intensity</Label>
              <select
                id="intensity"
                name="intensity"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                required
              >
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging Workout..." : "Log Workout"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default WorkoutLogForm;