module.exports = {
  apps: [{
    name: 'bipolar-reads',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-18-219-189-140.us-east-2.compute.amazonaws.com',
      key: '../bipolar-new-key.pem',
      ref: 'origin/master',
      repo: 'git@github.com:itsujj/bipolar-reads',
      path: '/home/ubuntu/bipolar-reads',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
