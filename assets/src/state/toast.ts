import { writable } from "svelte/store";
import generateId from "../utils/generateId";

export enum ToastType {
    INFO,
    ERROR,
}

export type ToastData = {
    type: ToastType;
    message: string;
    title?: string;
};

export type Toast = {
    id: string;
} & ToastData;

export const toasts = writable<Toast[]>([]);

export function toast(toast: ToastData): Toast {
    const toastWithId: Toast = {
        ...toast,
        id: generateId(8),
    };

    toasts.update(toasts => [...toasts, toastWithId]);

    // Dissmiss toast after 5 seconds.
    setTimeout(() => {
        dismissToast(toastWithId);
    }, 5000);

    return toastWithId;
}

// @ts-ignore
window.toast = toast;

export function dismissToast(toast: Toast) {
    toasts.update(toasts => toasts.filter(t => t.id !== toast.id));
}
