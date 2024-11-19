import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./client";

const PostDetail = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [upvote, setUpvotes] = useState(0);

  // Fetch post details by ID
  const fetchPostDetail = async () => {
    const { data, error } = await supabase
      .from("Twiterrr")
      .select("id, post, reply, created_at, upvote")
      .eq("id", id)
      .single(); // Fetch the single post by ID

    if (error) {
      console.error("Error fetching post detail:", error);
    } else {
      setPost(data);
      setUpvotes(data.upvote || 0);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchPostDetail();
  }, [id]);

  // Handle upvoting
  const handleUpvote = async () => {
    const newUpvotes = upvote + 1;
    setUpvotes(newUpvotes);

    const { error } = await supabase
      .from("Twiterrr")
      .update({ upvote: newUpvotes })
      .eq("id", id);

    if (error) {
      console.error("Error updating upvotes:", error);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-detail">
      <img src={post.image} alt="user" />
      <h2>{post.image}</h2>
      <p>{post.post}</p>
      <p>Created at: {new Date(post.created_at).toLocaleString()}</p>
      <p>Upvotes: {upvote}</p>
      <button onClick={handleUpvote}>Upvote</button>
    </div>
  );
};

export default PostDetail;
