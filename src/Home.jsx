import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "./client";
import "./Home.css";

const Home = () => {
  const [tweetContent, setTweetContent] = useState("");
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("time");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch tweets from the Supabase database when the component mounts
  const fetchTweets = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("Twiterrr") // Ensure the table name is correct
      .select("id, post, created_at, upvote")
      .order("created_at", { ascending: false }); // Latest tweets first

    if (error) {
      console.error("Error fetching tweets:", error);
    } else {
      setTweets(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTweets(); // Fetch tweets when the page loads
  }, []);

  // Handle input change in the tweet box
  const handleTweetChange = (e) => {
    setTweetContent(e.target.value);
  };

  // Handle posting a new tweet
  const handlePostTweet = async (e) => {
    e.preventDefault();

    if (!tweetContent.trim()) return;

    setIsLoading(true);

    try {
      // Insert the new tweet into Supabase table
      const { data, error } = await supabase
        .from("Twiterrr")
        .insert([
          {
            post: tweetContent, // The actual tweet content
            upvote: 0,
          },
        ])
        .single(); // Ensure only one tweet is inserted

      if (error) {
        console.error("Error posting tweet:", error);
      } else {
        setTweets([data, ...tweets]); // Add the new tweet to the front of the feed
        setTweetContent(""); // Clear the tweet box after posting
      }
    } catch (error) {
      console.error("Error handling post tweet:", error);
    }

    setIsLoading(false);
    window.location = "/";
  };

  const sortTweets = (tweets) => {
    if (sortBy === "time") {
      return [...tweets].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ); // Latest first
    }
    return [...tweets].sort((a, b) => b.upvotes - a.upvotes);
  };

  const filteredTweets = tweets.filter((tweet) =>
    tweet.post.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedAndFilteredTweets = sortTweets(filteredTweets);

  const handleUpvote = async (tweetId, currentUpvotes) => {
    const newUpvotes = currentUpvotes + 1;

    // Update the upvotes in Supabase
    const { error } = await supabase
      .from("Twiterrr")
      .update({ upvote: newUpvotes })
      .eq("id", tweetId);

    if (error) {
      console.error("Error updating upvotes:", error);
    } else {
      // Update local state to reflect the new upvote count
      setTweets((prevTweets) =>
        prevTweets.map((tweet) =>
          tweet.id === tweetId ? { ...tweet, upvote: newUpvotes } : tweet
        )
      );
    }
  };

  return (
    <div className="home-container">
      <div className="navbar">
        <img
          src="twitter-logo.png"
          alt="Twitterrr"
          style={{ height: 80, width: 80 }}
        />
        <h3>Twitterrr</h3>
      </div>

      {/* Tweet Box */}
      <div className="tweet-box">
        <textarea
          placeholder="What's happening?"
          value={tweetContent}
          onChange={handleTweetChange}
        />
        <br />
        <button onClick={handlePostTweet} disabled={isLoading}>
          {isLoading ? "Posting..." : "Tweet"}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => setSortBy("time")}
          style={{
            marginRight: 20,
            backgroundColor: "#1da1f2",
            color: "white",
          }}
        >
          Sort by Time
        </button>
        <button
          onClick={() => setSortBy("upvotes")}
          style={{
            marginRight: 20,
            backgroundColor: "#1da1f2",
            color: "white",
          }}
        >
          Sort by Upvotes
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Feed */}
      <div className="feed">
        {tweets.length === 0 ? (
          <p>No tweets yet!</p>
        ) : (
          sortedAndFilteredTweets.map((tweet) => (
            <div className="tweet" key={tweet.id}>
              {/* <h4>{tweet.username}</h4> */}
              <p>{tweet.post}</p>
              <p>Created at: {new Date(tweet.created_at).toLocaleString()}</p>
              <button>Upvotes: {tweet.upvote}</button>
              <div className="actions" style={{ marginTop: 20 }}>
                <button
                  style={{
                    marginRight: 20,
                    backgroundColor: "#1da1f2",
                    color: "white",
                  }}
                  onClick={() => handleUpvote(tweet.id, tweet.upvote)}
                >
                  Upvote
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
