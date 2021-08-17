const getErrorMessages = (error) => {
  const errors = [];
  let errorsFromApi = error.response.data.errors;
  Object.values(errorsFromApi).forEach((key) => {
    errors.push(key[0]);
  });

  return errors;
};

export default {
  getErrorMessages,
};
