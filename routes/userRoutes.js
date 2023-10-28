import express from "express";
import {
  addToPlaylist,
  changePassword,
  deleteMyProfile,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getMyProfile,
  login,
  logout,
  register,
  removeFromPlaylist,
  resetPassword,
  updateProfile,
  updateProfilePic,
  updateUserRole,
} from "../controllers/userController.js";
import { get } from "mongoose";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

// to register a new user
router.route("/register").post(singleUpload, register);

//login
router.route("/login").post(login);

//logout
router.route("/logout").get(logout);

//getMyProfile
router.route("/me").get(isAuthenticated, getMyProfile);

//deleteMtProfile
router.route("/me").delete(isAuthenticated, deleteMyProfile);

//Change Password
router.route("/changepassword").put(isAuthenticated, changePassword);

//updateProfile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

//updateProfilePicture
router
  .route("/updateprofilepic")
  .put(singleUpload, isAuthenticated, updateProfilePic);

//Forget Password
router.route("/forgetpassword").post(forgetPassword);

//resetpassword
router.route("/resetpassword/:token").put(resetPassword);

//ADD TO PLAYLIST
router.route("/addtoplaylist").post(isAuthenticated, addToPlaylist);

//remove from playlist
router.route("/removefromplaylist").delete(isAuthenticated, removeFromPlaylist);

// Admin Routes
router.route("/admin/users").get(isAuthenticated, authorizeAdmin, getAllUsers);

// update role

router
  .route("/admin/user/:id")
  .put(isAuthenticated, authorizeAdmin, updateUserRole)
  .delete(isAuthenticated, authorizeAdmin, deleteUser);

export default router;
