import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Passwordinput = ({onChange, value}) => {
  let [isShowPassword, setIsShowPassword] = useState(false);

  const toggle = () => {
    return setIsShowPassword(!isShowPassword);
  };
  return (
    <>
      <label htmlFor="password">Password</label>
      <div className=" flex justify-between p-2 border-2 border-[rgb(180,180,180)] rounded-xl ">
        <input
          type={isShowPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder="Enter your password"
          value={value}
          onChange={onChange}
          className="outline-none"
          minLength={6}
          maxLength={10}
          required
        />
        {isShowPassword ? (
            <FaRegEye
              size={22}
              className="text-blue-600"
              onClick={() => {
                toggle();
              }}
            />
        ) : (
            <FaRegEyeSlash            
             size={22}
              className="text-blue-600"
              onClick={() => {
                toggle();}} />
        )}
      </div>
    </>
  );
};

export default Passwordinput;
