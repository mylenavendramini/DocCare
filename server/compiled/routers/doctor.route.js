"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorRouter = void 0;
const express_1 = require("express");
const doctor_controller_1 = require("../controllers/doctor.controller");
const authorization_1 = require("../middleware/authorization");
const doctorRouter = (0, express_1.Router)();
exports.doctorRouter = doctorRouter;
doctorRouter.post('/doctor/register', doctor_controller_1.createDoctor);
doctorRouter.post('/doctor/login', doctor_controller_1.loginDoctor);
doctorRouter.get('/doctor/:id', authorization_1.doctorAuthMiddleware, doctor_controller_1.getDoctor);
doctorRouter.get('/doctors', authorization_1.doctorAuthMiddleware, doctor_controller_1.getDoctors);
doctorRouter.post('/doctor/:id/medical-info', authorization_1.doctorAuthMiddleware, doctor_controller_1.createMedicalInfo);
doctorRouter.put('/doctor/summary/:id', authorization_1.doctorAuthMiddleware, doctor_controller_1.createPatientSummary);
