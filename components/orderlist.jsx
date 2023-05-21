import Image from "next/image";
import { useState } from "react";

function OrderItem({ order }) {
  const [editMode, setEditMode] = useState(false);
  const [price, setPrice] = useState(
    order.prctyp.includes("SL") ? order.trgprc : order.prc
  );

  const handleCancleorder = async (order) => {
    const res = await fetch("api/order/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prd: order.prd,
        tsym: order.tsym,
        trantype: order.trantype,
      }),
    });

    const resData = await res.json();

    console.log(resData);
  };

  const handleModifyOrder = async (order) => {
    let data = {
      exch: order.exch,
      tsym: order.tsym,
      prd: order.prd,
      trantype: order.trantype,
    };

    if (order.prctyp == "LMT") data["prc"] = price;
    if (order.prctyp == "SL-LMT") {
      data["trgprc"] = price;
      data["prc"] =
        order.trantype == "B"
          ? (+price + 0.1).toFixed(2)
          : (+price - 0.1).toFixed(2);
    }

    const res = await fetch("api/order/modify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: data }),
    });

    const resData = await res.json();

    console.log(resData);
  };

  return (
    <li className="order_list px-2">
      <span>{order.tsym}</span>
      <span className="text-right">{order.qty}</span>
      {editMode ? (
        <div className="flex justify-end items-center gap-2 px-4">
          <Image
            className="cursor-pointer"
            src="/assets/icons/cancle-circle.svg"
            width={20}
            height={20}
            alt="close"
            onClick={() => {
              setPrice(order.prc);
              setEditMode(false);
            }}
          />

          <input
            className="bg-gray-50 border w-full px-2 rounded-md text-center border-gray-300"
            type="number"
            step={order.ti}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Image
            className="cursor-pointer"
            src="/assets/icons/tick.svg"
            width={20}
            height={20}
            alt="close"
            onClick={() => {
              handleModifyOrder(order);
              setEditMode(false);
            }}
          />
        </div>
      ) : (
        <div className="flex justify-end items-center gap-2 px-4">
          <span>{price}</span>
          <Image
            className="cursor-pointer"
            src="/assets/icons/edit.svg"
            width={20}
            height={20}
            alt="close"
            onClick={() => setEditMode(true)}
          />
        </div>
      )}

      <span>{order.status.slice(0, 3)}</span>
      <span>
        <Image
          className="cursor-pointer"
          src="/assets/icons/trash.svg"
          width={20}
          height={20}
          alt="close"
          onClick={(e) => handleCancleorder(order)}
        />
      </span>
    </li>
  );
}

export default function Orderlist({ orders }) {
  return (
    <div style={{ border: "1px solid gray" }}>
      <ul>
        <li className="order_list bg-primary px-2" key="heading">
          <span>Symbol</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Price</span>
          <span>Sta</span>
          <span></span>
        </li>
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderItem key={order.norenordno} order={order} />
          ))
        ) : (
          <li>No Pending Orders</li>
        )}
      </ul>
    </div>
  );
}
