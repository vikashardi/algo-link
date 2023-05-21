import { WatchlistContext } from "@/context/watchlistContext";
import React, { useState, useEffect, useContext } from "react";

const Search = ({ broker, userId, btoken, ws }) => {
  const { setWatchlist: wlHandler } = useContext(WatchlistContext);
  const [exch, setExch] = useState("NFO");
  const [stext, setStext] = useState("");
  const [searchresult, setSearchresult] = useState([]);
  const [errmsg, setErrmsg] = useState("");

  const handleSelect = (item) => {
    // handler(prev => [...prev, item ])
    wlHandler((prev) => {
      if (item.optt == "PE") {
        prev[1] = item;
        ws.current.send(
          JSON.stringify({
            t: "t",
            k: `${item.exch}|${item.token}`,
          })
        );
      } else {
        prev[0] = item;
        ws.current.send(
          JSON.stringify({
            t: "t",
            k: `${item.exch}|${item.token}`,
          })
        );
      }
      return [...prev];
    });
    setStext("");
    setSearchresult([]);
  };

  useEffect(() => {
    setErrmsg("");
    if (stext.length < 3) return;
    setSearchresult([]);
    const searchSymbols = async () => {
      let url = "";
      if (broker == "flattrade") {
        url = "https://piconnect.flattrade.in/PiConnectTP/SearchScrip";
      }
      if (broker == "finvasia") {
        url = "https://api.shoonya.com/NorenWClientTP/SearchScrip";
      }
      if (url == "") return;
      const res = await fetch(url, {
        method: "POST",
        body: `jData=${JSON.stringify({
          uid: userId,
          stext: encodeURI(stext),
          exch: exch,
        })}&jKey=${btoken}`,
      });

      const resdata = await res.json();

      if (res.status == 200) {
        setSearchresult(resdata.values);
      } else {
        setErrmsg(resdata.emsg);
      }
    };
    let t = setTimeout(() => {
      searchSymbols();
    }, 2000);

    return () => {
      clearTimeout(t);
    };
  }, [stext, exch]);

  return (
    <div className="flex gap-2 w-96 z-10">
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2"
        value={exch}
        onChange={(e) => {
          setExch(e.target.value);
          setSearchresult([]);
          setStext("");
        }}
      >
        <option value="NSE">NSE</option>
        <option value="NFO">NFO</option>
      </select>
      <div className="relative w-full flex-grow">
        <input
          type="text"
          id="search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2"
          value={stext}
          onChange={(e) => setStext(e.target.value)}
        />
        {searchresult.length != 0 && (
          <div className="absolute bg-secondary py-2 inset-x-0 h-72 overflow-y-scroll z-10">
            {searchresult.map((item) => (
              <div
                className="hover:bg-secondary-dark hover:text-white hover:text-lg hover:font-semibold px-4 cursor-pointer"
                key={item.token}
                onClick={() => handleSelect(item)}
              >
                {item.tsym}
              </div>
            ))}
          </div>
        )}
        <p className="absolute bg-secondary">{errmsg}</p>
      </div>
    </div>
  );
};

export default Search;
