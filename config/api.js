module.exports = [
  // 获取问卷列表
  {
    url: 'survey',
    method: 'GET', // 可缺省，默认是 GET
  },
  // 回答问卷
  {
    url: 'surveyItem',
    method: 'POST',
  },
  // 创建问卷
  {
    url: 'survey',
    method: 'POST',
  },
]