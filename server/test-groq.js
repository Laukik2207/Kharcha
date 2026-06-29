import dotenv from 'dotenv';
dotenv.config();

const callGroq = async () => {
  console.log("Using API Key:", process.env.GROQ_API_KEY ? "Found" : "Not Found");
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "llama-3.3-70b-versatile",
        "messages": [
          { "role": "user", "content": "Hello. return json." }
        ],
        "response_format": { "type": "json_object" }
      })
    });

    if (!response.ok) {
      console.log("Error status:", response.status, response.statusText);
      const text = await response.text();
      console.log("Error response text:", text);
      return;
    }

    const data = await response.json();
    console.log("Success:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

callGroq();
