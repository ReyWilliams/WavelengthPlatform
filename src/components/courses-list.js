/* eslint-disable no-shadow */
import '../App.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import DataService from '../services/course';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchNumber, setSearchNumber] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [subjects, setSubjects] = useState(['All Subjects']);
  const [render, setRender] = useState(Math.random());
  const { user } = useAuth0;

  useEffect(() => {

  }, [user]);
  const retrieveCourses = () => {
    DataService.getAll()
      .then((response) => {
        // console.log(response.data);
        setCourses(response.data.courses);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveSubjects = () => {
    DataService.getSubjects()
      .then((response) => {
        setSubjects(['All Subjects'].concat(response.data));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveCourses();
  };

  const find = (query, by) => {
    DataService.find(query, by)
      .then((response) => {
        setCourses(response.data.courses);
      })

      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = (e) => {
    e.preventDefault();

    find(searchName, 'name');
    setSearchName('');
  };

  const findByZip = (e) => {
    e.preventDefault();
    find(searchNumber, 'number');
    setSearchNumber('');
  };

  const findBySubject = () => {
    if (searchSubject === 'All Subjects') {
      refreshList();
    } else {
      find(searchSubject, 'subject');
    }
  };

  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchNumber = (e) => {
    const searchNumber = e.target.value;
    setSearchNumber(searchNumber);
  };

  const onChangeSearchSubject = (e) => {
    const searchSubject = e.target.value;
    setSearchSubject(searchSubject);
    setRender(Math.random());
  };

  useEffect(() => {
    retrieveCourses();
    retrieveSubjects();
  }, []);

  useEffect(() => {
    findBySubject();
  }, [render]);

  return (
    <div>
      <div className="row pb-1 mb-3">

        <div className="input-group col-lg-4 m-2">
          <form onSubmit={findByName} className="w-100">
            <input
              type="text"
              className="form-control w-100"
              placeholder="Search By Course Name"
              value={searchName}
              onChange={onChangeSearchName}
            />
          </form>
        </div>

        <div className="input-group col-lg-4 m-2">
          <form onSubmit={findByZip} className="w-100">
            <input
              type="text"
              className="form-control w-100"
              placeholder="Search By Course Number"
              value={searchNumber}
              onChange={onChangeSearchNumber}
            />
          </form>
        </div>

        <div className="input-group col-lg-4 m-2 mt-4 justify-content-center ">
          <select onChange={onChangeSearchSubject} className=" form-select">
            {subjects.map((subject) => (
              <option value={subject} className="text-primary" key={subject}>
                {subject.substr(0, 20)}
              </option>
            ))}
          </select>

        </div>
      </div>
      <div className="row">
        {courses.map((course) => (
          <div className="col-lg-4 pb-1" key={course.number}>
            <div className="card">
              <div className="card-body">
                <Link to={`/courses/${course._id}`} className="h5 text-decoration-none">
                  <h5 className="card-title text-primary text-center">
                    {course.name}
                  </h5>
                </Link>
                <p className="card-text">
                  <strong>Subject: </strong>
                  {course.subject}
                  <br />
                  <strong>Course Number: </strong>
                  {course.number}
                  <br />
                </p>
                <div className="row justify-content-center">
                  {/* eslint-disable-next-line no-underscore-dangle */}
                  <Link to={`/courses/${course._id}`} className="btn btn-primary mx-1 mb-1">
                    View Reviews
                  </Link>

                  <Link
                    to={{
                      pathname: `/appointments/${course._id}`,
                      state: { course },
                    }}
                    className="btn btn-outline-primary mx-1 mb-1"
                  >
                    Views Appointments
                  </Link>

                </div>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default CoursesList;
