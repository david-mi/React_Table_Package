
import { getNodeText, render, screen, fireEvent } from "@testing-library/react";
import { columns as mockColumns, rows as mockRows } from "../../__mocks__"
import type { Data } from "../../__mocks__";
import { Table } from "../../lib";

const defaultMockRowsLength = 10

beforeEach(() => {
  render(<Table columns={mockColumns} rows={mockRows} />)
})

describe("Given I want to sort rows", () => {
  let getRowsAccessorData: (accessor: keyof Data) => string[]
  let getCellsDataFromTargetColumn: (columnPosition: number) => string[]
  let firstColumnHead: HTMLElement
  let firstColumnAccessor: keyof Data

  beforeAll(() => {
    getRowsAccessorData = function (accessor: keyof Data) {
      return mockRows.reduce<string[]>((acc, row) => {
        acc.push(row[accessor] as string)
        return acc
      }, [])
    }

    getCellsDataFromTargetColumn = function (columnPosition: number) {
      return screen
        .getAllByTestId("tbody-row")
        .map(({ children }) => getNodeText(children[columnPosition] as HTMLElement))
    }
  })

  beforeEach(() => {
    firstColumnHead = screen.getAllByTestId("thead-title")[0]
    firstColumnAccessor = mockColumns[0].accessor
  })

  describe("When I'm clicking one time on first column head", () => {
    test("Then it should sort rows in ascending order, based on first column cells", () => {
      fireEvent.click(firstColumnHead)

      const rowsAccessorDataFromFirstColumnInAscendingOrder = getRowsAccessorData(firstColumnAccessor).sort()
      rowsAccessorDataFromFirstColumnInAscendingOrder.length = defaultMockRowsLength
      const firstColumnTableRows = getCellsDataFromTargetColumn(0)

      expect(firstColumnTableRows).toEqual(rowsAccessorDataFromFirstColumnInAscendingOrder)
    })
  })

  describe("When I'm clicking two times on first column head", () => {
    test("Then it should sort rows in descending order, based on first column cells", () => {
      fireEvent.click(firstColumnHead)
      fireEvent.click(firstColumnHead)

      const rowsAccessorDataFromFirstColumnInDescendingOrder = getRowsAccessorData(firstColumnAccessor).sort((a, b) => b.localeCompare(a))
      rowsAccessorDataFromFirstColumnInDescendingOrder.length = defaultMockRowsLength
      const firstColumnTableRows = getCellsDataFromTargetColumn(0)

      expect(firstColumnTableRows).toEqual(rowsAccessorDataFromFirstColumnInDescendingOrder)
    })
  })

  describe("When I'm clicking three times on first column head", () => {
    test("Then it should get rows in initial order", () => {
      fireEvent.click(firstColumnHead)
      fireEvent.click(firstColumnHead)
      fireEvent.click(firstColumnHead)

      const firstColumnTableRows = getCellsDataFromTargetColumn(0)
      const rowsAccessorDataFromFirstColumnInitial = getRowsAccessorData(firstColumnAccessor)
      rowsAccessorDataFromFirstColumnInitial.length = 10

      expect(firstColumnTableRows).toEqual(rowsAccessorDataFromFirstColumnInitial)
    })
  })

  describe("When I'm clicking on first column head, then on second", () => {
    test("Then it should sort rows in ascending order, based on second column cells", () => {
      const firstNameColumnHead = screen.getAllByTestId("thead-title")[0]
      const lastNameColumnHead = screen.getAllByTestId("thead-title")[1]

      fireEvent.click(firstNameColumnHead)
      fireEvent.click(lastNameColumnHead)

      const secondColumnAccessor: keyof Data = mockColumns[1].accessor
      const rowsAccessorDataFromSecondColumnInAscendingOrder = getRowsAccessorData(secondColumnAccessor).sort()
      rowsAccessorDataFromSecondColumnInAscendingOrder.length = defaultMockRowsLength
      const secondColumnTableRows = getCellsDataFromTargetColumn(1)

      expect(secondColumnTableRows).toEqual(rowsAccessorDataFromSecondColumnInAscendingOrder)
    })
  })
})

describe("Given I want to filter rows based on input search value", () => {
  describe("When I'm writing 'Sales' in input", () => {
    test("Then 2 rows should be displayed in the table with correct data", () => {
      const inputElement = screen.getByTestId("search-input")
      fireEvent.change(inputElement, { target: { value: "Sales" } })
      const rowsElements = screen.getAllByTestId("tbody-row")

      const tbodyCellsText = screen
        .getAllByTestId("tbody-cell")
        .map(getNodeText)

      const filteredRowsKeys = [
        "Basanti", "Dan", "2019-10-28", "Sales", "1997-01-19", "Washington Blvd", "KY", "Durham", "94588",
        "Kim", "Mehmet", "2020-02-11", "Sales", "1965-02-18", "Sunset Strip", "UT", "Lexington", "55415"
      ];

      expect(tbodyCellsText).toEqual(filteredRowsKeys)
      expect(rowsElements.length).toBe(2)
    })
  })

  describe("When I'm writing 'Sales' in input, then remove it", () => {
    test("Then number of displayed rows should be equal to mockRows length", () => {
      const inputElement = screen.getByTestId("search-input")
      fireEvent.change(inputElement, { target: { value: "Sales" } })
      fireEvent.change(inputElement, { target: { value: "" } })

      const rowsElements = screen.getAllByTestId("tbody-row")
      expect(rowsElements.length).toBe(defaultMockRowsLength)
    })
  })
})

describe("Given I want to sort rows, then filter them based on input search value", () => {
  describe("When i'm cliking on 'Date of Birth' column head, then typing 'sunset' in search input", () => {
    test("Then 3 rows should be displayed in the table with correct data in ascending birthDate order", () => {
      const dateOfBirthColumnHead = screen.getAllByTestId("thead-title")[4]
      expect(dateOfBirthColumnHead).toHaveTextContent("Date of Birth")
      fireEvent.click(dateOfBirthColumnHead)

      const inputElement = screen.getByTestId("search-input")
      fireEvent.change(inputElement, { target: { value: "sunset" } })

      const tbodyCellsText = screen
        .getAllByTestId("tbody-cell")
        .map(getNodeText)

      const filteredRowsInAscendingBirthDateOrderKeys = [
        "Kim", "Mehmet", "2020-02-11", "Sales", "1965-02-18", "Sunset Strip", "UT", "Lexington", "55415",
        "Herbert", "Jorge", "2020-06-07", "Engineering", "1982-04-03", "Sunset Plaza Dr", "KS", "Fort Wayne", "87505",
        "Emine", "Olivier", "2022-05-15", "Engineering", "1985-04-01", "Sunset Blvd", "ND", "San Diego", "33950"
      ];

      expect(tbodyCellsText).toEqual(filteredRowsInAscendingBirthDateOrderKeys)
    })
  })
})
