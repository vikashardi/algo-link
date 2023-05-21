import Image from "next/image";
import { useRef, useState } from "react";

function PositonItem({ position }) {
  const highprice = useRef("");
  const [editMode, setEditMode] = useState(false);
  const [sl, setSl] = useState(false);
  const [tsl, setTsl] = useState(false);
  const [slPrice, setSlPrice] = useState("");

  const [editTg, setEditTg] = useState(false);
  const [tg, setTg] = useState(false);
  const [tgPrice, setTgPrice] = useState("");

  const [cb1, setCb1] = useState(true);
  const [cb2, setCb2] = useState(false);
  const [inp1, setInp1] = useState("");
  const [inp2, setInp2] = useState("1");
  const [tgInp, setTgInp] = useState("");

  const handleSLUpdate = () => {
    setEditMode(false);
    if (cb1 && inp1 == "") return;
    if (cb1) {
      setSl(true);
      setSlPrice(inp1);
    } else {
      setSl(false);
      setSlPrice("");
      setInp1("");
    }

    if (cb2) {
      highprice.current = position.lp;
      setTsl(true);
    } else {
      highprice.current = "";
      setTsl(false);
    }
  };

  const handleTgUpdate = () => {
    if (tgInp != "") {
      setTg(true);
      setTgPrice(tgInp);
    } else {
      setTg(false);
      setTgPrice("");
    }
    setEditTg(false);
  };

  const handleRemoveTg = () => {
    setTg(false);
    setTgPrice("");
    setTgInp("");
  };

  async function handleClosePositon(price) {
    setSl(false);
    setTsl(false);
    setTg(false);
    setSlPrice("");
    setInp1("");
    setTgPrice("");
    setTgInp("");

    let data = {
      prc: price,
      tsym: position.tsym,
    };
    const res = await fetch("/api/position/close", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: data,
      }),
    });

    const resData = await res.json();

    console.log(resData);
  }

  if (sl) {
    if (slPrice > position.lp) {
      console.log("close position");
      handleClosePositon(0);
    }
  }

  if (tsl) {
    let diff = +position.lp - +highprice.current;
    if (diff > +inp2) {
      setSlPrice((prev) => (+prev + diff).toFixed(2));
      highprice.current = position.lp;
    }
  }

  if (tg) {
    if (tgPrice < position.lp) {
      console.log("close position");
      handleClosePositon(tgPrice);
    }
  }

  return (
    <li className="position_list">
      <span>{position.tsym}</span>
      <span className="text-right">{position.netqty}</span>
      <div className="flex items-center justify-center">
        {editMode && (
          <div className="fixed grid place-content-center inset-0 bg-black bg-opacity-5 z-50">
            <div className="bg-white w-96 h-64">
              <div className=" relative px-3 py-1 bg-secondary-dark">
                Place SL
                <Image
                  className="absolute right-2 top-2 cursor-pointer"
                  src="/assets/icons/cancle-circle.svg"
                  width={20}
                  height={20}
                  alt="close"
                  onClick={() => setEditMode(false)}
                />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 items-start gap-4">
                  <div className="flex items-center gap-2">
                    {cb1 ? (
                      <Image
                        className="cursor-pointer"
                        src="/assets/icons/check-box-checked.svg"
                        width={20}
                        height={20}
                        alt="close"
                        onClick={() => setCb1(!cb1)}
                      />
                    ) : (
                      <Image
                        className="cursor-pointer"
                        src="/assets/icons/check-box-unchecked.svg"
                        width={20}
                        height={20}
                        alt="close"
                        onClick={() => setCb1(!cb1)}
                      />
                    )}
                    <p className="text-sm">Set Stoploss</p>
                  </div>
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor="sl"
                    >
                      Enter Stoploss
                    </label>
                    <input
                      disabled={!cb1}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      type="number"
                      id="sl"
                      value={inp1}
                      onChange={(e) => setInp1(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {cb2 ? (
                      <Image
                        className="cursor-pointer"
                        src="/assets/icons/check-box-checked.svg"
                        width={20}
                        height={20}
                        alt="close"
                        onClick={() => {
                          setCb2(!cb2);
                        }}
                      />
                    ) : (
                      <Image
                        className="cursor-pointer"
                        src="/assets/icons/check-box-unchecked.svg"
                        width={20}
                        height={20}
                        alt="close"
                        onClick={() => {
                          setCb2(!cb2);
                        }}
                      />
                    )}
                    <p className="text-sm">Set Trailing SL</p>
                  </div>
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor="tsl"
                    >
                      Enter Stoploss
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg  block w-full p-2.5 focus:ring-blue-500 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      disabled={!cb2}
                      type="number"
                      id="tsl"
                      value={inp2}
                      onChange={(e) => setInp2(e.target.value)}
                    />
                  </div>
                </div>
                <hr style={{ marginBlock: "1rem" }} />
                <div className="flex justify-end gap-4">
                  <button className="btn" onClick={(e) => setEditMode(false)}>
                    Cancel
                  </button>
                  <button className="btn_primary" onClick={handleSLUpdate}>
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {position.netqty != 0 &&
          (slPrice != "" ? (
            <div className="flex gap-3">
              <Image
                className="cursor-pointer"
                src="/assets/icons/minus.svg"
                width={20}
                height={20}
                alt="close"
                onClick={() =>
                  setSlPrice((prev) => (+prev - +position.ti).toFixed(2))
                }
              />

              <span onClick={() => setEditMode(true)}>{slPrice}</span>
              <Image
                className="cursor-pointer"
                src="/assets/icons/add.svg"
                width={20}
                height={20}
                alt="close"
                onClick={() =>
                  setSlPrice((prev) => (+prev + +position.ti).toFixed(2))
                }
              />
            </div>
          ) : (
            <Image
              className="cursor-pointer"
              src="/assets/icons/add.svg"
              width={20}
              height={20}
              alt="add Sl"
              onClick={() => setEditMode(true)}
            />
          ))}
      </div>
      <span className="text-right">{position.lp}</span>
      <span className="text-right">
        {position.netqty > 0
          ? (
              position.netqty * position.lp -
              (position.totbuyamt - position.totsellamt)
            ).toFixed(2)
          : position.netqty < 0
          ? (
              position.netqty * position.lp -
              (position.totbuyamt - position.totsellamt)
            ).toFixed(2)
          : (position.totsellamt - position.totbuyamt).toFixed(2)}
      </span>
      {position.netqty != 0 && (
        <div className="flex justify-center items-center">
          {editTg ? (
            <Image
              className="cursor-pointer"
              src="/assets/icons/cancle-circle.svg"
              width={20}
              height={20}
              alt="cancle"
              onClick={() => {
                setTgInp(tgPrice);
                setEditTg(false);
              }}
            />
          ) : (
            tg && (
              <Image
                className="cursor-pointer"
                src="/assets/icons/trash.svg"
                width={20}
                height={20}
                alt="remove tg"
                onClick={handleRemoveTg}
              />
            )
          )}
          <input
            disabled={!editTg}
            type="number"
            className="bg-gray-50 border border-gray-400 disabled:bg-gray-300 w-20 rounded-md text-center"
            value={tgInp}
            onChange={(e) => setTgInp(e.target.value)}
          />
          {editTg ? (
            <Image
              className="cursor-pointer"
              src="/assets/icons/tick.svg"
              width={20}
              height={20}
              alt="update TG"
              onClick={handleTgUpdate}
            />
          ) : (
            <Image
              className="cursor-pointer"
              src="/assets/icons/edit.svg"
              width={20}
              height={20}
              alt="edit Tg"
              onClick={() => setEditTg(true)}
            />
          )}
        </div>
      )}
      <span className="flex justify-center items-center">
        {position.netqty != 0 && (
          <Image
            className="cursor-pointer"
            src="/assets/icons/cancle-circle.svg"
            width={20}
            height={20}
            alt="close position"
            onClick={() => handleClosePositon(0)}
          />
        )}
      </span>
    </li>
  );
}

export default function Positions({ positions }) {
  return (
    <div style={{ border: "1px solid gray" }}>
      <ul className="">
        <li className="position_list bg-primary" key="headeing">
          <span>Symbol</span>
          <span className="text-right">Qty</span>
          <span className="text-center">SL Button</span>
          <span className="text-right">LTP</span>
          <span className="text-right">P&L</span>
          <span className="text-right">Set Trg.</span>
          <span className="text-center"></span>
        </li>
        {positions.length > 0 ? (
          positions.map((position) => (
            <PositonItem position={position} key={position.tsym} />
          ))
        ) : (
          <li>No Position</li>
        )}
      </ul>
    </div>
  );
}
