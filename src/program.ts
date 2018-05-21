import program = require('commander')

const ownPackage = require('../package.json')

export default program
	.version(ownPackage.version)
	.arguments('<file>')
	.option('-D, --dry', 'Make config, but do not act')
	.option('-v, --verbose', 'Verbosity')
	.option('-i, --indent <indent>', 'Indentation to use')
	.option('-n, --name <project-name>', '')
	.option('-d, --description <info>', '')
	.option('-l, --license <license>', '')
	.parse(process.argv)
