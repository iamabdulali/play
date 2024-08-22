// Helper function to create FormData object dynamically
export const createFormData = (data) => {
  const formData = new FormData();
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      formData.append(key, data[key]);
    }
  }
  return formData;
};
