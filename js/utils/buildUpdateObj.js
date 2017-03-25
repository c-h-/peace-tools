// recursively builds an update object to pass to the update helper
function buildUpdateObject(route, value, operation = '$set', obj = {}, separator = '.') {
  const updateObj = obj;
  const separatorIndex = route.indexOf(separator);
  if (separatorIndex !== -1) {
    // still parts of path to update. send down a new shallow object to be set.
    const currentPath = route.slice(0, separatorIndex);
    const remainingPath = route.slice(separatorIndex + 1);
    updateObj[currentPath] = buildUpdateObject(remainingPath, value, operation, {}, separator);
  }
  else {
    updateObj[route] = { [operation]: value };
  }
  return updateObj;
}
export default buildUpdateObject;
