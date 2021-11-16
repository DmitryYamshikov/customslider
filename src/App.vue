<script lang="ts" src="./App.ts"></script>

<template>
	<slider
		:dots="true"
		:arrows="true"
	>
		<div class="slide">1</div>
		<div class="slide">2</div>
		<div class="slide">3</div>
		<div class="slide">4</div>
	</slider>
</template>

<style lang="scss">
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.slide {
	height: 200px;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid black;
	box-sizing: border-box;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

