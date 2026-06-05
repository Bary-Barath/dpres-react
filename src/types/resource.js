/**
 * @typedef {'Available' | 'Maintenance' | 'Depleted'} ResourceStatus
 *
 * @typedef {Object} ResourceLocation
 * @property {string} id
 * @property {string} building
 * @property {string} floor
 * @property {string} room
 * @property {string} description
 * @property {ResourceStatus} status
 * @property {number|null} latitude
 * @property {number|null} longitude
 *
 * @typedef {Object} ResourceEntry
 * @property {string} id
 * @property {string} name
 * @property {number} count
 * @property {string} color
 * @property {string} status
 * @property {ResourceLocation[]} locations
 */

export {};
