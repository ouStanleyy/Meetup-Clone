import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { restoreSession } from "./store/session";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(
    () => dispatch(restoreSession()).then(() => setIsLoaded(true))[dispatch]
  );

  return (
    isLoaded && (
      <>
        <Switch>
          <Route exact path="/">
            <h1>Homepage</h1>
          </Route>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
        </Switch>
      </>
    )
  );
}

export default App;
