import { Redirect, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { restoreSession } from "./store/session";
import Navigation from "./components/Navigation";
import { GroupsIndex, GroupInfo, CreateGroupForm } from "./components/Groups";
import EventsIndex from "./components/Events/EventsIndex";
import EventInfo from "./components/Events/EventInfo";
import CreateEventForm from "./components/Events/CreateEventForm";
import Homepage from "./components/Homepage/Homepage";
import SignupForm from "./components/SignupFormModal/SignupForm";

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
            path="/groups/:groupId/events/new"
            component={CreateEventForm}
          />
          <Route exact path="/groups/:groupId" component={GroupInfo} />
          <Route exact path="/events/:eventId" component={EventInfo} />
          <Route exact path="/groups" component={GroupsIndex} />
          <Route exact path="/events" component={EventsIndex} />
          <Route exact path="/your-groups" component={GroupsIndex} />
          <Route exact path="/signup" component={SignupForm} />
          {/* <Route exact path="/your-events" component={EventsIndex} /> */}
          <Route exact path="/" component={Homepage}></Route>
          <Route path="">
            <Redirect to="/" />
          </Route>
        </Switch>
      </>
    )
  );
}

export default App;
