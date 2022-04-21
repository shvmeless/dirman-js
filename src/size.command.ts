// IMPORTS
import { Argument, program } from 'commander'
import { existsSync } from 'fs'
import { resolve } from 'path'
import { calculateDirSize } from './helpers/directory.helper'
import { byteFormatter } from './helpers/formatting.helper'
import { BOLD, RESET, WHITE } from './utils/styles'

// ARGUMENTS
const args = { path: new Argument( '[path]', 'Set the directory to search.' ).default( '.', 'Current location.' ) }

// PROGRAM
program
	.description( 'Lists the directories and files found in the specified location.' )
	.addArgument( args.path )
	.action( ( path ) => {

		path = resolve( process.cwd(), path )
		if ( !existsSync( path ) ) {
			process.stdout.write( `No such file or directory!` )
			process.exit( 1 )
		}

		try {

			const size = calculateDirSize( path )
			process.stdout.write( `\n${ WHITE }${ BOLD }DIRECTORY: ${ RESET }${ path }` )
			process.stdout.write( `\n${ WHITE }${ BOLD }SIZE: ${ RESET }${ byteFormatter( size ) }\n` )

		} catch ( error ) {
			process.stdout.write( `Unexpected error!` )
			process.exit( 1 )
		}

	} )

// RUN
program.parse()
