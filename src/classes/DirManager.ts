// IMPORTS
import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { Directory } from './Interfaces'

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

}

// EXPORT
export default DirManager
