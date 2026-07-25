import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    serviceTitle: {
      type: String,
      required: true,
      trim: true
    },

    serviceSlug: {
      type: String,
      required: true,
      trim: true
    },

    packageName: {
      type: String,
      required: true,
      trim: true
    },

    packageIndex: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    deliveryDays: {
      type: Number,
      required: true,
      min: 1
    },

    features: {
      type: [String],
      default: []
    }
  },
  {
    _id: false
  }
);

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    senderName: {
      type: String,
      required: true,
      trim: true
    },

    senderRole: {
      type: String,
      enum: ["customer", "admin"],
      required: true
    },

    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    }
  },
  {
    timestamps: true
  }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in-progress",
        "delivered",
        "cancelled"
      ],
      required: true
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    changedByName: {
      type: String,
      default: "System",
      trim: true
    },

    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator(items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "An order must contain at least one item."
      }
    },

    total: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in-progress",
        "delivered",
        "cancelled"
      ],
      default: "pending",
      index: true
    },

    projectBrief: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000
    },

    preferredDeadline: {
      type: Date,
      default: null
    },

    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    messages: {
      type: [messageSchema],
      default: []
    },

    statusHistory: {
      type: [statusHistorySchema],
      default: []
    }  
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Order", orderSchema);