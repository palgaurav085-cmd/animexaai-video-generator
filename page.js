export default function Home() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const res = await fetch("/api/generate-video", {
      method: "POST",
      body: formData
    });

    const result = await res.json();
    alert(result.message);
  };

  return (
    <div className="container">
      <h1>🎬 Animexa AI – Auto Animation Creator</h1>
      <p>Enter your script & upload optional character image. Animexa will generate a full AI animation (coming soon).</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Your Script</label>
          <textarea 
            name="script" 
            placeholder="Type your video script here..."
            rows="6"
            required
          />

          <label>Upload Character (Optional)</label>
          <input type="file" name="character" accept="image/*" />

          <button type="submit">Generate Animation</button>
        </form>
      </div>
    </div>
  );
}
