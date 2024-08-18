"use client";

import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import { useState, useEffect } from "react";
import { Button, Card, Input, Textarea } from "@/components/ui";

const UserProfile = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const store = useStore();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/${session.user.id}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchUser();
    }
  }, [session]);

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    setIsUpdating(true);
    setError(null);

    const formData = new FormData(event.target);
    const updatedUser = {
      id: session.user.id,
      email: formData.get("email"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      bio: formData.get("bio"),
    };

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      setUser(data);
      store.setUser(data);
    } catch (error) {
      setError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      {user && (
        <Card>
          <form onSubmit={handleUpdateUser}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName">First Name</label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  defaultValue={user.firstName}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName">Last Name</label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  defaultValue={user.lastName}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={user.email}
                  required
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="bio">Bio</label>
                <Textarea
                  id="bio"
                  name="bio"
                  defaultValue={user.bio}
                />
              </div>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;