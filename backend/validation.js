const Joi = require("joi")
Joi.objectId = require('joi-objectid')(Joi)


const registerSchema = Joi.object({
    username: Joi.string().min(4).max(30).alphanum().required(),
    password: Joi.string().required().min(4).max(30),
    role: Joi.string().required().valid('admin', 'guest')

})

const registrationValidation = (data => {
    return registerSchema.validate(data);
})

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const loginValidation = (data => {
    return loginSchema.validate(data);
})

const auditSchema = Joi.object({
    username: Joi.string().required(),
    type: Joi.string().required().valid("login", "logout", "edit-roster", "create-roster"),
    delta: Joi.object(),
    documentId: Joi.objectId(),
})

const auditValidation = (data => {
    return auditSchema.validate(data);
})

const addRosterSchema = Joi.object({
    date: Joi.date().required(),
    roster: Joi.array().required().items(Joi.object({
        assignment: Joi.string().required(),
        name: Joi.string().required(),
        shift: Joi.string(),
        staffType: Joi.string().required().valid("doctor", "nurse", "log", "ha", "eye"),
        note: Joi.string()
    })),
    username: Joi.string().required()
})

const addRosterValidation = (data => {
    return addRosterSchema.validate(data)
})

const rosterQuerySchema = Joi.object({
    date: Joi.date().required(),
    staffType: Joi.string()
})

const rosterQueryValidation = (data => {
    return rosterQuerySchema.validate(data)
})

const massCreateSchema = Joi.object({
    username: Joi.string().required(),
    rosters: Joi.array().required().items(Joi.object({
        date: Joi.date().required(),
        roster: Joi.array().required().items(Joi.object({
            assignment: Joi.string().required(),
            name: Joi.string().required(),
            shift: Joi.string(),
            staffType: Joi.string().required().valid("doctor", "nurse", "log", "ha", "eye"),
            note: Joi.string()
        }))
    }))
})

const massCreateValidation = (data => {
    return massCreateSchema.validate(data)
})

module.exports = {
    registrationValidation: registrationValidation,
    loginValidation: loginValidation,
    auditValidation: auditValidation,
    addRosterValidation: addRosterValidation,
    rosterQueryValidation: rosterQueryValidation,
    massCreateValidation: massCreateValidation
}