#!/usr/bin/env node
require('source-map-support').install()

import RC from './rc'

export const cfg = new RC()

export interface Config {
	[key: string]: any
	target?: string
	name?: string
	license?: string
	description?: string
	dependencies?: string
	pkg?: {}
}
