import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import getCurrentProfile, { deleteAccount } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import dashboardActions from "./dashboardActions";
import Experiences from "./Experiences";
import Education from "./Education";

export const dashboard = ({
  getCurrentProfile,
  auth,
  deleteAccount,
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>dashboard test</h1>
      <p className='Lead'>
        <i className='fas fa-user'></i>Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <dashboardActions />
          <Experiences experience={profile.experience} />
          <Education education={profile.education} />
          <div className='my-2'>
            <button className='btn btn-danger' onClick={() => deleteAccount()}>
              <i className='fas fa-user-minus'></i>Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          You have not setup a profile . Please add some
          <Link to='/create-profile' className='btn btn-primary my-1'>
            {" "}
            Create Profile{" "}
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  dashboard
);
