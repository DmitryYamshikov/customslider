<script lang="ts" src="./App.ts"></script>

<template>
	<div class="container">
		<slider
			:dots="true"
			:arrows="true"
			:freeMode="false"
			:slidesToShow="5"
			:slidesToScroll="3"
			:marginBetweenSlides="10"
			:breakpoints="breakpoints"
			:arrowSize="'big'"
			:dotsPos="'right'"
			:timer="2000"
		>
			<div class="slide">1</div>
			<div class="slide">2</div>
			<div class="slide">3</div>
			<div class="slide">4</div>
			<div class="slide">5</div>
			<div class="slide">6</div>
			<div class="slide">7</div>
			<div class="slide">8</div>
		</slider>
	</div>
</template>

<style lang="scss">
* {
	padding:    0;
	margin:     0;
	box-sizing: border-box;
}

#app {
	font-family:             Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing:  antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align:              center;
	color:                   #2c3e50;
}

.slide {
	height:          200px;
	display:         flex;
	justify-content: center;
	align-items:     center;
	border:          1px solid black;
	box-sizing:      border-box;
}

.container {
	padding:  15px;
	overflow: hidden;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color:       #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>

