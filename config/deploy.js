module.exports = function(deployTarget) {  
  return {
    pagefront: {
      app: 'robertblog',
      key: process.env.PAGEFRONT_KEY
    }
  };
};
