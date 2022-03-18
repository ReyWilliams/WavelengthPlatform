import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import * as moment from 'moment';
import DataService from '../services/course';

const Course = (props) => {
  const initialCourseState = {
    id: null,
    name: '',
    subject: '',
    reviews: [],
  };

  const [course, setCourse] = useState(initialCourseState);
  const { user } = useAuth0();
  // eslint-disable-next-line no-unused-expressions
  user && console.log(user);

  const getCourse = (id) => {
    DataService.get(id)
      .then((response) => {
        setCourse(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getCourse(props.match.params.id);
  }, [props.match.params.id]);

  const deleteReview = (reviewId, index) => {
    DataService.deleteReview(reviewId, user.email)
      .then((response) => {
        console.log(response.data);

        setCourse((prevState) => {
          prevState.reviews.splice(index, 1);
          return {
            ...prevState,
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {course ? (
        <div>
          <div>
            <h2 className="text-center">{course.name}</h2>
            <h4 className="text-center text-primary">
              {course.subject}
              {' '}
              {course.number}
            </h4>
          </div>
          <hr />
          <h3 className="my-3 text-center"> Reviews </h3>
          <div className="d-flex justify-content-center mb-4">
            <Link
              to={`/courses/${props.match.params.id}/review`}
              className="btn btn-primary"
            >
              Add Review
            </Link>
          </div>
          <div className="row">
            {course?.reviews?.length > 0 ? (course.reviews.map((review, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="col-lg-4 pb-1" key={`${index}-col`}>
                <div className="card">
                  <div className="card-body">
                    <p className="card-text">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong className="text-primary">
                            {review.name}
                          </strong>
                        </div>
                        <div>
                          {moment(review.date).utc().format('MMMM D, yyyy')}
                        </div>
                      </div>
                      <hr />
                      {review.text}
                    </p>
                    {user && user.email === review.user_id && (
                    <div className="row">
                      <a
                        onClick={() => deleteReview(review._id, index)}
                        className="btn btn-danger col-lg-5 mx-1 mb-1"
                      >
                        Delete
                      </a>
                      <Link
                        to={{
                          pathname: `/courses/${props.match.params.id}/review`,
                          state: {
                            currentReview: review,
                          },
                        }}
                        className="btn btn-primary col-lg-5 mx-1 mb-1"
                      >
                        Edit
                      </Link>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div className="col-sm-4">
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>No course selected.</p>
        </div>
      )}
    </div>
  );
};

export default Course;
