const isUsernameValid = value => {
  if (!value) return false;
  const modifiedValue = "@" + value.replace(/\W/g, "").toLowerCase();
  return value.length >=4 && value === modifiedValue;
};

export default isUsernameValid;
