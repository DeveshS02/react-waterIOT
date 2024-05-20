import axios from 'axios'

const fetchNodes = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

 export default fetchNodes;