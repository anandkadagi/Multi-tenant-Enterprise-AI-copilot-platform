const multer = require("multer");


// for doc uploads
const documentUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 }, 
});

// for user upload
const excelUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, "uploads"),
        filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap
    fileFilter: (req, file, cb) => {
        const allowed = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only .xlsx or .xls files are allowed"));
        }
        cb(null, true);
    },
});

module.exports = { documentUpload, excelUpload };