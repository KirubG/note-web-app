import React from "react";

import { getInitials } from "../utils/helpers";

const Profile = ({ userInfo, onClick }) => {
  if (!userInfo) {
    return null // or return null
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="rounded-full flex bg-slate-200 text-slate-950 font-bold w-12 h-12 items-center justify-center">
        {getInitials(userInfo.fullName)}
      </div>

      <div className="flex flex-col">
        <h4>{userInfo.fullName}</h4>
        <button
          className="text-slate-600 font-semibold underline"
          onClick={onClick}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;