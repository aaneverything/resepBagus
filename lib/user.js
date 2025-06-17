/**
 * @typedef {Object} User
 * @property {string} email
 * @property {string} password
 */

const users = [
  { email: 'admin@gmail.com', password: '123' },
  { email: 'user@gmail.com', password: '123' },
  { email: 'user1@gmail.com', password: '123' },
];

export function getAllUsers() {
  // This would connect to your actual database
  return users;
    
}