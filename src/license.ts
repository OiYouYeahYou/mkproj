import { join } from 'path'
import { existsSync } from 'fs'
import { piper } from './util/piper'
import {
	removeDoubleWhitespace,
	replaceSpaceWithDash,
} from './util/stringOperators'

const licenseFolder = '../choosealicense.com/_licenses'

interface IFrontMatterResult<T> {
	readonly attributes: T
	readonly body: string
}

interface IChooseALicense {
	readonly title: string
	readonly nickname?: string
	readonly featured?: boolean
	readonly hidden?: boolean
}

export interface ILicense {
	readonly name: string
	readonly featured: boolean
	readonly body: string
	readonly hidden: boolean
}

type frontMatter = <T>(path: string) => IFrontMatterResult<T>
const frontMatter: frontMatter = require('front-matter')

export function getLicense(name: string) {
	const saneName = piper(removeDoubleWhitespace, replaceSpaceWithDash)(name)
	const path = join(licenseFolder, name + '.txt')
	if (!existsSync(path)) {
		console.log(saneName)
		return // nothing found
	}

	const result = frontMatter<IChooseALicense>(path)
	return result
}
