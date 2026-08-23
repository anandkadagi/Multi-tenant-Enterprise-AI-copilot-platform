const axios = require("axios");
const FormData = require("form-data");
const uploadDocServices=require("../../services/uploadDocs/upload_docs.services")

exports.uploadDocument = async (req, res) => {
    try {
        const { userId,tenantId } = req.user;
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

        uploadDocServices.saveDocs({userId, tenantId, file, response})

        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


exports.listDocuments = async (req, res) => {
    try {
        const { tenantId } = req.user;
        const documents = await uploadDocServices.listDocuments({tenantId});
        return res.json({ documents });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};