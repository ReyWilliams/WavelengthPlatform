/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import logo from './images/site-logo.png';

import 'bootstrap/dist/css/bootstrap.min.css';

import AddReview from './components/add-review';
import Course from './components/courses';
import CoursesList from './components/courses-list';
import Profile from './components/profile';
import Appointment from './components/appointments';
import AddAppointment from './components/add-appointments';

function App() {
  const {
    loginWithRedirect, user, logout,
  } = useAuth0();

  // eslint-disable-next-line
  user && console.log(user);

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark mb-3">
        <li className="nav-item">
          <img src={logo} height="50" alt="Wavelength logo" className="mx-2" />
        </li>
        <Link to="/courses" className="navbar-brand">
          Wavelength
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/courses" className="nav-link">
              Courses
            </Link>
          </li>
          <li className="nav-item" style={{ cursor: 'pointer' }}>
            {!user
              ? (
                <div onClick={() => loginWithRedirect()} className="nav-link ">
                  Login
                </div>
              )
              : (
                <div onClick={() => logout()} className="nav-link ">
                  Logout
                  {', '}
                  {user.given_name}
                </div>
              )}
          </li>
          <li className="nav-item " style={{ cursor: 'pointer' }}>
            <Link to="/profile">
              {user && <img className="rounded-circle w-25  ms-5" src={user.picture} alt="Profile Pic" /> }
            </Link>
          </li>
        </div>

      </nav>

      <div className="container-fluid">
        <Switch>
          <Route
            path="/profile"
            render={(props) => (
              <Profile {...props} key={Date.now()} />
            )}
          />
          <Route
            path="/appointments/:id"
            render={(props) => (
              <Appointment {...props} key={Date.now()} />
            )}
          />
          <Route
            exact
            path={['/', '/courses']}
            render={(props) => <CoursesList {...props} key={Date.now()} />}
          />

          <Route
            path="/courses/:id/review"
            render={(props) => (
              <AddReview {...props} />
            )}
          />

          <Route
            path="/courses/:id/appointment"
            render={(props) => (
              <AddAppointment {...props} />
            )}
          />

          <Route
            path="/courses/:id"
            render={(props) => (
              <Course {...props} />
            )}
          />

        </Switch>
      </div>
    </div>
  );
}

export default App;
