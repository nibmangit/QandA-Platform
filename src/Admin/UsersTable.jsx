import React from "react";

const UsersTable = ({ users }) => (
  <div className="space-y-2">
    {users.map((user) => (
      <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#0F172A] rounded-xl transition-colors">
        <div className="flex items-center space-x-3">
          <img src={user.avatar} className="h-8 w-8 rounded-full" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {user.name} <span className="text-xs text-gray-500 dark:text-gray-400">({user.role})</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="space-x-2">
          <button className="text-sm px-3 py-1 rounded-xl text-white bg-green-500 hover:bg-green-600 transition-colors">Promote</button>
          <button className="text-sm px-3 py-1 rounded-xl text-white bg-red-500 hover:bg-red-600 transition-colors">Ban</button>
        </div>
      </div>
    ))}
  </div>
);

export default UsersTable;
