const core = require('@actions/core');
const github = require('@actions/github');
const MarkdownIt = require('markdown-it')

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  const inputDir = core.getInput('input_dir');
  const outputDir = core.getInput('output_dir');

  core.setOutput("output_dir", time);

  //md = new MarkdownIt();
  //var result = md.render('# markdown-it rulezz!');

} catch (error) {
  core.setFailed(error.message);
}