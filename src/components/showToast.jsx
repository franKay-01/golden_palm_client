import { toast } from 'react-toastify';

export const ShowToast = (type, message) => {
  toast[type](message, {
    position: "top-right",
    className: "font-light text-sm",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
  })
}