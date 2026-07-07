module.exports = {
  apps: [{
    name: 'weeklog',
    script: 'dist/index.js',
    cwd: 'C:/projects/weeklog/server',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
