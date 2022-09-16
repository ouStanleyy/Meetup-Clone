import LoginFormPage from "./components/LoginFormPage";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { restoreSession } from "./store/session";

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
        </Switch>
      </>
    )
  );
}

export default App;
