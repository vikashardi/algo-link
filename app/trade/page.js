import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Broker from "@/models/Broker";
import dbConnect from "@/lib/dbConnect";
import TradePannel from "@/components/tradePannel";

async function getBroker() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return {};
    await dbConnect();
    const de = await Broker.findOne({ user: session.user.id, primary: true });
    let bd = { ...de._doc };
    return { ...bd, _id: bd._id.toString(), user: bd.user.toString() };
  } catch (error) {
    console.log(error);
    return {};
  }
}

export default async function Page() {
  const broker = await getBroker();
  return (
    <div className="p-2 lg:p-6">
      <TradePannel config={broker} />
    </div>
  );
}
