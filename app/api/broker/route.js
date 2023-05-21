import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Broker from "@/models/Broker";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ msg: "Bad Boy" }, { status: 401 });
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const de = await Broker.findById(id);
      let bd = { ...de._doc };
      return NextResponse.json(
        { ...bd, _id: bd._id.toString(), user: bd.user.toString() },
        { status: 200 }
      );
    } else {
      const de = await Broker.find({});
      let data = de.map((e) => {
        let bd = { ...e._doc };
        return { ...bd, _id: bd._id.toString(), user: bd.user.toString() };
      });
      return NextResponse.json(data, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ msg: "Bad Boy" }, { status: 401 });
  const user = session.user.id;
  const { name, broker_name, userId, key, secret, lot } = await req.json();
  try {
    await dbConnect();
    const primaryBroker = await Broker.findOne({ user: user, primary: true });
    if (primaryBroker) {
      if (!(await Broker.findOne({ user: user, name: name }))) {
        const sbroker = await Broker.create({
          user,
          name,
          broker_name,
          userId,
          key,
          secret,
          lot,
        });
        return NextResponse.json(sbroker, { status: 201 });
      } else {
        return NextResponse.json(
          { msg: "Identificaton Name exist" },
          { status: 409 }
        );
      }
    } else {
      const newbroker = await Broker.create({
        user,
        name,
        broker_name,
        userId,
        key,
        secret,
        lot,
        primary: true,
      });
      return NextResponse.json(newbroker, { status: 201 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ msg: "Bad Boy" }, { status: 401 });
  const { id, lotSize, isActive, btoken, tokenexp } = await req.json();
  try {
    await dbConnect();
    const broker = await Broker.findById(id);
    if (btoken != undefined) {
      broker.btoken = btoken;
      broker.tokenexp = tokenexp;
    }
    if (lotSize != undefined) {
      broker.lot = lotSize;
    }
    if (isActive != undefined) {
      broker.isActive = isActive;
    }
    broker.save();
    return NextResponse.json({ msg: "ok" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!session) return NextResponse.json({ msg: "Bad Boy" }, { status: 401 });
  try {
    await dbConnect();
    const db = await Broker.deleteOne({ _id: id, user: session.id });
    console.log(db);
    // if (dd.acknowledged) {
    //   res.status(200).json({ msg: "OK" });
    // } else {
    //   console.log(dd);
    //   res.status(500).json({ msg: "Server Errror try later" });
    // }
    return NextResponse.json({ msg: "ok" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "server Error" }, { status: 500 });
  }
}
