import { WatchlistContext } from "@/context/watchlistContext";
import React, { useContext, useState } from "react";

const Watchlist = () => {
  const { watchlist: symbols } = useContext(WatchlistContext);
  const [lotsize, setLotsize] = useState("1");
  const [orderType, setOrderType] = useState("LMT");
  return (
    <>
      <div className="flex items-center gap-4 my-2">
        <label htmlFor="lot">Lot :</label>
        <select
          className="bg-gray-50 border border-gray-300 p-1 rounded-lg"
          id="lot"
          value={lotsize}
          onChange={(e) => setLotsize(e.target.value)}
        >
          <option value="1">100%</option>
          <option value="0.75">75%</option>
          <option value="0.50">50%</option>
          <option value="0.25">25%</option>
        </select>
        <label htmlFor="ot">Order type :</label>
        <select
          className="bg-gray-50 border border-gray-300 p-1 rounded-lg"
          id="ot"
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
        >
          <option value="MKT">Market</option>
          <option value="LMT">Limit</option>
          <option value="SL-LMT">Stop</option>
        </select>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-8 md:gap-2 my-4 p-1">
        {symbols.map(
          (sym) =>
            sym && (
              <ListItem
                symbol={sym}
                lotsize={lotsize}
                orderType={orderType}
                key={sym.token}
              />
            )
        )}
      </div>
    </>
  );
};

export default Watchlist;

function ListItem({ symbol, lotsize, orderType }) {
  const [price, setPrice] = useState("");

  const handleOrder = async (side) => {
    let data = {
      // uid: settings.state.userId,
      // actid: settings.state.userId,
      exch: symbol.exch,
      tsym: symbol.tsym,
      lotsize: lotsize,
      ls: symbol.ls,
      prc: "0",
      prd: symbol.exch == "NSE" ? "I" : "M",
      trantype: side,
      prctyp: orderType,
      ret: "day",
    };

    if (orderType == "LMT") {
      if (price == "") {
        data.prctyp = "MKT";
      } else {
        data.prc = price;
      }
    }

    if (orderType == "SL-LMT") {
      if (price == "") {
        data.prctyp = "MKT";
      } else {
        data["trgprc"] = price;
        data.prc =
          side == "B"
            ? (+price + 0.1).toFixed(symbol.pp)
            : (+price - 0.1).toFixed(symbol.pp);
      }
    }

    const res = await fetch("/api/order/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    const resData = await res.json();
    console.log(resData);
  };
  return (
    <div
      className={`relative w-72 p-3 bg-secondary-light border-[2px] rounded-md shadow-lg ${
        symbol.optt == "PE" ? "border-red-700" : "border-green-700"
      }`}
    >
      <p className="font-bold text-blue-900">{symbol.dname}</p>
      <p className="font-bold text-blue-900">{symbol.cname}</p>
      <div className="flex justify-between items-center">
        <p className="text-md font-bold">Ask : {symbol.ask}</p>
        <p className=" text-sm">Ltp : {symbol.ltp}</p>
      </div>
      <div className="absolute flex justify-between inset-x-2 -bottom-3">
        <button
          className="text-xs px-8 bg-green-600 rounded-lg text-white font-bold"
          onClick={(e) => {
            e.preventDefault();
            handleOrder("B");
          }}
        >
          B
        </button>
        {orderType != "MKT" && (
          <input
            type="number"
            className="border border-gray-400 rounded-xl px-2 font-bold text-center"
            style={{ width: "8ch" }}
            placeholder={symbol.ask}
            id="price"
            value={price}
            min={symbol.ti}
            onChange={(e) => setPrice(e.target.value)}
          />
        )}
        <button
          disabled
          className="text-xs px-8 bg-red-600 rounded-lg text-white font-bold"
          // onClick={(e) => {
          //   e.preventDefault();
          //   handleOrder("S");
          // }}
        >
          S
        </button>
      </div>
      {/* {sym.tsym} */}
    </div>
  );
}
