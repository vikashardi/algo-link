const baseURL = "https://api.shoonya.com/NorenWClientTP";
export async function fvPlaceOrder(data, jkey) {
  const res = await fetch(`${baseURL}/PlaceOrder`, {
    method: "POST",
    body: `jData=${JSON.stringify(data)}&jKey=${jkey}`,
  });

  return await res.json();
}

export async function fvCancelOrder(uid, jkey, prd, tsym, trantype) {
  const [norenordno, qty] = await fvGetOrderNo(uid, jkey, prd, tsym, trantype);
  if (norenordno == null) return;
  const res = await fetch(`${baseURL}/CancelOrder`, {
    method: "POST",
    body: `jData=${JSON.stringify({ norenordno, uid })}&jKey=${jkey}`,
  });

  return await res.json();
}

export async function fvModifyOrder(data, jkey) {
  const { uid, prd, tsym, trantype } = data;
  const [norenordno, qty] = await fvGetOrderNo(uid, jkey, prd, tsym, trantype);
  if (norenordno == null) return;
  const res = await fetch(`${baseURL}/ModifyOrder`, {
    method: "POST",
    body: `jData=${JSON.stringify({ ...data, qty, norenordno })}&jKey=${jkey}`,
  });

  return await res.json();
}

export async function fvGetOrderBook(userId, jkey) {
  const res = await fetch(`${baseURL}/OrderBook`, {
    method: "POST",
    body: `jData=${JSON.stringify({
      uid: userId,
    })}&jKey=${jkey}`,
  });

  const pb = await res.json();
  if (pb.stat == "Not_Ok") return null;
  if (res.status == 200) {
    return pb;
  } else {
    return null;
  }
}

export async function fvGetOrderNo(uid, jkey, prd, tsym, trantype) {
  const res = await fetch(`${baseURL}/OrderBook`, {
    method: "POST",
    body: `jData=${JSON.stringify({ uid, prd })}&jKey=${jkey}`,
  });

  const ol = await res.json();

  if (res.status == 200) {
    let i;
    ol.forEach((order, index) => {
      if (
        order.tsym == tsym &&
        order.trantype == trantype &&
        (order.status == "PENDING" ||
          order.status == "TRIGGER_PENDING" ||
          order.status == "OPEN")
      ) {
        i = index;
      }
    });
    if (i == undefined) return [null, null];
    return [ol[i].norenordno, ol[i].qty];
  } else {
    return [null, null];
  }
}

export async function fvGetPositions(userId, jkey) {
  const res = await fetch(`${baseURL}/PositionBook`, {
    method: "POST",
    body: `jData=${JSON.stringify({
      uid: userId,
      actid: userId,
    })}&jKey=${jkey}`,
  });

  const pb = await res.json();
  if (pb.stat == "Not_Ok") return null;
  if (res.status == 200) {
    return pb;
  } else {
    return null;
  }
}

export async function fvGetOpenPosition(userId, tsym, jkey) {
  const res = await fetch(`${baseURL}/PositionBook`, {
    method: "POST",
    body: `jData=${JSON.stringify({
      uid: userId,
      actid: userId,
    })}&jKey=${jkey}`,
  });

  const pb = await res.json();
  if (pb.stat == "Not_Ok") return null;
  if (res.status == 200) {
    return pb.filter((pos) => pos.tsym == tsym);
  } else {
    return null;
  }
}

export async function fvClosePosition(userId, tsym, prc, jkey) {
  const pos = await fvGetOpenPosition(userId, tsym, jkey);
  if (pos == null) return "hi";
  let data = {
    uid: userId,
    actid: userId,
    exch: pos[0].exch,
    tsym: pos[0].tsym,
    qty: pos[0].netqty,
    prc: "0",
    prd: pos[0].prd,
    trantype: pos[0].netqty > 0 ? "S" : "B",
    prctyp: "MKT",
    ret: "day",
  };

  if (prc != 0) {
    data.prc = prc.toString();
    data.prctyp = "LMT";
  }

  const res = await fetch(`${baseURL}/PlaceOrder`, {
    method: "POST",
    body: `jData=${JSON.stringify(data)}&jKey=${jkey}`,
  });

  return await res.json();
}
