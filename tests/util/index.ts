export const getTestURL = () => {
  return process.env.TEST_URL;
};

export const getURL = (path: string) => {
  return `${getTestURL()}${path}`;
};

export const getTestUser = () => {
  return {
    email: process.env.TEST_USER_EMAIL,
    password: process.env.TEST_USER_PASSWORD,
  };
};
