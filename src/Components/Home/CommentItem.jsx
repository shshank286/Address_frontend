import React, { useState } from "react";
import { postCommentReply } from "../../services/commentService";
import { useSelector } from "react-redux";

const CommentItem = (comment) => {
  const { newsId, onReply } = comment;
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const replies = comment?.replies;

  const fname = useSelector((state) => state.auth.name);
  const firstLetter = (fname || "").substring(0, 1);

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      await postCommentReply(newsId, replyText, comment.id);
      setReplyText("");
      setShowReplyBox(false);
      onReply();
    } catch (error) {
      console.error("Error posting reply", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply(); 
    }
  };

  return (
    <div className="border-t border-gray-200 pt-1">
      <div className="flex space-x-4">
        {/* Avatar */}
        {comment.profile_picture ? (
          <img
            src={comment.profile_picture}
            alt="Profile"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 uppercase flex items-center justify-center font-bold text-lg sm:text-xl rounded-full">
            {firstLetter}
          </div>
        )}

        {/* Comment Content */}
        <div className="w-full">
          <h4 className="font-bold text-sm sm:text-base text-gray-800">{comment.author}</h4>
          <span className="text-xs text-gray-500">{comment.date}</span>
          <p className="mt-2 text-gray-700 text-sm sm:text-base">{comment.text}</p>
          
          {comment?.replies && (
            <div className="">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowReplyBox(!showReplyBox)}
                  className="text-sm sm:text-base text-[#D6043C] font-bold mt-2"
                >
                  REPLY
                </button>
              </div>
              {showReplyBox && (
                <div className="mt-4 w-full sm:w-[60rem] md:w-[50rem]">
                  <textarea
                    name="custom-comment-textarea"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="2"
                    placeholder="Write your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown} 
                    autoComplete="off"
                  ></textarea>
                  <div className="flex justify-end sm:justify-end mt-2 space-x-2">
                    <button
                      className="px-4 py-1 bg-gray-300 rounded-md text-sm sm:text-base"
                      onClick={() => setShowReplyBox(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-1 text-xs sm:text-sm bg-pink-600 text-white rounded-md"
                      onClick={handleReply}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Replies */}
          {replies && (
            <div className="ml-6 mt-4 space-y-4">
              {replies.map((reply, index) => (
                <CommentItem key={index} {...reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
