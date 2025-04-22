import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Comment = ({ comment }) => {
    const [showReplies, setShowReplies] = useState(false);
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
        <div className="comment-area-box media" style={{ marginLeft: comment.parent_comment ? '20px' : '0', marginBottom: '10px' }}>
            <img alt="" src="images/blog-user-2.jpg" className="img-fluid float-left mr-3 mt-2" />
            <div className="media-body ml-4">
                <h4 className="mb-0">{comment.user}</h4>
                <span className="date-comm font-sm text-capitalize text-color">
                    {/* <i className="ti-time mr-2"></i> */}
                    {new Date(comment.created_at).toLocaleDateString()}
                </span>
                <div className="comment-content mt-3">
                    <p>{comment.content}</p>
                </div>
                
                {/* Only show reply toggle for parent comments with replies */}
                {!comment.parent_comment && hasReplies && (
                    <div className="comment-meta mt-4 mt-lg-0 mt-md-0">
                        <Link to="#" className="text-underline" onClick={() => setShowReplies(!showReplies)}>
                            {showReplies ? 'Hide Replies' : 'Show Replies'}
                        </Link>
                    </div>
                )}

                {/* Show replies if toggled */}
                {showReplies && hasReplies && (
                    <div>
                        {comment.replies.map((reply) => (
                            <Comment key={reply.id} comment={reply} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Comments component 
export function Comments({ comments }) {
    const [commentsData, setCommentsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If comments are passed as props, use them
        if (comments && comments.length > 0) {
            setCommentsData(comments);
            setLoading(false);
        } else {
            // Otherwise fetch comments from the backend
            fetch(`http://127.0.0.1:8000/api/blog/comments/`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch comments');
                    }
                    return response.json();
                })
                .then((data) => {
                    // Handle pagination structure
                    const commentsList = data.results || data;
                    setCommentsData(commentsList);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching comments:', error);
                    setLoading(false);
                });
        }
    }, [comments]);

    if (loading) {
        return <div>Loading comments...</div>;
    }

    // Filter to only show top-level comments (no parent_comment)
    const topLevelComments = commentsData.filter(comment => !comment.parent_comment);

    return (
        <div>
            {topLevelComments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </div>
    );
}