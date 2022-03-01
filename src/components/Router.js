import React from "react";
import { 
  HashRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({ isLoggedIn, userObj, setUserObj }) => {
  return (
    <Router>
      {/* isLoggedIn = true면 Navigation 띄운다. */}
      {isLoggedIn && <Navigation />}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Route exact path="/profile">
              <Profile setUserObj={setUserObj} />
            </Route>
          </>
        ) : (
          <Route exact path="/" component={() => <Auth />}></Route>
        )}
      </Switch>
    </Router>
  )
}

export default AppRouter;