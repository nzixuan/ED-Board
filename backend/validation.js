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

const rosterSchema = Joi.object({
    date: Joi.date().required(),
    roster: Joi.array().required().items(Joi.object({
        assignment: Joi.string().required(),
        name: Joi.string().required(),
        shift: Joi.string().valid("am", "pm", "nd", "straddle"),
        staffType: Joi.string().required().valid("doctor", "nurse", "log", "ha", "eye"),
        note: Joi.string()
    })),
    username: Joi.string().required()
})

const rosterValidation = (data => {
    return rosterSchema.validate(data)
})

const rosterQuerySchema = Joi.object({
    date: Joi.date().required(),
    staffType: Joi.string()
})

const rosterQueryValidation = (data => {
    return rosterQuerySchema.validate(data)
})



module.exports = {
    registrationValidation: registrationValidation,
    loginValidation: loginValidation,
    auditValidation: auditValidation,
    rosterValidation: rosterValidation,
    rosterQueryValidation: rosterQueryValidation
}