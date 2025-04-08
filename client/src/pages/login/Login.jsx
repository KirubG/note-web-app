import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Passwordinput from "../../components/Passwordinput";
import axiosInstance from "../../utils/axios";

const Login = () => {
  let [form, setForm] = useState({
    email: "",
    password: "",
  });
  let navigate = useNavigate();

  let handleChange = (e) => {
    let { name, value } = e.target;
    setForm((prevInfo) => {
      return {
        ...prevInfo,
        [name]: value,
      };
    });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();

    //api
    try {
      const response = await axiosInstance.post(
        "/login",
        JSON.stringify({
          email: form.email,
          password: form.password,
        })
      );
      console.log("Full response:", response);

      // handle successfull login
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        // localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // handle error
      alert("Login failed. Please check your credentials.");
      navigate("/login");
    }
  };
  return (
    <>
      <Navbar />

      <div className="container items-center flex justify-center sm:w-[400px] w-[70%] mx-auto mt-10 glassmorphism px-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 mb-10 w-full"
        >
          <h2 className="text-[30px] font-poppins font-semibold text-center">
            Login
          </h2>
          <label htmlFor="email"> Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            value={form.email}
            placeholder="Enter your email"
            className="p-2 border-2 border-[rgb(180,180,180)] rounded-xl outline-none"
            required
          />
          <Passwordinput value={form.password} onChange={handleChange} />
          <button
            type="submit"
            className="bg-blue-600 w-full py-3 px-4 rounded-xl mx-auto text-white"
          >
            Login
          </button>

          <p>
            Not registerd yet?
            <Link className="font-semibold text-blue-600 ml-2" to="/signup">
              Create an Account
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
