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

    const { id, type, description, target, deadline } = await req.json();

    if (!type || !description || !target || !deadline) {
      return new Response("Missing required fields", { status: 400 });
    }

    let goal;

    if (id) {
      goal = await prisma.goal.update({
        where: {
          id: parseInt(id),
        },
        data: {
          type,
          description,
          target,
          deadline: new Date(deadline),
        },
      });
    } else {
      goal = await prisma.goal.create({
        data: {
          userId: parseInt(userId),
          type,
          description,
          target,
          deadline: new Date(deadline),
        },
      });
    }

    return new Response(JSON.stringify(goal), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to create or update goal", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const goals = await prisma.goal.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        deadline: "asc",
      },
    });

    return new Response(JSON.stringify(goals), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch goals", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { goalId } = await req.json();

    if (!goalId) {
      return new Response("Missing goalId", { status: 400 });
    }

    await prisma.goal.delete({
      where: {
        id: parseInt(goalId),
      },
    });

    return new Response("Goal deleted successfully", { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to delete goal", { status: 500 });
  }
}