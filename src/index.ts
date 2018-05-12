#!/usr/bin/env node
import co from 'co'
import * as prompt from 'co-prompt'
import * as program from 'commander'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import git = require('simple-git/promise')
import { resolve } from 'dns'
import { spawnSync } from 'child_process'

program
	.arguments('<file>')
	.option('-d, --dry', "Make config, mut don't act")
	.option('-i, --indent <indent>', 'Indentation to use')
	.parse(process.argv)

co(function*() {
	const name = yield prompt('Project name: ')
	const target = join(process.cwd(), name)
	const exists = existsSync(target)

	if (exists) {
		console.log('folder already exists')
		return process.exit()
	}

	const license = yield prompt('license: ')
	const user = yield prompt('user: ')
	const description = yield prompt('description: ')
	const dependencies = yield prompt('dependencies: ')

	const pkg = {
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

	const publishResponse = yield prompt('publish: ')
	const publish = publishResponse == 'y' || publishResponse == 'yes'
	const commitResponse = yield prompt('commit: ')
	const commit = commitResponse == 'y' || commitResponse == 'yes'

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

	if (!program.dry) yield act(config)
	else console.log(config)

	process.exit()
})

function* act(config: config) {
	const { target, license, name, description, pkg, dependencies } = config

	mkdirSync(target)
	process.chdir(target)
	const repo = git(target)
	// @ts-ignore untyped method
	yield repo.init()

	// "npm init"
	writeJSON(join(target, 'package.json'), pkg)

	safeSpawn(`github open ${target}`, 'failed to open github')
	safeSpawn('npm i', 'failed to install')

	if (dependencies)
		safeSpawn(
			`npm i ${dependencies}`,
			'failed to install additional dependencies'
		)

	writeJSON(join(target, '.mkproj'), config)
}

function writeJSON(filename: string, data: any) {
	const json = JSON.stringify(data, undefined, program.indent || '\t')
	writeFileSync(filename, json)
}

function safeSpawn(command: string, errorMessage: string) {
	try {
		spawnSync(command)
	} catch (e) {
		console.log(errorMessage)
	}
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
