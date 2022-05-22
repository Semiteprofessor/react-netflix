import React from 'react';

import { useState, useEffect } from 'react';
import * as posts from '../data/posts';

const Pagination = ({ match }) => {
//   const pageNumber = match.params.pageNumber || 1;

//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);

//   const [page, setPage] = useState(pageNumber);
//   const [pages, setPages] = useState(1);


//   useEffect(() => {
//     const fetchPost = async (req, res, next) => {
//       setLoading(true);
//       try {
//         const res = await fetch(`/api/v1/posts?page=${page}`);
//         const { data, pages: totalPages } = await res.json();

//         setPages(totalPages);
//         setPosts(data);
//         setLoading(false);
//   console.log(posts);
//       } catch (error) {
//         setError(error, "Something went wrong");
//       }
//     };

//     fetchPost();
//   }, [page]);

    return (
        <div>
            {/* Pagination component */}
            {/* Post listing */}
            {/* Pagination component */}
            {posts.map(post => (
            <div className="Post">
            <h1>{post.title}</h1>
            <p>{post.body}</p>
            <h3>{post.author}</h3>
            </div>

      ))}
        </div>
    )
}

export default Pagination
