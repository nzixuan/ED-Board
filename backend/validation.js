const Joi = require("joi")
Joi.objectId = require('joi-objectid')(Joi)

//User

const registerSchema = Joi.object({
    username: Joi.string().min(4).max(30).alphanum().required(),
    password: Joi.string().required().min(4).max(30),
    role: Joi.string().required().valid('admin', 'user')

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

//Audit

const auditSchema = Joi.object({
    username: Joi.string().required(),
    type: Joi.string().required().valid("login", "logout", "edit-roster", "create-roster", "delete-roster", "edit-config"),
    delta: Joi.object(),
    documentId: Joi.objectId(),
    deletedDocumentDate: Joi.date()
})

const auditValidation = (data => {
    return auditSchema.validate(data);
})

//Roster

const staffSchema = Joi.object({
    name: Joi.string().required(),
    shift: Joi.string(),
    note: Joi.string()
})

const rosterSchema = Joi.object({
    assignment: Joi.string().required(),
    am: staffSchema,
    pm: staffSchema,
    nd: staffSchema,
    straddle1: staffSchema,
    straddle2: staffSchema
})

const rostersSchema = Joi.object({
    staffType: Joi.string().required().valid("doctor", "nurse", "log", "ha", "eye"),
    roster: Joi.array().required().items(rosterSchema)
})


const addRosterListSchema = Joi.object({
    date: Joi.date().required(),
    rosters: Joi.array().required().items(rostersSchema),
    username: Joi.string().required()
})

const addRosterListValidation = (data => {
    return addRosterListSchema.validate(data)
})

const rosterQuerySchema = Joi.object({
    date: Joi.date(),
    board: Joi.string(),
})

const rosterQueryValidation = (data => {
    return rosterQuerySchema.validate(data)
})

const deleteRosterSchema = Joi.object({
    date: Joi.date().required(),
    username: Joi.string().required()
})

const deleteRosterValidation = (data => {
    return deleteRosterSchema.validate(data)
})

const massCreateSchema = Joi.object({
    username: Joi.string().required(),
    rosters: Joi.array().required().items(Joi.object({
        date: Joi.date().required(),
        rosters: Joi.array().required().items(rostersSchema)
    }))

})

const massCreateValidation = (data => {
    return massCreateSchema.validate(data)
})


//Config

const configSchema = Joi.object({
    username: Joi.string().required(),
    boards: Joi.object().required(),
    boardNames: Joi.object().required(),
})

const configValidation = (data => {
    return configSchema.validate(data)
})

module.exports = {
    registrationValidation: registrationValidation,
    loginValidation: loginValidation,
    auditValidation: auditValidation,
    addRosterListValidation: addRosterListValidation,
    rosterQueryValidation: rosterQueryValidation,
    massCreateValidation: massCreateValidation,
    deleteRosterValidation: deleteRosterValidation,
    configValidation: configValidation
}