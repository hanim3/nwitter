import React, { useEffect, useState } from "react";
import AppRouter from 'components/Router';
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
        // displayName이 빈 값인 경우 이메일을 가공해서 생성해줌
        if (user.displayName === null) {
          const { email } = user;
          user.updateProfile({
            displayName: email.split('@')[0],
          });
        }
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} setUserObj={setUserObj} /> : "Initializing..."}
    </>
  )
}

export default App;
