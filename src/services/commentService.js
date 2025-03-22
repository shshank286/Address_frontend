import { apiClientUser } from "../utils/apiHelper";

export const postComment = async (newsId, commentDescription) => {
  try {
    const response = await apiClientUser.post(`/comment`, {
      newsId,
      commentDescription
    });

    return response.data; 
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

export const getCommentByNewsById = async (id) => {
  try {
    const response = await apiClientUser.get(`/comment/news/${id}`);

    console.log("comment",response.data.comments);
    
    return response.data.comments;
  } catch (error) {
    console.error("COMMENT ERROR ::: ", error);
    throw error;
  }
};

export const postCommentReply = async (
  newsId,
  commentDescription,
  parentCommentId
) => {
  try {
    const response = await apiClientUser.post(`/comment`, {
      newsId,
      commentDescription,
      parentCommentId
    });

    return response.data; 
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};
