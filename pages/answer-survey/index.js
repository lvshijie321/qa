Page({

  data: {
    loading: false,
    detail: {},
    hasNoSource: false,
    questionStyle: [],
    hasAnswer: false,
  },

  onLoad: function (options) {
    this.setTitle()
    this.fetchDetail(options.id)
  },

  onInputBlur(e) {
    this.data.detail.list[e.target.dataset.index].entity.value = e.detail.value.trim()
  },
  // fetchUserInfo() {
  //   wx.getSetting({
  //     success: res => {
  //       if (!res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             let _index
  //             const nameItem = this.data.detail.list.find((item, index) => {
  //               const matched = item.entity.title.match(RegExp(/姓名/))
  //               matched && (item.entity.value = '123') && this.setData({
  //                 detail: this.data.detail
  //               })
  //               return
  //             })

  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  setTitle() {
    wx.setNavigationBarTitle({
      title: '开始答题'
    })
  },


  handleDetail(detail) {
    const list = JSON.parse(detail.list)
    const sort = ['blank', 'radio', 'multiple', 'radio_source', 'multiple_source']
    // 按照 sort 排序
    detail.list = sort.reduce((acc, item, index, array) => acc.concat(list.filter(_item => _item.type === item)), [])
    this.setData({
      hasNoSource: !!(list.find(item => item.type === sort[0] || item.type === sort[1] || item.type === sort[2])
        && list.find(item => item.type === sort[3] || item.type === sort[4]))
    })
    return detail
  },
  handleStyle(dataset) {
    this.data.questionStyle = []
    this.data.questionStyle[dataset.index] = 'border-color:rgb(220, 223, 230)'
    this.setData({
      questionStyle: this.data.questionStyle
    })
  },
  onCheckBoxChange(e) {
    this.data.detail.list[e.target.dataset.index].entity.value = e.detail.value
    this.handleStyle(e.currentTarget.dataset)
  },
  onRadioChange(e) {
    this.data.detail.list[e.target.dataset.index].entity.value = e.detail.value
    this.handleStyle(e.currentTarget.dataset)
  },
  onInputFocus({ currentTarget: { dataset } }) {
    this.handleStyle(dataset)
  },
  fetchDetail(id) {
    this.setData({
      loading: true
    })
    wx.$request.survey({
      id
    })
      .then(res => {
        this.setData({
          detail: this.handleDetail(res),
        })
      }).catch(err => { 
      }).finally(() => {
        this.setData({
          loading: false
        })
      })
  },
  submit() {
    const blankItems = this.data.detail.list.filter(item => !item.entity.value)
    const noticeMsg = blankItems.reduce((acc, item, index, array) => {
      return acc += item.entity.title + (index === array.length - 1 ? '' : '、')
    }, '')
    if (blankItems.length) {
      wx.showToast({
        title: `请填写：${noticeMsg}`,
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      loading: true,
    })
    const param = {
      survey_id: this.data.detail.id,
      source: 0,
      list: JSON.stringify(this.data.detail.list)
    }
    wx.$request.surveyItem(param)
      .then(res => {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        this.setData({
          hasAnswer: true,
        })
        wx.setNavigationBarTitle({
          title: '完成答题'
        })
      }).catch(err => {
        wx.showToast({
          title: err,
          none: 'none',
          duration: 2000
        })
      }).finally(() => {
        this.setData({
          loading: false
        })
      })
  },

})
