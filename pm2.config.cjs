module.exports = {
  apps: [{
    name: 'weeklog',
    script: 'server/dist/index.js',
    cwd: 'C:/projects/weeklog',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
