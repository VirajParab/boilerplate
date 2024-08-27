import { useContext, useState } from "react";
import { toast } from "react-toastify";
import validator from "validator";
import { useNavigate } from "react-router-dom";

import axios from "../../api/axios";
import { loginRoute } from "../../api/routes";
import FormField from "../../components/FormField/FormField";
import { AuthContext } from "../../contexts/AuthContext";

import "./Login.scss";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [emailError, setemailError] = useState("");
  const [formValid, setFormValid] = useState(false);

  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!validator.isEmail(email)) {
      formIsValid = false;
      setemailError("Email Not Valid");
      return false;
    } else {
      setemailError("");
      formIsValid = true;
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      formIsValid = false;
      setpasswordError(
        "Must contain 8 characters, one uppercase letter, one lowercase letter, one number, and one special symbol"
      );
      return false;
    } else {
      setpasswordError("");
      formIsValid = true;
    }
    setFormValid(formIsValid);
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    handleValidation();

    if (formValid) {
      axios
        .post(loginRoute, {
          email: email,
          password: password,
        })
        .then(function (response) {
          toast.success("Logged In Successfully!");
          setIsLoggedIn(true);
          setUser(response.data.user);
          localStorage.setItem("token", response.data.token);
          navigate("/");
        })
        .catch(function (error) {
          toast.error(error.response.data.msg);
        });
    }
  };

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <div className="col-md-4">
          <form id="loginform" onSubmit={loginSubmit} className="login-form">
            <h3 className="text-center login-header">Login</h3>
            <div className="form-group mt-2">
              <h5>Email address</h5>
              <FormField
                type="email"
                placeholder="Enter Email"
                setFunc={setEmail}
              />
              <small id="emailHelp" className="text-danger form-text mt-2">
                {emailError}
              </small>
            </div>
            <div className="form-group mt-4">
              <h5>Password</h5>
              <FormField
                type="password"
                placeholder="Enter Password"
                setFunc={setPassword}
              />
              <small id="passworderror" className="text-danger form-text">
                {passwordError}
              </small>
            </div>
            <div className="text-center submit-btn">
              <button type="submit" className="btn btn-dark mt-4">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
