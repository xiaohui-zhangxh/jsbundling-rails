say "Install esbuild with config"
copy_file "#{__dir__}/esbuild.config.js", "esbuild.config.js"
run "yarn add esbuild"
run "yarn add -D glob"
say "Add stimulus autoloader"
copy_file "#{__dir__}/stimulus_autoloader.js", "app/javascript/controllers/index.js"

say "Add build script"
run %(npm set-script build "node esbuild.config.js")
