/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    current: {
      id: undefined,
      createdAt: undefined,
      createdBy: undefined,
      name: undefined,
      description: undefined,
    },
    bots: [],
  };
}
