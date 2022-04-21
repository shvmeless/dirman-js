// IMPORTS
import { calculateDirSize } from './helpers/directory.helper'
import { byteFormatter } from './helpers/formatting.helper'
import { BOLD, RESET, WHITE } from './utils/styles'
import { Argument, program } from 'commander'
import { existsSync } from 'fs'
import { resolve } from 'path'

// ARGUMENTS
const args = { path: new Argument( '[path]', 'Path of the directory to calculate the size.' ).default( '.', 'Current location.' ) }

// PROGRAM
program
	.description( 'Displays the total size of the specified directory.' )
	.addArgument( args.path )
	.action( ( path ) => {

		try {

			path = resolve( process.cwd(), path )

			if ( !existsSync( path ) ) {
				process.stdout.write( `No such file or directory!` )
				process.exit( 1 )
			}

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
