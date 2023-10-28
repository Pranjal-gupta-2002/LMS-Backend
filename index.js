import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "Backend",
  })
  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();
const port = 3000;

const users = [];

//using middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const decodedData = jwt.verify(token, "fgeuygfyetgfh");
    console.log(decodedData);
    req.user = await User.findById(decodedData._id);
    next();
  } else {
    res.redirect("/login")
  }
};

//setting up viw engine
app.set("view engine", "ejs");

app.get("/", isAuthenticated, (req, res) => {
  console.log(req.user);
  res.render("logout", { name: req.user.name });
});

app.get("/register", (req, res) => {
  console.log(req.user);
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");

});

app.post("/login",async(req,res)=>{
  const {email,password} = req.body;

  let user = await User.findOne({email})
  if(!user){
    return res.redirect("/register")
  }

  const isMatch = user.password===password;

  if(!isMatch){
    return res.render("login",{email,message:"Incorrect Password"})
  }
  const token = jwt.sign({ _id: user._id }, "fgeuygfyetgfh");

  // console.log(token)

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");

})

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.redirect("/login");
  }

  console.log(req.body);
  user = await User.create({ name, email, password });

  const token = jwt.sign({ _id: user._id }, "fgeuygfyetgfh");

  // console.log(token)

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
