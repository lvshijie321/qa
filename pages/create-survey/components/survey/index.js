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
    index: Number
  },
  
  externalClasses: ['ex-class'],
  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    obOption(newValue, oldValue) {
      this.addOne(newValue)
    },
    addOption() {
      this.addOne(this.data.option)
    },
    deleteOption() {
      this.setData({
        optionList: (this.data.optionList.pop(), this.data.optionList)
      })
    },
    addOne(newValue) {
      !newValue.title && (newValue.title = '')
      if (!newValue.optionList) {
        const option = { option: '选项1' }
        !!(newValue.type === 'multiple_source' || newValue.type === 'radio_source') && (option.score = 1)
        newValue.optionList = [option]
      } else {
        const option = { option: `选项${newValue.optionList.length + 1}` }
        !!(newValue.type === 'multiple_source' || newValue.type === 'radio_source') && (option.score = 1)
        newValue.optionList.push(option)
      }
      this.setData({
        option: newValue
      })
    },
  }
})
