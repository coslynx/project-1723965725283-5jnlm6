"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";
import GoalForm from "@/components/GoalForm";
import ProgressChart from "@/components/ProgressChart";

const GoalsPage = () => {
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const store = useStore();
  const goals = store.goals;

  const handleGoalSelect = (goalId) => {
    setSelectedGoalId(goalId);
  };

  const handleGoalEdit = (goalId) => {
    setSelectedGoalId(goalId);
  };

  const handleGoalDelete = async (goalId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        store.deleteGoal(goalId);
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

  const handleGoalSubmit = () => {
    setSelectedGoalId(null);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Goals</h1>
      <div className="mb-4">
        <GoalForm
          isEditing={selectedGoalId !== null}
          goalId={selectedGoalId ? goals.find((g) => g.id === selectedGoalId) : null}
          onSubmit={handleGoalSubmit}
        />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Goals</h2>
        <ul>
          {goals.map((goal) => (
            <li key={goal.id} className="mb-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{goal.type} - {goal.description}</p>
                  <p className="text-gray-600">
                    Target: {goal.target} - Deadline:{" "}
                    {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedGoalId === goal.id && (
                    <Button onClick={() => handleGoalEdit(goal.id)}>
                      Edit
                    </Button>
                  )}
                  <Button onClick={() => handleGoalDelete(goal.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              {selectedGoalId === goal.id && (
                <ProgressChart goalId={goal.id} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GoalsPage;