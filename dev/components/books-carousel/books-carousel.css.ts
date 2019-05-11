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
	width: 100%;
	min-width: 100%;
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
	text-align: center;
	margin: 10px;
	padding: 0;
	height: 280px;
	max-height: 280px;
	border-radius: 5px;
	box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
}

.slider ul li div {
	position: absolute;
    bottom: 0;
    width: 100%;
}

.slider ul li img {
	max-height: calc(100% - 50px);
	max-width: 100%;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -55%);
}

.slider ul li h6 {
	font-size: 1rem;
	margin: 0;
}

.slider ul li p {
	margin: 0;
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
`;
