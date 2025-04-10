import React from "react";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/actions/user.actions";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AddressList } from "@/components/profile/AddressList"; // Import AddressList

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    // Check for user ID as well
    redirect("/login"); // Redirect if not logged in
  }

  // Fetch user data
  const userData = await getUserProfile();

  if (!userData) {
    // Handle case where user data couldn't be fetched (shouldn't happen if session exists)
    return (
      <p className="text-center text-destructive">
        Error loading profile data.
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Update Form */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
          <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
            <p className="text-muted-foreground mb-1">
              Email: {userData.email}
            </p>
            <p className="text-muted-foreground mb-1">Role: {userData.role}</p>
            <p className="text-muted-foreground mb-4">
              Status: {userData.status}
            </p>
            <ProfileForm
              initialData={{
                firstName: userData.firstName,
                lastName: userData.lastName,
                pixKey: userData.pixKey,
                role: userData.role,
              }}
            />
          </div>
        </div>

        {/* Address Management */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Manage Addresses</h2>
          {/* Pass fetched addresses to the AddressList component */}
          <AddressList addresses={userData.addresses || []} />
          {/* Removed extra closing div */}
        </div>
      </div>
    </div>
  );
}
