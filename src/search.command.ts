// IMPORTS
import { Argument, program } from 'commander'
import { existsSync } from 'fs'
import { resolve } from 'path'
import Table from './classes/Table'
import { searchFile } from './helpers/directory.helper'
import { byteFormatter } from './helpers/formatting.helper'
import { BOLD, RESET, WHITE } from './utils/styles'

// ARGUMENTS
const args = {
	path: new Argument( '[path]', 'Set the directory to search.' ).default( '.', 'Current location.' ),
	name: new Argument( '<name>', 'The name of the directory or file.' ),
}

// PROGRAM
program
	.description( 'Lists the directories and files found in the specified location.' )
	.addArgument( args.path )
	.addArgument( args.name )
	.action( ( path, name ) => {

		path = resolve( process.cwd(), path )
		if ( !existsSync( path ) ) {
			process.stdout.write( `No such file or directory!` )
			process.exit( 1 )
		}

		try {

			const found = searchFile( path, name )

			const table = new Table()

			const headers: string[] = []

			table.addColumn( { alignment: 'center' } )
			headers.push( `${ WHITE }${ BOLD }SIZE${ RESET }` )

			table.addColumn( { alignment: 'left' } )
			headers.push( `${ WHITE }${ BOLD }NAME${ RESET }` )

			table.addRow( headers )

			found.forEach( ( dir ) => {

				const row = []

				if ( dir.size !== undefined ) row.push( dir.size === null ? '' : byteFormatter( dir.size ) )
				row.push( dir.name )

				table.addRow( row )

			} )

			table.setBorder( 'norc' )
			table.setHorizontalLine( ( index, rows ) => {
				return index === 0 || index === 1 || index === rows
			} )

			// console.log( table.getTable() )
			process.stdout.write( table.output() )

		} catch ( error ) {
			process.stdout.write( `Unexpected error!` )
			process.exit( 1 )
		}

	} )

// RUN
program.parse()
