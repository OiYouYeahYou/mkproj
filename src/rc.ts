import { join } from 'path'
import { homedir } from 'os'
import { existsSync, readFileSync } from 'fs'
import { Config } from '.'
import program from './program'

export default class RC {
	public config: Config

	constructor(home = homedir()) {
		const dir = join(home, '.mkprojrc')

		this.config = existsSync(dir)
			? JSON.parse(readFileSync(dir).toString())
			: {}
	}

	checkPreExistingData(key: string): DataFetcher {
		if (key in program && typeof program[key] !== 'string')
			return {
				isArgument: true,
				preExistingValue: program[key],
			}

		if (key in this.config)
			return {
				isConfig: true,
				preExistingValue: this.config[key],
			}

		return {
			isBlank: true,
			preExistingValue: null,
		}
	}
}

interface DataFetcher {
	preExistingValue: string
	isArgument?: true
	isConfig?: true
	isBlank?: true
}
