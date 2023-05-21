import Link from "next/link";

export const metadata = {
  title: "Algolink | Login",
};

export default function Page() {
  return (
    <>
      <div className="main">
        <div className="gradient"></div>
      </div>
      <div className="absolute bg-white p-4 rounded-2xl w-96 shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* <div className="absolute inset-0 m-auto max-w-sm bg-white p-4 rounded-2xl shadow-lg"> */}
        <h1 className="text-center font-Bruno text-secondary text-3xl font-bold">
          SignUp
        </h1>
        <p className="text-center text-sm text-gray-700 mt-2">
          Register with{" "}
          <span className="text-primary font-bold"> Algolink</span> for better
          trading exprience
        </p>
        <form className="mt-10">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your Full Name"
              required
            />
          </div>
          <div className="mt-4">
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
              required
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="mobile"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Mobile
            </label>
            <input
              type="text"
              id="mobile"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your Mobile No."
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
              placeholder="Passwrod"
              required
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="cpassword"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm Passwrod
            </label>
            <input
              type="password"
              id="cpassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Re Enter Passwrod"
              required
            />
          </div>
          <div className="flex mt-4 justify-end">
            <button className="btn_primary" type="submit">
              Register
            </button>
          </div>
          <div className="my-4">
            <p className="text-center text-sm text-gray-400">
              Already have account?{" "}
              <Link className="font-bold text-blue-600" href="/login">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
