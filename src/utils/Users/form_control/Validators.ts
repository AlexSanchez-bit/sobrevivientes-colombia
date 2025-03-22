export const Validators = {
  required: (value) => value != null && value != "",
  email: (value) => value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  min: (value, size) => value.length >= size,
  equals_to: (value1, value2) => value1 == value2,
};
