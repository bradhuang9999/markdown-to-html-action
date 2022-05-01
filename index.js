const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs");
var path = require("path");
const MarkdownIt = require('markdown-it');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);

  const inputDir = core.getInput('input_dir');
  const outputDir = core.getInput('output_dir');

  var absoluteInputDir = path.resolve(inputDir);
  var absoluteOutputDir = path.resolve(outputDir);

  const md = new MarkdownIt();

  const callAllFile = function(startPath, relatePath, func) {
    console.log('dirPath', dirPath);
    files = fs.readdirSync(dirPath);    
    files.forEach(function(fileName) {
      if (fs.statSync(startPath + "/" + relatePath + "/" + fileName).isDirectory()) {
        callAllFile(startPath, relatePath + "/" + fileName, func)
      } else {
        func(startPath, relatePath, fileName);
      }
    });
  };

  const convertMarkdown = function(startPath, relatePath, fileName) {
    fileName = fileName.trim();
    if(fileName.endsWith('.md'))

    console.log('filePath', startPath, filePath, fileName);
    const buffer = fs.readFileSync(startPath + "/", filePath + "/" + fileName, {encoding:'UTF-8'});
    const fileContent = buffer.toString();
    var resultHtml = md.render(fileContent);

    var extIndex = fileName.lastIndexOf('.');
    var fileNameNew = fileName.substr(0, extIndex) + ".html";    
    var filePathNew = absoluteOutputDir + "/" + relatePath + fileNameNew;

    console.log('filePathNew', filePathNew);

    //fs.writeFile(fileNameName, resultHtml, 'UTF-8');
  };

  callAllFile(absoluteInputDir, "/", convertMarkdown);

  core.setOutput("output_dir", time);

  //md = new MarkdownIt();
  //var result = md.render('# markdown-it rulezz!');

} catch (error) {
  core.setFailed(error.message);
}