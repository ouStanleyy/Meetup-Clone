import { Redirect, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { restoreSession } from "./store/session";
import Navigation from "./components/Navigation";
import { GroupsIndex, GroupInfo, CreateGroupForm } from "./components/Groups";
import { AddImageForm } from "./components/Images";

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
          <Route exact path="/groups/new" component={CreateGroupForm} />
          <Route
            exact
            path="/groups/:groupId/images/add"
            component={AddImageForm}
          />
          <Route exact path="/groups/:groupId" component={GroupInfo} />
          <Route exact path="/groups" component={GroupsIndex} />
          <Route exact path="/your-groups" component={GroupsIndex} />
          <Route exact path="/">
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
