"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";

const GoalForm = ({ goalId, isEditing, onSubmit }) => {
  const [type, setType] = useState(isEditing ? goalId.type : "");
  const [description, setDescription] = useState(
    isEditing ? goalId.description : ""
  );
  const [target, setTarget] = useState(isEditing ? goalId.target : "");
  const [deadline, setDeadline] = useState(
    isEditing ? new Date(goalId.deadline).toISOString().slice(0, 10) : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const store = useStore();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/goals", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: isEditing ? goalId.id : undefined,
          type,
          description,
          target,
          deadline,
        }),
      });

      if (response.ok) {
        // Goal saved or updated successfully
        const data = await response.json();
        if (isEditing) {
          store.updateGoal(data);
        } else {
          store.addGoal(data);
        }
        onSubmit();
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
      <h1 className="text-3xl font-bold mb-4">
        {isEditing ? "Edit Goal" : "Set Goal"}
      </h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="type">Goal Type</Label>
              <select
                id="type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="weight loss">Weight Loss</option>
                <option value="muscle gain">Muscle Gain</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="activity level">Activity Level</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="target">Target</Label>
              <Input
                type="text"
                id="target"
                name="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                type="date"
                id="deadline"
                name="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update Goal" : "Set Goal"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default GoalForm;