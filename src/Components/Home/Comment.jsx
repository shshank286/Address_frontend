import React, { useState, useEffect } from "react";
import CommentItem from "./CommentItem";
import { useParams } from "react-router-dom";
import {
  getCommentByNewsById,
  postComment
} from "../../services/commentService";

const Comment = () => {
  const { newsId } = useParams();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComments();
    return () => { };
  }, [newsId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getCommentByNewsById(newsId);

      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async () => {

    if (!newComment.trim()) {
      setError("Enter a comment !");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await postComment(newsId, newComment);
      fetchComments();
    } catch (error) {
      console.error("Error while posting comment:", error);
    } finally {
      setLoading(false);
      setNewComment("");
    }
  };

  // Handle "Enter" key to submit the comment
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePostComment();
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
        </div>
      ) : (
        <div className="px-4 sm:px-8 lg:px-16 pt-5 mx-auto bg-[#F6F6F5] ">

          {/* Comments List */}
          <div className="mt-8 space-y-6">
            {comments.map((comment, index) => (
              <CommentItem
                key={index}
                {...comment}
                newsId={newsId}
                onReply={fetchComments}
              />
            ))}
          </div>

          {/* Leave a Reply */}
          <div className="mt-12">
            <h3 className="text-lg font-bold text-[#D6043C]">Leave a Comment</h3>
            <div className="mt-4 space-y-4 h-96">
              <textarea
                name="custom-comment-textarea"
                className="w-full p-4 border border-gray-300 rounded-md"
                placeholder="comment..."
                value={newComment}
                rows="4"
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              ></textarea>

              {error && (
                <div className="text-[#D6043C] text-[1rem] font-poppins ">{error}</div>
              )}

              <div className=" p-1 flex justify-end sm:justify-end">
                <button
                  onClick={handlePostComment}
                  className="bg-[#D6043C]  text-white px-16 py-2 rounded-full"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
