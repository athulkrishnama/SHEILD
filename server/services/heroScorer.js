/**
 * Calculate hero scores based on child's answers and gift price
 * @param {Object} answers - Child's answers to questions (e.g., { Q4: "yes", Q10: "no" })
 * @param {Number} giftPrice - Price of the requested gift in INR
 * @returns {Object} - Hero scores object
 */
export function calculateHeroScores(answers, giftPrice) {
  const scores = {
    Flash: 0,
    "Spider-Man": 0,
    Batman: 0,
    Aquaman: 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Wonder Woman": 0,
  };

  // Question-based scoring
  if (answers.Q2 === "yes") scores["Wonder Woman"] += 40; // Likes Barbie dolls
  if (answers.Q3 === "yes") scores["Spider-Man"] -= 100; // Afraid of spiders
  if (answers.Q4 === "yes") scores["Flash"] += 50; // Likes racing
  if (answers.Q5 === "yes") scores["Aquaman"] += 40; // Likes water
  if (answers.Q6 === "yes") scores["Doctor Strange"] += 50; // Likes magic stories
  if (answers.Q7 === "yes") scores["Ant-Man"] += 40; // Likes tiny toys
  if (answers.Q10 === "yes") scores["Spider-Man"] += 40; // Has a chimney

  // Price-based scoring
  if (giftPrice > 10000) scores["Batman"] += 60; // Expensive gifts for rich Batman

  return scores;
}
