export async function translateText(text: string, targetLang: string, sourceLang: string = "en"): Promise<string> {
  if (!text || targetLang === sourceLang) return text
  try {
    // Split text into sentences for better translation quality
    const sentences = text.match(/[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g) || [text];
    const translatedSentences: string[] = [];
    for (const sentence of sentences) {
      if (!sentence.trim()) continue;
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sentence)}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log("[DEBUG] Google Translate API response:", data);
      if (Array.isArray(data) && Array.isArray(data[0])) {
        translatedSentences.push(data[0].map((item: any) => item[0]).join("").trim());
      } else {
        translatedSentences.push(sentence);
      }
    }
    return translatedSentences.join(" ").replace(/\s+/g, " ").trim();
  } catch (err) {
    console.log("[DEBUG] Google Translate error:", err);
    return text;
  }
}
