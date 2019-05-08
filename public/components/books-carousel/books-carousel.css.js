export const styles = `
:host {
	display: block;
}

:host([hidden]) {
	display: none;
}

.slider {
	position: relative;
	overflow: hidden;
	max-height: 300px;
}

.slider ul {
	position: relative;
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-wrap: nowrap;
}
  
.slider ul li {
	position: relative;
	display: flex;
	align-items: center;
    justify-content: center;
	margin: 10px;
	padding: 0;
	min-width: 250px;
	height: 280px;
	max-height: 280px;
	border-radius: 5px;
	box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
}

.slider ul li img {
	max-height: 100%;
	max-width: 100%;
}

a.control_prev, a.control_next {
	position: absolute;
	border-radius: 10px;
	top: 40%;
	z-index: 999;
	display: block;
	padding: .5rem;
	width: auto;
	height: auto;
	background: #2a2a2a;
	color: #fff;
	text-decoration: none;
	font-weight: 600;
	font-size: 18px;
	opacity: 0.8;
	cursor: pointer;
}

a.control_prev:hover, a.control_next:hover {
	opacity: 1;
	-webkit-transition: all 0.2s ease;
}

a.control_prev {
	border-radius: 0 2px 2px 0;
}

a.control_next {
	right: 0;
	border-radius: 2px 0 0 2px;
}

@media only screen and (min-width: 1000px)  {
	.slider {
		max-height: 400px;
	}

	.slider ul li {
		min-width: 300px;
		height: 380px;
		max-height: 380px;
	}
}
`;
//# sourceMappingURL=books-carousel.css.js.map