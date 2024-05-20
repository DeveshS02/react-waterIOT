const extractLastArrays = (obj) => {
    const result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const arrays = obj[key];
        if (arrays.length > 0) {
          result[key] = arrays[arrays.length - 1]; // Get the last array
        }
      }
    }
  
    return result;
  };

export default extractLastArrays;  