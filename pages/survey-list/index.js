//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    filter: {
      page: 0,
      page_size: 10,
    },
    datas: [],
    total: undefined,
    noMore: false,
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //this._()
    this.setTitle()
    this.fetchList()

  },
  setTitle() {
    wx.setNavigationBarTitle({
      title: '问卷列表'
    })
  },
  _() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  fetchList() {
    ++this.data.filter.page
    let requireReq
    if (this.data.total === undefined) {
      requireReq = true
    } else {
      const totalPages = Math.ceil(this.data.total / this.data.filter.pageSize)
      requireReq = this.data.filter.page <= totalPages
    }
    if (requireReq) {
      this.setData({
        loading: true
      })
      wx.$request.survey(this.data.filter)
        .then(res => {
          if (this.data.total !== undefined || (res.data && res.data.length)) {
            this.setData({
              datas: this.data.datas.concat(res.data),
              total: res.totalPages,
            })
          } else if (this.data.total === undefined && (!res.data || !res.data.length)) {
            this.setData({
              total: 0,
            })
          }
        }).catch(err => {
        }).finally(() => {
          this.setData({
            loading: false
          })
        })
    } else {
      this.setData({
        noMore: true
      })
      setTimeout(() => this.setData({
        noMore: false
      }), 2500)
    }
  },
  onTap({ currentTarget: { dataset: { id } } }) {
    wx.navigateTo({
      url: `/pages/answer-survey/index?id=${id}`
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReachBottom(e) {
    this.fetchList()
  },
})