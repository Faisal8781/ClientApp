import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  let history = useNavigate();
  useEffect(() => {
    // axios.all([axios.get(`http://localhost:3001/posts/byId/${id}`),axios.get(`http://localhost:3001/comments/${id}`)]).then(axios.spread((post,comment) =>{
    // setPostObject(post.data);
    // setComments(comment.data)
    // }))
    const APICallRender = () => {
      axios
        .get(
          `https://faisal-postapi-389d915ec785.herokuapp.com/posts/byId/${id}`
        )
        .then((response) => {
          setPostObject(response.data);
        });

      axios
        .get(`https://faisal-postapi-389d915ec785.herokuapp.com/comments/${id}`)
        .then((response) => {
          setComments(response.data);
        });
    };

    APICallRender();
  }, []);
  const addComment = () => {
    axios
      .post(
        "https://faisal-postapi-389d915ec785.herokuapp.com/comments",
        { commentBody: newComment, PostId: id },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((respone) => {
        if (respone.data.error) {
          alert(respone.data.error);
        } else {
          console.log(respone.data);
          const commentToAdd = {
            commentBody: newComment,
            username: respone.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(
        `https://faisal-postapi-389d915ec785.herokuapp.com/comments/${id}`,
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id != id;
          })
        );
      });
  };
  const deletePost = (id) => {
    axios
      .delete(`https://faisal-postapi-389d915ec785.herokuapp.com/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
      axios.put(
        "https://faisal-postapi-389d915ec785.herokuapp.com/posts/title",
        { newTitle: newTitle, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );
      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter New Text:");
      axios.put(
        "https://faisal-postapi-389d915ec785.herokuapp.com/posts/postText",
        { newText: newPostText, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );
      setPostObject({ ...postObject, postText: newPostText });
    }
  };
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.username === postObject.usernames) {
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === postObject.usernames) {
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.usernames}
            {authState.username === postObject.usernames && (
              <button onClick={() => deletePost(postObject.id)}>
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}> Add Comment </button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label>@{comment.username}</label>
                {authState.username === comment.username && (
                  <button onClick={() => deleteComment(comment.id)}>X</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
