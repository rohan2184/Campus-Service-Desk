const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ticketSchema = new mongoose.Schema(
  {
    ticketID: {
      type: String,
      unique: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please select a title/issue type"],
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please add a description of the issue"],
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: ["IT Support", "Facilities", "Academic Services", "Other"],
    },
    location: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Low",
    },
    status: {
      type: String,
      enum: [
        "Approval",
        "Open",
        "In Progress",
        "Completed",
        "Review",
        "Closed",
      ],
      default: "Approval",
    },
    ticketType: {
      type: String,
      enum: ["Student Generated", "Staff Generated", "Admin Generated"],
      default: "Student Generated",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    optimalCompletionTime: {
      type: Date,
    },
    adminRemarks: {
      type: String,
    },
    feedback: {
      type: String,
    },
    satisfactionTag: {
      type: String,
      enum: ["completed good", "unresolved", "average", "bad"],
    },
    stateEntryTimestamps: [
      {
        state: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    attachments: [
      {
        type: String,
      },
    ],
    comments: [commentSchema],
    history: [
      {
        action: String,
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Auto-generate sequential ticketID (CSD-000001 format)
ticketSchema.pre("save", async function () {
  if (!this.isNew) {
    return;
  }
  try {
    const lastTicket = await this.constructor.findOne(
      {},
      { ticketID: 1 },
      { sort: { createdAt: -1 } },
    );
    let nextNum = 1;
    if (lastTicket && lastTicket.ticketID) {
      const match = lastTicket.ticketID.match(/CSD-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    this.ticketID = "CSD-" + String(nextNum).padStart(6, "0");
  } catch (err) {
    // Fallback to timestamp-based ID
    this.ticketID = "CSD-" + Date.now().toString().slice(-6);
  }
});

module.exports = mongoose.model("Ticket", ticketSchema);
