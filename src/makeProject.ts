import program from './program'
import { log } from './util/log'
import { writeFileSync, readFileSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { join } from 'path'
import { compile } from 'handlebars'
import git = require('simple-git/promise')
import { Config } from '.'

export async function makeProject(config: Config) {
	const { target, pkg, dependencies } = config

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

function makefile(sourceName: string, destination?: string, config?: Config) {
	const sourcePath = join(__dirname, '../assets', sourceName)
	const destinationPath = join(process.cwd(), destination || '', sourceName)

	const content = readFileSync(sourcePath).toString()
	const result = compile(content)(config)

	log(`writing ${sourcePath} to ${destinationPath}`)
	writeFileSync(destinationPath, result)
}
