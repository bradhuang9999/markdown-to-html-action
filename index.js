const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs");
var path = require("path");
const MarkdownIt = require('markdown-it');

try {
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);

  const inputDir = core.getInput('input_dir');
  const outputDir = core.getInput('output_dir');

  var absoluteInputDir = path.resolve(inputDir);
  var absoluteOutputDir = path.resolve(outputDir);

  if(!fs.existsSync(absoluteOutputDir)) {
    fs.mkdirSync(absoluteOutputDir, {recursive:true});
  }

  Walker(absoluteInputDir)
  .on('file', function(file, stat) {
    console.log('Got file: ' + file);
    console.log('stat: ' + stat);
  });
} catch (err) {
  console.error(err);
  core.setFailed(err.message);
}