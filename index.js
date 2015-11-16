var fs = require('fs-extra');

var GT = {
  load: function (assetsPath) {
    return {
      assetsPath: assetsPath,
      assets: GT.getAssets(assetsPath),
      clean: GT.tasks.clean,
      build: GT.tasks.build,
      watch: GT.tasks.watch
    };
  },
  getAssets: function (assetsPath) {
    return GT.tam.fillAssets(GT.tam.read(assetsPath), {});
  },
  tasks: {
    clean: function () {
      var dist = this.assets.dist;
      GT.tam.log.info('Remove dist folder [%s]', dist);
      fs.removeSync(dist);
    },
    build: function () {
      GT.tam.run({
        assets: this.assetsPath
      });
    },
    watch: function () {
      var that = this;
      var assetsPathReal = fs.realpathSync(this.assetsPath);

      var report;
      var linked;
      rebuildAll();

      GT.gulp.watch([
        this.assetsPath,
        this.assets.src + '/**/*'
      ], function (event) {
        GT.tam.log.trace('File [%s] was "%s".', event.path, event.type);
        if (event.type === 'deleted') {
          return;
        }
        if (assetsPathReal === event.path) {
          that.assets = GT.getAssets(that.assetsPath);
          rebuildAll();
        } else {
          rebuildOne(event.path);
        }
      });

      function rebuildAll() {
        report = GT.tam.build(GT.tam.prepare(that.assets));
        linked = GT.tam.link(report, that.assets.www);
        fs.writeFileSync(that.assets.linked, JSON.stringify(linked));
      }

      function rebuildOne(file) {

        GT.tam.log.info('File [%s] needs rebuilding.', file);
        if (forInCommands(function (command, pkgName) {
          var pkg = that.assets.packages[pkgName];
          pkg.name = pkgName;
          GT.tam.namer(that.assets, pkg)(command);
          GT.tam.worker.perform(command);
        }) === 0) {
          GT.tam.log.info('No commands related found.');
          return;
        }
        linked = GT.tam.link(report, that.assets.www);
        fs.writeFileSync(that.assets.linked, JSON.stringify(linked));

        function forInCommands(fn) {
          var i = 0;
          for (var pkgName in report) {
            report[pkgName].commands.forEach(function (command) {
              if (command.files.indexOf(file) >= 0) {
                i++;
                fn(command, pkgName);
              }
            });
          }
          return i;
        }
      }

    }
  }
};

module.exports = function (gulp, tam) {
  GT.gulp = gulp;
  GT.tam = tam;
  return GT.load;
};
