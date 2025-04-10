import React from "react";
// Import necessary components and actions later

// TODO: Add action to fetch ALL users (admin only)

export default async function AdminAllUsersPage() {
  // TODO: Fetch all users using an admin-specific action
  // const allUsers = await getAllUsers();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Users (Admin)</h1>
      <p className="text-muted-foreground mb-6">
        View all registered users on the marketplace.
      </p>

      {/* TODO: Display all users in a table */}
      <div className="border rounded-lg p-4">
        <p className="text-center text-muted-foreground">
          All users table implementation pending.
        </p>
        {/* Placeholder for table */}
      </div>
    </div>
  );
}
