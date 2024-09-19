const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials:true
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server successfully  started on : ${PORT}`));



mongoose.connect(
  process.env.DB_LINK,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Successfully Connected to MongoDB");
  }
);


//import routes
const Auth = require("./routes/AuthRoutes");
const userRouter = require("./routes/userRoutes");
const heartRateRouter = require("./routes/HeartRateRoutes");
const therapyRouter = require("./routes/therapyRoutes")
const suggestedTherapies = require("./routes/suggestedTherapyRoutes")
const chatbotInput = require("./routes/ChatbotInputRoutes")
const FeedbackInput = require("./routes/FeedbackInputRoutes")
const taskRouter = require("./routes/taskRoutes");
const musicRoute = require("./routes/MusicRoutes");


//User management routes
app.use("/emosense",Auth);

//user routes
app.use("/emosense/user",userRouter);

//user routes
app.use("/emosense/health",heartRateRouter);

//therapy routes
app.use("/therapy",therapyRouter)

//suggested therapy routes
app.use("/suggested-therapy",suggestedTherapies)

//chatbot inputs routes
app.use("/chatbotinput",chatbotInput)

//feedback inputs routes
app.use("/feedback",FeedbackInput)

//task routes
app.use("/emosense/task",taskRouter);

app.use("/music", musicRoute);
