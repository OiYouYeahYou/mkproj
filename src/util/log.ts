import { cfg } from '..'
import program from '../program'

export function log(...params: any[]) {
	if (cfg.config.verbose || program.verbose) console.log(...params)
}
