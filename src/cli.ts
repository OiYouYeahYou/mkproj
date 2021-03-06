import program from './program'
import co from 'co'
import { Config } from '.'
import { prompt } from './prompts'
import { nameValidator, licenseValidator } from './validators'
import { join } from 'path'
import { makeProject } from './makeProject'
import { randomName } from './name'
import {
	trim,
	removeDoubleWhitespace,
	replaceSpaceWithDash,
} from './util/stringOperators'
import { piper } from './util/piper'

require('./name')

co(function*() {
	const config: Config = yield makeConfig()

	if (!program.dry) yield makeProject(config)
	else console.log(config)
})
	.catch(e => console.log(e))
	.then(() => process.exit())

function* makeConfig(): Iterable<Config> {
	const name = yield prompt({
		key: 'project-name',
		prompt: 'Project name',
		validator: nameValidator,
		defaultValueMaker: randomName,
		sanitiser: piper(trim, removeDoubleWhitespace, replaceSpaceWithDash),
	})
	const license = yield prompt({
		key: 'license',
		validator: licenseValidator,
	})
	const user = yield prompt({ key: 'user' })
	const description = yield prompt({ key: 'info' })
	const dependencies = yield prompt({ key: 'dependencies' })

	const target = join(process.cwd(), name)

	const pkg = pkgMaker(user, name, description, license)

	return {
		name,
		license,
		target,
		description,
		pkg,
		dependencies,
		user,
	}
}

function pkgMaker(
	user: string,
	name: string,
	description: string,
	license: string
) {
	return {
		name,
		description,
		license,

		version: '0.0.0',
		main: 'lib/index.js',
		script: {
			postinstall: '',
			lint:
				'prettier ./src/*.ts --write && tslint --fix -p ./tsconfig.json',
			dev: 'nodemon -e .ts --exec gulp',
		},
		dependencies: {},
		repository: {
			type: 'git',
			url: `git+https://github.com/${user}/${name}.git`,
		},
		bugs: {
			url: `https://github.com/${user}/${name}/issues`,
		},
		homepage: `https://github.com/${user}/${name}#readme`,
		devDependencies: {
			'@types/dotenv': '^4.0.3',
			'@types/node': '^4.0.42',
			del: '^3.0.0',
			gulp: '^3.9.1',
			'gulp-sourcemaps': '^2.6.4',
			'gulp-tslint': '^8.1.3',
			'gulp-typescript': '^4.0.2',
			tslint: '^5.9.1',
			typescript: '^2.8.3',
		},
	}
}
