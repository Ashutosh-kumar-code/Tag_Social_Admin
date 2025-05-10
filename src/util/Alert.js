import Swal from 'sweetalert2';

export const alert = (title, data, type) => {
  return Swal.fire(title, data, type);
};

export const warning = (confirm) => {
  return Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });
};

// Delete Warning for category
export const warningForText = (text) => {
  return Swal.fire({
    title: 'Are you sure?',
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });
};


