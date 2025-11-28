import React from 'react'

const TableList = ({
  columns,
  data,
  isLoading,
  renderRow,
  emptyMessage = 'لا توجد بيانات',
}) => {
  if (isLoading) {
    return (
      <div className="card text-center py-8">
        <div className="inline-block animate-spin">
          <svg
            className="w-8 h-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <p className="text-gray-600 mt-4">جاري التحميل...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index}>
                {renderRow ? (
                  renderRow(item)
                ) : (
                  columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableList
