import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ToastProvider() {
  return (
    <ToastContainer
      position='top-center'
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='light'
      style={{
        fontSize: '1rem',
        fontWeight: 'bold',
        minHeight: '64px',
        width: '320px',
      }}
      toastStyle={{
        background: '#ffffff',
        color: '#333333',
        border: '1px solid #dddddd',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    />
  );
}
