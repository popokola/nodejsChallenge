const { Router } = require("express");
const multer = require("multer");
const { s3Uploadv3, s3Delete, s3GetSignedUrl } = require("../libs/bucket");
const { logger } = require("../libs/logger");
const uuid = require("uuid").v4;


module.exports = function () {
  const router = Router();

  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1000000000, files: 2 },
  });

  router.get("/signedUrl/:id", async (req, res) => {
    try {
      const url = await s3GetSignedUrl(req.params.id);
      return res.json({ status: "success", url });
    } catch (err) {
      logger.error(err);
      console.log(err);
    }
  });
  

  router.post("/uploads", upload.array("file"), async (req, res) => {
    try {
      const results = await s3Uploadv3(req.files);
     
      return res.json({ status: "success", results });
    } catch (err) {
      logger.error(err);
      console.log(err);
    }
  });

  router.delete("/uploads/:id", async (req, res) => {

    //delete from s3
    try {
      const results = await s3Delete(req.params.id);
      return res.json({  results });
    } catch (err) {
      logger.error(err);
      console.log(err);
    }
  })

  router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "file is too large",
        });
      }
  
      if (error.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          message: "File limit reached",
        });
      }
  
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          message: "File must be an image",
        });
      }
    }
  });


  return router;
};