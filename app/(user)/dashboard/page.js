import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BrokerList from "@/components/brokerList";
import dbConnect from "@/lib/dbConnect";
import BrokerModel from "@/models/Broker";
import { getServerSession } from "next-auth";
import Link from "next/link";

async function getAllBrokers() {
  const session = await getServerSession(authOptions);
  try {
    await dbConnect();
    const de = await BrokerModel.find({ user: session.user.id });
    let data = de.map((e) => {
      let bd = { ...e._doc };
      return { ...bd, _id: bd._id.toString(), user: bd.user.toString() };
    });
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default async function Page() {
  const brokers = await getAllBrokers();
  return (
    <section>
      <h1 className="section_heading">Dashboard</h1>
      <div className="flex">
        <Link href="/broker" className="btn_primary">
          Add Broker
        </Link>
      </div>
      <BrokerList brokers={brokers} />
    </section>
  );
}
