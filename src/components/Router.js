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

const AppRouter = ({ refreshUser, isLoggedIn, userObj, setUserObj }) => {
  return (
    <Router>
      {/* isLoggedIn = true면 Navigation 띄운다. */}
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Switch>
        {isLoggedIn ? (
          <div 
            style={{
              maxWidth: 890,
              width: "100%",
              margin: "0 auto",
              marginTop: 80,
              display: "flex",
              justifyContent: "center"
            }}>
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Route exact path="/profile">
              <Profile refreshUser={refreshUser} setUserObj={setUserObj} userObj={userObj} />
            </Route>
          </div>
        ) : (
          <Route exact path="/" component={() => <Auth />}></Route>
        )}
      </Switch>
    </Router>
  )
}

export default AppRouter;