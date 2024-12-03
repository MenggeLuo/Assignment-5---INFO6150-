const Company = require("../models/Company");
const User = require("../models/User");

exports.checkAdminPrevileges = async function(userId) {
    if(!userId) {
        return res.status(400).send({
            message: "User ID is required in the request body"})};

    try {
        const user = await User.findById(userId)

        if(!user) {
            return res.status(404).send({
                message: "User not found with ID " + userId
            });
        } else {
            if(user.type !== 'admin') {
                return res.status(403).send({
                    message: "Only admin users can create companies"
                });
            }
        }
    } catch (error) {
        return res.status(500).send({
            message: "Error", error
        });
    }
}

exports.checkIfCompanyExists = async function(companyId) {
    try {
        const company = await Company.findById(companyId)
        if(!company) {
            return res.status(404).send({
                message: "Company not found with ID " + companyId
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: "Error", error
        });
    }
}