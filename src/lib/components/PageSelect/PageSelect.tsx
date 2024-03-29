import type { ChangeEvent } from "react"

interface Props {
  updatePageSize: ({ target }: ChangeEvent<HTMLSelectElement>) => void
  className?: string
}

/** Select menu to change pages size */

const PageSelect = ({ updatePageSize, className }: Props) => {
  const pagesSizes = [10, 25, 50, 100]
  const defaultOptionValue = pagesSizes[0]

  return (
    <div className={className}>
      <label htmlFor="paginationSize" className={className}>Show</label>
      <select
        name="paginationSize"
        id="paginationSize"
        onChange={updatePageSize}
        defaultValue={defaultOptionValue}
      >
        {pagesSizes.map((size) => {
          return <option key={size} value={size}>{size}</option>
        })}
      </select>
      <span>entries</span>
    </div>
  )
}

export default PageSelect