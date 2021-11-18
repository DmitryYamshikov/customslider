<script lang="ts" src="./slider.ts"></script>

<template>
		<div
			class="slider"
			ref="slider"
		>

			<div class="slider__arrows">
				<button
						:disabled="currentIndex === 0"
						class="slider__btn slider__btn_prev"
						ref="sliderBtnPrev"
						@click.self="slidePrev($event)"
				>
					<svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M7.74549 1.03968C8.03838 1.33257 8.03838 1.80744 7.74549 2.10034L1.84582 8.00001L7.74549 13.8997C8.03838 14.1926 8.03838 14.6674 7.74549 14.9603C7.45259 15.2532 6.97772 15.2532 6.68483 14.9603L0.254826 8.53034C0.114174 8.38969 0.0351562 8.19892 0.0351562 8.00001C0.0351562 7.80109 0.114174 7.61033 0.254826 7.46968L6.68483 1.03968C6.97772 0.746784 7.45259 0.746784 7.74549 1.03968Z" fill="#8C8C8C"/>
					</svg>
				</button>
				<button
						:disabled="currentIndex === dotsCount-1"
						class="slider__btn slider__btn_next"
						ref="sliderBtnNext"
						@click.stop="slideNext($event)"
						:style="{right: marginBetweenSlides + 12 + 'px'}"
				>
					<svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M0.973576 1.03968C1.26647 0.746784 1.74134 0.746784 2.03424 1.03968L8.46424 7.46968C8.60489 7.61033 8.68391 7.80109 8.68391 8.00001C8.68391 8.19892 8.60489 8.38969 8.46424 8.53034L2.03424 14.9603C1.74134 15.2532 1.26647 15.2532 0.973576 14.9603C0.680683 14.6674 0.680683 14.1926 0.973576 13.8997L6.87325 8.00001L0.973576 2.10034C0.680683 1.80744 0.680683 1.33257 0.973576 1.03968Z" fill="#8C8C8C"/>
					</svg>
				</button>
			</div>

			<ul class="slider__dots" ref="sliderDots" v-if="dots">
				<li
						v-for="n in dotsCount"
						class="slider__dots-item"
						:key="n"
						:class="{active: n-1 === currentIndex}"
						@click="setSlide($event, n-1)"

				></li>
			</ul>

			<div
					@pointerdown="mouseDownHandler($event)"
					@pointermove="mouseMoveHandler($event)"
					@pointerleave="resetActions($event)"
					@pointerup="resetActions($event)"
					class="slider__wrapper"
					ref="sliderWrapper"
					:style="`transform: translateX(-${currentPosition}px)`"
			>
				<slot></slot>
			</div>

		</div>
</template>



