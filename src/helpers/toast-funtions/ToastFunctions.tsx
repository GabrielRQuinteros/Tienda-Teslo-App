'use client';
import ErrorToast from '@/components/toasts/ErrorToast/ErrorToast';
import MessageToast from '@/components/toasts/MessageToast/MessageToast';
import SuccessToast from '@/components/toasts/SuccessToast/SuccessToast';
import toast from 'react-hot-toast';

export const showMessageToast = ( message: string) => {
  toast.custom((t) => (
    <MessageToast t={t} message={message} />
  ));
};


export const showErrorToast = ( message: string) => {
  toast.custom((t) => (
    <ErrorToast t={t} message={message} />
  ));
};


export const showSuccessToast = ( message: string) => {
  toast.custom((t) => (
    <SuccessToast t={t} message={message} />
  ));
};