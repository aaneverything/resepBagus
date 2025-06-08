// Recipe object structure for JSDoc documentation
/**
 * @typedef {Object} Recipe
 * @property {string} id - Unique recipe identifier
 * @property {string} title - Recipe title
 * @property {string} description - Recipe description
 * @property {string[]} ingredients - List of ingredients
 * @property {string[]} instructions - Cooking instructions
 * @property {number} cookingTime - Cooking time in minutes
 * @property {number} servings - Number of servings
 * @property {'easy'|'medium'|'hard'} difficulty - Recipe difficulty level
 * @property {string} category - Recipe category
 * @property {string} [imageUrl] - Optional image URL
 * @property {Object} author - Recipe author
 * @property {string} author.id - Author ID
 * @property {string} author.name - Author name
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {Date} createdAt - Account creation date
 */

// Export empty object since JavaScript doesn't need type exports
export default {};
