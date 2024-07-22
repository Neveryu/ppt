const pkg = require('./package.json')
const glob = require('glob')
const yargs = require('yargs')

const rimraf = require('gulp-rimraf')
const gulp = require('gulp')
const zip = require('gulp-zip')
const header = require('gulp-header')

const fs = require('fs')
const path = require('path')
const inliner = require('inliner')
const { exec, execSync } = require('child_process')

// 假设你的HTML文件都在'input'目录下，并且你想要将结果保存在'output'目录中
const inputDir = './'
const outputDir = 'output'


const root = yargs.argv.root || '.'
const port = yargs.argv.port || 8000
const host = yargs.argv.host || 'localhost'


/**
 * 删除pptzip文件
 */ 
gulp.task('delzip', function () {
  return gulp.src('neveryu-ppt.zip', { read: false, allowEmpty: true }) // 不会读取文件内容
    .pipe(rimraf()); // 删除匹配的文件和目录
});

/**
 * 把我的ppt文件打包成zip
 */ 
gulp.task('package', gulp.series('delzip', () =>
  gulp.src(
    [
      './output/**'
    ],
    { base: './' }
  )
  .pipe(zip('neveryu-ppt.zip')).pipe(gulp.dest('./'))
))

// 处理单个文件
function processFile(inputFile) {
  console.log('当前处理的文件是：', inputFile)
  const outputFile = path.join(outputDir, path.basename(inputFile));
  const command = `cat ${inputFile} | npx inliner -ni ${inputFile} > ${outputFile} -`

  execSync(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行错误: ${error}`);
    }
    if (stderr) {
      console.error(`标准错误输出: ${stderr}`);
    }

    if (stdout) {
      console.log(`标准输出: ${stdout}`); // 注意：由于你使用了重定向，stdout 可能不会包含任何内容
    }
    console.log(`文件已处理: ${inputFile}`);
  })
}

/**
 * 打包编译单文件
 * 由于写的html文件存在引入css,js文件的问题，在传播方便受限。
 * 打包单文件，传播后，直接双击打开即可。
 */
gulp.task('htmlinliner', gulp.series((done) => {
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  let srcFiles = glob.sync(`${inputDir}*.html`)
  srcFiles.map( filename => {
    processFile(filename)
  })
  done()
}))