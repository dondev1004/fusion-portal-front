import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FcCancel, FcCheckmark } from "react-icons/fc";

export interface TableProps {
  tableType: "user" | "domain";
  searchTerm: string;
  headerItems: Array<string>;
  tableItems: Array<any>;
  onViewUser?: (index: number) => Promise<void>;
  onEditUser: (index: number) => Promise<void>;
  onDeleteUser?: (index: number) => Promise<void>;
}

const Table: React.FC<TableProps> = ({
  tableType,
  searchTerm,
  headerItems,
  tableItems,
  onViewUser,
  onEditUser,
  onDeleteUser,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10; // Number of items per page
  const totalPages = Math.ceil(tableItems.length / itemsPerPage);

  const filteredItems =
    tableType === "user"
      ? tableItems.filter(
          (item) =>
            item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.domain.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : tableType === "domain"
      ? tableItems.filter((item) =>
          item.domain_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col overflow-auto border shadow-lg bg-white">
      <div className="flex flex-col overflow-x-auto">
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headerItems.map((headerItem, index) => (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    key={index}
                  >
                    {headerItem}
                  </th>
                ))}
                <th
                  scope="col"
                  className="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-14">
              {paginatedItems.map((item, index) => (
                <tr
                  className="bg-white hover:bg-gray-100 cursor-pointer duration-150"
                  key={index}
                >
                  {Object.values(item).map((objectItem, index2) => {
                    if (typeof objectItem === "boolean")
                      return (
                        <td
                          className="px-6 py-3 whitespace-nowrap"
                          key={index2}
                        >
                          {objectItem ? <FcCheckmark /> : <FcCancel />}
                        </td>
                      );

                    return (
                      <td
                        className="px-6 py-3 whitespace-nowrap"
                        key={index2}
                        onClick={() => {
                          if (onViewUser) onViewUser(index);
                        }}
                      >
                        {objectItem as string}
                      </td>
                    );
                  })}
                  <td className="px-6 py-3 flex items-center justify-center">
                    <button
                      className="text-blue-400 hover:text-blue-500"
                      onClick={() => onEditUser(index)}
                    >
                      <FaEdit />
                    </button>
                    {onDeleteUser ? (
                      <button
                        className="text-red-400 hover:text-red-500 ml-4"
                        onClick={() => onDeleteUser(index)}
                      >
                        <FaTrashAlt />
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 ml-3 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, filteredItems.length)}
                </span>{" "}
                of <span className="font-medium">{filteredItems.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span>Previous</span>
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                      currentPage === index + 1
                        ? "bg-blue-100 text-blue-600"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span>Next</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
