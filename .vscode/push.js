const { execSync } = require("child_process");
const [, , projectDir] = process.argv;

function getCurrentBranch() {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", { cwd: projectDir })
      .toString()
      .trim();
  } catch (error) {
    console.error("无法获取Git分支信息:", error);
    return "git分支获取出错";
  }
}

async function start() {
  const sourceBranch = await getCurrentBranch();

  execSync(`git pull origin develop:develop`, { cwd: projectDir });
  execSync(`git pull origin uat:uat`, { cwd: projectDir });
  console.log(`✅ 拉取 develop 和 uat 分支`);

  execSync(`git push`, { cwd: projectDir });
  console.log(`✅ push ${sourceBranch} 分支`);

  execSync(`git pull origin ${sourceBranch}:develop`, { cwd: projectDir });
  execSync(`git push origin develop:develop`, { cwd: projectDir });
  console.log(`✅ develop 分支已推送!`);

  execSync(`git pull origin ${sourceBranch}:uat`, { cwd: projectDir });
  execSync(`git push origin uat:uat`, { cwd: projectDir });

  console.log(`✅ uat 分支已推送!`);
  process.exit(0);
}

start();
