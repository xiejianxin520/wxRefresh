Component({
	properties: {
		//刷新
		refresh: {
			type: Number,
			value: 0, // 0 表示成功  -1失败  1没有数据了  100成功
			observer: 'refreshObserver'
		},
		load: {
			type: Number,
			value: 0, // 0 表示成功  -1失败  1没有数据了  100成功
			observer: 'loadObserver'
		},
		duration: {
			type: Number,
			value: 1800,
		},
		refreshSuccessHeight: {
			type: Number,
			value: 0
		},
		loadSuccessHeight: {
			type: Number,
			value: '0'
		},
		refreshEnable: {
			type: Boolean,
			value: true,
		},
		loadEnable: {
			type: Boolean,
			value: true,
		},
		spaceColor: {
			type: String,
			value: "rgba(255, 255, 255, 0)"
		},
		topSize: {
			type: Number,
			value: 0,
			observer: "topSizeObserver"
		},
		bottomSize: {
			type: Number,
			value: 0,
			observer: "bottomSizeObserver"
		},
		crossBoundaryReboundHeight: {
			type: Number,
			value: 0
		},
		scrollSpace: {
			type: String,
			value: '0px'
		},
		rebuild: {
			value: false,
			type: Boolean,
			observer: "rebuildObserver"
		},
		noDataToLoadMoreEnable: {
			value: false,
			type: Boolean,
		},
		scrollToTop: {
			value: false,
			type: Boolean,
			observer: "scrollToTopObserver"
		},
		scrollToBottom: {
			value: false,
			type: Boolean,
			observer: "scrollToBottomObserver"
		},
		headerBelowSticky: {
			value: false,
			type: Boolean
		}
	},
	options: {
		multipleSlots: true,
	},
	data: {
		//sticky
		interval_height: -1,
		_interval_height: -1,
		interval: false,
		sticky_height:  -1,
		_sticky_height:  -1,
		sticky: false,
		sticky_offset: 0,

		//sticky_2
		interval_height_2:-1,
		_interval_height_2:-1,
		interval_2: false,
		sticky_height_2:-1,
		_sticky_height_2:-1,
		sticky_2: false,
		sticky_offset_2: 0,

		//sticky_3
		interval_height_3:-1,
		_interval_height_3:-1,
		interval_3: false,
		sticky_height_3:-1,
		_sticky_height_3:-1,
		sticky_3: false,
		sticky_offset_3: 0,

		movable_height: 0,
		movable_y: 0, //movable y方向的偏移量

		//刷新  
		header_height: 0,
		header_exist: false,
		refresh_state: 1, // 1: 下拉刷新, 2: 松开更新, 3: 刷新中, 4: 刷新完成

		//加载
		footer_height: 0,
		footer_exist: false,
		load_state: 1, // 1: 上拉加载, 2: 松开加载, 3: 加载中, 4: 加载完成

		//other 
		over_page: false, //超过一页
		content_height: 0, //slot=content 高度
		scroll_height: 0, //滚动布局的高度
		space_height: 0, //填充到一页的高度
		current_scroll: 0, //当前滚动的位置
		empty_height: 0, // content 为空 展示的高度
		sticky_container: null,
		sticky_intervel: false,
		header_below: 0,
		_header_below: 0
	},
	methods: {
		init() {
			this.createSelectorQuery().select("#__header").boundingClientRect((__header) => {
				this.data.header_height = __header.height
				if (this.data.header_height == 0) {
					this.data.header_height = this.rpx2px(this.properties.crossBoundaryReboundHeight) / 2
					this.properties.refreshEnable = false
				} else
					this.data.header_exist = true
				this.setData({
					header_height: this.data.header_height,
					movable_y: -2 * this.data.header_height,
					header_exist: this.data.header_exist,
					animation: ''
				})
				setTimeout(() => {
					this.setData({
						animation: 'true'
					}, 50)
				})
			}).exec();
			this.createSelectorQuery().select("#__interval").boundingClientRect((__interval) => {
				this.data.interval_height = __interval.height
				this.data._interval_height = __interval.height
				this.data.sticky_offset = this.data.interval_height
				this.setData({
					interval_height: this.data.interval_height
				})
			}).exec();
			this.createSelectorQuery().select("#__interval_2").boundingClientRect((__interval) => {
				this.data.interval_height_2 = __interval.height
				this.data._interval_height_2 = __interval.height
				this.data.sticky_offset_2 = this.data.interval_height + this.data.interval_height_2
				this.setData({
					interval_height_2: this.data.interval_height_2
				})
			}).exec();
			this.createSelectorQuery().select("#__interval_3").boundingClientRect((__interval) => {
				this.data.interval_height_3 = __interval.height
				this.data._interval_height_3 = __interval.height
				this.data.sticky_offset_3 = this.data.interval_height + this.data.interval_height_2 + this.data.interval_height_3
				this.setData({
					interval_height_3: this.data.interval_height_3
				})
			}).exec();
			this.createSelectorQuery().select("#__sticky").boundingClientRect((__sticky) => {
				this.data.sticky_height = __sticky.height
				this.data._sticky_height = __sticky.height  
				this.setData({
					sticky_height: this.data.sticky_height
				})
			}).exec();
			this.createSelectorQuery().select("#__sticky_2").boundingClientRect((__sticky) => {
				this.data.sticky_height_2 = __sticky.height
				this.data._sticky_height_2 = __sticky.height
				this.setData({
					sticky_height_2: this.data.sticky_height_2
				})
			}).exec();
			this.createSelectorQuery().select("#__sticky_3").boundingClientRect((__sticky) => {
				this.data.sticky_height_3 = __sticky.height
				this.data._sticky_height_3 = __sticky.height
				this.setData({
					sticky_height_3: this.data.sticky_height_3
				})
			}).exec();
			this.createSelectorQuery().select("#__movable_view").boundingClientRect((__movable_view) => {
				this.data.movable_height = __movable_view.height
				this.setData({
					movable_height: this.data.movable_height,
				})
			}).exec();
			this.createSelectorQuery().select("#__footer").boundingClientRect((__footer) => {
				this.data.footer_height = __footer.height
				if (this.data.footer_height == 0) {
					this.data.footer_height = this.rpx2px(this.properties.crossBoundaryReboundHeight) / 2
					this.properties.loadEnable = false
				} else
					this.data.footer_exist = true
				this.setData({
					footer_height: this.data.footer_height,
					over_page_footer_height: this.data.footer_height,
					footer_exist: this.data.footer_exist
				})
			}).exec();
			this.createSelectorQuery().select("#__scroll_view").boundingClientRect((__scroll_view) => {
				this.data.scroll_height = __scroll_view.height
			}).exec();
			this.createSelectorQuery().select("#__content_empty").boundingClientRect((__content_empty) => {
				this.data.empty_height = __content_empty.height
				this.setData({
					empty_height: this.data.empty_height
				})
			}).exec();
			this.createSelectorQuery().select("#__content").boundingClientRect((__content) => {
				this.data.content_height = __content.height
				this.data.header_below = this.data.interval_height + this.data.sticky_height + this.data.interval_height_2 + this.data.sticky_height_2 + this.data.interval_height_3 + this.data.sticky_height_3
				this.data._header_below = this.data.header_below
				var diff = this.data.scroll_height - this.data.content_height - this.data.sticky_height - this.data.sticky_height_2 - this.data.sticky_height_3 - this.data.interval_height - this.data.interval_height_2 - this.data.interval_height_3 - this.rpx2px(this.properties.topSize) - this.rpx2px(this.properties.bottomSize)
				this.data.space_height = diff
				if (this.data.empty_height > 0 && this.data.content_height == 0 && (this.data.space_height < this.data.empty_height)) {
					this.data.space_height = this.data.space_height - this.data.empty_height
				}
				this.setData({
					content_height: this.data.content_height
				})
				if (this.data.space_height < 0) {
					this.data.over_page = true
					this.setData({
						over_page: true
					})
				} else {
					this.setData({
						space_height: this.data.space_height
					})
					this.triggerEvent("load-status", {
						state: 0
					}, {})
				}
				if (this.data.header_height == 0)
					console.error('You should add header for wxRefresh. Click here(https://github.com/hacknife/wxRefresh)')
				if (this.data.footer_height == 0)
					console.error('You should add footer for wxRefresh. Click here(https://github.com/hacknife/wxRefresh)')

				var info = {
					"header_height": this.data.header_height,
					"interval_height": this.data.interval_height,
					"interval_height_2": this.data.interval_height_2,
					"interval_height_3": this.data.interval_height_2,
					"sticky_height": this.data.sticky_height,
					"sticky_height_2": this.data.sticky_height_2,
					"sticky_height_3": this.data.sticky_height_2,
					"scroll_height": this.data.scroll_height,
					"content_height": this.data.content_height,
					"footer_height": this.data.footer_height,
					"over_page": this.data.over_page,
					"empty_height": this.data.empty_height,
					"space_height": this.data.space_height,
					"header_below":this.data.header_below,
				}
 
				if (this.data.content_height > 0) {
					setTimeout(() => {
						this.rebuild(true)
					}, 500)
				}
				this.triggerEvent("info", info, {})
			}).exec();

			this.triggerEvent("refresh-status", {
				state: this.properties.refreshEnable ? 1 : 0
			}, {})
			this.triggerEvent("load-status", {
				state: this.properties.loadEnable ? 1 : 0
			}, {})
		},
		headerBelow(state) { 
			this.data.sticky = state
			this.data.interval = state
			this.data.sticky_2 = state
			this.data.interval_2 = state
			this.data.sticky_3 = state
			this.data.interval_3 = state
			this.data.sticky_intervel = state
			var  interval_height = state ? 0 : this.data._interval_height
			var  interval_height_2 = state ? 0 : this.data._interval_height_2
			var  interval_height_3 = state ? 0 : this.data._interval_height_3
			var  sticky_height = state ? 0 : this.data._sticky_height
			var  sticky_height_2 = state ? 0 : this.data._sticky_height_2
			var  sticky_height_3 = state ? 0 : this.data._sticky_height_3
			var  header_below = state? this.data._header_below : 0   
			var data = {
				interval_height: interval_height ,
				sticky_height:sticky_height,
				interval_height_2:interval_height_2,
				sticky_height_2: sticky_height_2,
				interval_height_3: interval_height_3,
				sticky_height_3: sticky_height_3,
				header_below: header_below,
				sticky: state,
				interval: state,
				sticky_2: state,
				interval_2: state,
				sticky_3: state,
				interval_3: state, 
			} 
			this.setData(data) 
		},
		onMovableChange(e) {
			var drag = -2 * this.data.header_height - e.detail.y
			this.triggerEvent("drag", {
				space: drag
			}, {})
 			if (this.properties.headerBelowSticky && drag < -0.15 && !this.data.sticky_intervel) {
				this.headerBelow(true)
			} else if (this.properties.headerBelowSticky && drag > -0.15 && this.data.sticky_intervel) {
				this.headerBelow(false)
			}

			this.onScrollChanged({
				detail: {
					scrollTop: this.data.current_scroll - 2 * this.data.header_height - e.detail.y,
					manual: ''
				}
			})
			var y = e.detail.y
			if (this.data.refresh_state > 2 || this.data.load_state > 2) { // 1: 下拉刷新, 2: 松开更新, 3: 刷新中, 4: 刷新完成
				if (this.data.refresh_state == 3) {
					this.triggerEvent('refresh-status', {
						state: this.data.refresh_state,
						percent: (y + this.data.header_height) / (this.data.header_height * 1.00)
					})
				} else if (this.data.refresh_state > 3) {
					this.triggerEvent('refresh-status', {
						state: this.data.refresh_state,
						percent: (y + 2 * this.data.header_height) / (this.data.header_height * 1.00)
					})
				}
				if (this.data.load_state == 3) {
					this.triggerEvent('load-status', {
						state: this.data.load_state,
						percent: (-2 * this.data.header_height - this.data.footer_height - y) / (this.data.footer_height * 1.00)
					})
				} else if (this.data.load_state > 3) {
					this.triggerEvent('load-status', {
						state: this.data.load_state,
						percent: (-2 * this.data.header_height - y) / (this.data.footer_height * 1.00)
					})
				}
				return
			}
			if (y >= -this.data.header_height && this.properties.refreshEnable) { // |-| | | |
				if (this.data.refresh_state != 2) {
					this.data.refresh_state = 2
					this.triggerEvent("refresh-state", {
						state: this.data.refresh_state
					}, {})
				}
				this.triggerEvent("refresh-status", {
					state: this.data.refresh_state,
					percent: (y + this.data.header_height) / (this.data.header_height * 1.00)
				}, {})
			} else if (y >= -2 * this.data.header_height && y < -this.data.header_height && this.properties.refreshEnable) { // | |-| | |
				if (this.data.refresh_state != 1) {
					this.data.refresh_state = 1
					this.triggerEvent("refresh-state", {
						state: this.data.refresh_state
					}, {})
				}
				this.triggerEvent("refresh-status", {
					state: this.data.refresh_state,
					percent: (y + 2 * this.data.header_height) / (this.data.header_height * 1.00)
				}, {})

			} else if (y >= -2 * this.data.header_height - this.data.footer_height && y < -2 * this.data.header_height && !this.data.over_page && this.properties.loadEnable) { // | | |-| |
				if (this.data.load_state != 1) {
					this.data.load_state = 1
					if (!(this.properties.load == 1 && !this.properties.noDataToLoadMoreEnable)) {
						this.triggerEvent("load-state", {
							state: this.data.load_state
						}, {})
					}
				}
				if (this.properties.load == 1 && !this.properties.noDataToLoadMoreEnable) {} else {
					this.triggerEvent("load-status", {
						state: this.data.load_state,
						percent: (-2 * this.data.header_height - y) / (this.data.footer_height * 1.00)
					}, {})
				}
			} else if (y < -2 * this.data.header_height - this.data.footer_height && !this.data.over_page && this.properties.loadEnable) { // | | | |-|
				if (this.data.load_state != 2) {
					this.data.load_state = 2
					if (!(this.properties.load == 1 && !this.properties.noDataToLoadMoreEnable)) {
						this.triggerEvent("load-state", {
							state: this.data.load_state
						}, {})
					}
				}
				if (this.properties.load == 1 && !this.properties.noDataToLoadMoreEnable) {} else {
					this.triggerEvent("load-status", {
						state: this.data.load_state,
						percent: (-2 * this.data.header_height - this.data.footer_height - y) / (this.data.footer_height * 1.00)
					}, {})
				}
			} else if (y < -2 * this.data.header_height && this.data.over_page && this.properties.loadEnable) {
				if (this.properties.load == 1 && !this.properties.noDataToLoadMoreEnable) {} else {
					this.data.load_state = 1
					this.properties.load = 0
					this.onScrollBottom('')
					this.setData({
						movable_y: -2 * this.data.header_height
					})
				}
			}
		},
		onMovableTouchEnd(e) {
			this.triggerEvent("drag-end")
			if (this.data.refresh_state > 2 || this.data.load_state > 2) return // 1: 下拉刷新, 2: 松开更新, 3: 刷新中, 4: 刷新完成
			if (this.data.refresh_state == 1 && this.data.load_state == 1) {
				this.setData({
					movable_y: -2 * this.data.header_height
				})
			} else if (this.data.refresh_state == 2) {
				this.data.refresh_state = 3
				this.triggerEvent("refresh-state", {
					state: this.data.refresh_state
				}, {})
				this.triggerEvent("refresh-status", {
					state: this.data.refresh_state,
				}, {})
				this.properties.refresh = 100
				this.properties.load = 0
				this.triggerEvent("load-state", {
					state: 1,
				}, {})
				this.triggerEvent("load-status", {
					state: 1,
				}, {})
				this.setData({
					movable_y: -this.data.header_height,
					refresh_state: this.data.refresh_state,
					over_page_footer_height: this.data.footer_height
				})
				this.triggerEvent('refresh');
			} else if (this.data.load_state == 2 && (this.properties.load != 1 || this.properties.noDataToLoadMoreEnable)) {
				this.data.load_state = 3
				this.triggerEvent("load-state", {
					state: this.data.load_state
				}, {})
				this.triggerEvent("load-status", {
					state: this.data.load_state
				}, {})
				this.properties.load = 100
				this.setData({
					movable_y: -2 * this.data.header_height - this.data.footer_height,
					load_state: this.data.load_state,
				})
				this.triggerEvent('load');
			} else if (this.data.load_state == 2) {
				this.setData({
					movable_y: -2 * this.data.header_height
				})
			}
		},
		onScrollChanged(e) {
			var top = e.detail.scrollTop
			var manual = true
			if (e.detail.manual == null) {
				this.data.current_scroll = top
				this.triggerEvent("scroll", {
					space: top
				}, {})
				manual = false
			}

			this.triggerEvent("scroll-drag", {
				space: top
			}, {})
			if (this.data.sticky_height != 0) {
				if (top >= this.data.sticky_offset) {
					if (this.data.sticky != true) {
						this.data.sticky = true
						this.setData({
							sticky: this.data.sticky
						})
						this.triggerEvent("sticky", {
							"id": "__sticky",
							"percent": 1.0
						}, {})
					}

				} else {
					if (this.data.sticky != false && (!this.properties.headerBelowSticky || !manual)) {
						this.data.sticky = false
						this.setData({
							sticky: this.data.sticky
						})
					}
					var percent = top * 1.00 / this.data.sticky_offset
					this.triggerEvent("sticky", {
						"id": "__sticky",
						"percent": percent
					}, {})
				}
			}
			if (this.data.sticky_height_2 != 0) {
				if (top >= this.data.sticky_offset_2) {
					if (this.data.sticky_2 != true) {
						this.data.sticky_2 = true
						this.setData({
							sticky_2: this.data.sticky_2
						})
						this.triggerEvent("sticky", {
							"id": "__sticky_2",
							"percent": 1.0
						}, {})
					}
				} else {
					if (this.data.sticky_2 != false && (!this.properties.headerBelowSticky || !manual)) {
						this.data.sticky_2 = false
						this.setData({
							sticky_2: this.data.sticky_2
						})
					}
					var percent = top * 1.00 / this.data.sticky_offset_2
					this.triggerEvent("sticky", {
						"id": "__sticky_2",
						"percent": percent
					}, {})
				}
			}
			if (this.data.sticky_height_3 != 0) {
				if (top >= this.data.sticky_offset_3) {
					if (this.data.sticky_3 != true) {
						this.data.sticky_3 = true
						this.setData({
							sticky_3: this.data.sticky_3
						})
						this.triggerEvent("sticky", {
							"id": "__sticky_3",
							"percent": 1.0
						}, {})
					}
				} else {
					if (this.data.sticky_3 != false && (!this.properties.headerBelowSticky || !manual)) {
						this.data.sticky_3 = false
						this.setData({
							sticky_3: this.data.sticky_3
						})
					}
					var percent = top * 1.00 / this.data.sticky_offset_3
					this.triggerEvent("sticky", {
						"id": "__sticky_3",
						"percent": percent
					}, {})
				}
			}
		},
		refreshObserver() {
			this.rebuild(true)
			if (this.properties.refresh == 100 && !this.properties.load) {
				setTimeout(() => {
					this.setData({
						movable_y: -this.data.header_height + 20
					})
					setTimeout(() => {
						this.onMovableTouchEnd(null)
					}, 500)
				}, 500)
				return
			}
			if (this.properties.refresh == 100) return

			if (this.data.refreshSuccessHeight != 0) {
				this.data.refresh_state = this.properties.refresh == 0 ? 4 : (this.properties.refresh == 1 ? 5 : 6)
				this.triggerEvent("refresh-state", {
					state: this.data.refresh_state
				}, {})
				this.triggerEvent("refresh-status", {
					state: this.data.refresh_state
				}, {})
				this.setData({
					movable_y: -2 * this.data.header_height + this.rpx2px(this.properties.refreshSuccessHeight),
					refresh_state: this.data.refresh_state
				})
				setTimeout(() => {
					this.setData({
						movable_y: -2 * this.data.header_height,
					})
					setTimeout(() => {
						this.data.refresh_state = 1
						this.triggerEvent("refresh-state", {
							state: this.data.refresh_state
						}, {})
						this.triggerEvent("refresh-status", {
							state: this.data.refresh_state
						}, {})
						this.setData({
							refresh_state: this.data.refresh_state
						})
					}, 1000)
				}, this.properties.duration)
			} else {
				this.data.refresh_state = 1
				this.triggerEvent("refresh-state", {
					state: this.data.refresh_state
				}, {})
				this.triggerEvent("refresh-status", {
					state: this.data.refresh_state
				}, {})
				this.setData({
					movable_y: -2 * this.data.header_height,
					refresh_state: this.data.refresh_state
				})
			}

		},
		loadObserver() {
			this.rebuild(false)
			if (this.properties.load == 100 && this.properties.refresh != 100 && !this.data.over_page) {
				setTimeout(() => {
					this.setData({
						movable_y: -2 * this.data.header_height - this.data.footer_height - 20
					})
					setTimeout(() => {
						this.onMovableTouchEnd(null)
					}, 500)
				}, 500)
				return
			}
			if (this.properties.load == 100) return
			if (this.data.loadSuccessHeight != 0 && !this.data.over_page) {
				this.data.load_state = this.properties.load == 0 ? 4 : (this.properties.load == 1 ? 5 : 6)
				this.triggerEvent("load-state", {
					state: this.data.load_state
				}, {})
				this.triggerEvent("load-status", {
					state: this.data.load_state
				}, {})

				this.setData({
					movable_y: -2 * this.data.header_height - this.rpx2px(this.properties.loadSuccessHeight),
					load_state: this.data.load_state
				})
				setTimeout(() => {
					this.setData({
						movable_y: -2 * this.data.header_height,
					})
					setTimeout(() => {
						this.data.load_state = 1
						this.setData({
							load_state: this.data.load_state
						})
						if (this.properties.load == 1 && !this.properties.noDataToLoadMoreEnable) {
							this.setData({
								over_page_footer_height: this.rpx2px(this.properties.loadSuccessHeight)
							})
						} else {
							this.triggerEvent("load-state", {
								state: this.data.load_state
							}, {})
							this.triggerEvent("load-status", {
								state: this.data.load_state
							}, {})
						}
					}, 1000)
				}, this.properties.duration)
			} else if (this.data.loadSuccessHeight != 0 && this.data.over_page) {
				if (this.properties.load != 0) {
					this.data.load_state = this.properties.load == 1 ? 5 : 6
					this.triggerEvent("load-state", {
						state: this.data.load_state
					}, {})
					this.triggerEvent("load-status", {
						state: this.data.load_state
					}, {})
					this.setData({
						load_state: this.data.load_state
					})
					//当刷新完成之前，布局由于手动操作滚上去。 
					if (this.data.current_scroll > this.rpx2px(this.properties.loadSuccessHeight) - this.data.space_height) {
						this.setData({
							scrollSpace: -this.data.space_height + this.rpx2px(this.properties.loadSuccessHeight)
						})
					}
					if (this.properties.load == 1 && !this.properties.noDataToLoadMoreEnable) {
						setTimeout(() => {
							this.setData({
								over_page_footer_height: this.rpx2px(this.properties.loadSuccessHeight)
							})
						}, 500)
					}
					this.data.load_state = 1
					this.setData({
						load_state: this.data.load_state
					})

				} else {
					this.data.load_state = 1
					this.triggerEvent("load-state", {
						state: this.data.load_state
					}, {})
					this.triggerEvent("load-status", {
						state: this.data.load_state
					}, {})
					this.setData({
						load_state: this.data.load_state
					})
				}
			} else if (this.data.loadSuccessHeight == 0 && this.data.over_page) {
				this.setData({
					scrollSpace: -this.data.space_height + this.rpx2px(this.properties.loadSuccessHeight),
				})
				setTimeout(() => {
					this.data.load_state = 1
					this.setData({
						load_state: this.data.load_state,
					})
					this.triggerEvent("load-status", {
						state: this.data.load_state
					}, {})
					if (this.properties.load == 1 && !this.properties.noDataToLoadMoreEnable) {
						this.setData({
							over_page_footer_height: 0
						})
					}
				}, 500)

			} else if (this.data.loadSuccessHeight == 0 && !this.data.over_page) {
				this.data.load_state = 1
				this.triggerEvent("load-status", {
					state: this.data.load_state,
				}, {})
				this.setData({
					movable_y: -2 * this.data.header_height,
				})
				setTimeout(() => {
					this.setData({
						load_state: this.data.load_state
					})
				}, 800)
			}
		},
		rebuildObserver() {
			if (this.properties.rebuild)
				this.rebuild(true)
			this.properties.rebuild = false
		},
		topSizeObserver() {
			this.rebuild(true)
		},
		bottomSizeObserver() {
			this.rebuild(true)
		},
		onScrollBottom(e) {
			this.triggerEvent('bottom');
			if (!this.properties.loadEnable) return
			if (this.properties.load == 100 || (this.properties.load == 1 && !this.properties.noDataToLoadMoreEnable)) return
			this.properties.load = 100
			if (this.data.load_state == 1) {
				this.data.load_state = 2
				this.setData({
					load_state: this.data.load_state
				})
				this.triggerEvent("load-state", {
					state: this.data.load_state
				}, {})
				this.triggerEvent("load-status", {
					state: this.data.load_state
				}, {})
				this.data.load_state = 3
				this.setData({
					load_state: this.data.load_state
				})
				this.triggerEvent("load-status", {
					state: this.data.load_state
				}, {})
				this.triggerEvent("load-state", {
					state: this.data.load_state
				}, {})
				this.triggerEvent('load');
			}
		},
		onScrollTop(e) {
			this.triggerEvent("top")
		},
		scrollToTopObserver() {
			this.setData({
				scrollSpace: '0px'
			})
			this.properties.scrollToTop = false
		},
		scrollToBottomObserver() {
			this.rebuild(true)
			this.properties.scrollToBottom = false
			setTimeout(() => {
				this.setData({
					scrollSpace: (-this.data.space_height) + 'px'
				})
			}, 500)

		},
		rebuild(_is_refresh) {
			if (!this.data.over_page || _is_refresh || (this.data.over_page && this.data.content_height == 0) || (this.data.over_page && this.data.loadEnable)) {
				this.createSelectorQuery().select("#__content").boundingClientRect((__content) => {
					this.data.content_height = __content.height
					var diff = this.data.scroll_height - this.data.content_height - this.data.sticky_height - this.data.sticky_height_2 - this.data.sticky_height_3 - this.data.interval_height - this.data.interval_height_2 - this.data.interval_height_3 - this.rpx2px(this.properties.topSize) - this.rpx2px(this.properties.bottomSize)
					this.data.space_height = diff
					if (this.data.empty_height > 0 && this.data.content_height == 0 && (this.data.space_height < this.data.empty_height)) {
						this.data.space_height = this.data.space_height - this.data.empty_height
					}
					this.setData({
						content_height: this.data.content_height
					})
					if (this.data.space_height < 0) {
						this.data.over_page = true
						this.setData({
							over_page: this.data.over_page
						})
					} else {
						this.data.over_page = false
						this.setData({
							space_height: this.data.space_height,
							over_page: this.data.over_page
						})
					}
					var info = {
						"header_height": this.data.header_height,
						"interval_height": this.data.interval_height,
						"sticky_height": this.data.sticky_height,
						"interval_height_2": this.data.interval_height_2,
						"scroll_height": this.data.scroll_height,
						"content_height": this.data.content_height,
						"footer_height": this.data.footer_height,
						"over_page": this.data.over_page,
						"empty_height": this.data.empty_height,
						"space_height": this.data.space_height,
					}
					// console.log(info)
				}).exec()
			}
		},
		rpx2px(_rpx) {
			return wx.getSystemInfoSync().screenWidth / 750.00 * _rpx
		},
	},
	ready() {
		this.init();
	}
});