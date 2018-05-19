export const removeDoubleWhitespace = (value: string) =>
	value.replace(/\s\s/g, ' ')
export const replaceSpaceWithDash = (value: string) => value.replace(/\s/g, '-')
export const trim = (value: string) => value.trim()
