import { cfg } from '.'
import * as coPrompt from 'co-prompt'
import { Validationinfo } from './validators'

type validationFn = (value: string) => Validationinfo
type defaultGenerator = () => string

interface PromptConfig {
	key: string
	prompt: string
	validator?: validationFn
	defaultValueMaker?: defaultGenerator
}

export function* prompt({
	key,
	validator,
	prompt,
	defaultValueMaker,
}: PromptConfig): Iterable<string> {
	const { preExistingValue, isConfig, isArgument } = cfg.checkPreExistingData(
		key
	)

	if (isArgument) {
		return preExistingValue
	}

	while (true) {
		const defaultValue =
			typeof defaultValueMaker === 'function'
				? defaultValueMaker()
				: undefined
		const defaultInfo =
			isConfig || defaultValue
				? ` [${defaultValueMaker || preExistingValue}]`
				: ''
		const promptString = `${prompt || key}${defaultInfo}: `
		const promptResult = yield coPrompt(promptString)
		const value = processPromptValue(
			promptResult,
			isConfig,
			preExistingValue
		)

		if (callValidator(validator, value)) return value
	}
}

export function* boolPrompt(key: string): Iterable<boolean> {
	const { preExistingValue, isArgument, isConfig } = cfg.checkPreExistingData(
		key
	)

	if (isArgument) {
		return Boolean(preExistingValue)
	}

	const yes = ['y', 'yes']
	const no = ['n', 'no']

	while (true) {
		const defaultInfo = isConfig ? `[${preExistingValue ? 'y' : 'n'}]` : ''
		const promptMessage = `${key} (y/n)${defaultInfo}:`
		const input = (yield coPrompt(promptMessage)).toLowerCase()

		if (!input && isConfig) {
			return Boolean(preExistingValue)
		}

		if (yes.indexOf(input) !== -1) {
			return true
		}

		if (no.indexOf(input) !== -1) {
			return false
		}
	}
}

function processPromptValue(
	value: string,
	present: boolean,
	preExistingValue: string
) {
	if (value) return value
	return present ? preExistingValue : ''
}

function callValidator(validator: validationFn | void, value: string): boolean {
	if (typeof validator !== 'function') return true
	const { isValid, message } = validator(value)
	if (!isValid) console.log(message)
	return isValid
}
