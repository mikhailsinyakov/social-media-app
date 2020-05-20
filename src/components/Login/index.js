import React from "react";

import WithPhoneNumber from "./WithPhoneNumber";
import WithGoogle from "./WithGoogle";
import WithGithub from "./WithGithub";

const Login = () => (
  <>
    <WithPhoneNumber />
    <WithGoogle />
    <WithGithub />
  </>
);

export default Login;
