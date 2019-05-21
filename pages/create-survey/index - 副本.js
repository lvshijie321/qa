Page({
  data: {
    loading: false,
    titleValue: "问卷标题",
    prefixValue: '感谢您能抽出几分钟时间来参加本次答题，现在我们就马上开始吧！',
    movable: false,
    surveyList: {},
    cloneChunk: {
      y: 0,
      hidden: true,
    },
    direct: [],
    gap: 20,
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
    this.data._onMoveChunkIndex === undefined
    this.data._directList = undefined
    const index = e.currentTarget.dataset.index
    this.setData({
      [`moveableViewList.${index}`]: {
        ...this.data.moveableViewList[index],
        zIndex: 0,
        actived: false,
      },
    })
  },
  //@todo向上滑动，这个函数合适吗
  calY(index) {
    // 计算滑动模块上面所有模块的 offsetY 累计值
    const prevChunk = this.data.moveableViewList[index - 1]
    let accY = prevChunk ?
      prevChunk.y + prevChunk.height + this.data.gap :
      0
    // 计算替换模块的 height 和 gap
    accY += this.data.moveableViewList[index + 1].height + this.data.gap

    return accY
  },
  _____(height, index, array) {
    this.data.moveableViewList[index] = { // 先赋值 moveableViewList[index]，再 calHeight
      ...this.data.surveyList[index],
      height: height * 2 + 6, // el.height 单位是 px，转化为 rpx。解决 moveableView 设置 height ，实际渲染的高度会减少的问题，所以加上 6
      zIndex: 0,
      index: Number(index),
    }
    this.setData({
      [`moveableViewList.${index}`]: {
        ...this.data.moveableViewList[index],
        y: this.calHeight(array ? array : this.data.moveableViewList, this.data.gap),
      }
    })

  },
  handleCalHeight(index, callback, array) {
    this.fetchHeight(index, '.aaa')
      .then(el => {
        this._____(el.height, index, array)// 先赋值 moveableViewList[index]，再 calHeight

        // this.setData({
        //   [`moveableViewList.${index}`]: {
        //     ...this.data.moveableViewList[index],
        //     y: this.calHeight(array ? array : this.data.moveableViewList, this.data.gap),
        //   }
        // })


        // this.data.moveableViewList[index] = { // 先赋值 moveableViewList[index]，再 calHeight
        //   ...this.data.surveyList[index],
        //   height: el.height * 2 + 6, // el.height 单位是 px，转化为 rpx。解决 moveableView 设置 height ，实际渲染的高度会减少的问题，所以加上 6
        //   zIndex: 0,
        //   index: Number(index),
        // }

        callback && callback()
      })
  },
  copyObject(from, len, target) {
    const o = {}
    for (let i = 0; i < len; i++) {
      o[i] = target[i]
    }
    return o
  },
  updateDom(e) {

    const len = Object.keys(this.data.moveableViewList).length
    this.handleCalHeight(e.detail, () => {
      for (let i = e.detail + 1; i < len; i++) {
        this._____(this.data.moveableViewList[i].height / 2, i, this.copyObject(0, i + 1, this.data.moveableViewList))
      }

      this.setData({
        [`moveableViewList`]: this.data.moveableViewList
      })
    }, this.copyObject(0, e.detail + 1, this.data.moveableViewList))
  },
  oneOfObject(index, o) {
    return Object.keys(o).find(key => o[key].index === index)
  },
  onMove(e) {
    // 检测模块个数，至少 2 个
    const len = Object.keys(this.data.moveableViewList).length
    if (len < 2) return

    // 不能是 moveableview 动画移动，只能是用户手动移动
    if (this.data._onMoveChunkIndex === undefined || this.data._onMoveChunkIndex !== e.currentTarget.dataset.index) return

    // 检测移动方向
    const y = e.detail.y * 2 // 单位是 px
    !this.data._directList && (this.data._directList = [])
    this.data._directList.length === 2 ?
      this.data._directList.splice(0, 2, this.data._directList[this.data._directList.length - 1], y) :
      this.data._directList.push(y)
    if (this.data._directList.length != 2) return

    // 只要不释放，e.currentTarget.dataset.index 永远是滑动模块的索引
    let moveChunk = this.data.moveableViewList[e.currentTarget.dataset.index]
    const index = moveChunk.index // 滑动模块位置改变后的临时索引（临时是相对于未释放而言）

    if (this.data._directList[0] - this.data._directList[1] < 0) { // 向下滑动
      if (index === len - 1) return
      let replaceChunk = this.data.moveableViewList[index + 1]
      const bottomY = y + moveChunk.height
      if (bottomY >= replaceChunk.y && moveChunk.index < replaceChunk.index) { // 触发替换条件，且不能重复替换
        !this.data.arriveCount && (this.data.arriveCount === 0)
        this.data.arriveCount++
        // 替换项：替换模块的 y、index ，但不需要渲染
        let {
          index: tempIndex,
          y: tempY,
        } = moveChunk
        Object.assign(moveChunk, {
          y: this.calY(moveChunk.index), //@todo:有错，cal放在后面
          index: replaceChunk.index,
        })
        // 替换项：surveyList 的元素顺序，但不需要渲染
        let temp = this.data.surveyList[index + 1]
        this.data.surveyList[index + 1] = this.data.surveyList[index]
        this.data.surveyList[index] = temp
        // 替换项：被替换模块的 y、 index，cloneChunk 的 y
        this.setData({
          [`moveableViewList.${index + 1}.y`]: tempY,
          [`moveableViewList.${index + 1}.index`]: tempIndex,
          'cloneChunk.y': moveChunk.y
        })
      }
    } else { // 向上滑动
      if (index === 0) return
      const replaceChunk = this.data.moveableViewList[index - 1]
      if (y <= replaceChunk.y + replaceChunk.height && moveChunk.index > replaceChunk.index) { // 触发替换条件，且不能重复替换
        !this.data.arriveCount && (this.data.arriveCount === 0)
        this.data.arriveCount++
        // 替换项：替换模块的 y、index ，但不需要渲染
        let tempIndex = moveChunk.index
        Object.assign(moveChunk, {
          y: replaceChunk.y,
          index: replaceChunk.index,
        })
        // 替换项：surveyList 的元素顺序，但不需要渲染
        let temp = this.data.surveyList[index - 1]
        this.data.surveyList[index - 1] = this.data.surveyList[index]
        this.data.surveyList[index] = temp

        // 替换项：被替换模块的 y、 index，cloneChunk 的 y
        this.setData({
          [`moveableViewList.${index - 1}.y`]: replaceChunk.y + moveChunk.height + this.data.gap,
          [`moveableViewList.${index - 1}.index`]: tempIndex,
          'cloneChunk.y': replaceChunk.y
        })

      }
    }

  },
  /**
   * startMove 里不要触发绑定了 moveableViewList[index] 的 option 的 setData 更新，会导致手机端无法滑动，
   * 触发绑定 surveyList[index]  的 option 的 setData 更新，手机端可以滑动，
   */
  startMove(e) {
    this.data.movable = true
    const index = this.data._onMoveChunkIndex = e.currentTarget.dataset.index
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
  onInputTitle(e) {
    this.data.titleValue = e.detail.value
  },
  onInputPrefix(e) {
    this.data.prefixValue = e.detail.value
  },
  submit() {
    const param = {
      title_content: this.data.titleValue,
      prefix_content: this.data.prefixValue,
      list: JSON.stringify(this.data._data_.map((item) => {
        const o = {
          type: item.type,
          entity: {
            title: item.title,

          }
        };
        item.type !== 'blank' && (o.entity.items =
          item.optionList.map(_item => {
            const o = {
              name: _item.option
            };
            (item.type === 'multiple_source' || item.type === 'radio_source') &&
              (o.source = _item.score)
            return o
          }))
        return o
      }))
    }
    this.setData({
      loading: true
    })
    wx.$request.createSurvey(param)
      .then(res => {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateTo({
          url: `/pages/survey-list/index`
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
    this.handleCalHeight(index)
    // this.fetchHeight(index, '.aaa')
    //   .then(el => {
    //     this.data.moveableViewList[index] = { // 先赋值 moveableViewList[index]，再 calHeight
    //       ...this.data.surveyList[index],
    //       height: el.height * 2 + 6, // el.height 单位是 px，转化为 rpx。解决 moveableView 设置 height ，实际渲染的高度会减少的问题，所以加上 6
    //       zIndex: 0,
    //       index: Number(index),
    //     }
    //     this.setData({
    //       [`moveableViewList.${index}`]: {
    //         ...this.data.moveableViewList[index],
    //         y: this.calHeight(this.data.moveableViewList, this.data.gap),
    //       }
    //     })
    //   })


  },
  calHeight(o, offsetY) {
    return Object.keys(o).reduce((acc, item, index) => {
      debugger
      return acc += ((index === 0) ?
        0 :
        o[index - 1].height + offsetY)
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
  setTitle() {
    wx.setNavigationBarTitle({
      title: '创建问卷'
    })
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
    } else if (readyPlaceIndex >= surveyList.length) {
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

  onchange(e) {
    !this.data._data_ && (this.data._data_ = [])
    this.data._data_[e.currentTarget.dataset.index] = e.detail
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setTitle()
    //     setTimeout(() =>{
    // debugger
    //       this.setData({ surveyList: this.data.surveyList })
    //     },6000)
  },
})