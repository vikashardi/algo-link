"use client";
import Broker from "@/components/broker";
import { fvGetOrderBook, fvGetPositions } from "@/lib/finvasiaAPI";
import { useEffect, useState } from "react";

const BrokerList = ({ brokers }) => {
  const [selectedBroker, setSelectedBroker] = useState({});
  const [op, setOp] = useState("");

  const selectBroker = (broker, op) => {
    setSelectedBroker(broker);
    setOp(op);
  };
  return (
    <div className="w-full mt-6">
      <div>
        <div className="broker_list bg-secondary font-bold">
          <span>Name</span>
          <span>Broker</span>
          <span>User Id</span>
          <div className="flex justify-center gap-1">Lots</div>
          <div className="flex justify-center">Primary</div>
          <div>Active</div>
          <div></div>
          <div></div>
        </div>
        {brokers.map((broker) => (
          <Broker
            broker={broker}
            selectBroker={selectBroker}
            key={broker._id.toString()}
          />
        ))}
      </div>
      <div className="mt-6">
        {selectedBroker && op == "order" && (
          <OrderBook broker={selectedBroker} />
        )}
      </div>
      <div className="mt-6">
        {selectedBroker && op == "position" && (
          <PositionBook broker={selectedBroker} />
        )}
      </div>
    </div>
  );
};

export default BrokerList;

const PositionBook = ({ broker }) => {
  const [positions, setPositions] = useState([]);
  useEffect(() => {
    if (broker.broker_name == "finvasia") {
      fvGetPositions(broker.userId, broker.btoken).then((pos) => {
        if (pos) setPositions(pos);
      });
    }
  }, [broker.userId]);

  return (
    <div className="flex flex-col p-4 border shadow-lg">
      <h4 className="font-semibold font-Bruno">
        Positons of {broker.name} ({broker.userId})
      </h4>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Symbol</th>
            <th className="text-right">Qty</th>
            <th className="text-right">P&L</th>
            <th className="text-right">MTM</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {positions.length > 0 &&
            positions.map((position) => (
              <tr key={position.tsym}>
                <td className="text-left">{position.tsym}</td>
                <td className="text-right">{position.netqty}</td>
                <td className="text-right">{position.rpnl}</td>
                <td className="text-right">{position.urmtom}</td>
                <td></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const OrderBook = ({ broker }) => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (broker.broker_name == "finvasia") {
      fvGetOrderBook(broker.userId, broker.btoken).then((orders) => {
        if (orders)
          setOrders(
            orders.filter(
              (o) =>
                o.status == "PENDING" ||
                o.status == "TRIGGER_PENDING" ||
                o.status == "OPEN"
            )
          );
      });
    }
  }, [broker.userId]);

  return (
    <div className="flex flex-col p-4 border shadow-lg">
      <h4 className="font-semibold font-Bruno">
        OrderBook of {broker.name} ({broker.userId})
      </h4>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Symbol</th>
            <th className="text-left">Buy/Sell</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Price</th>
            <th className="text-left">Stauts</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr
                key={order.norenordno}
                className={`${
                  order.trantype == "B" ? "text-green-500" : "text-red-500"
                }`}
              >
                <td>{order.tsym}</td>
                <td className="text-left">
                  {order.trantype == "B" ? "BUY" : "SELL"}
                </td>
                <td className="text-right">{order.qty}</td>
                <td className="text-right">{order.rprc}</td>
                <td className="text-left">{order.status}</td>
                <td></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
