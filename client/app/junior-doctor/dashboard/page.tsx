'use client'
import JuniorDoctorMessages from './messages';
import './dashboard.css'
import apiService from '@/services/APIservices';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setCurrentJunior } from '@/redux/features/junior-slice';
import { useEffect, useState } from 'react';
import { TUser } from '@/types/types';
import { TypeJuniorDoctor, TypePatient } from '../../../../server/types/types';

export default function JuniorDoctorDashBoard() {
  const dispatch = useDispatch<AppDispatch>();
  const [junior, setJunior] = useState<TUser>()
  const [patients, setAllPatients] = useState<TypePatient[]>([])

  async function authenticate(token:string, userType:string) {
    const user = await apiService.getUser(token, userType);
    setJunior(user)
    console.log(user)
    dispatch(setCurrentJunior(user as TypeJuniorDoctor))
  }

  async function getPatients(token:string) {
    const patients = await apiService.getAllPatients(token)
    setAllPatients(patients as TypePatient[])
    console.log(patients)
  }


  useEffect(() => {
    const token = localStorage.getItem('accessToken') as string;
    const userType = localStorage.getItem('userType') as string;
    if (token && userType === 'junior-doctor') {
      authenticate(token, userType)
      getPatients(token)
    }
    
  }, [])
  
  return (
    <main>
      <h1>Junior DashBoard!</h1>
      <div className='chat-box'>
      <JuniorDoctorMessages currentJunior={junior}/>
      </div>
    </main>
  );
  }
  