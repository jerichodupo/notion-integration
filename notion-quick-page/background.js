chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CREATE_NOTION_PAGE") {
    createNotionPage(message.payload)
      .then(() => sendResponse({ success: true }))
      .catch(err => sendResponse({ success: false, error: err.message }));

    return true; // keep channel open for async
  }
});

async function createNotionPage({ title, content }) {
  const PARENT_PAGE_ID = "2ed521718490804f92e5de94859dbc48";
  const NOTION_ID = "";

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${PARENT_PAGE_ID}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    },
    body: JSON.stringify({
      parent: { page_id: PARENT_PAGE_ID },
      properties: {
        title: {
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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
}
