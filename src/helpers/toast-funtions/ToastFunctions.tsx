'use client';
import toast from 'react-hot-toast';
import MessageToast from '../../components/toasts/MessageToast/MessageToast';
import ErrorToast from '@/components/toasts/ErrorToast/ErrorToast';

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