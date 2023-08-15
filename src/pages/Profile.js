import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
function Profile() {
  let { id } = useParams();
  let history = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(
        `https://faisal-postapi-389d915ec785.herokuapp.com/auth/basicinfo/${id}`
      )
      .then((response) => {
        setUsername(response.data.username);
      });
    axios
      .get(
        `https://faisal-postapi-389d915ec785.herokuapp.com/posts/byuserId/${id}`
      )
      .then((response) => {
        setListOfPosts(response.data);
      });
  }, []);
  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1>Username: {username}</h1>
        {authState.username === username && (
          <button onClick={() => history("/changepassword")}>
            Change My Password
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post">
              <div className="title">{value.title}</div>
              <div
                className="body"
                onClick={() => {
                  history(`/post/${value.id}`);
                }}
              >
                {value.postText}{" "}
              </div>
              <div className="footer">
                <div className="username">{value.usernames}</div>
                <div className="buttons">
                  <label> {value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
