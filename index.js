const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs");
const path = require("path");
const Walker = require('walker');
const cheerio = require('cheerio');
const marked = require('marked');
const Mustache = require('mustache');
const fm = require('front-matter')

try {
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);

  const inputDir = core.getInput('input_dir');
  const outputDir = core.getInput('output_dir');
  const strTemplatePath = core.getInput('template');

  var absoluteInputDir = path.resolve(inputDir);
  var absoluteOutputDir = path.resolve(outputDir);

  if(strTemplatePath) {
    var strTemplate = fs.readFileSync(strTemplatePath, {encoding:'UTF-8'}).toString();  
  }
  
  
  if(!fs.existsSync(absoluteOutputDir)) {
    fs.mkdirSync(absoluteOutputDir, {recursive:true});
  }

  Walker(absoluteInputDir)
  .on('file', function (root, stat, next) {
    var fileName = path.basename(file);
      var dirName = path.dirname(file);
      var relatePath = dirName.substring(absoluteInputDir.length);
      
      if(!fileName.endsWith('.md') && !fileName.endsWith('.markdown')) {
        return;
      }

      var extIndex = fileName.lastIndexOf('.');
      var fileNameNew = fileName.substring(0, extIndex) + ".html"; 
      var filePathNew = absoluteOutputDir + relatePath;

      if(!fs.existsSync(filePathNew)) {
        fs.mkdirSync(filePathNew, {recursive:true});
      }

      const strMarkdownContent = fs.readFileSync(file, {encoding:'UTF-8'}).toString();
      const strMarkdownContentParsed = fm(strMarkdownContent);
      
      var resultHtml = marked.parse(strMarkdownContentParsed.body);
      if(strTemplate) {
        var strTemplateRender = Mustache.render(strTemplate, strMarkdownContentParsed.attributes);
        var $ = cheerio.load(strTemplateRender);
        $('body').prepend(resultHtml);
        resultHtml = $.html();
      }

      fs.writeFileSync(filePathNew + "/" + fileNameNew, resultHtml, {encoding:'UTF-8'});
  });
} catch (err) {
  console.error(err);
  core.setFailed(err.message);
}