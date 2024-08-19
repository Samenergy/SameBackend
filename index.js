import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define CORS options
const corsOptions = {
  origin: "http://localhost:5173",
  allowedHeaders: ["Authorization", "Content-Type"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Mongoose schema and model for feedback
const feedbackSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Route to handle contact form submission
app.post("/send-email", async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).send({ error: "All fields are required" });
  }

  try {
    // Save feedback to MongoDB
    const newFeedback = new Feedback({
      firstName,
      lastName,
      email,
      subject,
      message,
    });
    await newFeedback.save();

    // Response after saving feedback
    res
      .status(200)
      .send({ message: "Feedback received and saved successfully!" });
  } catch (error) {
    console.error("Error processing feedback:", error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your feedback" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
