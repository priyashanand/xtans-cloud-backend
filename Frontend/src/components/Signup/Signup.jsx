import React, { useState } from 'react';
import './signup.css';
import Navbar from '../Navbar/Navbar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../Alert/Alert';

function SignUp() {
  const [responseMessage, setResponseMessage] = useState('');
  const server = "http://localhost:4001/";
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  // Yup validation schema for the new user schema
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    mobileNumber: Yup.string().matches(/^\d{10}$/, 'Please enter a valid 10-digit mobile number'),
    avatar: Yup.string().url('Please enter a valid URL for the avatar').nullable(), // optional field
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${server}api/auth/signup`, values);
      setResponseMessage(response.data.message);
      setShowAlert(true);

      if (response.data.status === 'success') {
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      }
    } catch (error) {
      setResponseMessage(error.response ? error.response.data.message : 'Something went wrong');
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <Navbar />
      <div className="sign-up-container">
        <h2>Sign Up to XTrans Cloud</h2>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            mobileNumber: '',
            avatar: '', // optional field
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="sign-up-form">
              <div className="sign-up-form-group">
                <label htmlFor="firstName">First Name</label>
                <Field type="text" id="firstName" name="firstName" placeholder="Enter First Name" />
                <ErrorMessage name="firstName" component="div" className="error-message" />
              </div>
              <div className="sign-up-form-group">
                <label htmlFor="lastName">Last Name</label>
                <Field type="text" id="lastName" name="lastName" placeholder="Enter Last Name" />
                <ErrorMessage name="lastName" component="div" className="error-message" />
              </div>
              <div className="sign-up-form-group">
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" placeholder="Enter Email" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>
              <div className="sign-up-form-group">
                <label htmlFor="password">Password</label>
                <Field type="password" id="password" name="password" placeholder="Create Password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>
              <div className="sign-up-form-group">
                <label htmlFor="confirmPassword">Retype Password</label>
                <Field type="password" id="confirmPassword" name="confirmPassword" placeholder="Retype Password" />
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
              </div>
              <div className="sign-up-form-group">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <Field type="text" id="mobileNumber" name="mobileNumber" placeholder="Enter Mobile Number" />
                <ErrorMessage name="mobileNumber" component="div" className="error-message" />
              </div>
              <div className="sign-up-form-group">
                <label htmlFor="avatar">Avatar URL (optional)</label>
                <Field type="text" id="avatar" name="avatar" placeholder="Enter Avatar URL" />
                <ErrorMessage name="avatar" component="div" className="error-message" />
              </div>
              <button type="submit" className="sign-up-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Signing up...' : 'Sign up'}
              </button>
            </Form>
          )}
        </Formik>
        {showAlert && (
          <AlertModal message={responseMessage} onClose={handleCloseAlert} />
        )}
      </div>
    </>
  );
}

export default SignUp;
