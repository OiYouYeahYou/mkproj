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
	.option('-i, --indent', 'Indentation to use')
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
	const description = yield prompt('description: ')

	const config: config = { name, license, target, description }

	if (!program.dry) yield act(config)
	else console.log(config)

	process.exit()
})

function* act(config: config) {
	const { target, license, name, description } = config
	mkdirSync(target)
	const repo = git(target)
	// @ts-ignore untyped method
	yield repo.init()

	const pkg = {
		name,
		description,
		license,
		version: '0.0.0',
		main: 'lib/index.js',
		script: {},
		dependencies: {},
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

	writeJSON(join(target, 'package.json'), pkg)
	writeJSON(join(target, '.mkproj'), config)

	try {
		spawnSync(`github open ${target}`)
	} catch (e) {
		console.log('failed to open github')
	}
}

function writeJSON(filename: string, data: any) {
	const json = JSON.stringify(data, undefined, program.indent || '\t')
	writeFileSync(filename, json)
}

interface config {
	[key: string]: any
	name: string
	license: string
	description: string
}
