import { useState, useMemo, useRef } from "react"
import type { Row } from "../../types"
import { getRandomId } from "../../utils"
import usePagination from "../usePagination/usePagination"
import { sortData, filterData } from "./helpers"

export interface SortState<T> {
  type: "ASC" | "DESC" | "NONE"
  column: T | ""
}

export type RowUniqueId<T extends string> = {
  uniqueId: string
} & { [key in T]: string }

export type RowsUniqueIds<T extends string> = RowUniqueId<T>[]

/**
 * Custom Hook to handle initial rows data, data sorting and data filtering
 */

function useTable<T extends string>(rows: Row<T>[]) {

  /** Initial rows data with added unique id */
  const initialData = useMemo<RowsUniqueIds<T>>(() => {
    return rows.map((row) => {
      for (const key in row) {
        if (typeof row[key] === "number") {
          row[key] = String(row[key])
        }
      }

      return { uniqueId: getRandomId(), ...row } as RowUniqueId<T>
    })
  }, [])

  const [rowsData, setRowsData] = useState(initialData)
  const [sort, setSort] = useState<SortState<T>>({
    type: "NONE",
    column: ""
  })
  const [searchInput, setSearchInput] = useState("")

  const pagination = usePagination(rowsData)
  const previousInput = useRef("")
  const isUnsort = sort.type === "NONE"

  /**
   * Manage states related to filtering
   * 
   * @param searchInput search input
   */

  function handleSearch(searchInput: string) {
    const searchValueStartsWithPreviousValue = searchInput.startsWith(previousInput.current)
    previousInput.current = searchInput

    let updatedData: RowsUniqueIds<T>;

    if (searchValueStartsWithPreviousValue) {
      updatedData = filterData(rowsData, searchInput)
    } else {
      updatedData = isUnsort
        ? filterData(initialData, searchInput)
        : sortData(filterData(initialData, searchInput), sort)
    }

    setRowsData(updatedData)
    pagination.updatePagination({ rows: updatedData, newPageIndex: 0 })
    setSearchInput(searchInput)
  }

  /**
   * Manage states related to sorting
   * 
   * @param sort sort options
   */

  function handleSort(sort: SortState<T>) {
    const isUnsort = sort.type === "NONE"

    const updatedData = isUnsort
      ? filterData(initialData, searchInput)
      : sortData(rowsData, sort)

    setRowsData(updatedData)
    pagination.updatePagination({ rows: updatedData, newPageIndex: 0 })
    setSort(sort)
  }

  return {
    rowsData,
    sort,
    handleSort,
    searchInput,
    handleSearch,
    ...pagination
  }
}

export default useTable