import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Broker from "@/models/Broker";
import { ftModifyOrder } from "@/lib/flattradeAPI";
import { fvModifyOrder } from "@/lib/finvasiaAPI";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ msg: "bbk" }, { status: 401 });
  const user = session.user.id;
  const { data } = await req.json();
  try {
    await dbConnect();
    const brokers = await Broker.find({ user: user, isActive: true });
    brokers.forEach(async (broker) => {
      if (
        broker.tokenexp == new Date().toISOString().slice(0, 10) &&
        broker.btoken != ""
      ) {
        switch (broker.broker_name) {
          case "flattrade":
            console.log(
              await ftModifyOrder(
                { ...data, uid: broker.userId },
                broker.btoken
              )
            );
            break;
          case "finvasia":
            console.log(
              await fvModifyOrder(
                { ...data, uid: broker.userId },
                broker.btoken
              )
            );
            break;

          default:
            break;
        }
      }
    });
    return NextResponse.json({ mag: "ok" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { mag: "Server Error. Try again latter" },
      { status: 500 }
    );
  }
}
