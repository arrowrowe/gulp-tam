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

      GT.gulp.watch([
        this.assetsPath,
        this.assets.src + '/**/*'
      ], function (event) {
        GT.tam.log.trace('File [%s] was "%s".', event.path, event.type);
        if (assetsPathReal === fs.realpathSync(event.path)) {
          that.assets = GT.getAssets(that.assetsPath);
          that.build();
        } else {
          rebuild(event.path);
        }
      });

      function rebuild(file) {
        // TODO: rebuild necessary commands and relink.
        GT.tam.log.info('File [%s] needs rebuilding.', file);
      }
    }
  }
};

module.exports = function (gulp, tam) {
  GT.gulp = gulp;
  GT.tam = tam;
  return GT.load;
};
