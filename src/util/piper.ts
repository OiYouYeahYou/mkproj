export function piper<T>(...handlers: ((value: T) => T)[]): (value: T) => T {
	return value =>
		handlers.reduce(
			(previousValue, handler) => handler(previousValue),
			value
		)
}
