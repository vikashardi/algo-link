import { Schema, models, model } from "mongoose";

const brokerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Name is Required"],
  },
  userId: {
    type: String,
    required: [true, "UserId is Required"],
  },
  broker_name: {
    type: String,
    required: [true, "Broker is Required"],
  },
  key: {
    type: String,
    required: [true, "Key is Required"],
  },
  secret: {
    type: String,
    required: [true, "Secret/VC is Required"],
  },
  btoken: {
    default: "",
    type: String,
  },
  tokenexp: {
    default: "",
    type: String,
  },
  lot: {
    default: 1,
    type: Number,
  },
  primary: {
    default: false,
    type: Boolean,
  },
  isActive: {
    default: false,
    type: Boolean,
  },
});

const Broker = models.Broker || model("Broker", brokerSchema);
export default Broker;
