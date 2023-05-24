"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Broker = ({ broker, selectBroker }) => {
  const router = useRouter();
  const [editLot, setEditLot] = useState(false);
  const [lotSize, setLotSize] = useState(broker.lot);
  const handleUpdateLots = async () => {
    const res = await fetch("/api/broker", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: broker._id, lotSize }),
    });
    const resData = await res.json();

    if (res.status == 200) {
      router.refresh();
    } else {
      console.log(resData);
    }
    setEditLot(false);
  };

  const toggleActive = async () => {
    const res = await fetch("/api/broker", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: broker._id, isActive: !broker.isActive }),
    });
    const resData = await res.json();

    if (res.status == 200) {
      router.refresh();
    } else {
      console.log(resData);
    }
  };

  const handleRemoveBroker = async () => {
    const res = await fetch(`/api/broker?id=${broker._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resdata = await res.json();
    if (res.status == 200) {
      router.refresh();
    } else {
      console.log(resdata);
    }
  };

  // token validtion
  let isTokenValid = false;
  if (
    broker.btoken != "" &&
    broker.tokenexp == new Date().toISOString().slice(0, 10)
  ) {
    isTokenValid = true;
  }

  return (
    <div className="broker_list">
      <span>{broker.name}</span>
      <span>{broker.broker_name.toUpperCase()}</span>
      <span>{broker.userId}</span>
      <div className="flex justify-center gap-1">
        {editLot ? (
          <>
            <Image
              className="cursor-pointer"
              onClick={() => {
                setLotSize(broker.lot);
                setEditLot((prev) => false);
              }}
              src="/assets/icons/cancle-circle.svg"
              height={20}
              width={20}
              alt="tick"
            />
            <input
              className="bg-gray-50 border border-gray-300 w-12 text-center"
              type="number"
              min="1"
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
            />
            <Image
              className="cursor-pointer"
              onClick={handleUpdateLots}
              src="/assets/icons/tick.svg"
              height={20}
              width={20}
              alt="tick"
            />
          </>
        ) : (
          <>
            <span>{broker.lot}</span>
            <Image
              className="cursor-pointer"
              onClick={() => setEditLot((prev) => true)}
              src="/assets/icons/edit.svg"
              height={20}
              width={20}
              alt="tick"
            />
          </>
        )}
      </div>
      <div className="flex justify-center">
        {broker.primary ? (
          <Image
            src="/assets/icons/check-box-checked.svg"
            height={20}
            width={20}
            alt="tick"
          />
        ) : (
          <Image
            src="/assets/icons/check-box-unchecked.svg"
            height={20}
            width={20}
            alt="tick"
          />
        )}
      </div>
      <div>
        {broker.isActive ? (
          <Image
            className="cursor-pointer"
            onClick={toggleActive}
            src="/assets/icons/play.svg"
            height={20}
            width={20}
            alt="tick"
          />
        ) : (
          <Image
            className="cursor-pointer"
            onClick={toggleActive}
            src="/assets/icons/stop.svg"
            height={20}
            width={20}
            alt="tick"
          />
        )}
      </div>
      <div className="flex gap-2">
        {isTokenValid ? (
          <>
            {broker.primary && (
              <Link
                href="/trade"
                className="border border-gray-600 bg-gray-50 p-1 rounded-full"
              >
                <Image
                  src="/assets/icons/ext-link.svg"
                  width={20}
                  height={20}
                  alt="cb"
                />
              </Link>
            )}
            {broker.broker_name == "finvasia" && (
              <Link
                href={{ pathname: "/finvasia", query: { id: broker._id } }}
                className="border border-gray-600 bg-gray-50 p-1 rounded-full"
              >
                <Image
                  src="/assets/icons/link.svg"
                  width={20}
                  height={20}
                  alt="cb"
                />
              </Link>
            )}
            {broker.broker_name == "flattrade" && (
              <Link
                href={`https://auth.flattrade.in/?app_key=${broker.key}`}
                className="border border-gray-600 bg-gray-50 p-1 rounded-full"
              >
                <Image
                  src="/assets/icons/link.svg"
                  width={20}
                  height={20}
                  alt="cb"
                />
              </Link>
            )}
            <button
              type="button"
              onClick={() => selectBroker(broker, "order")}
              className="border border-gray-600 bg-gray-50 p-1 rounded-full"
            >
              <Image
                src="/assets/icons/book.svg"
                width={20}
                height={20}
                alt="cb"
              />
            </button>
            <button
              type="button"
              className="border border-gray-600 bg-gray-50 p-1 rounded-full"
              onClick={() => selectBroker(broker, "position")}
            >
              <Image
                src="/assets/icons/book.svg"
                width={20}
                height={20}
                alt="cb"
              />
            </button>
          </>
        ) : (
          <>
            {broker.broker_name == "finvasia" && (
              <Link
                href={{ pathname: "/finvasia", query: { id: broker._id } }}
                className="border border-gray-600 bg-gray-50 p-1 rounded-full"
              >
                <Image
                  src="/assets/icons/link.svg"
                  width={20}
                  height={20}
                  alt="cb"
                />
              </Link>
            )}
            {broker.broker_name == "flattrade" && (
              <Link
                href={`https://auth.flattrade.in/?app_key=${broker.key}`}
                className="border border-gray-600 bg-gray-50 p-1 rounded-full"
              >
                <Image
                  src="/assets/icons/link.svg"
                  width={20}
                  height={20}
                  alt="cb"
                />
              </Link>
            )}
          </>
        )}
      </div>
      <div>
        {!broker.primary && (
          <Image
            className="cursor-pointer"
            onClick={handleRemoveBroker}
            src="/assets/icons/trash.svg"
            height={20}
            width={20}
            alt="tick"
          />
        )}
      </div>
    </div>
  );
};

export default Broker;
