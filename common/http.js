import Config from './config.js'

export default (options = { method: 'GET', data: {},contentType:'' }) => {
  let defaultHeader = {
    'content-type':'application/json'
  };
  if(options.contentType) {
    defaultHeader['content-type'] = options.contentType;
  }
  const token =uni.getStorageSync('token')
  if (token){
	   defaultHeader['X-Access-Token'] = token;
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: Config.baseUrl + options.url,
      data: options.data,
      header: defaultHeader,
      method: options.method && options.method.toUpperCase() || 'GET',
      success: res => {
        const { statusCode, data } = res;
        if (statusCode >= 200 && statusCode < 300) {
          if (data.code !== 200) {
			
            uni.showToast({
              title: data.message || data.code,
              icon: 'none',
              mask: true,
              complete: function() {
              }
            });
            resolve(data);
          } else {
            resolve(data);
          }
        } else {
          uni.showToast({
            title: data.message || data.code,
          });
          reject(data.message || data.code);
        }
      },
      fail: error => {
        reject(error);
      }
    })
  });
}