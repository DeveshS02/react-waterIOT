import $ from 'jquery';

const fetchNodes = async (url) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(res) {
        resolve(res);
      },
      error: function(xhr, status, error) {
        reject(error);
      }
    });
  });
};

export default fetchNodes;
