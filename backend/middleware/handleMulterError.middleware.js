// middlewares/handleMulterError.middleware.js
const multer = require("multer");

const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File is too large" });
        }
        return res.status(400).json({ message: err.message });
    }

    if (err) {
        // any other error thrown before this point (e.g., from a custom fileFilter)
        return res.status(400).json({ message: err.message || "Upload failed" });
    }

    next();
};

module.exports = handleMulterError;