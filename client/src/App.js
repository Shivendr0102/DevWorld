import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import "./App.css";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import dashboard from "./components/dashboard/dashboard";
import privateRoute from "./components/routing/privateRoute";
import { loaduser } from "./actions/auth";
import createprofile from "./components/profile_form/createprofile";
import EditProfile from "./components/profile_form/EditProfile";
import AddExperience from "./components/profile_form/AddExperience";
import AddEducation from "./components/profile_form/AddEducation";
import Post from "./components/Post/Post";
//Redux
import { Provider } from "react-redux";
import store from "./store";
import setauthtoken from "./utils/setauthtoken";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";

if (localStorage.token) {
  setauthtoken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loaduser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Landing />} />
          </Routes>

          <section className='container'>
            <Alert />
            <Routes>
              <Route exact path='/register' element={<Register />} />
              <Route exact path='/login' element={<Login />} />
              <Route exact path='/profiles' element={<Profiles />} />
              <Route exact path='/profiles/:id' element={<Profile />} />
              <privateRoute exact path='/dashboard' element={<dashboard />} />
              <privateRoute
                exact
                path='/createprofile'
                element={<createprofile />}
              />
              <privateRoute
                exact
                path='/edit-profile'
                element={<EditProfile />}
              />
              <privateRoute
                exact
                path='/add-experience'
                element={<AddExperience />}
              />
              <privateRoute
                exact
                path='/add-education'
                element={<AddEducation />}
              />
              <privateRoute exact path='/posts' element={<Posts />} />
              <privateRoute exact path='/posts/:id' element={<Post />} />
            </Routes>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
