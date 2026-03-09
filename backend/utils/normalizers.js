function cleanText(v) {
  return (v ?? "").toString().trim();
}

function cleanEmail(v) {
  return cleanText(v).toLowerCase();
}