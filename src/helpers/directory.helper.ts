// IMPORTS
import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { Directory } from '../classes/Interfaces'

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

// FUNCTION
export const searchFile = ( path: string, name: string ): Directory[] => {

	const found: Directory[] = []

	name = name.toLowerCase()
	name = name.replace( /[ ]/gm, '' )

	const items = readdirSync( path, { withFileTypes: true } )

	for ( const item of items ) {

		const stats = statSync( join( path, item.name ) )

		let itemName = item.name
		itemName = itemName.toLowerCase()
		itemName = itemName.replace( / /gm, '' )

		if ( itemName.indexOf( name ) >= 0 ) found.push( {
			name: join( path, item.name ),
			isDir: stats.isDirectory(),
			size: stats.isDirectory() ? null : stats.size,
		} )

		if ( !item.isDirectory() ) continue

		found.push( ...searchFile( join( path, item.name ), name ) )

	}

	return found

}
