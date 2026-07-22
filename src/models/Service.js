import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    deliveryDays: {
      type: Number,
      required: true
    },

    features: [String]
  },
  {
    _id: false
  }
);

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      required: true
    },

    description: String,

    icon: String,

    packages: [packageSchema]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Service", serviceSchema);