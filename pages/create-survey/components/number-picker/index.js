// pages/create-survey/components/number-picker/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    step: 5,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    sub() {
      let value = this.data.value - this.data.step
      value = value < 0 ?
        0 :
        value
      this.setData({
        value
      })
      this.triggerEvent('change', value)
    },
    plus() {
      this.setData({
        value: this.data.value + this.data.step
      })
      this.triggerEvent('change', this.data.value)
    }
  }
})