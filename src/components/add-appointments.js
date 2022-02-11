/* eslint-disable no-unused-vars */
// @ts-nocheck
import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Form } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import DateTimePicker from 'react-datetime-picker';
import * as moment from 'moment';
import DataService from '../services/course';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

const AddAppointment = () => {
  const [description, setDescription] = useState('');
  const location = useLocation();
  const {
    course, metaInfo, status, appointment,
  } = location?.state;
  const { user } = useAuth0();
  const [maxStudentCount, setMaxStudentCount] = useState(1);
  const [subject, setSubject] = useState(metaInfo[0]?.subjects[0]);
  const [apptDate, setApptDate] = useState(new Date());
  const [valid, setValid] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const saveAppt = () => {
    setValid(true);
    const data = {
      name: `${user.given_name} ${user.family_name}`,
      subject: course.subject,
      number: course.number,
      maxNumStudents: maxStudentCount,
      time: apptDate,
      description,
      user_id: user.email,
      lastUpdated: moment(),
      courseId: course._id,
    };

    DataService.createAppt(data)
      .then((response) => {
        setSubmitted(true);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const validateDescription = (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-unused-expressions
    description.length > 5 && saveAppt();
    // eslint-disable-next-line no-unused-expressions
    description.length <= 5 && setValid(false);
  };

  useEffect(() => {
    if (appointment) {
      setDescription(appointment.description);
      setSubject(appointment.subject);
      setMaxStudentCount(appointment.maxNumStudents);
      console.log(appointment);
    }
  }, []);
  return (
    <div>
      <div>
        <h2 className="text-center">{course.name}</h2>
        <h4 className="text-center text-primary">
          {course.subject}
          {' '}
          {course.number}
        </h4>
        <hr />
        {user && !submitted && status !== 'editing' && appointment ? (
          <h3 className="my-3 text-center mt-4">
            {' '}
            Create Appointment For
            {' '}
            <strong className="text-primary">
              {user?.given_name}
            </strong>
          </h3>
        ) : (
          <h3 className="my-3 text-center mt-4">
            {' '}
            Editing Appointment For
            {' '}
            <strong className="text-primary">
              {user?.given_name}
            </strong>
            <p className="h4 mt-2">
              <strong className="text-danger">Caution: </strong>
              This will clear sign-ups.
            </p>
          </h3>
        )}
      </div>

      {submitted && (
      <div>
        <div className="d-flex justify-content-center">
          <div className="alert alert-success text-center w-25 ">
            Submission Successful!
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <Link
            to={{
              pathname: `/appointments/${course._id}`,
              state: { course },
            }}
            className="btn btn-success"
          >
            View Appointments
          </Link>
        </div>
      </div>
      )}

      {!valid
        && (
        <div className="d-flex justify-content-center">
          <div className="alert alert-danger text-center w-25 ">
            Description text is not valid. Please write more!
          </div>
        </div>
        )}

      {!submitted && (
      <div className="container w-75 mt-3">

        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <br />
            <Form.Label className="text-primary h3">Select Number of Students</Form.Label>
            <br />

            <div>
              <RangeSlider
                value={maxStudentCount}
                onChange={(e) => setMaxStudentCount(e.target.value)}
                min={1}
                max={10}
                tooltip="auto"
                size="sm"
              />
            </div>

            <br />
            <Form.Label className="text-primary h3 me-4">Select Date</Form.Label>
            {apptDate && (
            <DateTimePicker
              onChange={setApptDate}
              value={apptDate}
              required
            />
            )}
            <br />
            <Form.Label className="text-primary h3 mt-4">Enter Description</Form.Label>
            <Form.Control as="textarea" value={description} rows={3} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
          <br />
          <Button onClick={(e) => validateDescription(e)} className="mt-4" variant="primary" type="submit">
            Submit
          </Button>
        </Form>

      </div>
      )}
    </div>
  );
};

export default AddAppointment;
