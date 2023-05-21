"use client";
import { useEffect, useState } from "react";
import { sha256 } from "js-sha256";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const search = useSearchParams();
  const id = search.get("id");
  const [broker, setBroker] = useState({});
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const getBroker = async () => {
    const res = await fetch(`/api/broker?id=${id}`, { method: "GET" });
    if (res.status == 200) {
      setBroker(await res.json());
    } else {
      console.log(await res.json());
    }
  };
  useEffect(() => {
    getBroker();
  }, []);

  const handleGetToken = async (e) => {
    e.preventDefault();
    let pwd = sha256(password).toString();
    let appkey = sha256(`${broker.userId}|${broker.key}`).toString();
    let payload = {
      source: "API",
      apkversion: "AL:1.0",
      uid: broker.userId,
      pwd: pwd,
      factor2: otp,
      vc: broker.secret,
      appkey: appkey,
      imei: "abc1234",
    };

    const fvres = await fetch(
      "https://api.shoonya.com/NorenWClientTP/QuickAuth",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: `jData=${JSON.stringify(payload)}`,
      }
    );

    const fvdata = await fvres.json();

    if (fvres.status != 200) {
      console.log("Someting went wrong");
    } else {
      if (fvdata.stat == "Not_Ok") {
        console.log(fvdata.emsg);
      } else {
        const res = await fetch("/api/broker", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: broker._id,
            btoken: fvdata.susertoken,
            tokenexp: new Date().toISOString().slice(0, 10),
          }),
        });
        const resdata = await res.json();
        if (res.status == 200) {
          router.push("/dashboard");
        } else {
          console.log(resdata);
        }
      }
    }
  };
  return (
    <div className="grid place-content-center mt-10">
      <div className="w-96 p-6 shadow-lg">
        <h1>Soonya login</h1>
        <p>
          {broker.name} - ({broker.userId})
        </p>
        <form onSubmit={handleGetToken}>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="text"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Broker Terminal Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="otp"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              OTP/TOP
            </label>
            <input
              type="text"
              id="otp"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="OTP/TOP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <div className="my-6">
            <button className="btn_primary" type="submit">
              Get Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
