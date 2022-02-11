import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import DataService from '../services/course';

const AddReview = (props) => {
  const { user, loginWithRedirect } = useAuth0();

  let initialReviewState = '';

  let editing = false;

  if (props.location.state && props.location.state.currentReview) {
    editing = true;
    initialReviewState = props.location.state.currentReview.text;
  }

  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(true);

  const handleInputChange = (event) => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    setValid(true);
    const data = {
      text: review,
      name: `${user.given_name} ${user.family_name}`,
      user_id: user.email,
      course_id: props.match.params.id,
    };

    if (editing) {
      data.review_id = props.location.state.currentReview._id;
      DataService.updateReview(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      DataService.createReview(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const validateReview = () => {
    // eslint-disable-next-line no-unused-expressions
    review.length > 5 && saveReview();
    // eslint-disable-next-line no-unused-expressions
    review.length <= 5 && setValid(false);
  };

  return (
    <div>
      {user ? (
        <div className="submit-form">
          {submitted ? (
            <div>
              <div className="d-flex justify-content-center">
                <div className="alert alert-success text-center w-25 ">
                  Submission Successful!
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-center">
                <Link to={`/courses/${props.match.params.id}`} className="btn btn-success">
                  Back to Course
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="description" className="mb-2">
                  { editing ? 'Edit' : 'Create' }
                  {' '}
                  Review
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="text"
                  required
                  value={review}
                  onChange={handleInputChange}
                  name="text"
                />
              </div>
              <button onClick={validateReview} type="submit" className="btn btn-success mt-2">
                Submit
              </button>
            </div>
          )}

          {!valid && (
          <div className="d-flex justify-content-center">
            <div className="alert alert-primary text-center w-25 ">
              Review text is not valid. Please write more!
            </div>
          </div>
          )}

        </div>

      ) : (
        <div className="d-flex justify-content-center" style={{ cursor: 'pointer' }} onClick={() => loginWithRedirect()}>
          <div className="alert alert-danger text-center w-25 ">
            Please log in.
          </div>
        </div>
      )}

    </div>
  );
};

export default AddReview;
