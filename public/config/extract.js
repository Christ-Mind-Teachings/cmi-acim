var text = require("./text.json");
var util = require("util");
var flat = [];

for (let content of text.contents) {
  for (let section of content.sections) {
    flat.push(section.url.substr(0,8));
  }
}

console.log(util.inspect(flat, {maxArrayLength:500}));