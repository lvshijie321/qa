Page({
  data: {
    surveyList: [],
    movableViewInfo: {
      y: 0,
      showClass: 'none',
      data: {}
    },
    moveableViewList: [],
    tapOne: {},
    pageInfo: {
      rowHeight: 0,
      scrollHeight: 85,

      startIndex: null,
      scrollY: true,
      readyPlaceIndex: null,
      startY: 0,
      selectedIndex: null,
    }
  },
  touchEnd(e) {
    debugger
  },
  onMove(e) {
    debugger
  },
  startMove(e) {
    debugger
  },
  addSurvey(e) {
    this.data.surveyList.push({
      type: e.currentTarget.dataset.type,
    })
    this.data.moveableViewList.push({})
    const index = this.data.surveyList.length - 1
    //this.data.surveyList[index].height = 1
    this.setData({
      surveyList: this.data.surveyList
    })
    this.fetchHeight(index, '.aaa')
      .then(el => {
        Object.assign(this.data.moveableViewList[index], {
          height: el.height * 2 + 6, // 解决 moveableView 设置 height ，实际渲染的高度会减少的问题，所以加上 6
          y: this.calHeight(this.data.moveableViewList, 20),
            
        })
        this.setData({
          moveableViewList: this.data.moveableViewList
        })
      })

   
  },
  calHeight(array, offsetY) {
    return array.reduce((acc, item, index, array) => {
      return acc += index === 0
              ? 0
              : array[index - 1].height + offsetY
    }, 0)
  },
  fetchHeight(index, el) {
    return new Promise(resolve => {
      var query = wx.createSelectorQuery();
      //		//选择id
      query.selectAll(el).boundingClientRect()
      query.exec(res => {
        resolve(res[0][index])
      })
    })
    
    // debugger
    // this.data.pageInfo.rowHeight = res[index].height
    // // 初始化拖动控件数据
    // var movableViewInfo = this.data.movableViewInfo
    // movableViewInfo.data = this.data.surveyList[index]
    // movableViewInfo.showClass = "inline"

    // this.setData({
    //   movableViewInfo: movableViewInfo,
    //   pageInfo: this.data.pageInfo,
    //   'movableViewInfo.y': this.data.pageInfo.startY - (this.data.pageInfo.rowHeight / 2)
    // })
  },
  dragStart: function (event) {
    var startIndex = event.target.dataset.index
    this.setData({
      tapOne: this.data.surveyList[startIndex]
    })
    this.fetchHeight(startIndex)
    console.log('获取到的元素为', this.data.surveyList[startIndex])
    // 初始化页面数据
    var pageInfo = this.data.pageInfo
    pageInfo.startY = event.touches[0].clientY
    pageInfo.readyPlaceIndex = startIndex
    pageInfo.selectedIndex = startIndex
    pageInfo.scrollY = false
    pageInfo.startIndex = startIndex

    
    
  },

  dragMove: function (event) {
    var flag = false
    var surveyList = this.data.surveyList
    var pageInfo = this.data.pageInfo
    // 计算拖拽距离
    var movableViewInfo = this.data.movableViewInfo
    var movedDistance = event.touches[0].clientY - pageInfo.startY
    movableViewInfo.y = pageInfo.startY - (pageInfo.rowHeight / 2) + movedDistance
    console.log('移动的距离为', movedDistance)

    // 修改预计放置位置
    var movedIndex = parseInt(movedDistance / pageInfo.rowHeight)
    var readyPlaceIndex = pageInfo.startIndex + movedIndex
    if (readyPlaceIndex < 0) {
      readyPlaceIndex = 0
    }
    else if (readyPlaceIndex >= surveyList.length) {
      readyPlaceIndex = surveyList.length - 1
    }
    // 移动movableView
    pageInfo.readyPlaceIndex = readyPlaceIndex


    if (readyPlaceIndex != pageInfo.selectedIndex) {
      flag = true
      var selectedData = surveyList[pageInfo.selectedIndex]
      surveyList.splice(pageInfo.selectedIndex, 1)
      surveyList.splice(readyPlaceIndex, 0, selectedData)
      pageInfo.selectedIndex = readyPlaceIndex
      this.setData({
        movableViewInfo: movableViewInfo,
        surveyList: surveyList,
        pageInfo: pageInfo
      })
    } else if (flag) {
      flag = false
      this.setData({
        movableViewInfo: movableViewInfo,
        surveyList: surveyList,
        pageInfo: pageInfo
      })
    }
    
  },

  dragEnd: function (event) {
    // 重置页面数据
    var pageInfo = this.data.pageInfo
    pageInfo.readyPlaceIndex = null
    pageInfo.startY = null
    pageInfo.selectedIndex = null
    pageInfo.startIndex = null
    pageInfo.scrollY = true
    // 隐藏movableView
    var movableViewInfo = this.data.movableViewInfo
    movableViewInfo.showClass = 'none'

    this.setData({
      pageInfo: pageInfo,
      movableViewInfo: movableViewInfo
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
})