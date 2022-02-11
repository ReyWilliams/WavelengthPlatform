import herokuHttp from '../heroku-http';
import http from '../http-common';

class DataService {
  getAll(page = 0) {
    return http.get(`/courses?page=${page}`);
  }

  get(id) {
    return http.get(`/course?id=${id}`);
  }

  getMeta(userId) {
    return http.get(`/fetchMeta?user_id=${userId}`);
  }

  getApptsForCourse(courseId) {
    return http.get(`/fetchAppt?courseId=${courseId}`);
  }

  createAppt(data) {
    return http.post('/scheduleAppt', data);
  }

  find(query, by = 'name', page = 0) {
    return http.get(`courses?${by}=${query}&page=${page}`);
  }

  createReview(data) {
    return http.post('/review-new', data);
  }

  supportCourse(data) {
    return http.post('/supportCourse', data);
  }

  updateReview(data) {
    return http.put('/review-edit', data);
  }

  deleteReview(id, userId) {
    return http.delete(`/review-delete?id=${id}`, { data: { user_id: userId } });
  }

  getSubjects() {
    return http.get('/subjects');
  }

  signUpForAppt(data) {
    return http.post('/signUpForAppt', data);
  }

  cancelSignUpForAppt(data) {
    return http.post('/cancelSignUp', data);
  }

  // eslint-disable-next-line camelcase
  checkSignUp(new_user_id) {
    // eslint-disable-next-line camelcase
    return http.get(`/checkSignUp?new_user_id=${new_user_id}`);
  }

  getZoomSignature(data) {
    return herokuHttp.post('/', data);
  }
}

export default new DataService();
