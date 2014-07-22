'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs');
var chalk = require('chalk');

var hello =
chalk.blue.bold("\n ______________") +
chalk.blue.bold("\n< Hello, you!  >") +
chalk.blue.bold("\n --------------") +
chalk.red("\n      ") + chalk.blue.bold("\\") + chalk.red("                    / \\  //\\") +
chalk.red("\n       ") + chalk.blue.bold("\\") + chalk.red("    |\\___/|      /   \\//  \\\\") +
chalk.red("\n            /") + chalk.yellow("0  0") + chalk.red("  \\__  /    //  | \\ \\") +
chalk.red("\n           /     /  \\/_/    //   |  \\  \\") +
chalk.red("\n           @_^_@'/   \\/_   //    |   \\   \\") +
chalk.yellow("\n           //") + chalk.red("_^_/     \\/_ //     |    \\    \\") +
chalk.yellow("\n        ( //)") + chalk.red(" |        \\///      |     \\     \\") +
chalk.yellow("\n      ( / /) ") + chalk.red("_|_ /   )  //       |      \\     _\\") +
chalk.yellow("\n    ( // /) ") + chalk.red("'/,_ _ _/  ( ; -.    |    _ _\\.-~        .-~~~^-.") +
chalk.yellow("\n  (( / / )) ") + chalk.red(",-{        _      `-.|.-~-.           .~         `.") +
chalk.yellow("\n (( // / ))  ") + chalk.red("'/\\      /                 ~-. _ .-~      .-~^-.  \\") +
chalk.yellow("\n (( /// ))      ") + chalk.red("`.   {            }                   /      \\  \\") +
chalk.yellow("\n  (( / ))     ") + chalk.red(".----~-.\\        \\-'                 .~         \\  `. \\^-.") +
"\n             " + chalk.red("///.----..>        \\             _ -~             `.  ^-`  ^-_") +
"\n               " + chalk.red("///-._ _ _ _ _ _ _}^ - - - - ~                     ~-- ,.-~") +
"\n                                                                  " + chalk.red("/.-~          ");

var EpigoneGenerator = module.exports = function EpigoneGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(EpigoneGenerator, yeoman.generators.Base);

EpigoneGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(hello);

  var prompts = [
  {
    name: 'themename',
    message: 'What is the name of your theme?',
    default: 'My Theme'
  },
  {
    name: 'themeuri',
    message: 'What is the URL of your theme?',
    default: 'http://epigone.me'
  },
  {
    name: 'author',
    message: 'What is your name?',
    default: 'Automattic'
  },
  {
    name: 'authoruri',
    message: 'What is your URL?',
    default: 'http://automattic.com/'
  },
  {
    name: 'themedescription',
    message: 'Enter the theme description:',
    default: 'A starter theme based on _s'
  }
  ];

  this.prompt(prompts, function (props) {
    this.themename = props.themename;
    this.themeuri = props.themeuri;
    this.author = props.author;
    this.authoruri = props.authoruri;
    this.themedescription = props.themedescription;
    this.sassBootstrap = props.sassBootstrap;
    cb();
  }.bind(this));
};

EpigoneGenerator.prototype.installepigone = function installepigone() {
  this.startertheme = 'https://github.com/1shiharaT/epigone/archive/master.tar.gz';
  this.log.info('Downloading & extracting ' + chalk.yellow('epigone'));
  this.tarball(this.startertheme, '.', this.async());
};

function findandreplace(dir) {
  var self = this;
  var _ = this._;

  var files = fs.readdirSync(dir);
  files.forEach(function (file) {
    file = path.join(dir, file);
    var stat = fs.statSync(file);

    if (stat.isFile() && (path.extname(file) == '.php' || path.extname(file) == '.css' )) {
      self.log.info('Find and replace epigone in ' + chalk.yellow(file));
      var data = fs.readFileSync(file, 'utf8');
      var result;
      result = data.replace(/Text Domain: epigone/g, "Text Domain: " + _.slugify(self.themename) + "");
      result = result.replace(/'epigone'/g, "'" + _.slugify(self.themename) + "'");
      result = result.replace(/Epigone_/g, "'" + _.slugify(self.themename) + "'");
      result = result.replace(/'EPIGONE/g, "'" + _.slugify(self.themename) + "'");
      result = result.replace(/epigone_/g, _.underscored(_.slugify(self.themename)) + "_");
      result = result.replace(/ epigone/g, " " + self.themename);
      result = result.replace(/epigone-/g, _.slugify(self.themename) + "-");
      if (file == 'style.css') {
        self.log.info('Updating theme information in ' + file);
        result = result.replace(/(Theme Name: )(.+)/g, '$1' + self.themename);
        result = result.replace(/(Theme URI: )(.+)/g, '$1' + self.themeuri);
        result = result.replace(/(Author: )(.+)/g, '$1' + self.author);
        result = result.replace(/(Author URI: )(.+)/g, '$1' + self.authoruri);
        result = result.replace(/(Description: )(.+)/g, '$1' + self.themedescription);
        result = result.replace(/(Version: )(.+)/g, '$10.0.1');
        result = result.replace(/(\*\/\n)/, '$1@import url("css/main.css");');
      }
      fs.writeFileSync(file, result, 'utf8');
    }
    else if (stat.isFile() && path.basename(file) == 'epigone.pot') {
      self.log.info('Renaming language file ' + chalk.yellow(file));
      fs.renameSync(file, path.join(path.dirname(file), _.slugify(self.themename) + '.pot'));
    }
    else if (stat.isFile() && path.basename(file) == 'README.md') {
      self.log.info('Updating ' + chalk.yellow(file));
      var data = fs.readFileSync(file, 'utf8');
      var result = data.replace(/((.|\n)*)Getting Started(.|\n)*/i, '$1');
      fs.writeFileSync(file, result, 'utf8');
    }
    else if (stat.isDirectory()) {
      findandreplace.call(self, file);
    }
  });
}

EpigoneGenerator.prototype.renameepigone = function renameepigone() {
  findandreplace.call(this, '.');
  this.log.ok('Done replacing string ' + chalk.yellow('_s'));
};
