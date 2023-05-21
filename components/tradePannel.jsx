"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";
import Search from "@/components/search";
import Watchlist from "@/components/watchlist";
import Orderlist from "@/components/orderlist";
import Positions from "@/components/positions";
import Image from "next/image";
import { WatchlistContext } from "@/context/watchlistContext";

const TradePannel = ({ config }) => {
  // const [watchlist, setWatchlist] = useState([null, null]);
  const { setWatchlist } = useContext(WatchlistContext);
  const [orderlist, setOrderlist] = useState([]);
  const [positions, setPositions] = useState([]);

  const [showOrder, setShowOrder] = useState(true);
  const [showPositions, setShowPositions] = useState(false);

  const ws = useRef(null);
  let wsurl = "";
  if (config.broker_name == "finvasia")
    wsurl = "wss://api.shoonya.com/NorenWSTP/";

  useEffect(() => {
    ws.current = new WebSocket(wsurl);

    ws.current.onopen = (ev) => {
      ws.current.send(
        JSON.stringify({
          t: "c",
          uid: config.userId,
          actid: config.userId,
          source: "API",
          susertoken: config.btoken,
        })
      );
      getPositons();
    };

    ws.current.onmessage = (ev) => {
      let data = JSON.parse(ev.data);
      if (data.t == "ck") {
        ws.current.send(
          JSON.stringify({
            t: "o",
            actid: config.userId,
          })
        );
      }
      if (data.t == "tf" || data.t == "tk") {
        handlePriceUpdate(data);
      }
      if (data.t == "om") {
        handleOrderUpdate(data);
      }
    };

    getOrders();
    return () => {
      ws.current.close();
    };
  }, []);

  const getOrders = async () => {
    const res = await fetch(
      "https://api.shoonya.com/NorenWClientTP/OrderBook",
      {
        method: "POST",
        body: `jData=${JSON.stringify({
          uid: config.userId,
          prd: "I",
        })}&jKey=${config.btoken}`,
      }
    );
    const resData = await res.json();

    if (resData.stat == "Not_Ok") return;
    if (res.status == 200) {
      setOrderlist(
        resData.filter(
          (d) =>
            d.status != "REJECTED" &&
            d.status != "COMPLETE" &&
            d.status != "CANCELED"
        )
      );
    }
  };

  const getPositons = async () => {
    const res = await fetch(
      "https://api.shoonya.com/NorenWClientTP/PositionBook",
      {
        method: "POST",
        body: `jData=${JSON.stringify({
          uid: config.userId,
          actid: config.userId,
        })}&jKey=${config.btoken}`,
      }
    );
    const resData = await res.json();

    if (resData.stat == "Not_Ok") return;
    if (res.status == 200) {
      let sinpos = resData
        .map((p) => {
          return `${p.exch}|${p.token}`;
        })
        .join("#");
      ws.current.send(JSON.stringify({ t: "t", k: sinpos }));
      setPositions(resData);
    }
  };

  const handleOrderUpdate = (data) => {
    // console.log(data);
    setOrderlist((prev) => {
      if (data.reporttype == "NewAck") return [...prev, data];

      if (
        data.reporttype == "Rejected" ||
        data.reporttype == "COMPLETE" ||
        data.reporttype == "Fill" ||
        data.reporttype == "Canceled"
      ) {
        return prev.filter((d) => d.norenordno != data.norenordno);
      }

      if (data.reporttype == "New") {
        let newlist = prev.map((d) => {
          if (d.norenordno == data.norenordno) d.status = data.status;
          return d;
        });
        return newlist;
      }

      if ((data.reporttype == "ModAck", data.reporttype == "Replaced")) {
        let newlist = prev.map((d) => {
          if (d.norenordno == data.norenordno) d = data;
          return d;
        });
        return newlist;
      }
      return [...prev];
    });

    if (data.status == "COMPLETE") {
      getPositons();
    }
  };

  const handlePriceUpdate = (data) => {
    setWatchlist((prev) => {
      prev.map((sy) => {
        if (sy?.token == data.tk) {
          if (data.lp) sy.ltp = data.lp;
          if (data.bp1) sy.ask = data.bp1;
        }
      });
      return [...prev];
    });
    setPositions((prev) => {
      prev.map((sy) => {
        if (sy?.token == data.tk) {
          if (data.lp) sy.lp = data.lp;
        }
      });
      return [...prev];
    });
  };
  return (
    <>
      <div className="container mx-auto">
        <Link
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            zIndex: 999,
          }}
          href="/dashboard"
        >
          <Image
            src="/assets/icons/dashboard.svg"
            alt="dashboard"
            width={30}
            height={30}
          />
        </Link>
        <h1 className="hidden md:block font-Bruno text-xl text-primary font-bold mb-2">
          VY Trade Pannel
        </h1>
        <Search
          broker={config.broker_name}
          userId={config.userId}
          btoken={config.btoken}
          ws={ws}
          // wlHandler={setWatchlist}
        />
        {/* <Watchlist symbols={watchlist} /> */}
        <Watchlist />
        {/* <ul className="flex mt-3">
          <li
            className={`px-2 py-1 relative -bottom-[1px] rounded-t-md font-semibold border cursor-pointer border-black ${
              showOrder ? "bg-primary border-b-0" : "bg-gray-300"
            }`}
            onClick={() => {
              setShowOrder(true);
              setShowPositions(false);
            }}
          >
            Orders
          </li>
          <li
            className={`px-2 py-1 relative -bottom-[1px] rounded-t-md font-semibold border cursor-pointer border-black ${
              showPositions ? "bg-primary border-b-0" : "bg-gray-300"
            }`}
            onClick={() => {
              setShowOrder(false);
              setShowPositions(true);
            }}
          >
            Positions
          </li>
        </ul> */}
        {/* {showOrder && <Orderlist orders={orderlist} />}
        {showPositions && <Positions positions={positions} />} */}
        <div className="mt-10">
          <h2 className="font-Bruno font-semibold ">Order Book</h2>
          <Orderlist orders={orderlist} />
        </div>
        <div className="mt-4">
          <h2 className="font-Bruno font-semibold ">Position Book</h2>
          <Positions positions={positions} />
        </div>
      </div>
    </>
  );
};

export default TradePannel;
