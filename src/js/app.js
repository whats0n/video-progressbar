$(document).ready(function() {
	
	class Video {

		constructor() {

			this._btn = $('.js-play');
			this._video = $('.js-video');
			this._bar = $('.js-progress');
			this._slider = $('.js-slider');
			this._slides = this._slider.find('.js-slide').length;

			//flag: active video playing or not
			this._playing = true;
			//current slide number (after change)
			this._counter = 0;
			//current slide number (before change)
			this._current = this._counter;
			//progressbar animation speed
			this._duration = 20;

			this._init();
		}

		_init() {
			this._playOnClick();
			this._addSlider();
		}

		_playOnClick() {
			this._btn.click((e) => {
				e.preventDefault();
				if (this._playing === false) {
					this._playing = true;
					this._getVideo(this._counter).play();
				} else {
					this._playing = false;
					this._getVideo(this._counter).pause();
				};
			});
		}

		_videoOnPlay(video) {
			let percent = 100 / video.duration;

			this._stopVideoProgress();
			this._moveVideoProgress(percent, video);

			//reset progress bar and change slide on video end
			video.onended = () => {
				this._slider.slick('slickNext');
			};

			video.play();
			this._playing = true;
		}

		_moveVideoProgress(percent, video) {
			let timer;
			this._timer = setTimeout(timer = () => {
				//find video progress in percent
				let progress = video.currentTime * percent;

				this._setProgress(progress);

				this._timer = setTimeout(timer, this._duration);

			}, this._duration);
		}

		_stopVideoProgress() {
			clearTimeout(this._timer);
		}

		_setProgress(progress) {
			this._bar.css({
				'transform': `translate3d(${progress - 100}%,0,0)`
			});
		}

		_addSlider() {
			this._video.eq(0).get(0).oncanplay = () => {
				if (!this._slider.hasClass('slick-initialized')) {
					this._slider.on('init', (e) => {
						let video = this._getVideo(0);
						this._videoOnPlay(video);
					});

					this._slider.slick({
						arrows: false
					});

					this._slider.on('beforeChange', (e, slick, current, next) => {
						if (current !== next) {
							this._setProgress(0);
							this._stopVideoProgress();
						}
						//set 'current' slide to see that we've changed slide or not
						this._current = current;
					});

					this._slider.on('afterChange', (e, slick, current) => {
						//play new video if slide really was changed
						if (this._current !== current) {
							let video = this._getVideo(current);
							this._counter = current;
							this._resetVideoTime();
							this._videoOnPlay(video);
						}
					});
				};
			};
		}

		_resetVideoTime() {
			this._setProgress(0);
			this._video.each(function() {
				this.currentTime = 0;
			});
		}

		_getVideo(index) {
			return this._slider.find(`.slick-slide[data-slick-index="${index}"] .js-video`).get(0)
		}

	}

	new Video();

});