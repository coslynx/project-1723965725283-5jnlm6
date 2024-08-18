"use server";

import { cookies } from "next/headers";
import { prisma } from "@/db";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { goalId, activityType, duration, intensity, notes } = await req.json();

    if (!goalId || !activityType || !duration || !intensity) {
      return new Response("Missing required fields", { status: 400 });
    }

    const workout = await prisma.workout.create({
      data: {
        userId: parseInt(userId),
        goalId: parseInt(goalId),
        activityType,
        duration: parseInt(duration),
        intensity,
        notes,
      },
    });

    return new Response(JSON.stringify(workout), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to log workout", { status: 500 });
  }
}