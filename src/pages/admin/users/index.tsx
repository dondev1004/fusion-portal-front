import { useCallback, useEffect, useState } from "react";
import Sidebar, {
  SidebarMenuItemProps,
} from "../../../components/advanced/layouts/Sidebar";
import Modal from "../../../components/base/Modal";
import Table from "../../../components/base/Table";
import Footer from "../../../components/layouts/footer";
import Header from "../../../components/layouts/header";

import { base_url } from "../../../config/setting";

import { useAppStore } from "../../../lib/zustand/store";

import { AiOutlineSearch } from "react-icons/ai";
import { BsCopy, BsPlusLg, BsTrash } from "react-icons/bs";
import { FaHatWizard, FaUserGroup } from "react-icons/fa6";

interface TableItemProps {
  username: string;
  fullName: string;
  ext: number;
  role: string;
  domain: ".pbx1.cloudtalk.ca";
  api: string;
}

const CustomersDashboard = () => {
  const { userData } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState<Array<{ name: string; id: string }>>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [inputRows, setInputRows] = useState([
    {
      username: "",
      firstName: "",
      lastName: "",
      fullName: "",
      email: "",
      ext: "",
      role: "",
      domain: ".pbx1.cloudtalk.ca",
    },
  ]);
  const [editUser, setEditUser] = useState<{
    username: string;
    firstName: string;
    lastName: string;
    ext: number;
    role: string;
    domain: ".pbx1.cloudtalk.ca";
    api: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const sidebarMenus: Array<SidebarMenuItemProps> = [
    {
      icon: <FaUserGroup />,
      label: "User List",
      subSidebarMenus: ["Users with Extensions", "Unassigned Extensions"],
    },
    {
      icon: <FaHatWizard />,
      label: "Wizard for Extensions",
    },
  ];

  const [tableItems, setTableItems] = useState<Array<TableItemProps>>([]);

  const onAddUser = (newUser: TableItemProps) => {
    setTableItems((prevItems) => [...prevItems, newUser]);
  };

  const handleEditUser = (index: number) => {
    const user = tableItems[index];
    const [firstName, lastName] = user.fullName.split(" ");
    setEditUser({
      ...user,
      firstName,
      lastName,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (index: number) => {
    const updatedUsers = tableItems.filter((_, i) => i !== index);
    setTableItems(updatedUsers);
  };

  const handleAddUser = () => {
    inputRows.forEach((row) => {
      let newRole: any = roles.filter((item) => {
        return item.id === row.role;
      })[0];
      if (!newRole && roles.length) {
        newRole = roles[0];
      }
      const user: TableItemProps = {
        username: row.username,
        fullName: `${row.firstName} ${row.lastName}`,
        ext: Math.floor(Math.random() * 900) + 100, // Random extension for example
        role: newRole.name,
        domain: ".pbx1.cloudtalk.ca",
        api: "9d*******34",
      };
      onAddUser(user);
    });
    setIsModalOpen(false);
    console.log(roles[0]);
    setInputRows([
      {
        username: "",
        firstName: "",
        lastName: "",
        fullName: "",
        email: "",
        ext: "",
        role: roles[0].id,
        domain: ".pbx1.cloudtalk.ca",
      },
    ]);
  };

  const handleUpdateUser = () => {
    if (editUser) {
      let newRole: any = roles.filter((item) => {
        return item.id === editUser.role;
      })[0];
      if (!newRole && roles.length) {
        newRole = roles[0];
      }
      const updatedUser: TableItemProps = {
        username: editUser.username,
        fullName: `${editUser.firstName} ${editUser.lastName}`,
        ext: editUser.ext,
        role: newRole.name,
        domain: editUser.domain,
        api: editUser.api,
      };
      const updatedUsers = tableItems.map((user) =>
        user.ext === editUser.ext ? updatedUser : user
      );
      setTableItems(updatedUsers);
      setInputRows([
        {
          username: "",
          firstName: "",
          lastName: "",
          fullName: "",
          email: "",
          ext: "",
          role: "",
          domain: ".pbx1.cloudtalk.ca",
        },
      ]);
      setIsEditModalOpen(false);
    }
  };

  const addInputRow = () => {
    setInputRows([
      ...inputRows,
      {
        username: "",
        firstName: "",
        lastName: "",
        fullName: "",
        email: "",
        ext: "",
        role: "",
        domain: ".pbx1.cloudtalk.ca",
      },
    ]);
  };

  const removeInputRow = (index: number) => {
    setInputRows(inputRows.filter((_, i) => i !== index));
  };

  const updateInputRow = (index: number, field: string, value: string) => {
    const rows = [...inputRows];
    rows[index] = { ...rows[index], [field]: value };
    console.log(rows);
    setInputRows(rows);
  };

  const fetchRoleResponse = useCallback(async () => {
    const response = await fetch(`${base_url}/admin/user_create`, {
      headers: {
        authorization: userData.token,
      },
    });
    const data = await response.json();
    const roleItems: Array<{ name: string; id: string }> = [];
    for (let i = 0; i < data.data.length; i++) {
      roleItems.push({
        name: data.data[i].group_name,
        id: data.data[i].group_uuid,
      });
    }

    setRoles(roleItems);
  }, []);

  useEffect(() => {
    fetchRoleResponse();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-white font-nunito">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4 h-full">
          <Sidebar sidebarMenus={sidebarMenus} />
          <div className="flex-1">
            <div className="w-full bg-white rounded-md shadow-md">
              <div className="flex justify-between items-center p-4">
                <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
              </div>
              <div className="flex justify-between items-center bg-gray-50 border-b p-5">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="bg-gray-200 text-gray-600 grid place-items-center px-2 border-gray-200 cursor-pointer">
                    <AiOutlineSearch className="" />
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-2 py-1 border border-gray-200 flex items-center bg-gray-200 text-blue-400"
                >
                  <BsPlusLg className="mr-2" /> Add User
                </button>
              </div>
              <Table
                searchTerm={searchTerm}
                headerItems={[
                  "User Name",
                  "Full Name",
                  "Ext.",
                  "Role",
                  "Domain",
                  "API",
                ]}
                tableItems={tableItems}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
              <Modal
                width="w-[1000px]"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              >
                <div>
                  <h2 className="text-xl text-gray-500 mb-4 bg-gray-100 border-b-2 border-gray-300 p-4 text-center">
                    Add User
                  </h2>
                  <div className="p-6 space-y-6">
                    {inputRows.map((row, index) => (
                      <div key={index} className="grid grid-cols-6 gap-4">
                        <div>
                          {index === 0 && (
                            <label className="block text-sm font-medium text-gray-700">
                              User Name
                            </label>
                          )}
                          <input
                            type="text"
                            className="mt-1 p-2 border rounded-lg w-full"
                            value={row.username}
                            onChange={(e) =>
                              updateInputRow(index, "username", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          {index === 0 && (
                            <label className="block text-sm font-medium text-gray-700">
                              First Name
                            </label>
                          )}
                          <input
                            type="text"
                            className="mt-1 p-2 border rounded-lg w-full"
                            value={row.firstName}
                            onChange={(e) =>
                              updateInputRow(index, "firstName", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          {index === 0 && (
                            <label className="block text-sm font-medium text-gray-700">
                              Last Name
                            </label>
                          )}
                          <input
                            type="text"
                            className="mt-1 p-2 border rounded-lg w-full"
                            value={row.lastName}
                            onChange={(e) =>
                              updateInputRow(index, "lastName", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          {index === 0 && (
                            <label className="block text-sm font-medium text-gray-700">
                              Ext.
                            </label>
                          )}
                          <input
                            type="text"
                            className="mt-1 p-2 border rounded-lg w-full"
                            value={row.ext}
                            onChange={(e) =>
                              updateInputRow(index, "ext", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          {index === 0 && (
                            <label className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                          )}
                          <input
                            type="text"
                            className="mt-1 p-2 border rounded-lg w-full"
                            value={row.email}
                            onChange={(e) =>
                              updateInputRow(index, "email", e.target.value)
                            }
                          />
                        </div>
                        <div className="text-sm">
                          {index === 0 && (
                            <label className="block text-sm font-medium text-gray-700">
                              Role
                            </label>
                          )}
                          <select
                            className="mt-1 p-2 border rounded-lg w-full"
                            value={row.role}
                            onChange={(e) =>
                              updateInputRow(index, "role", e.target.value)
                            }
                          >
                            {roles.map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="text-sm">
                          {index === 0 && (
                            <label className="block text-sm font-medium text-gray-700">
                              Domain
                            </label>
                          )}
                          <select
                            className="mt-1 p-2 border rounded-lg w-full"
                            value={row.domain}
                            onChange={(e) =>
                              updateInputRow(index, "domain", e.target.value)
                            }
                          >
                            <option value=".pbx1.cloudtalk.ca">
                              .pbx1.cloudtalk.ca
                            </option>
                          </select>
                        </div>
                        <div className="pt-6 flex items-center gap-4">
                          <button
                            className="text-blue-400 hover:text-blue-500"
                            onClick={addInputRow}
                          >
                            <BsCopy />
                          </button>
                          {inputRows.length > 1 && (
                            <button
                              className="text-blue-400 hover:text-blue-500"
                              onClick={() => removeInputRow(index)}
                            >
                              <BsTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end p-4 border-t border-gray-200">
                    <button
                      className="px-4 py-2 mr-2 bg-gray-300 rounded-lg"
                      onClick={() => {
                        setInputRows([
                          {
                            username: "",
                            firstName: "",
                            lastName: "",
                            fullName: "",
                            email: "",
                            ext: "",
                            role: "",
                            domain: ".pbx1.cloudtalk.ca",
                          },
                        ]);
                        setIsModalOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                      onClick={handleAddUser}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </Modal>
              {editUser && (
                <Modal
                  width="w-[1000px]"
                  isOpen={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                >
                  <div>
                    <h2 className="text-xl text-gray-500 mb-4 bg-gray-100 border-b-2 border-gray-300 p-4 text-center">
                      Edit User
                    </h2>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            User Name
                          </label>
                          <input
                            type="text"
                            className="mt-1 p-2 border rounded-lg w-full"
                            value={editUser.username}
                            onChange={(e) =>
                              setEditUser({
                                ...editUser,
                                username: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="mt-1 p-2 border rounded-lg w-full"
                            value={editUser.firstName}
                            onChange={(e) =>
                              setEditUser({
                                ...editUser,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="mt-1 p-2 border rounded-lg w-full"
                            value={editUser.lastName}
                            onChange={(e) =>
                              setEditUser({
                                ...editUser,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Ext.
                          </label>
                          <input
                            type="text"
                            className="mt-1 p-2 border rounded-lg w-full"
                            value={editUser.ext.toString()}
                            onChange={(e) =>
                              setEditUser({
                                ...editUser,
                                ext: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Role
                          </label>
                          <select
                            className="mt-1 p-2 border rounded-lg w-full"
                            defaultValue={roles.length ? roles[0].id : ""}
                            onChange={(e) =>
                              setEditUser({
                                ...editUser,
                                role: e.target.value,
                              })
                            }
                          >
                            {roles.map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Domain
                          </label>
                          <select
                            className="mt-1 p-2 border rounded-lg w-full"
                            value={editUser.domain}
                            onChange={(e) =>
                              setEditUser({
                                ...editUser,
                                domain: e.target.value as ".pbx1.cloudtalk.ca",
                              })
                            }
                          >
                            <option value=".pbx1.cloudtalk.ca">
                              .pbx1.cloudtalk.ca
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end p-4 border-t border-gray-200">
                      <button
                        className="px-4 py-2 mr-2 bg-gray-300 rounded-lg"
                        onClick={() => setIsEditModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                        onClick={handleUpdateUser}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomersDashboard;
