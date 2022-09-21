import { Redirect, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { restoreSession } from "./store/session";
import Navigation from "./components/Navigation";
import { GroupsIndex, GroupInfo, CreateGroupForm } from "./components/Groups";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(restoreSession()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    isLoaded && (
      <>
        <Navigation />
        <Switch>
          <Route path="/groups/new" component={CreateGroupForm} />
          <Route path="/groups/:groupId" component={GroupInfo} />
          <Route path="/groups" component={GroupsIndex} />
          <Route path="/your-groups" component={GroupsIndex} />
          <Route path="/">
            <h1>Homepage</h1>
          </Route>
          <Route path="">
            <Redirect to="/" />
          </Route>
        </Switch>
      </>
    )
  );
}

export default App;
