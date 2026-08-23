const axios = require("axios");
const FormData = require("form-data");

exports.uploadDocument = async (req, res) => {
    try {
        const { tenantId } = req.user;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const form = new FormData();
        form.append("file", file.buffer, file.originalname);
        form.append("companyId", tenantId); 

        const response = await axios.post(
            "http://localhost:8000/injection/upload",
            form,
            { headers: form.getHeaders() }
        );

        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};