/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Helmet } from 'react-helmet';
import * as moment from 'moment';
import { Link } from 'react-router-dom';
import DataService from '../services/course';

const Profile = () => {
  const { user, isLoading } = useAuth0();
  const userName = `${user?.given_name} ${user?.family_name}`;
  const [subjects, setSubjects] = useState([]);
  const [userSignUps, setUserSignUps] = useState([]);
  const [subjectsSelected, setSubjectsSelected] = useState([]);
  const [subjectsShown, setSubjectsShown] = useState(false);
  const [apptsShown, setApptsShown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tutorInfo, setTutorInfo] = useState({});
  const [lastUpdated, setlastUpdated] = useState(null);
  const [checkedState, setCheckedState] = useState(
    new Array(8).fill(false),
  );

  const getMetaInfo = (id) => {
    DataService.getMeta(id)
      .then((response) => {
        setTutorInfo(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateSubjects = () => {
    const subjectsFiltered = subjects.filter((item, index) => checkedState[index]);
    setSubjectsSelected(subjectsFiltered);
  };

  const subjectCheckboxChange = (position) => {
    // eslint-disable-next-line max-len
    const updatedCheckedState = checkedState.map((item, index) => (index === position ? !item : item));
    setCheckedState(updatedCheckedState);
  };

  const saveSubjects = () => {
    const data = {
      name: `${user.given_name} ${user.family_name}`,
      user_id: user.email,
      subjects: subjectsSelected,
      lastUpdated: moment(),
    };

    DataService.supportCourse(data)
      .then((response) => {
        setSubmitted(true);
        console.log(response.data);
        getMetaInfo(user.email);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveSubjects = () => {
    DataService.getSubjects()
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const checkSignUp = () => {
    DataService.checkSignUp(user.email)
      .then((response) => {
        console.log(`checked if ${user.email} is signed up for appointments`);
        setUserSignUps(response.data.signUps);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveSubjects();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    user && user['https:user.com/meta'].Experience === 'Tutor'
    && getMetaInfo(user.email);
    // eslint-disable-next-line no-unused-expressions
    user && checkSignUp();
  }, []);

  useEffect(() => {
    updateSubjects();
  }, [checkedState]);

  useEffect(() => {
    setlastUpdated(tutorInfo[0]?.lastUpdated);
  }, [tutorInfo]);

  return (
    <div>
      {!isLoading
        ? (
          <div className="container">
            <Helmet>
              <title>
                {userName}
                {' '}
                {' '}
                | Profile
              </title>
            </Helmet>
            <div className="mt-3">
              <h1 className="text-center">
                {user?.given_name}
              </h1>
              <h2 className="text-primary text-center">
                {user?.family_name}
              </h2>
            </div>
            <hr />
            <div>
              <h3>
                School
                {': '}
                <span className="text-primary">
                  {user['https:user.com/meta'].school_name}
                </span>

              </h3>
            </div>
            <div>
              <h3>
                Role
                {': '}
                <span className="text-primary">
                  {user['https:user.com/meta'].Experience}
                </span>
              </h3>
            </div>
            <div>
              <h3>
                Major
                {': '}
                <span className="text-primary">
                  {user['https:user.com/meta'].major_name}
                </span>
              </h3>
            </div>
            <div>
              <h3>
                Email
                {': '}
                <span className="text-primary">
                  {user.email}
                </span>
              </h3>
            </div>

            { user['https:user.com/meta'].Experience === 'Tutor'
            && !subjectsShown
            && (
            <div className="d-flex justify-content-center m-3">
              <button type="button" className="btn btn-primary mx-1 mb-1 center" onClick={setSubjectsShown}>
                Choose Subjects
              </button>
            </div>
            )}

            { user['https:user.com/meta'].Experience === 'Tutor'
            && subjectsShown
            && (
            <div className="d-flex justify-content-center m-3">
              <button type="button" className="btn btn-danger mx-1 mb-1 center" onClick={() => setSubjectsShown(false)}>
                Hide Subjects
              </button>
            </div>
            )}

            { user
            && !apptsShown
            && (
            <div className="d-flex justify-content-center m-3">
              <button type="button" className="btn btn-primary mx-1 mb-1 center" onClick={setApptsShown}>
                Show Appointments
              </button>
            </div>
            )}

            { user
            && apptsShown
            && (
            <div className="d-flex justify-content-center m-3">
              <button type="button" className="btn btn-danger mx-1 mb-1 center" onClick={() => setApptsShown(false)}>
                Hide Appointments
              </button>
            </div>
            )}

            {apptsShown && (
              userSignUps.map((appointment) => (
                <div className="col-lg-4 pb-1">
                  <div className="card">
                    <div className="card-body">
                      <Link to={`/courses/${appointment.courseId}`} className="text-primary text-decoration-none">
                        <h5 className="card-title text-primary text-center">
                          {`${appointment.subject} ${appointment.number}`}
                        </h5>
                      </Link>
                      <p className="card-text">
                        <strong>Tutor: </strong>
                        {appointment.name}
                        <br />
                        <strong>Time: </strong>
                        {moment(appointment.time).format('LLL')}
                        <br />
                        <p className="text-primary mt-3">
                          {appointment.description}
                        </p>
                      </p>
                    </div>
                  </div>
                </div>
              )))}

            {subjectsShown
            && (
              <div>
                <hr />
                <h2 className="text-primary text-center">Select Courses</h2>
                <div className="form-check">
                  <p className="h4 text-center">
                    <strong className="text-danger">Current Courses: </strong>
                    {tutorInfo && tutorInfo[0].subjects.map((item) => (
                      <>
                        {item}
                        {' '}
                      </>
                    ))}
                  </p>

                  {user && checkedState && subjects.map((subject, index) => (
                    <div key={`${subject}`}>
                      <>{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }</>
                      <input className="form-check-input" type="checkbox" value={checkedState[index]} checked={checkedState[index]} id={`${subject}checkBox`} onChange={() => subjectCheckboxChange(index)} />
                      <label className="form-check-label" htmlFor={`${subject}checkBox`}>
                        {checkedState[index] ? (
                          <h3 className="text-danger">
                            {subject}
                          </h3>
                        ) : (
                          <h3>
                            {subject}
                          </h3>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button onClick={saveSubjects} type="submit" className="btn btn-primary mt-2 ">
                    Submit
                  </button>
                </div>
              </div>

            )}

            {subjectsShown && lastUpdated && (
            <div>
              <hr />
              <div className="alert alert-primary text-center" role="alert">
                Last Updated:
                {' '}
                {moment(lastUpdated).format('LLL')}
              </div>
            </div>
            )}

            {submitted && (
            <div>
              <div className="alert alert-success text-center" role="alert">
                Submitted Courses
                {' '}
              </div>
            </div>
            )}
          </div>
        )
        : (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) }

    </div>
  );
};

export default Profile;
