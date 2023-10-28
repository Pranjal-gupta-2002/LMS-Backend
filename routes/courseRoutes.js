import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseLectures,
  addLecture,
  deleteCourse,
  deleteLecture,
} from "../controllers/courseCotroller.js";
import singleUpload from "../middlewares/multer.js";
import { authorizeAdmin, authorizeSubscriber, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Get all the courses
router.route("/courses").get(getAllCourses);

// Create a new course
router
  .route("/createcourse")
  .post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);

// Add Lectures, Delete Course, Get Course Details
router
  .route("/course/:id")
  .get(isAuthenticated,authorizeSubscriber,getCourseLectures)
  .post(isAuthenticated, authorizeAdmin, singleUpload, addLecture)
  .delete(isAuthenticated, authorizeAdmin,deleteCourse);


// delete Lectures

router.route("/lecture").delete(isAuthenticated,authorizeAdmin,deleteLecture);
export default router;
