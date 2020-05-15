import React, { Fragment, useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FirebaseContext } from "components/Firebase";

import ByPhoneNumber from "./ByPhoneNumber";
import WithGoogle from "./WithGoogle";
import WithGithub from "./WithGithub";
import Modal from "shared/Modal";

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
      <ByPhoneNumber />
      <WithGoogle />
      <WithGithub />
      {error && 
        <Modal 
          title={t("errorOccurred")}
          description={error} 
          close={() => setError(null)}
        />
      }
    </Fragment>
  );
};

export default Login;
