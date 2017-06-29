const apiUrl = (() => {
  const url = location.hostname === 'localhost' ?
                'http://localhost:5000' :
              `${location.protocol}//${location.host}`;
  return url;
})();

export const Api = {
  login                   : `${apiUrl}/auth`,
  logout                  : `${apiUrl}/auth/logout`,
  checkLogin              : `${apiUrl}/auth/check`,
  user                    : `${apiUrl}/user`,
  User: {
    list                  : `${apiUrl}/user/list`,
    projectMonth          : `${apiUrl}/user/project-month`,
    changePassword        : `${apiUrl}/user/change-pass`,
    validateChangePassword: `${apiUrl}/user/change-pass/validate`,
    validate              : `${apiUrl}/user/validate`,
  },
  project                 : `${apiUrl}/project`,
  Project: {
    list                  : `${apiUrl}/project/list`,
    userMonth             : `${apiUrl}/project/user-month`,
    validate              : `${apiUrl}/project/validate`,
  },
  projectPersonnel        : `${apiUrl}/project-personnel`
};
