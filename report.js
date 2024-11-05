document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Get the stored data
    const { reportData } = await chrome.storage.local.get("reportData");
    function basicMarkdownParser(markdown) {
      return markdown
        .replace(/^### (.+)$/gm, "<h3>$1</h3>") // Headers
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") // Bold
        .replace(/\*(.+?)\*/g, "<em>$1</em>") // Italic
        .replace(/\n{2,}/g, "<br><br>"); // Paragraph breaks
    }

    document.getElementById("businessAnalysis").innerHTML = basicMarkdownParser(
      reportData.businessAnalysis
    );
    document.getElementById("uiuxAnalysis").innerHTML = basicMarkdownParser(
      reportData.uiuxAnalysis
    );

    document.getElementById("screenshotPreview").src = reportData.screenshot;

    // Add copy functionality
    document
      .querySelector(".copy-button")
      .addEventListener("click", async () => {
        try {
          const businessAnalysis =
            document.getElementById("businessAnalysis").textContent;
          const uiuxAnalysis =
            document.getElementById("uiuxAnalysis").textContent;

          const fullContent = `Business Goals and Content Analysis\n----------------------------------------\n${businessAnalysis}\n\nUI/UX Analysis and Optimizations\n----------------------------------------\n${uiuxAnalysis}`;

          await navigator.clipboard.writeText(fullContent);
          showToast("Report copied to clipboard!");
        } catch (err) {
          console.error("Copy failed:", err);
          // Fallback method
          const textarea = document.createElement("textarea");
          textarea.value = fullContent;
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand("copy");
            showToast("Report copied to clipboard!");
          } catch (err) {
            showToast("Failed to copy content");
          }
          document.body.removeChild(textarea);
        }
      });
  } catch (error) {
    console.error("Error loading report:", error);
  }
});

function showToast(message) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  }
}
