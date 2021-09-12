const glob  = require('glob').sync

// thanks: https://github.com/thomaschaaf/esbuild-plugin-import-glob
const ImportGlobPlugin = () => ({
  name: 'require-context',
  setup: (build) => {
    build.onResolve({ filter: /\*/ }, async (args) => {
      console.log('resolveDir', args.resolveDir)
      if (args.resolveDir === '') {
        return; // Ignore unresolvable paths
      }
      console.log('path', args.path)
      return {
        path: args.path,
        namespace: 'import-glob',
        pluginData: {
          resolveDir: args.resolveDir,
        },
      };
    });

    build.onLoad({ filter: /.*/, namespace: 'import-glob' }, async (args) => {
      const files = (
        glob(args.path, {
          cwd: args.pluginData.resolveDir,
        })
      ).sort();

      let importerCode = `
        ${files
          .map((module, index) => `import * as module${index} from './${module}'`)
          .join(';')}
        export default [${files
          .map((module, index) => `module${index}.default`)
          .join(',')}];
        export const context = {
          ${files.map((module, index) => `'${module}': module${index}.default`).join(',')}
        }
      `;

      return { contents: importerCode, resolveDir: args.pluginData.resolveDir };
    });
  },
});

require('esbuild').build({
  entryPoints: glob('./app/javascript/*.js'),
  bundle: true,
  outdir: 'app/assets/builds',
  watch: true,
  logLevel: 'info',
  plugins: [
    ImportGlobPlugin()
  ]
}).catch(() => process.exit(1))
