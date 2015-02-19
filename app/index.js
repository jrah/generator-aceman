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

var JrahSWPGenerator = module.exports = function JrahSWPGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(JrahSWPGenerator, yeoman.generators.Base);

JrahSWPGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(hello);

  var prompts = [
  {
    name: 'themename',
    message: 'What is the name of your theme?',
    default: 'theme'
  },
  {
    name: 'themeuri',
    message: 'What is the URL of your theme?',
    default: 'http://bitbucket.org/jhome'
  },
  {
    name: 'author',
    message: 'What is your name?',
    default: 'James Home'
  },
  {
    name: 'authoruri',
    message: 'What is the author URL?',
    default: 'http://jameshome.co'
  },
  {
    name: 'themedescription',
    message: 'Enter the theme description:',
    default: 'A starter theme based on _s'
  },
  {
    name: 'devurl',
    message: 'What is the browser proxy url? e.g. site.dev',
    default: 'domain.dev'
  }
  ];

  this.prompt(prompts, function (props) {
    this.themename = props.themename;
    this.themeuri = props.themeuri;
    this.author = props.author;
    this.authoruri = props.authoruri;
    this.themedescription = props.themedescription;
    this.devurl = props.devurl;
    cb();
  }.bind(this));
};

JrahSWPGenerator.prototype.installunderscores = function installunderscores() {
  this.startertheme = 'https://github.com/Automattic/_s/archive/master.tar.gz';
  this.log.info('Downloading & extracting ' + chalk.yellow('Underscores by Automattic'));
  this.tarball(this.startertheme, this.themename, this.async());
};


function findandreplace(dir) {
  var self = this;
  var _ = this._;
  var files = fs.readdirSync(dir);
  files.forEach(function (file) {
    file = path.join(dir, file);
    var stat = fs.statSync(file);

    if (stat.isFile() && (path.extname(file) == '.php' || path.extname(file) == '.css')) {
      self.log.info('Find and replace _s in ' + chalk.yellow(file));
      var data = fs.readFileSync(file, 'utf8');
      var result;
      result = data.replace(/Text Domain: _s/g, "Text Domain: " + _.slugify(self.themename) + "");
      result = result.replace(/'_s'/g, "'" + _.slugify(self.themename) + "'");
      result = result.replace(/_s_/g, _.underscored(_.slugify(self.themename)) + "_");
      result = result.replace(/ _s/g, " " + self.themename);
      result = result.replace(/_s-/g, _.slugify(self.themename) + "-");
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
      else if (file == 'footer.php') {
        self.log.info('Updating theme information in ' + file);
        result = result.replace(/http:\/\/automattic.com\//g, self.authoruri);
        result = result.replace(/Automattic/g, self.author);
      }
      else if (file == 'functions.php') {
        self.log.info('Updating theme information in ' + file);
        var themejs = "$1  wp_enqueue_script( '" + _.slugify(self.themename) + "-theme', get_template_directory_uri() . '/js/theme.js', array('jquery'), '0.0.1' ); }\n $2"
        result = result.replace(/(get_stylesheet_uri\(\) \);\n)(\n.wp_enqueue_script\()/, themejs);
      }
      fs.writeFileSync(file, result, 'utf8');
    }
    else if (stat.isDirectory()) {
      findandreplace.call(self, file);
    }
  });
}

JrahSWPGenerator.prototype.addfiles = function addfiles() {
  var self = this;
  var _ = this._;
  var themdirectory = _.slugify(self.themename);
  this.log(chalk.yellow('Creating dev folders and files'));
  this.mkdir(themdirectory + '/images');
  this.mkdir(themdirectory + '/fonts');
  this.mkdir(themdirectory +'/css');
  this.mkdir('src/scss');
  this.copy('_main.scss', 'src/scss/main.scss');
  this.mkdir(themdirectory +'/js/vendor');
  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
  this.copy('_GulpFile.js', 'GulpFile.js');
  this.copy('_gitignore', '.gitignore');
};


JrahSWPGenerator.prototype.renameunderscores = function renameunderscores() {
  findandreplace.call(this, '.');
  this.log.ok('Done replacing string ' + chalk.yellow('_s'));
};


JrahSWPGenerator.prototype.sassboostrap = function sassboostrap() {
  if (this.sassBootstrap) {
    this.bowerInstall([ 'sass-bootstrap' ], { save: true });
  }
};