/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Form, Input } from 'antd';

import React, { FormEvent, useEffect, useState } from 'react';

import Footer from '@/app/(components)/footer';
import apiService from '@/services/APIservices';
import { login } from '../../redux/features/auth-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { message } from 'antd';
import { io } from 'socket.io-client';
const socket = io('ws://localhost:3001');

type SizeType = Parameters<typeof Form>[0]['size'];

interface Props {
  user: string;
}

export default function Login(props: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>(
    'default'
  );

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const initialState = { email: '', password: '' };
  const [state, setState] = useState(initialState);
  const [formError, setFormError] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [messageContent, setMessageContent] = useState('');
  const key = 'updatable';

  const openMessage = () => {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type: 'success',
        content: messageContent,
        duration: 2,
      });
      setTimeout(() => {
        const userType = localStorage.getItem('userType');
        router.push(`/${userType}/dashboard`);
      }, 2000);
    }, 1000);
  };

  useEffect(() => {
    if (messageContent) {
      openMessage();
    }
  }, [messageContent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log({ name });
    console.log({ value });
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    const data = await apiService.login(state, props.user);
    const { message, result } = data;
    if (result) {
      const username = result.userAuthenticated.name as string;
      const userType = result.userAuthenticated.userType as string;
      if(userType === 'patient') {
        console.log('patient')
        socket.emit('patient logged', 'show this');
      }
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('userType', userType);
      setFormError('');
      dispatch(login(username));
      setMessageContent(message);
    } else {
      setFormError(`${data}`);
    }
    setState(initialState);
  };

  return (
    <>
      {contextHolder}
      <div className='flex min-h-screen flex-col'>
        <div className='grid grid-cols-2 gap-4 h-screen'>
          <div className='flex flex-col items-center justify-evenly'>
            <div className='flex flex-row items-start justify-start'>
              {/* <img
                className='h-auto w-44 rounded'
                src='/doctor-mobile.png'
                alt='Your Company'
              /> */}
            </div>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <h2 className='font-bold text-2xl text-primary'>Login</h2>
            <h3>Explore the future with us.</h3>
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 14 }}
              layout='horizontal'
              initialValues={{ size: componentSize }}
              onValuesChange={onFormLayoutChange}
              size={componentSize as SizeType}
              style={{ maxWidth: 900 }}
              action={`${props.user}`}
              method='post'
              onFinish={submitForm}
            >
              <Form.Item label='Email' htmlFor='email'>
                <Input
                  type='email'
                  id='email'
                  name='email'
                  required
                  value={state.email}
                  onChange={(e) => handleChange(e)}
                />
              </Form.Item>
              <Form.Item label='Password' htmlFor='password'>
                <Input
                  type='password'
                  id='password'
                  name='password'
                  value={state.password}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </Form.Item>
              {formError && (
                <p className='error-message'>
                  <ExclamationCircleTwoTone /> {formError}
                </p>
              )}
              <button
                className='bg-tertiary hover:bg-tertiary-dark text-white font-bold py-2 px-4 m-2 rounded'
                type='submit'
              >
                Login
              </button>
            </Form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
