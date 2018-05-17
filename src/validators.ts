import { join } from 'path'
import { existsSync } from 'fs'

export interface Validationinfo {
	isValid: boolean
	message?: string
}

export function nameValidator(value): Validationinfo {
	if (typeof value !== 'string')
		return { isValid: false, message: 'is not a string' }

	if (!value.length) return { isValid: false, message: 'is blank' }

	const target = join(process.cwd(), value)
	const exists = existsSync(target)

	if (exists)
		return {
			isValid: false,
			message: 'folder already exists',
		}

	return { isValid: true }
}

export function licenseValidator(value: string): Validationinfo {
	return {
		isValid: true,
	}
}
