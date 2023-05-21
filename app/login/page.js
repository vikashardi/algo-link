"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export const metadata = {
  title: "Algolink | Login",
};

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true);
    signIn("credentials", { email, password, redirect: false })
      .then((response) => {
        if (response.ok) {
          router.push("/dashboard");
        } else {
          console.log(response);
        }
        // setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="main">
        <div className="gradient"></div>
      </div>
      <div className="absolute bg-white p-4 rounded-2xl w-96 shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* <div className="absolute inset-0 m-auto max-w-sm bg-white p-4 rounded-2xl shadow-lg"> */}
        <h1 className="text-center font-Bruno text-secondary text-3xl font-bold">
          Login
        </h1>
        <p className="text-center text-sm text-gray-700 mt-2">Welcome Back!</p>
        <form onSubmit={handleSubmit} className="mt-10">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your e-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Passwrod
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex mt-4 justify-end">
            <button className="btn_primary" type="submit">
              Login
            </button>
          </div>
          <div className="my-4">
            <p className="text-center text-sm text-gray-400">
              Don't have account with us?{" "}
              <Link className="font-bold text-blue-600" href="/signup">
                Signup
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
