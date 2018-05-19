export function piper<T>(handlers: ((value: T) => T)[]): (value: T) => T {
	return function(value: T) {
		let r = value

		for (const handler of handlers) {
			r = handler(r)
		}

		return r
	}
}
