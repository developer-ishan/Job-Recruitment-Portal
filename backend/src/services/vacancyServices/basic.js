var Vacancy = require('../../models/vacancy')
var Company = require('../../models/company')
var Skill = require('../../models/skill')
var mongoose = require('mongoose')

// posting a new vacancy - only for company users
exports.postVacancy = (req, res, next) => {

    var newVacancy = new Vacancy({
        owner: req.root._id,
        location: req.body.location,
        salary: req.body.salary,
        desig: req.body.desig,
        desc: req.body.desc,
        requiredSkill: req.body.requiredSkill
    })

    newVacancy.save()
        .then((vacancy) => {
            req.root.vacancyId = vacancy._id
            next()
        })
        .catch((err) => {
            return res.status(500).json({
                err: err,
                success: false
            })
        })
    // passing the control to notification services
}

/*
getting a vacancy
0 - Selected
1 - Pending Request
2 - Not Applied
*/
exports.getVacancy = (req, res) => {

    Vacancy.findById(req.params.vacancyId, (err, vacancy) => {
        if (!vacancy)
            return res.status(404).json({
                err: "Vacancy Not Found!",
                success: false
            })

        let applicationStatus = -1
        let isApplicant = vacancy.applicants.indexOf(req.root._id)
        let isAccepted = vacancy.accepted.indexOf(req.root._id)

        if (isAccepted >= 0)
            applicationStatus = 0
        else if (isApplicant >= 0)
            applicationStatus = 1
        else
            applicationStatus = 2

        var skill_ids = vacancy.requiredSkill.map((id) => {
            return mongoose.mongo.ObjectID(id)
        })

        Company.findById(vacancy.owner, (err, company) => {
            Skill.find({
                _id: {
                    $in: skill_ids
                }
            }, (err, skills) => { // finding the skills with skillID
                res.status(200).json({
                    applicationStatus: applicationStatus,
                    location: vacancy.location,
                    salary: vacancy.salary,
                    desig: vacancy.desig,
                    desc: vacancy.desc,
                    isOpen: vacancy.isOpen,
                    requiredSkill: skills,
                    applicantCount: vacancy.applicants.length + vacancy.accepted.length,
                    Oname: company.name,
                    Oemail: company.email,
                    Ologo: company.logo,
                    O_id: company._id,
                    createdAt: vacancy.createdAt
                })
            })
        })
    })
}

// updating an existing vacancy
exports.updateVacancy = (req, res) => {
    Vacancy.findById(req.params.vacancyId, (err, vacancy) => {
        if (!vacancy)
            return res.status(404).json({
                err: "Vacancy Not Found!!",
                success: false
            })

        if (vacancy.owner.toString() !== req.root._id.toString())
            return res.status(401).json({
                err: "Not Authorised. Cannot Update!!",
                success: false
            })

        // if any of the field is not provided, it is not updated
        if (req.body.location !== undefined)
            vacancy.location = req.body.location
        if (req.body.salary !== undefined)
            vacancy.salary = req.body.salary
        if (req.body.desig !== undefined)
            vacancy.desig = req.body.desig
        if (req.body.desc !== undefined)
            vacancy.desc = req.body.desc
        if (req.body.requiredSkill !== undefined)
            vacancy.requiredSkill = req.body.requiredSkill

        vacancy.save()
            .catch((err) => {
                return res.status(500).json({
                    err: err,
                    success: false
                })
            })

        return res.status(200).json({
            msg: "Vacancy Updated!",
            success: true
        })
    })
}

exports.deleteVacancy = (req, res) => {
    Vacancy.findById(req.params.vacancyId, (err, vacancy) => {
        if (!vacancy)
            return res.status(404).json({
                err: "Vacancy Not Found!!",
                success: false
            })

        if (vacancy.owner.toString() !== req.root._id.toString())
            return res.status(401).json({
                err: "Not Authorised. Cannot Delete!!",
                success: false
            })

        Vacancy.findByIdAndDelete(vacancy._id)
            .catch((err) => {
                return res.status(500).json({
                    err: err,
                    success: false
                })
            })

        return res.status(200).json({
            msg: "Vacancy Deleted!",
            success: true
        })
    })
}