// IMPORTS
import { BorderUserConfig, ColumnUserConfig, DrawHorizontalLine, getBorderCharacters, SpanningCellConfig, table } from 'table'

// CLASS
class Table {

	// ATTRIBUTES
	private table: string[][]
	private border: BorderUserConfig
	private columns: ColumnUserConfig[]
	private spanningCells: SpanningCellConfig[]
	private drawHorizontalLine: DrawHorizontalLine

	// CONSTRUCTOR
	constructor () {
		this.table = []
		this.border = {}
		this.columns = []
		this.spanningCells = []
		this.drawHorizontalLine = (): boolean => false
	}

	// SETTER
	public setBorder ( border: string ): void { this.border = getBorderCharacters( border ) }
	public addColumn ( column: ColumnUserConfig ): void { this.columns.push( column ) }
	public addSpanning ( cell: SpanningCellConfig ): void { this.spanningCells.push( cell ) }
	public setHorizontalLine ( func: DrawHorizontalLine ): void { this.drawHorizontalLine = func }

	// GETTER
	public getBorder (): BorderUserConfig { return this.border }
	public getColumn (): ColumnUserConfig[] { return this.columns }
	public getSpanning (): SpanningCellConfig[] { return this.spanningCells }
	public getHorizontalLine (): DrawHorizontalLine { return this.drawHorizontalLine }
	public getTable (): string[][] { return this.table }

	// METHOD
	public addRow ( row: string[] ): void {

		this.table.push( row )

	}

	// METHOD
	public output (): string {

		return table( this.table, {
			border: this.border,
			columns: this.columns,
			spanningCells: this.spanningCells,
			drawHorizontalLine: this.drawHorizontalLine,
		} )

	}

}

// EXPORT
export default Table
