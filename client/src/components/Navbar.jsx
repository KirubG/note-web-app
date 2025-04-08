import React, { useState } from "react";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userInfo }) => {
  let navigate = useNavigate();

  let onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-full flex drop-shadow-lg shadow-lg py-2 px-4 gap-3 items-center justify-between ">
      <h1 className="text-xl font-medium text-black py-2">Notes</h1>


      <Profile userInfo={userInfo} onClick={onLogout} />
    </div>
  );
};

export default Navbar;
