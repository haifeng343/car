Component({
  properties: {
    value: {
      type: Number
    },
    optionList: {
      type: Array
    }
  },

  data: {
    expand: false,
    label: ''
  },

  methods: {
    calcLabel(value) {
      const { optionList } = this.properties;
      if (this.properties.optionList.length === 0) {
        return;
      }

      let label = optionList[0].label;

      if (typeof value !== 'undefined') {
        const selectedItem = optionList.find((item) => item.value === value);

        if (selectedItem) {
          label = selectedItem.label;
        }
      }

      return label;
    },
    handleExpand() {
      this.setData({ expand: !this.data.expand });
    },
    handleChange(event) {
      let value = event.currentTarget.dataset.item.value;
      let label = event.currentTarget.dataset.item.label;
      this.setData({ label });
      this.triggerEvent('change', { value: value });
    }
  },

  lifetimes: {
    ready() {
      const label = this.calcLabel(this.properties.value);
      this.setData({ label });
    }
  }
});
