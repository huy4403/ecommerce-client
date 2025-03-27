import { toast, ToastContainer as ToastContainerReact } from "react-toastify";

export const Toast = {
    success(messages) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }
        messages.forEach((message) => {
            toast.success(message);
        })
    },

    error(messages) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }
        messages.forEach((message) => {
            toast.error(message);
        })
    },

    warn(messages) {
        if (!Array.isArray(messages)) {
            messages = [messages];
        }
        messages.forEach((message) => {
            toast.warning(message);
        })
    }
}

export function ToastContainer() {
    return (
        <ToastContainerReact />
    )
}
