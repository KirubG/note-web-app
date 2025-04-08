import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Passwordinput from "../../components/Passwordinput";
import axiosInstance  from "../../utils/axios";

const Signup = () => {
  let [form, setForm] = useState({
    name: "",
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
    e.preventDefault(); // Fixed typo

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: form.name,
        email: form.email,
        password: form.password,
      });

      if (response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }

    setForm({
      name: "",
      email: "",
      password: "",
    });
  };
  return (
    <>
      <Navbar />

      <div className="container items-center flex justify-center sm:w-[400px] w-[70%] mx-auto mt-2 glassmorphism px-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 mb-10 w-full"
        >
          <h2 className="text-[30px] font-poppins font-semibold text-center">
            Signup
          </h2>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
            value={form.name}
            placeholder="Enter your name"
            className="p-2 border-2 border-[rgb(180,180,180)] rounded-xl outline-none"
            required
          />
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
            Signup
          </button>

          <p>
            Have you an Account?
            <Link className="font-semibold text-blue-600 ml-2" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Signup;
