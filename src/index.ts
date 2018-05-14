#!/usr/bin/env node
require('source-map-support').install()

import co from 'co'
import * as coPrompt from 'co-prompt'
import * as program from 'commander'
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import git = require('simple-git/promise')
import { resolve } from 'dns'
import { execSync } from 'child_process'
import { compile } from 'handlebars'

const ownPackage = require('../package.json')

const rc = {
	verbose: true,
	publish: false,
	commit: false,
	info: 'This is temporary description',
	license: 'MIT',
	user: 'OiYouYeahYou',
}

program
	.version(ownPackage.version)
	.arguments('<file>')
	.option('-D, --dry', "Make config, mut don't act")
	.option('-v, --verbose', 'Verbosity')
	.option('-p, --publish', 'Publish')
	.option('-c, --verbose', 'commit')
	.option('-i, --indent <indent>', 'Indentation to use')
	.option('-n, --name <project-name>', '')
	.option('-d, --description <info>', '')
	.option('-l, --license <license>', '')
	.parse(process.argv)

co(function*() {
	const config: config = yield makeConfig()

	if (!program.dry) yield act(config)
	else console.log(config)
})
	.catch(e => {
		console.log(e)
	})
	.then(() => process.exit())

function makeConfig(): Promise<config> {
	return co(function*() {
		const name = yield prompt('project-name', nameValidator)
		const license = yield prompt('license')
		const user = yield prompt('user')
		const description = yield prompt('info')
		const dependencies = yield prompt('dependencies')
		const publish = yield boolPrompt('publish')
		const commit = yield boolPrompt('commit')

		const target = join(process.cwd(), name)

		const pkg = pkgMaker(user, name, description, license)
		const config: config = {
			name,
			license,
			target,
			description,
			pkg,
			publish,
			commit,
			dependencies,
			user,
		}

		return config
	})
}

function nameValidator(value): validationinfo {
	if (typeof value !== 'string') return [false, 'is not a string']
	if (!value.length) return [false, 'is blank']
	const target = join(process.cwd(), value)
	const exists = existsSync(target)
	return [!exists, 'folder already exists']
}

async function act(config: config) {
	const { target, license, name, description, pkg, dependencies } = config

	log(`making directory: ${target}`)
	mkdirSync(target)
	mkdirSync(target + 'src')
	process.chdir(target)
	const repo = git(target)
	// @ts-ignore untyped method
	await repo.init()

	// "npm init"
	writeJSON(join(target, 'package.json'), pkg, 2)
	writeJSON(join(target, '.mkproj'), config)

	makefile('README.md', '.', config)
	makefile('.prettierrc', '.', config)
	makefile('.gitignore', '.', config)

	const npm = 'npm i' + (dependencies ? ` && npm i ${dependencies}` : '')
	safeExec(npm, 'failed to npm install')

	safeExec(`code ${target}`, 'failed to open VS Code')
	safeExec(`github open ${target}`, 'failed to open github')
}

function writeJSON(filename: string, data: any, indent?: number | '\t') {
	const space = indent || program.indent || '\t'
	const json = JSON.stringify(data, undefined, space)
	log(`Writting ${filename}`)
	writeFileSync(filename, json)
}

function safeExec(command: string, errorMessage: string) {
	log(`calling ${command}`)
	try {
		execSync(command, { stdio: 'ignore' })
	} catch (e) {
		console.log(errorMessage)
		log(e)
	}
}

type validationFn = (value: string) => validationinfo
type validationinfo = [boolean, string]

function prompt(key: string, validator?: validationFn): Promise<string> {
	return co(function*() {
		const [isByArg, isByRC, preValue] = checkPreExistingData(key)

		if (isByArg) {
			return preValue
		}

		while (true) {
			const defaultInfo = isByRC ? ` [${preValue}]` : ''
			const promptResult = yield coPrompt(`${key}${defaultInfo}: `)
			const value = processPromptValue(promptResult, isByRC, preValue)

			if (callValidator(validator, value)) return value
		}
	})
}

function callValidator(validator: validationFn, value: string): boolean {
	if (typeof validator !== 'function') return true
	const [valid, message] = validator(value)
	if (!valid) console.log(message)
	return valid
}

function processPromptValue(
	value: string,
	present: boolean,
	preExistingValue: string
) {
	if (value) return value
	return present ? preExistingValue : ''
}

function* boolPrompt(key: string) {
	const [present, pre] = checkPreExistingData(key)
	if (present) return pre

	const yes = ['y', 'yes']
	const no = ['n', 'no']

	while (true) {
		const input = (yield coPrompt(key + ' (y/n):')).toLowerCase()
		if (yes.indexOf(input) !== -1) return true
		if (no.indexOf(input) !== -1) return false
	}
}

function checkPreExistingData(key: string): [boolean, boolean, any] {
	if (key in program && typeof program[key] !== 'string') {
		return [true, false, program[key]]
	}

	if (key in rc) {
		return [true, true, rc[key]]
	}

	return [false, false, null]
}

function makefile(sourceName: string, destination?: string, config?: config) {
	const sourcePath = join(__dirname, '../assets', sourceName)
	const destinationPath = join(process.cwd(), destination || '', sourceName)

	const content = readFileSync(sourcePath).toString()
	const result = compile(content)(config)

	log(`writing ${sourcePath} to ${destinationPath}`)
	writeFileSync(destinationPath, result)
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
			lint: '',
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

function log(...params: any[]) {
	if (rc.verbose || program.verbose) console.log(...params)
}

interface config {
	[key: string]: any
	target: string
	name: string
	license: string
	description: string
	dependencies: string
	pkg: {}
}
