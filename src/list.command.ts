// IMPORTS
import { Argument, Option, program } from 'commander'
import DirManager from './classes/DirManager'
import { resolve } from 'path'

// ARGUMENTS
const args = { path: new Argument( '[path]', 'The path to the directory where the files will be displayed.' ).default( '.', 'Current location.' ) }

// OPTIONS
const options = {
	creation: new Option( '-c, --creation', 'Show the creation date.' ),
	update: new Option( '-u, --update', 'Show the modification date.' ),
	size: new Option( '-s, --size', 'Show the directory size.' ),
}

// PROGRAM
program
	.description( 'Generates a list of all items found within the specified directory.' )
	.addArgument( args.path )
	.addOption( options.creation )
	.addOption( options.update )
	.addOption( options.size )
	.action( ( path, options ) => {

		const { creation, update, size } = options

		path = resolve( process.cwd(), path )

		const dirManager = DirManager.create( path, creation, update, size )

		if ( !dirManager ) {
			console.log( 'ERROR: No such file or directory!' )
			process.exit( 1 )
		}

		process.stdout.write( dirManager.toTable() )

		process.exit( 0 )

	} )

// RUN
program.parse()
