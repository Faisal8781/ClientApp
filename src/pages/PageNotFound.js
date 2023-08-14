import React from "react";
import { Link } from "react-router-dom";
function PageNotFound() {
  return (
    <div>
      <h1>Page Not Found :/</h1>
      <h3>
        Try this links: <Link to="/login"> Login</Link>
        <Link to="/registration"> Registration </Link>
      </h3>
    </div>
  );
}

export default PageNotFound;
