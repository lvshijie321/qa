Page({
  data: {
    movable: false,
    surveyList: {},
    cloneChunk: {
      y: 0,
      hidden: true,
    },
    direct: [],
    _: true,
    movableViewInfo: {
      y: 0,
      showClass: 'none',
      data: {}
    },
    moveableViewList: {},
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
    this.data.movable = false
    const index = e.currentTarget.dataset.index
    this.setData({
      [`moveableViewList.${index}`]: {
        ...this.data.moveableViewList[index],
        zIndex: 0,
        actived: false,
      },
    })
  },
  onMove(e) {
    const len = Object.keys(this.data.moveableViewList).length
    if (len < 2) return

    if (!this.data.movable) return // moveableview 动画移动，非用户手动移动

    const index = Number(e.currentTarget.dataset.index)
    let moveChunk = this.data.moveableViewList[index] 
    const offsetY = moveChunk.y - e.detail.y * 2 // 单位是 px
    if (offsetY < 0) { // 向下滑动
      if (index === len - 1) return 
      let replaceChunk = this.data.moveableViewList[index + 1]
      const bottomY = moveChunk.y + moveChunk.height - offsetY
      if (bottomY >= replaceChunk.y && moveChunk.index < replaceChunk.index) {// 触发替换条件，且不能重复替换
      //@todo:连续替换二次能否替换

        let temp = replaceChunk.zIndex
        replaceChunk.zIndex = moveChunk.zIndex
        moveChunk.zIndex = temp
       // 先交换 zIndex ，等下再次交换，意味 zIndex 不需要交换

//go moveableViewList 的值是不是没有替换过来
        temp = replaceChunk
        replaceChunk = moveChunk
        moveChunk = temp

        debugger
        temp = this.data.surveyList[index]
        this.data.surveyList[index] = this.data.surveyList[index + 1]
        this.data.surveyList[index + 1] = temp
        console.log(this.data.surveyList)
      }
    } else { // 向上滑动
      if (index === 0) return 
      const replaceChunk = this.data.moveableViewList[index - 1]
      console.log(offsetY)
      const topY = replaceChunk.y - offsetY
      if (topY <= replaceChunk.y + replaceChunk.height && moveChunk.index > replaceChunk.index) {// 触发替换条件，且不能重复替换
      //@todo:连续替换二次能否替换
        [replaceChunk.index, moveChunk.index] = [moveChunk.index, replaceChunk.index]
        const temp = this.data.surveyList[index]
        this.data.surveyList[index] = this.data.surveyList[index - 1]
        this.data.surveyList[index - 1] = temp
        console.log(this.data.surveyList)
        debugger
      }
    }
    // debugger
    // let cloneChunk = this.data.cloneChunk
   
    
    
    // const moveBottomY = cloneChunk.height + offsetY * 2 - 20
    // let replaceChunk = this.data.moveableViewList[index + 1]
    // if (this.data._ && moveBottomY >= replaceChunk.y) {
    //   this.data._ = false
    //   this.data.surveyList.splice(index, 2, this.data.surveyList[index + 1], cloneChunk)
    //   const temp = replaceChunk
    //   replaceChunk = cloneChunk
    //   cloneChunk = temp
    //   // this.data.moveableViewList[index].y = offsetY * 2
    //   this.setData({
    //     moveableViewList: this.data.moveableViewList,
    //     cloneChunk: this.data.cloneChunk
    //   })

    // }

  },
  /**
   * startMove 里不要触发绑定了 moveableViewList[index] 的 option 的 setData 更新，会导致手机端无法滑动，
   * 触发绑定 surveyList[index]  的 option 的 setData 更新，手机端可以滑动，
   */
  startMove(e) {
    this.data.movable = true
    const index = e.currentTarget.dataset.index
    this.setData({
      cloneChunk: {
        ...this.data.moveableViewList[index],
        zIndex: 0,
        hidden: false,
      },
      [`moveableViewList.${index}`]: {
        ...this.data.moveableViewList[index],
        zIndex: 1,
        actived: true,
      },
      
    })
  },
  addSurvey(e) {
    this.data.direct = []
    const index = Object.keys(this.data.surveyList).length
    //this.data.surveyList[index].height = 1
    //this.data.moveableViewList[index] = { type: e.currentTarget.dataset.type }
    this.setData({
      [`surveyList.${index}`]: { // 先渲染内容，以便获取到 height
        type: e.currentTarget.dataset.type,
      },
      // [`moveableViewList.${index}`]: {
      //   ...this.data.moveableViewList[index],
      //   index,
      // },
    })
    this.fetchHeight(index, '.aaa')
      .then(el => {
        this.data.moveableViewList[index] = { // 先赋值 moveableViewList[index]，再 calHeight
          ...this.data.surveyList[index],
          height: el.height * 2 + 6, // el.height 单位是 px，转化为 rpx。解决 moveableView 设置 height ，实际渲染的高度会减少的问题，所以加上 6
          zIndex: 0,
          index: Number(index),
        }
        this.setData({
          [`moveableViewList.${index}`]: {
            ...this.data.moveableViewList[index],
            y: this.calHeight(this.data.moveableViewList, 20),
          }
        })
      })


  },
  calHeight(o, offsetY) {
    return Object.keys(o).reduce((acc, item, index) => {
      return acc += ((index === 0)
        ? 0
        : o[index - 1].height + offsetY)
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