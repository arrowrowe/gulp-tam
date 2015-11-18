var fs = require('fs-extra');

module.exports = function () {
  var GT = this.GT;
  var assetsPathReal = fs.realpathSync(this.assetsPath);

  var report;
  var linked;
  var rebuildAll = () => {
    report = GT.tam.build(GT.tam.prepare(this.assets));
    linked = GT.tam.link(report, this.assets.www);
    fs.writeFileSync(this.assets.linked, JSON.stringify(linked));
  };
  rebuildAll();

  var rebuildOne = file => {

    var forInCommands = fn => {
      var i = 0;
      for (var pkgName in report) {
        report[pkgName].commands.forEach(command => {
          if (command.files.indexOf(file) >= 0) {
            i++;
            fn(command, pkgName);
          }
        });
      }
      return i;
    };

    GT.tam.log.info('File [%s] needs rebuilding.', file);
    if (forInCommands((command, pkgName) => {
      var pkg = this.assets.packages[pkgName];
      pkg.name = pkgName;
      GT.tam.namer(this.assets, pkg)(command);
      GT.tam.worker.perform(command);
    }) === 0) {
      GT.tam.log.info('No commands related found.');
      return;
    }
    linked = GT.tam.link(report, this.assets.www);
    fs.writeFileSync(this.assets.linked, JSON.stringify(linked));
  };

  GT.gulp.watch([
    this.assetsPath,
    this.assets.src + '/**/*'
  ], event => {
    GT.tam.log.trace('File [%s] was "%s".', event.path, event.type);
    if (event.type === 'deleted') {
      return;
    }
    if (assetsPathReal === event.path) {
      this.assets = GT.getAssets(this.assetsPath);
      rebuildAll();
    } else {
      rebuildOne(event.path);
    }
  });

};
