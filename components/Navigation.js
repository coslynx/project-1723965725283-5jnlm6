"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const Navigation = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Fitness Tracker
        </Link>
        <ul className="flex items-center">
          {session ? (
            <>
              <li className="mx-4">
                <Link href="/goals">Goals</Link>
              </li>
              <li className="mx-4">
                <Link href="/workouts">Workouts</Link>
              </li>
              <li className="mx-4">
                <Link href="/profile">Profile</Link>
              </li>
              <li className="mx-4">
                <Link href="/api/auth/signout">Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li className="mx-4">
                <Link href="/login">Login</Link>
              </li>
              <li className="mx-4">
                <Link href="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;