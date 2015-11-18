var fs = require('fs-extra');

var GT = {
  load: assetsPath => ({
    GT: GT,
    assetsPath: assetsPath,
    assets: GT.getAssets(assetsPath),
    clean: GT.tasks.clean,
    build: GT.tasks.build,
    watch: GT.tasks.watch
  }),
  getAssets: assetsPath => GT.tam.fillAssets(GT.tam.read(assetsPath), {}),
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
    watch: require('./lib/watcher')
  }
};

module.exports = (gulp, tam) =>
  (GT.gulp = gulp) &&
  (GT.tam = tam) &&
  GT.load;
