/**
 * Initial State to be applied into vuex
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    user: {
      businessID: undefined,
      admin: undefined,
      permissions: undefined,
      name: undefined,
      email: undefined,
      // phoneNumber: null,
      // profilePictureURL: null,
    },
  };
}
