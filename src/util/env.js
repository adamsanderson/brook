/* global process */

const ENV = {
  [process.env.NODE_ENV]: true,
  environmentName: process.env.NODE_ENV
}

export default ENV