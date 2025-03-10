const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB 연결 성공!"))
  .catch((err) => console.error("MongoDB 연결 실패:", err));

app.get("/", (req, res) => {
  res.send("서버가 정상 작동 중입니다!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`));

const productRoutes = require("./routes/productRoutes");
app.use("/api", productRoutes);
