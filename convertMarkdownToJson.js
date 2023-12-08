export function convertMarkdownToJson(markdown) {
  const lines = markdown.split("\n");
  const json = {};
  let currentSection = null;

  lines.forEach((line) => {
    if (line.startsWith("# ")) {
      // New section
      const sectionName = line.substring(2).trim().toLowerCase();
      currentSection = sectionName;
      json[sectionName] = { text: "", choices: [] };
    } else if (line.startsWith("- [")) {
      // Choice in section
      const choiceText = line.match(/\[([^[]+)\]/)[1];
      const choiceLink = line.match(/\(#([^)]+)\)/)[1];
      const choice = choiceLink.startsWith("end")
        ? { text: choiceText, end: choiceLink }
        : { text: choiceText, next: choiceLink };
      json[currentSection].choices.push(choice);
    } else if (line.trim() !== "") {
      // Narrative text
      json[currentSection].text += line.trim() + " ";
    }
  });

  return json;
}
