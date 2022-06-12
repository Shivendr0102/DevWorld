import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

export const privateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => {
  <Route
    {...rest}
    render={(props) =>
      !isAuthenticated && !loading ? (
        <Redirect to='login' />
      ) : (
        <Component {...props} />
      )
    }
  />;
};

privateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(privateRoute);
