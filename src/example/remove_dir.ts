/**
* 定时清理下载临时文件
* @description
*
* @author yanxxit <xx.yan@tingo66.com>
* @created 2019/03/28 14:05:43
*/
import dayjs from 'dayjs';
import * as fs from 'fs';
import * as path from 'path';
/**
 * 删除存在文件的文件夹
 * @param {string} path 路径
 */
function deleteFolder(path: string) {
  let files: string[] = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(file => {
      const curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

async function mian() {
  const _dir = '/Users/yanxxit/Documents/workspace/egg-example';
  const base_dir = path.join(_dir, 'download');
  const files = fs.readdirSync(base_dir);
  for (const m of files) {
    const fillPath = path.join(base_dir, m);
    const res = fs.statSync(fillPath);

    if (dayjs(res.birthtime).unix() < dayjs().add(-1, 'days').unix()) {
      if (fs.statSync(fillPath).isDirectory()) {
        deleteFolder(fillPath);
      } else {
        fs.unlinkSync(fillPath);
      }
    }
  }
}

mian();
