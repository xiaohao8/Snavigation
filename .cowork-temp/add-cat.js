// 给 quick_list_preinstall 33 项按 title 添加 cat 字段
const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'js', 'set.js');
let src = fs.readFileSync(file, 'utf8');

const CAT = {
  '醉里博客': 0, '百度网盘': 0, '阿里云盘': 0,
  'GitHub': 4, 'W3school': 4, 'CSDN': 4, '掘金': 4, 'LeetCode': 4, '牛客网': 4, 'Gitee': 4, '开源中国': 4,
  'cloudflare': 2, '腾讯云': 2, '阿里云': 2, '又拍云': 2, 'Steam++': 2, '图吧工具箱': 2, 'TinyWow': 2,
  '草料二维码': 2, 'ProcessOn': 2, 'PDF24': 2, 'TinyPNG': 2, 'Remove.bg': 2, 'DeepL': 2,
  'Office': 3,
  '哔哩哔哩': 5,
  '菜鸟教程': 6, '学习通': 6, '知到': 6, '中国大学MOOC': 6, '学堂在线': 6, '国家智慧教育': 6, '慕课网': 6,
};

// 定位 preinstall 块
const start = src.indexOf('var quick_list_preinstall = {');
const end = src.indexOf('};', start);
const block = src.slice(start, end + 2);
let count = 0;
let newBlock = block.replace(/(title:\s*"([^"]+)",\s*\n(\s*)url:\s*"[^"]*",)/g, (m, all, title, indent) => {
  if (CAT[title] === undefined) { console.log('NO CAT for:', title); return m; }
  count++;
  return all + '\n' + indent + 'cat: ' + CAT[title] + ',';
});
src = src.slice(0, start) + newBlock + src.slice(end + 2);
fs.writeFileSync(file, src, 'utf8');
console.log('added cat to', count, 'entries');
