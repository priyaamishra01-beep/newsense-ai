import { useState, useEffect } from "react";

function Dashboard({ user, setUser }) {

  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews("india");
  }, []);

const fetchNews = async (searchText = query) => {

  if (!searchText.trim()) {
    alert("Please enter something");
    return;
  }

  try {

    setLoading(true);

    const res = await fetch(
      `https://newsense-ai-xzx5.onrender.com/news?q=${searchText}`
    );

    // CHECK RESPONSE FIRST
    if (!res.ok) {
      throw new Error("Backend response failed");
    }

    const data = await res.json();

    console.log(data);

    if (data.articles) {

      setArticles(data.articles);
      setSummaries({});

      data.articles.forEach((article, index) => {

        if (article.description) {
          summarize(article.description, index);
        }

      });

    } else {

      alert("No articles found");

    }

  } catch (err) {

    console.log(err);

    alert(err.message);

  } finally {

    setLoading(false);

  }

};

  const summarize = async (text, index) => {

    try {

      const res = await fetch("https://newsense-ai-xzx5.onrender.com/summarize", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ text }),

      });

      const data = await res.json();

      setSummaries((prev) => ({
        ...prev,
        [index]: data.summary,
      }));

    } catch (err) {

      console.log(err);

    }
  };
  const handleSearch = () => {

  fetchNews(query);

};

  const logout = () => {

    localStorage.removeItem("user");

    setUser(null);

  };

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-3xl font-bold">
            🧠 NewsSense AI
          </h1>

          <p className="text-slate-400">
            AI Powered News Summarizer
          </p>

        </div>

        <div className="flex items-center gap-4">

          <p className="font-semibold">
            {user?.name}
          </p>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>

      {/* SEARCH */}

      <div className="flex gap-4 mb-8">

        <input
          type="text"
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-slate-800 border border-slate-700 p-3 rounded-lg w-[350px]"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-6 rounded-lg"
        >
          Search
        </button>

      </div>

      {/* LOADING */}

      {loading && (
        <p className="text-slate-400">
          Loading news...
        </p>
      )}

      {/* NEWS GRID */}

      <div className="grid md:grid-cols-2 gap-8">

        {articles.map((article, index) => (

          <div
            key={index}
            className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg"
          >

            {article.urlToImage && (

              <img
                src={article.urlToImage}
                alt=""
                className="w-full h-[250px] object-cover"
              />

            )}

            <div className="p-5">

              <h2 className="text-xl font-bold mb-4">
                {article.title}
              </h2>

              <div className="bg-slate-800 p-4 rounded-xl">

                <h3 className="font-semibold text-green-400 mb-2">
                  🧠 AI Summary
                </h3>

                <p className="text-slate-300 leading-7">

                  {summaries[index]
                    ? summaries[index]
                    : "Generating AI summary..."}

                </p>

              </div>

              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
              >

                <button className="mt-5 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg">

                  📖 Read Full News

                </button>

              </a>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}

export default Dashboard;