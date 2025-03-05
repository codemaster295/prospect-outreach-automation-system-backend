import express from "express";
import { createFileController, getAllFilesController } from './contactFiles.controller'
import upload from "@/middlewares/upload.middleware";

const contactFilerouter = express.Router();

contactFilerouter.get("/", getAllFilesController);
// contactFilerouter.post("/upload", upload.single("file"),(req, res) => {
//     console.log(req.file,req.context, "<---------")
//     res.send("ok")
// })
// contactFilerouter.get("/:id", getFileByIdController);
contactFilerouter.post("/contactFiles", upload.single("file"), createFileController);


export default contactFilerouter;
