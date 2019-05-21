module.exports = [
  // 获取问卷列表
  {
    name: 'survey',
    url: 'survey',
    method: 'GET', // 可缺省，默认是 GET
  },
  // 回答问卷
  {
    name: 'surveyItem',
    url: 'surveyItem',
    method: 'POST',
  },
  // 创建问卷
  {
    name: 'createSurvey',
    url: 'survey',
    method: 'POST',
  },
]