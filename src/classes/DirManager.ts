// IMPORTS
import { readdirSync, statSync } from 'fs'
import { Directory } from './Interfaces'
import { join } from 'path'
import Table from './Table'

// CLASS
class DirManager {

	// ATTRIBUTES
	private path: string
	private directories: Directory[]
	private showCreation: boolean
	private showUpdate: boolean
	private showSize: boolean

	// CONSTRUCTOR
	private constructor () {
		this.path = ''
		this.directories = []
		this.showCreation = false
		this.showUpdate = false
		this.showSize = false
	}

	// GETTERS
	public getPath (): string { return this.path }
	public getDirectories (): Directory[] { return this.directories }
	public getFolders (): Directory[] { return this.directories.filter( ( dir ) => dir.isDir ) }
	public getFiles (): Directory[] { return this.directories.filter( ( dir ) => !dir.isDir ) }

	// METHOD
	public static create ( path: string, showCreation: boolean, showUpdate: boolean, showSize: boolean ): DirManager | null {

		const dirManager = new DirManager()

		dirManager.path = path
		dirManager.showCreation = showCreation
		dirManager.showUpdate = showUpdate
		dirManager.showSize = showSize

		dirManager.searchDirectories()
		dirManager.sortByName()

		return dirManager

	}

	// METHOD
	private searchDirectories (): void {

		try {

			const directory = statSync( this.path )
			if ( !directory.isDirectory() ) return

			const innerDirs = readdirSync( this.path )

			this.directories = innerDirs.map( ( name ): Directory => {

				const stats = statSync( join( this.path, name ) )

				return {
					name: name,
					isDir: stats.isDirectory(),
					size: !this.showSize ? undefined : stats.size === 0 ? null : stats.size,
					creation: this.showCreation ? stats.birthtime : undefined,
					update: this.showUpdate ? stats.mtime : undefined,
				}

			} )

		} catch { this.directories = [] }

	}

	// METHOD
	public sortByName (): void {

		const directories = this.getFolders()
		const files = this.getFiles()

		directories.sort( ( a, b ) => {
			return a.name.localeCompare( b.name )
		} )

		files.sort( ( a, b ) => {
			return a.name.localeCompare( b.name )
		} )

		this.directories = [...directories, ...files]

	}

	// METHOD
	public toTable (): string {

		const table = new Table()

		const headers: string[] = []

		if ( this.showCreation ) {
			table.addColumn( { alignment: 'left' } )
			table.addSpanning( { colSpan: 1, col: table.getSpanning().length, row: 0, alignment: 'center' } )
			headers.push( `CREATION` )
		}

		if ( this.showUpdate ) {
			table.addColumn( { alignment: 'left' } )
			table.addSpanning( { colSpan: 1, col: table.getSpanning().length, row: 0, alignment: 'center' } )
			headers.push( `UPDATE` )
		}

		if ( this.showSize ) {
			table.addColumn( { alignment: 'right' } )
			table.addSpanning( { colSpan: 1, col: table.getSpanning().length, row: 0, alignment: 'center' } )
			headers.push( `SIZE` )
		}

		table.addColumn( { alignment: 'left' } )
		table.addSpanning( { colSpan: 1, col: table.getSpanning().length, row: 0, alignment: 'center' } )
		headers.push( `NAME` )

		table.addRow( headers )

		this.directories.forEach( ( dir ) => {

			const row = []

			if ( dir.creation ) row.push( dir.creation.toLocaleString() )
			if ( dir.update ) row.push( dir.update.toLocaleString() )
			if ( dir.size !== undefined ) row.push( dir.size === null ? '' : dir.size.toString() )
			row.push( dir.name )

			table.addRow( row )

		} )

		table.setBorder( 'norc' )
		table.setHorizontalLine( ( index, rows ) => {
			return index === 0 || index === 1 || index === rows
		} )
		const output = table.output()
		return output

	}

}

// EXPORT
export default DirManager
