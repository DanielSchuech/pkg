const {Transform} = require('stream');

export function transformPackageJson (filename, config) {
  const isPackageJson = filename.indexOf('package.json') > -1;
  const hasExtReplace = config && config.extensionReplacements;

  return new Transform({
    objectMode: true,
    transform: (data, _, done) => {
      if (!isPackageJson || !hasExtReplace) {
        done(null, data)
      } else {
        try {
          let parsedPackageJson = JSON.parse(data.toString());
          config.extensionReplacements.forEach(([ from, to ]) => {
            parsedPackageJson.main = parsedPackageJson.main &&
              parsedPackageJson.main.replace(from, '');
          });
          done(null, Buffer.from(JSON.stringify(parsedPackageJson), 'utf8'));
        } catch(e) {
          console.error('Error parsing ', file, e);
          done('Error parsing ' + file, data);
        }
      }
    }
  })
}
