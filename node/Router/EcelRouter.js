const express = require('express');
const multer = require('multer');
const path = require('path');

const { postupload, getupload } = require('../Controller/ExcelController');
const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();

        if (ext === ".xlsx") {
            cb(null, true);
        } else {
            cb(new Error("Only .xlsx files are allowed"));
        }
    }
});

router.get('/excel', getupload);
router.post('/excel', upload.single('file'), postupload);

module.exports = router;