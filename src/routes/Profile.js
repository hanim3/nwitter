import { authService } from "fbase";
import React from "react";
import { useHistory } from "react-router-dom";

export default ({ setUserObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    setUserObj((prev) => !prev);
    history.push("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
};