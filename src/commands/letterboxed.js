module.exports = {
  name: "letterboxed",
  description: "Solution for the nytimes Letter Boxed game",
  enabled: true,

  execute(message, args) {
    const request = require("request");
    const cheerio = require("cheerio");

    message.channel.sendTyping();

    request(
      "https://www.nytimes.com/puzzles/letter-boxed",
      (error, response, html) => {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
          // get the html element holding the answers
          let answers = $(
            `.pz-game-screen script[type="text/javascript"]`
          ).html();
          // remove all of the unnecessary code before the answers
          answers = answers.slice(answers.indexOf('"ourSolution":') + 16);
          // remove all of the unnecessary code after the answers
          answers = answers.slice(0, answers.indexOf("]") - 1);
          // store the answers in an array
          const answersArray = answers.split('","');
          // set answers to nothing so it can be reused
          answers = "";
          // add each answer to a new line in a string
          answersArray.forEach((answer) => {
            answers += answer.toLowerCase() + "\n";
          });
          // send out the answers as one big message
          message.channel.send(answers);
        }
      }
    );
  },
};
