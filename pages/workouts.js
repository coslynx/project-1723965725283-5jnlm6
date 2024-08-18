"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";

const WorkoutsPage = () => {
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const store = useStore();
  const goals = store.goals;

  const handleGoalSelect = (goalId) => {
    setSelectedGoalId(goalId);
  };

  const handleWorkoutLog = async (event) => {
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
          goalId: selectedGoalId,
          activityType: event.target.activityType.value,
          duration: event.target.duration.value,
          intensity: event.target.intensity.value,
          notes: event.target.notes.value,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        store.addWorkoutLog(data);
        event.target.reset();
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
      <h1 className="text-3xl font-bold mb-4">Workouts</h1>
      <div className="mb-4">
        <Label htmlFor="goalSelect">Select Goal</Label>
        <select
          id="goalSelect"
          onChange={(e) => handleGoalSelect(e.target.value)}
        >
          <option value={null}>-- Select a goal --</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.type} - {goal.description}
            </option>
          ))}
        </select>
      </div>
      {selectedGoalId && (
        <>
          <h2 className="text-2xl font-bold mb-4">
            Log Workout for:{" "}
            {goals.find((goal) => goal.id === selectedGoalId)?.description}
          </h2>
          <Card>
            <form onSubmit={handleWorkoutLog}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="activityType">Activity Type</Label>
                  <Input
                    type="text"
                    id="activityType"
                    name="activityType"
                    placeholder="e.g., Running, Cycling, Strength Training"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    type="number"
                    id="duration"
                    name="duration"
                    placeholder="e.g., 30"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="intensity">Intensity</Label>
                  <select id="intensity" name="intensity" required>
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
                    placeholder="Optional: Add any details about your workout"
                  />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging Workout..." : "Log Workout"}
                </Button>
              </div>
            </form>
          </Card>
        </>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Workout Logs</h2>
        <ul>
          {store.workoutLogs.map((log) => (
            <li key={log.id} className="mb-2">
              <p>
                {log.activityType} - {log.duration} minutes -{" "}
                {log.intensity} intensity
              </p>
              {log.notes && <p className="text-gray-600">{log.notes}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkoutsPage;