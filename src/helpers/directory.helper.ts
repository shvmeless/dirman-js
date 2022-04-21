// IMPORTS
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

// FUNCTION
export const calculateDirSize = ( path: string ): number => {

	let size = 0

	const stats = statSync( path )

	if ( stats.isFile() ) return stats.size
	else if ( !stats.isDirectory() ) return 0

	const items = readdirSync( path, { withFileTypes: true } )

	items.forEach( ( item ) => {
		size += calculateDirSize( join( path, item.name ) )
	} )

	return size

}
