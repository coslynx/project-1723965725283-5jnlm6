"use client";

import { Chart } from "chart.js";
import { useRef, useEffect } from "react";
import { useStore } from "@/store";

const ProgressChart = ({ goalId }) => {
  const chartRef = useRef(null);
  const store = useStore();
  const goal = store.goals.find((g) => g.id === goalId);
  const workoutLogs = store.workoutLogs.filter((log) => log.goalId === goalId);

  useEffect(() => {
    if (chartRef.current && workoutLogs.length > 0) {
      const chartCanvas = chartRef.current;
      const ctx = chartCanvas.getContext("2d");

      const data = {
        labels: workoutLogs.map((log) => new Date(log.createdAt).toLocaleDateString()),
        datasets: [
          {
            label: goal.type,
            data: workoutLogs.map((log) => log.progress),
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };

      const myChart = new Chart(ctx, {
        type: "line",
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        myChart.destroy();
      };
    }
  }, [workoutLogs, goal]);

  return (
    <div className="mt-4">
      <canvas ref={chartRef} />
    </div>
  );
};

export default ProgressChart;