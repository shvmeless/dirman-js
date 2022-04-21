
// FUNCTION
export function byteFormatter ( bytes: number ): string {

	let decorator = 'B'

	if ( bytes > 1024 ) {
		bytes /= 1024
		decorator = 'kB'
	}

	if ( bytes > 1024 ) {
		bytes /= 1024
		decorator = 'MB'
	}

	if ( bytes > 1024 ) {
		bytes /= 1024
		decorator = 'GB'
	}

	return `${ Math.round( bytes * 10 ) / 10 } ${ decorator }`

}
