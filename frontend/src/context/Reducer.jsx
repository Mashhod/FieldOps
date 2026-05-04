export const reducer = (state, action) => {
  switch (action.type) {
      case "USER_LOGIN": {
          return { ...state, isLogin: true, user: action.user, token: action.token }
      }
      case "USER_LOGOUT": {
        Cookies.remove('fieldops_token');
        localStorage.removeItem('fieldops_user');
        localStorage.removeItem('fieldops_token');
          return { ...state, isLogin: false, user: {}, token: null, jobs: [] }
      }

      // Jobs handling cases
      case "SET_LOADING": {
          return { ...state, loading: action.payload }
      }
      case "SET_JOBS": {
          return { ...state, jobs: action.payload, loading: false }
      }
      case "ADD_NEW_JOB": {
          return { ...state, jobs: [action.payload, ...state.jobs] }
      }
      case "UPDATE_JOB_STATUS": {
          const updatedJobs = state.jobs.map(job => 
              job._id === action.payload._id ? action.payload : job
          );
          return { ...state, jobs: updatedJobs }
      }

      default: {
          return state
      }
  }
}