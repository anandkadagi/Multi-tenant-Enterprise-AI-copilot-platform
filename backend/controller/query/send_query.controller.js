const query_service=require("../../services/query/send_query.service")

const axios = require("axios")

// exports.send_query_controller =async (req, res)=>{
//     try{
//         const {query}=req.body;
//         const response = await axios.post(
//             "http://localhost:8000/injection/chat",
//             {
//                 query
//             }
//         );

//         return res.json(response.data);
//     }catch(error){
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// }

exports.send_query_controller = async (req, res) => {
    try {
        const { query } = req.body;
        const { id: userId, companyId } = req.user; 

        if (!query) {
            return res.status(400).json({ message: "query is required" });
        }

        const response = await axios.post(
            "http://localhost:8000/injection/chat",
            {
                query,
                companyId,
                userId
            }
        );

        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}