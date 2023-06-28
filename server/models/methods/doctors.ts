import db from '../schema/index';
import { TypeDoctor, TypeMedicalInfo } from '../../types/types';
import { Patient } from '../schema/Patient';
import { Appointment } from '../schema/Appointment';
import logger from '../../logger';

const DoctorDB = db.Doctor;
const PatientDB = db.Patient;
const MedicalInfoDB = db.MedicalInfo;

async function createDoctorModel(doctor: TypeDoctor) {
  try {
    console.log(doctor);
    const newDoctor = await DoctorDB.create(doctor);
    console.log(newDoctor);
    return newDoctor;
  } catch (error) {
    throw new Error();
  }
}

async function getDoctorModel(id: string) {
  try {
    const doctor = await DoctorDB.findOne({
      where: { id: id },
      include: [
        {
          model: Appointment,
          as: 'doctorAppointments',
          required: false,
        },
        {
          model: Patient,
          as: 'patients',
          required: false,
        },
      ],
    });
    return doctor;
  } catch (error) {
    throw new Error();
  }
}

async function getDoctorsModel() {
  try {
    console.log('working?');
    const doctors = await DoctorDB.findAll({
      include: {
        model: Appointment,
        as: 'doctorAppointments',
        required: false,
      },
    });
    console.log(doctors);
    return doctors;
  } catch (error) {
    throw new Error();
  }
}

async function createMedicalInfoModel(
  newMedicalInfo: TypeMedicalInfo,
  patientId: string
) {
  try {
    const patient = (await PatientDB.findOne({
      where: { id: patientId },
    })) as Patient;
    logger.info(patient);
    //TODO:its failing here...
    const medicalInfo = await MedicalInfoDB.create(newMedicalInfo);
    logger.info('here');
    patient.setMedicalInfo(medicalInfo);
    await medicalInfo.save();
    // await patient.save();
    return medicalInfo;
  } catch (error) {
    throw new Error();
  }
}

async function createPatientSummaryModel(
  newPatientSummary: string,
  patientId: string
) {
  try {
    const patient = (await PatientDB.findOne({
      where: { id: patientId },
    })) as Patient;
    patient.summary = newPatientSummary;
    await patient.save();
    return patient;
  } catch (error) {
    throw new Error();
  }
}

export {
  createDoctorModel,
  getDoctorModel,
  getDoctorsModel,
  createMedicalInfoModel,
  createPatientSummaryModel,
};
