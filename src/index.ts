#!/usr/bin/env node
import * as co from 'co'
import * as prompt from 'co-prompt'
import * as program from 'commander'
import { existsSync } from 'fs'
import { join } from 'path'

program
	// .arguments( '<file>' )
	.option('-u, --username <username>', 'The user to authenticate as')
	.option('-p, --password <password>', "The user's password")
	.action(function() {
		co(function*() {
			const name = yield prompt('Project name: ')

			if (existsSync(join(__dirname, name))) {
				console.log('folder already exists')
				return process.exit()
			}
		})

		process.exit()
	})
	.parse(process.argv)
