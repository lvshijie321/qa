// pages/create-survey/components/survey/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    option: {
      type: Object,
      observer: 'obOption'
    },
    index: {
      type:Number,
      observer(val) {
        this.setData({
          _index: Number(val) + 1
        })
      }
    }
  },
  
  externalClasses: ['ex-class'],
  /**
   * 组件的初始数据
   */
  data: {
    _index: 1,
  },

 
  
  /**
   * 组件的方法列表
   */
  methods: {

    scoreChange(e) {
     
      this.data.option.optionList[e.currentTarget.dataset.index].score = e.detail
      this.triggerEvent('change',  this.data.option)
    },
    obOption(newValue, oldValue) {
      this.addOne(newValue)
    },
    addOption() {
      this.addOne(this.data.option)
    },
    deleteOption(e) {
      this.data.option.optionList.splice(e.currentTarget.dataset.index, 1)
      this.setData({
        'option.optionList': this.data.option.optionList
      })
    },
    addOne(newValue) {
      !newValue.title && (newValue.title = '')
      if (!newValue.optionList) {
        const option = { option: '选项1' }
        !!(newValue.type === 'multiple_source' || newValue.type === 'radio_source') && (option.score = 0)
        newValue.optionList = [option]
      } else {
        const option = { option: `选项${newValue.optionList.length + 1}` }
        !!(newValue.type === 'multiple_source' || newValue.type === 'radio_source') && (option.score = 0)
        newValue.optionList.push(option)
      }
      this.setData({
        option: newValue
      })
      setTimeout(() => this.triggerEvent('change', this.data.option), 0)
    },
    onInput(e) {
      this.data.option.title = e.detail.value
      this.triggerEvent('change', this.data.option)
    },
    onInputCheck(e) {
      this.data.option.optionList[e.currentTarget.dataset.index].option = e.detail.value
      this.triggerEvent('change', this.data.option)
    },
  }
})
