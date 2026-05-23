const saveBtn = document.getElementById("save");
const statusText = document.getElementById("status");

saveBtn.addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (!title) {
    statusText.textContent = "Title is required";
    return;
  }

  statusText.textContent = "Saving...";

  const NOTION_TOKEN = "YOUR_NOTION_TOKEN";
  const DATABASE_ID = "YOUR_DATABASE_ID";

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          Name: {
            title: [{ text: { content: title } }]
          }
        },
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [{ text: { content } }]
            }
          }
        ]
      })
    });

    if (!response.ok) throw new Error("Failed to save");

    statusText.textContent = "Saved to Notion ✅";
  } catch (err) {
    statusText.textContent = "Error saving page ❌";
    console.error(err);
  }
});
