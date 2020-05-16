import React, { Fragment, useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FirebaseContext } from "components/Firebase";

import WithPhoneNumber from "./WithPhoneNumber";
import WithGoogle from "./WithGoogle";
import WithGithub from "./WithGithub";
import ModalError from "shared/ModalError";

const Login = () => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await firebase.getRedirectResult();
      if (result.outcome === "failure") {
        const { providerId, cause } = result;
        setError(`${t("couldntLink")} ${providerId}. ${t(cause)}`);
      }
    })();
  }, [t, firebase]);

  return (
    <Fragment>
      <WithPhoneNumber />
      <WithGoogle />
      <WithGithub />
      {error && 
        <ModalError 
          message={error} 
          close={() => setError(null)}
        />
      }
    </Fragment>
  );
};

export default Login;
