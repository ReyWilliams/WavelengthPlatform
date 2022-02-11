// @ts-nocheck
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import * as moment from 'moment';
import { ZoomMtg } from '@zoomus/websdk';
import DataService from '../services/course';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.0.1/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');
document.getElementById('zmmtg-root').style.display = 'none';
document.body.style.overflow = 'scroll';
const meetingNumber = '88155050100';

const Appointment = () => {
  const { user, loginWithRedirect, isLoading } = useAuth0();
  const [userSignUps, setUserSignUps] = useState([]);
  const [metaInfo, setMetaInfo] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [signature, setSignature] = useState(null);
  const location = useLocation();
  const { course } = location.state;

  const CLIENT_ID = process.env.REACT_APP_GAPI_CLIENTID;
  const API_KEY = process.env.REACT_APP_GAPI_KEY;
  const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

  const createEvent = (appointment) => {
    // eslint-disable-next-line prefer-destructuring
    const gapi = window.gapi;

    gapi.load('client:auth2', () => {
      console.log('loaded client');
      const endTime = moment(appointment.time).add(7, 'h');

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.client.load('calendar', 'v3', () => console.log('bam!'));

      gapi.auth2.getAuthInstance().signIn()
        .then(() => {
          const event = {
            summary: `Session with ${appointment.name} for ${appointment.subject}`,
            location: 'Zoom Meeting',
            description: `${appointment.description}`,
            start: {
              dateTime: `${appointment.time}`,
            },
            end: {
              dateTime: `${appointment.time}`,
            },
            attendees: [
              { email: `${appointment.user_id}` },
            ],
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 10 },
              ],
            },
          };

          const request = gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
          });

          // eslint-disable-next-line no-shadow
          request.execute((event) => {
            console.log(event);
            window.open(event.htmlLink);
          });
        });
    });
  };

  const getMetaInfo = (id) => {
    DataService.getMeta(id)
      .then((response) => {
        setMetaInfo(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const startMeeting = (signature, user) => {
    document.getElementById('zmmtg-root').style.display = 'block';
    document.body.style.overflow = 'hidden';

    ZoomMtg.init({
      leaveUrl: 'https://wavelength-vghfw.mongodbstitch.com/',
      success: (success) => {
        console.log(success);
        console.log('works');
        ZoomMtg.join({
          signature,
          meetingNumber,
          userName: user.given_name,
          apiKey: process.env.REACT_APP_ZOOM_JWT_API_KEY,
          userEmail: user.email,
          passWord: 'N05yxs',
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  };

  const getSignature = (user) => {
    if (!user) {
      return;
    }

    DataService.getZoomSignature({
      meetingNumber: '88155050100',
      role: user['https:user.com/meta'].Experience === 'Tutor' ? 1 : 0,
    })
      .then((response) => {
        console.log(response.data.signature);
        setSignature(response.data.signature);
        startMeeting(response.data.signature, user);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getAppts = (id) => {
    DataService.getApptsForCourse(id)
      .then((response) => {
        setAppointments(response.data);
        console.log(response.data);
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
  const signUp = (appointment) => {
    const data = {
      new_user_id: user.email,
      user_id: appointment.user_id,
    };

    DataService.signUpForAppt(data)
      .then((response) => {
        console.log(`${user.email} signed up for appointment with ${appointment.name}`);
        checkSignUp();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const cancelSignUp = (appointment) => {
    const data = {
      new_user_id: user.email,
      user_id: appointment.user_id,
    };

    DataService.cancelSignUpForAppt(data)
      .then((response) => {
        console.log(`${user.email} cancelled signed up for appointment with ${appointment.name}`);
        checkSignUp();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    user && user['https:user.com/meta'].Experience === 'Tutor'
    && getMetaInfo(user.email);

    // eslint-disable-next-line no-unused-expressions
    user && checkSignUp();
  }, []);

  useEffect(() => {
    getAppts(course._id);
  }, []);

  return (

    <div className="container">
      <div>
        <Link to={`/courses/${course._id}`} className="text-primary text-decoration-none">
          <h2 className="text-center">{course.name}</h2>
          <h4 className="text-center text-primary">
            {course.subject}
            {' '}
            {course.number}
          </h4>
        </Link>
      </div>
      <hr />
      <h3 className="my-3 text-center"> Appointments </h3>
      {user && user['https:user.com/meta']?.Experience === 'Tutor' && metaInfo && metaInfo[0]?.subjects?.includes(course.subject) && (
      <div className="d-flex justify-content-center mb-4">
        <Link
          to={{
            pathname: `/courses/${course.id}/appointment`,
            state: { course, metaInfo },
          }}
          className="btn btn-primary mx-1 mb-1"
        >
          Schedule Appointment

        </Link>
      </div>
      )}
      {user && isLoading && (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
      )}

      {!user && !isLoading && (
      <div className="d-flex justify-content-center" style={{ cursor: 'pointer' }} onClick={() => loginWithRedirect()}>
        <div className="alert alert-danger text-center w-25 ">
          Please log in.
        </div>
      </div>
      )}

      {user && !isLoading && user['https:user.com/meta']?.Experience === 'Tutor' && metaInfo && !metaInfo[0]?.subjects?.includes(course.subject)
      && (
        <div className="d-flex justify-content-center">
          <div className="alert alert-primary text-center w-25 ">
            You do not support this course. Please update tutor profile with
            {' '}
            <strong>
              {course.subject}
            </strong>
            .
          </div>
        </div>
      )}

      {user && user['https:user.com/meta']?.Experience === 'Tutor' && metaInfo && metaInfo[0]?.subjects?.includes(course.subject) && appointments.map((appointment) => (
        <div className="col-lg-4 pb-1" key={course.number}>
          <div className="card">
            <div className="card-body">

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
              <div className="row justify-content-center">

                {user?.email === appointment.user_id ? (
                  <Link
                    to={{
                      pathname: `/courses/${course._id}/appointment`,
                      state: {
                        course, metaInfo, status: 'editing', appointment,
                      },
                    }}
                    className="btn btn-warning mx-1 mb-1"
                  >
                    Edit Appointment

                  </Link>
                ) : (
                  <button type="button" className="btn btn-success mx-1 mb-1" onClick={() => createEvent(appointment)}>
                    Book
                  </button>
                )}

                {user && (
                <button type="button" className="btn btn-primary mx-1 mb-1" onClick={() => getSignature(user)}>
                  Join
                </button>
                )}

                {userSignUps && userSignUps.some((apt) => apt.user_id === appointment.user_id)
                  ? (
                    <button type="button" className="btn btn-danger mx-1 mb-1" onClick={() => cancelSignUp(appointment)}>
                      Cancel Sign Up
                    </button>
                  )
                  : (
                    <button type="button" className="btn btn-success mx-1 mb-1" onClick={() => signUp(appointment)}>
                      Sign Up
                    </button>
                  )}

              </div>
            </div>
          </div>
        </div>
      ))}

    </div>

  );
};

export default Appointment;
