import { useEffect, useState } from "react";
import { getAllUser, lockAccount, unlockAccount } from "~/services/admin/user-service";
import { Toast } from "~/components/ui/Toast";
import ConfirmationDialog from "~/components/ui/ConfirmationDialog";

function UserManagement() {

    localStorage.setItem("activeSection", "users");

    const [users, setUsers] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const handleLockAccount = async (id) => {
        try {
            await lockAccount(id);
            Toast.success("Khóa thành công tài khoản id: " + id);
            setRefresh(!refresh);
        } catch (err) {
            console.log(err);
            Toast.error("Đã xảy ra lỗi khi khóa tài khoản id: " + id);
        }
    }

    const handleUnlockAccount = async (id) => {
        try {
            await unlockAccount(id);
            Toast.success("Mở thành công tài khoản id: " + id);
            setRefresh(!refresh);
        } catch (err) {
            console.log(err);
            Toast.error("Đã xảy ra lỗi khi mở khóa tài khoản id: " + id);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const res = await getAllUser();
                setUsers(res.data.data);
            } catch (err) {
                console.log(err);
                Toast.error("Đã xảy ra lỗi khi lấy dữ liệu");
            }
        })()
    }, [refresh]);

    const openDialog = (id, action) => {

        ConfirmationDialog(action === 'lock' ?
            "Bạn có chắc chắn muốn khóa tài khoản này không?" :
            "Bạn có chắc chắn muốn mở khóa tài khoản này không?")
            .then((result) => {
                if (result) {
                    if (action === 'lock') {
                        handleLockAccount(id);
                    } else {
                        handleUnlockAccount(id);
                    }
                }
            });
    }

    return (
        <>
            <title>Quản lý khách hàng</title>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Quản lý khách hàng</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Avatar
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Tên
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Số điện thoại
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Tình trạng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            alt="Avatar"
                                            src={user.avatar}
                                            className="inline-block size-8 rounded-full ring-2 ring-white"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.mobile || "Không có"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.registrationDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.status === 'ACTIVE' ? (
                                            <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                                                onClick={() => openDialog(user.id, 'lock')}>
                                                Vô hiệu hóa
                                            </button>
                                        ) : (
                                            <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                                                onClick={() => openDialog(user.id, 'unlock')}>
                                                Kích hoạt
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default UserManagement;