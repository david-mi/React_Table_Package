import type { Column } from "../../types"
import type { MouseEvent } from "react"
import type { SortState } from "../../hooks/useTable/useTable"
import SortIcon from "./SortIcon/SortIcon"

enum SORT_SWITCH {
  NONE = "ASC",
  ASC = "DESC",
  DESC = "NONE",
}

interface Props<T extends string> {
  columns: Column<T>[]
  sort: SortState<T>
  handleSort: (sort: SortState<T>) => void
}

/** Display column heading */

function Thead<T extends string>({ columns, handleSort, sort }: Props<T>) {

  /**
   * Gets called when clicking on one column head
   * 
   * - Update {@link sort} state
   * - If clicked head column differs from the previous clicked one, set sort type to ascending
   * - else, define sort type based of current sort type and {@link SORT_SWITCH}
   */

  function handleColumnHeadClick({ currentTarget }: MouseEvent) {
    const clickedColumnHead = (currentTarget as HTMLTableCellElement).dataset.column as T

    handleSort(
      clickedColumnHead !== sort.column
        ? { type: "ASC", column: clickedColumnHead }
        : { type: SORT_SWITCH[sort.type], column: clickedColumnHead }
    )
  }

  return (
    <thead>
      <tr>
        {columns.map(({ title, accessor }) => (
          <th
            key={accessor}
            data-column={accessor}
            onClick={handleColumnHeadClick}
            data-testid="thead-th"
          >
            <div>
              <p data-testid="thead-title">{title}</p>
              <SortIcon sort={sort} accessor={accessor} />
            </div>
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default Thead