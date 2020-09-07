_prepublish_: Run BEFORE the package is packed and published, as well as on local npm install without any arguments. (See below)
_prepare_: Run both BEFORE the package is packed and published, and on local npm install without any arguments (See below). This is run AFTER prepublish, but BEFORE prepublishOnly.
_prepublishOnly_: Run BEFORE the package is prepared and packed, ONLY on npm publish. (See below.)
_prepack_: run BEFORE a tarball is packed (on npm pack, npm publish, and when installing git dependencies)
_postpack_: Run AFTER the tarball has been generated and moved to its final destination.
_publish, postpublish_: Run AFTER the package is published.
_preinstall_: Run BEFORE the package is installed
_install, postinstall_: Run AFTER the package is installed.
_preuninstall, uninstall_: Run BEFORE the package is uninstalled.
_postuninstall_: Run AFTER the package is uninstalled.
_preversion_: Run BEFORE bumping the package version.
_version_: Run AFTER bumping the package version, but BEFORE commit.
_postversion_: Run AFTER bumping the package version, and AFTER commit.
_pretest, test, posttest_: Run by the npm test command.
_prestop, stop, poststop_: Run by the npm stop command.
_prestart, start, poststart_: Run by the npm start command.
_prerestart, restart, postrestart_: Run by the npm restart command. Note: npm restart will run the stop and start scripts if no restart script is provided.
_preshrinkwrap, shrinkwrap, postshrinkwrap_: Run by the npm shrinkwrap command.

lint
postinstall
start
prestart - gulp
