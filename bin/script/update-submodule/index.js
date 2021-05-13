/* eslint-disable */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const exec = require('../exec-util');
const log = require('../log-util');

const SUBMODULE_DIR = {
  component: {
    folder: 'src/component/common',
    gitUrl: 'git@xxx.git',
  },
};

const MAIN_BRANCH = [
  'master',
  'dev',
  'sit',
];

const DEFAULT_BRANCH = 'master';

// 所用脚本
const INITIAL_SUBMODULE_SCRIPT = 'git submodule update --init --recursive';
const RESET_SUBMODULE_SCRIPT = 'git reset --hard';

function getUpdateSubmoduleCommand(branch) {
  return `git checkout ${branch} && git pull origin ${branch}`;
}

function getInitialSubmoduleScript(gitUrl, branch) {
  return `git submodule add ${gitUrl} common -b ${branch} --force`;
}

module.exports = class UpdateSubModule {
  /**
   * 更新公共组件代码
   *
   * @param {String} branch 公共代码分支
   * @param {Boolean} commit 是否提交更新后的公共代码版本
   * @param {Boolean} init 是否创建公共代码引用
   * @param {Boolean} reset  是否清除公共代码的本地变更
   */
  constructor (context, { branch, commit, init, reset, folder, gitUrl } = {}) {
    this.context = context;
    this.branch = branch;
    this.commit = commit;
    this.init = init;
    this.reset = reset;
    this.folder = folder;
    this.gitUrl = gitUrl;
  }

  update (dir, currentGitBranch) {
    // 进入子模块目录
    const enterSubmoduleFolderCommand = `cd ${path.join(this.context, dir)}`;
    // 强制更新公共代码的场合
    if (this.reset === true) {
      // 重置公共代码
      exec.cmd(`${enterSubmoduleFolderCommand} && ${RESET_SUBMODULE_SCRIPT}`);
    }
    log.label(`--- (Start) ---> Update Submodule Source: ${dir}`);
    exec.cmd(`${enterSubmoduleFolderCommand} && ${getUpdateSubmoduleCommand(currentGitBranch)}`);
    log.label(`---  (End)  ---> Update Submodule Source: ${dir}`);

    // 需要在父仓库更新Submodule版本的场合
    if (this.commit) {
      let commitFiles = exec.cmd('git status -s');
      if (commitFiles !== '') {
        commitFiles = commitFiles.split(' ');
        if (commitFiles.length > 0) {
          // 判断Submodule是否有更新并且需要提交
          if (commitFiles.some(filePath => filePath.indexOf(dir) !== -1)) {
            log.label(`*** [Git]Save ${dir} Version ***`);
            exec.cmd(`${enterSubmoduleFolderCommand} && git add ${dir}`);
            exec.cmd(`${enterSubmoduleFolderCommand} && git commit -m\'update submodule source\'`);
            exec.cmd(`${enterSubmoduleFolderCommand} && git push`);
          }
        }
      }
    }
  }
  
  run () {
    const { folder, gitUrl } = this;
    // 取得欲使用的公共代码分支
    let currentGitBranch = ''
    if (this.branch === undefined || this.branch === null || this.branch === '') {
      // 取得当前代码所使用的Git分支
      currentGitBranch = exec.getOutput('git symbolic-ref --short -q HEAD');
      // 如果当前分支不属于主分支，使用默认分支
      if (MAIN_BRANCH.indexOf(currentGitBranch) === -1) {
        log.warning(`Cannot use other branch except [${MAIN_BRANCH.join(',')}]!`)
        log.warning(`Use [${DEFAULT_BRANCH}] branch default!`)
        currentGitBranch = DEFAULT_BRANCH
      }
    } else {
      currentGitBranch = this.branch;
    }
    log.label(`Current Git Branch: ${currentGitBranch}`);

    const SWICTH_TO_CURRENT_GIT_BRANCH = `git checkout ${currentGitBranch}`;
    
    if (this.init) {
      log.label('Start Create Submodule Reference: ');
      // 按定义顺序处理Submodule
      // Object.keys(SUBMODULE_DIR).forEach(module => {
      //   const { folder, gitUrl } = SUBMODULE_DIR[module];
      //   // TODO 删除common目录
      //   // 执行前提：需要删除common目录
      //   exec.cmd(`cd ${folder.replace('/common', '')} && ${getInitialSubmoduleScript(gitUrl, currentGitBranch)}`);
      // });
      exec.cmd(`cd ${folder.replace('/common', '')} && ${getInitialSubmoduleScript(gitUrl, currentGitBranch)}`);
      log.label('End Create Submodule Reference: ');
      return;
    }

    log.label('Start Update Submodule: ');

    // 按定义顺序处理Submodule
    // Object.keys(SUBMODULE_DIR).forEach(module => {
    //   const { folder, gitUrl } = SUBMODULE_DIR[module];
    //   log.label(`Submodule: ${folder}`);
    //   const currentDir = path.join(this.context, folder);
    //   // 判断子仓库目录是否已初始化
    //   const isSubmoduleInitialed = fs.existsSync(path.join(`${currentDir}`, 'README.md'));
    //   // 子仓库目录存在的场合
    //   if (isSubmoduleInitialed) {
    //     this.update(folder, currentGitBranch, false);
    //   } else {
    //     log.label(`--- (Start) ---> Initial Submodule Source: ./${folder}`);
    //     // 初始化子仓库
    //     exec.cmd(`cd ${folder} && ${INITIAL_SUBMODULE_SCRIPT} && ${SWICTH_TO_CURRENT_GIT_BRANCH}`);
    //     log.label(`---  (End)  ---> Initial Submodule Source: ./${folder}`);
    //     // 更新子仓库
    //     this.update(folder, currentGitBranch, false);
    //   }
    // });
    log.label(`Submodule: ${folder}`);
    const currentDir = path.join(this.context, folder);
    // 判断子仓库目录是否已初始化
    const isSubmoduleInitialed = fs.existsSync(path.join(`${currentDir}`, 'README.md'));
    // 子仓库目录存在的场合
    if (isSubmoduleInitialed) {
      this.update(folder, currentGitBranch, false);
    } else {
      log.label(`--- (Start) ---> Initial Submodule Source: ./${folder}`);
      // 初始化子仓库
      exec.cmd(`cd ${folder} && ${INITIAL_SUBMODULE_SCRIPT} && ${SWICTH_TO_CURRENT_GIT_BRANCH}`);
      log.label(`---  (End)  ---> Initial Submodule Source: ./${folder}`);
      // 更新子仓库
      this.update(folder, currentGitBranch, false);
    }
    console.log('');
    log.success('Update Successful!');
  }
}

