import React, { useState, useEffect } from "react";

function App() {
  const [authenticationStatus, setAuthenticationStatus] = useState(
    "UnAuthenticated Provider"
  );

  const [publicRes, setPublic] = useState();
  const [customerRes, setCustomerRes] = useState();
  const [providerRes, setProviderRes] = useState();
  const [idToken, setIdToken] = useState();

  useEffect(() => {
    function getIDToken() {
      let url = new URL(window.location.href);
      let this_id_token = undefined;

      url.hash
        .substr(1)
        .split("&")
        .some(function (keyValueString) {
          let keyValueArray = keyValueString.split("=");
          if (keyValueArray[0] === "id_token") {
            this_id_token = keyValueArray[1];
            return true;
          }
          return null;
        });

      setIdToken(this_id_token);

      return this_id_token;
    }

    function checkAuthStatus() {
      getIDToken();

      if (idToken !== undefined) {
        setAuthenticationStatus("Authenticated");
      }
    }

    checkAuthStatus();
  }, [idToken]);

  const getUrlToCall = (type) => {
    switch (type) {
      case "public":
        return process.env.REACT_APP_GUEST_API;
      case "customer":
        return process.env.REACT_APP_CUSTOMER_API;
      case "provider":
        return process.env.REACT_APP_PROVIDER_API;
      default:
        break;
    }
  };

  function callService(authType) {
    const urlToCall = getUrlToCall(authType);
    if (authType === "public") {
      fetch(urlToCall)
        .then((res) => res.json())
        .then((resultJson) => {
          console.log(resultJson);
          attachResponse(authType, resultJson.message);
        })
        .catch((err) => {
          console.error(err);
          const errorResponse = "ERROR: " + err;
          attachResponse(authType, errorResponse);
        });
    } else {
      fetch(urlToCall, {
        credentials: "include",
        headers: {
          Authorization: idToken,
        },
      })
        .then((res) => res.json())
        .then((resultJson) => {
          console.log(resultJson);
          attachResponse(authType, resultJson.message);
        })
        .catch((err) => {
          console.error(err);
          const errorResponse =
            "ERROR: " + err + " You may not be authenticated !";
          attachResponse(authType, errorResponse);
        });
    }
  }

  const attachResponse = (type, data) => {
    switch (type) {
      case "public":
        setPublic(data);
        break;
      case "customer":
        setCustomerRes(data);
        break;
      case "provider":
        setProviderRes(data);
        break;
      default:
        break;
    }
  };

  const renderAuthenticationButton = () => {
    return (
      <button>
        <a
          href={process.env.REACT_APP_PROVIDER_AUTH_URL}
          id="authentication-link"
        >
          Authenticate
        </a>
      </button>
    );
  };
  const renderServiceCallBtn = () => {
    return (
      <div>
        <button
          id="call-service-button"
          onClick={() => callService("customer")}
        >
          Call Customer Service
        </button>
        <div id="call-result">{customerRes}</div>

        <button
          id="call-service-button"
          onClick={() => callService("provider")}
        >
          Call Provider Service
        </button>
        <div id="call-result">{providerRes}</div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome dear provider, you are a {authenticationStatus}</h1>
        <div id="authentication">
          <p>Login here to be authenticated:</p>
          {renderAuthenticationButton()}
        </div>
        <br />
        <br />
        {idToken && (
          <div>
            <h2>This is Your ID_Token:</h2>
            <p>{idToken}</p>
          </div>
        )}
        <br />
        <br />
        <h2>Petobe Services API</h2>
        <button id="call-service-button" onClick={() => callService("public")}>
          Call Public Service
        </button>
        <div id="call-result">{publicRes}</div>
        {idToken !== undefined && renderServiceCallBtn()}
      </header>
    </div>
  );
}

export default App;
