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

  const md = new MarkdownIt();

  const callAllFile = function(startPath, relatePath, func) {
    console.log('relatePath', relatePath);    
    files = fs.readdirSync(startPath + "/" + relatePath);    
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
    if(!fileName.endsWith('.md') && !fileName.endsWith('.markdown')) {
        return;
    }

    console.log('filePath', startPath, relatePath, fileName);
    const buffer = fs.readFileSync(startPath + relatePath + "/" + fileName, {encoding:'UTF-8'});
    const fileContent = buffer.toString();
    var resultHtml = md.render(fileContent);

    var extIndex = fileName.lastIndexOf('.');
    var fileNameNew = fileName.substr(0, extIndex) + ".html";    
    var filePathNew = absoluteOutputDir + relatePath;

    console.log('filePathNew', filePathNew);

    if(!fs.existsSync(filePathNew)) {
        fs.mkdirSync(filePathNew, {recursive:true});
    }

    fs.writeFileSync(filePathNew + "/" + fileNameNew, resultHtml, {encoding:'UTF-8'});
  };

  callAllFile(absoluteInputDir, "/", convertMarkdown);
} catch (err) {
  console.error(err);
  core.setFailed(err.message);
}