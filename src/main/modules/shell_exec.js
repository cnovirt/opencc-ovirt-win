const util = require('util');
const exec = util.promisify(require('child_process').exec);


export const shellExec = async (cmdStr) => {
  let retu = {
    status: false,
    data: '',
    error: '',
  }

  return await exec(cmdStr)
  // console.log(error, stdout, stderr)
  // if (error) {
  //   retu.error = stderr
  //   return retu
  // } else {
  //   retu.status = true
  //   retu.data = stdout
  //   return retu
  // }
}

