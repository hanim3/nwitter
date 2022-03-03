import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          form['email'], 
          form['password']
        );
      } else {
        data = await authService.signInWithEmailAndPassword(
          form['email'], 
          form['password']
        );
      }
    } catch(error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input 
          name="email" 
          type="text" 
          placeholder="Email" 
          required 
          value={form['email']}
          onChange={onChange}
          className="authInput"
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          required 
          value={form['password']}
          onChange={onChange}
          className="authInput"
        />
        <input 
          type="submit" 
          className="authInput authSubmit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;