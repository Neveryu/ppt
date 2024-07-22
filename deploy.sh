#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 定义要删除的目录的路径（把.git目录删掉）
DIRECTORY_TO_DELETE=".git"

# 检查目录是否存在
if [ -d "$DIRECTORY_TO_DELETE" ]; then
	# 如果目录存在，则删除它
	rm -rf "$DIRECTORY_TO_DELETE"
	echo "目录 $DIRECTORY_TO_DELETE 已被删除"
else
	echo "目录 $DIRECTORY_TO_DELETE 不存在"
fi

# 生成静态文件
npm ci && npm run inliner && npm run zip

# 进入生成的文件夹
# cd docs/.vuepress/dist

git init
git add -A
# 设置本地项目的 git 用户名
git config user.name "Yu"
git config user.email "never_yu@qq.com"
echo "Git 仓库配置已更新"

echo -n "请输入你的commit msg"
read msg
git commit -m "$msg"

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# 手动部署
# git push -f git@github.com:Neveryu/ppt.git master:master
git push -f http://github.com/Neveryu/ppt.git master:master
# 自动部署
# git push -f "https://${access_token}@github.com/Neveryu/web-bookmarks.git" master:gh-pages

cd -