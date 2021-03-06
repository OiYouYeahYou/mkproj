// https://gist.github.com/afriggeri/1266756#gistcomment-2087686

// prettier-ignore
const adjs = [
	'autumn', 'hidden', 'bitter', 'misty', 'silent', 'empty', 'dry', 'dark',
	'summer', 'icy', 'delicate', 'quiet', 'white', 'cool', 'spring', 'winter',
	'patient', 'twilight', 'dawn', 'crimson', 'wispy', 'weathered', 'blue',
	'billowing', 'broken', 'cold', 'damp', 'falling', 'frosty', 'green',
	'long', 'late', 'lingering', 'bold', 'little', 'morning', 'muddy', 'old',
	'red', 'rough', 'still', 'small', 'sparkling', 'wobbling', 'shy',
	'wandering', 'withered', 'wild', 'black', 'young', 'holy', 'solitary',
	'fragrant', 'aged', 'snowy', 'proud', 'floral', 'restless', 'divine',
	'polished', 'ancient', 'purple', 'lively', 'nameless',
]

// prettier-ignore
const nouns = [
	'waterfall', 'river', 'breeze', 'moon', 'rain', 'wind', 'sea', 'morning',
	'snow', 'lake', 'sunset', 'pine', 'shadow', 'leaf', 'dawn', 'glitter',
	'forest', 'hill', 'cloud', 'meadow', 'sun', 'glade', 'bird', 'brook',
	'butterfly', 'bush', 'dew', 'dust', 'field', 'fire', 'flower', 'firefly',
	'feather', 'grass', 'haze', 'mountain', 'night', 'pond', 'darkness',
	'snowflake', 'silence', 'sound', 'sky', 'shape', 'surf', 'thunder',
	'violet', 'water', 'wildflower', 'wave', 'water', 'resonance', 'sun',
	'wood', 'dream', 'cherry', 'tree', 'fog', 'frost', 'voice', 'paper',
	'frog', 'smoke', 'star',
]

const random = high => Math.floor(Math.random() * high)

export function randomName() {
	const adj = adjs[random(adjs.length)]
	const noun = nouns[random(nouns.length)]
	const num = random(1000) + 1

	return `${adj}-${noun}-${num}`
}
