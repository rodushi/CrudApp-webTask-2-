import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyPosts } from "./MyPosts";
import style from "../../css/newPost.module.css";
import style2 from "../../css/home.module.css";

export const NewPost = (props) => {
  const [post, setPost] = useState({
    title: "",
    body: "",
  });
  const navigate = useNavigate();
  const { title, body } = post;
  const createPost = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:3000/api/user/post",
        {
          title: title,
          body: body,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("x-access-token"),
          },
        }
      );
      const status = await response.status;
      switch (status) {
        case 201:
          alert("Story created");
          window.location.reload(true);
          break;
        case 401:
          alert("Unauthorized");
          window.location.href = "./api/auth/login";
          break;
        default:
          alert("Something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };
  // res.headers['x-access-token']
  const handleInput = (e) => {
    const name = e.target.name;
    setPost({ ...post, [name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted");
    console.log(post);
  };
  const toLogin = () => {
    localStorage.setItem("x-access-token", "");
    localStorage.setItem("userID", "");
    navigate("/api/auth/login");
  };
  const toPost = () => {
    navigate("/api/users/all");
  };
  const toHome = () => {
    navigate("/");
  };
  return (
    <div>
      <div className={style2.topnav}>
        <div className={style2.navLink}>
          <button onClick={toPost}>user</button>
          <button onClick={toHome}>home</button>
          <button onClick={toLogin}>logout</button>
        </div>
      </div>
      <form action="" onSubmit={handleSubmit}>
        <div className={style.newContainer}>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={handleInput}
            required
            placeholder="title"
            autofocus
          />

          <textarea
            type="text"
            name="body"
            id="body"
            onChange={handleInput}
            value={body}
            required
            placeholder="body"
            autofocus
          />
          <button type="submit" onClick={createPost}>
            Add Post
          </button>
        </div>
      </form>
      <myPost />
    </div>
  );
};