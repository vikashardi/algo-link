"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    broker_name: "finvasia",
    userId: "",
    key: "",
    secret: "",
    lot: "1",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/broker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (res.status == 201) {
      router.push("/dashboard");
    } else {
      console.log(await res.json());
    }
  };
  return (
    <section>
      <h1 className="section_heading">Add Broker</h1>
      <div className="max-w-md p-4 border border-secondary-dark rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit}>
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
              placeholder="Name for Identification"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="broker_name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Broker
            </label>
            <select
              id="broker_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={form.broker_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, broker_name: e.target.value }))
              }
            >
              <option value="finvasia">Finvasia</option>
              <option value="flattrade">FlatTrade</option>
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="userId"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              User Id
            </label>
            <input
              type="text"
              id="userId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="UserId of Broker"
              value={form.userId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  userId: e.target.value.toUpperCase(),
                }))
              }
              required
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="key"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Broker Key
            </label>
            <input
              type="text"
              id="key"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Broker Key"
              value={form.key}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, key: e.target.value }))
              }
              required
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="secret"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {form.broker == "finvasia" ? "Verndor Code" : "Broker Secret"}
            </label>
            <input
              type="text"
              id="secret"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Broker Secret/Vendor Code"
              value={form.secret}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, secret: e.target.value }))
              }
              required
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="lots"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Lots
            </label>
            <input
              type="number"
              id="lots"
              min={1}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Default No of Lots to Trade"
              value={form.lot}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, lot: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex justify-between my-6">
            <Link href="/dashboard" className="btn_outline_primary">
              Cancle
            </Link>
            <button type="submit" className="btn_primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
