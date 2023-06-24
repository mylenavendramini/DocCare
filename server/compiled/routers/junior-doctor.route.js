"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.juniorDoctorRouter = void 0;
const express_1 = require("express");
const junior_doctor_controller_1 = require("../controllers/junior-doctor.controller");
const authentication_1 = require("../middleware/authentication");
const juniorDoctorRouter = (0, express_1.Router)();
exports.juniorDoctorRouter = juniorDoctorRouter;
juniorDoctorRouter.post('/junior-doctor', authentication_1.juniorDoctorAuthMiddleware, junior_doctor_controller_1.createJuniorDoctor);
juniorDoctorRouter.get('/junior-doctor/:id', junior_doctor_controller_1.getJuniorDoctor);
juniorDoctorRouter.post('/junior-doctor/:id/note', junior_doctor_controller_1.createJuniorNote);
