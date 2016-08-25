/**
 * The screen object contains the functions to getHight() and getWidth()
 * of the window. 
 */
var screen = {
	getWidth: function() {
		if (self.innerWidth)
			return self.innerWidth;
		if (document.documentElement && document.documentElement.clientWidth)
			return document.documentElement.clientWidth;
		if (document.body) 
			return document.body.clientWidth;
	},
	getHeight: function() {
		if (self.innerHeight)
			return self.innerHeight;
		if (document.documentElement && document.documentElement.clientHeight)
			return document.documentElement.clientHeight;
		if (document.body)
			return document.body.clientHeight;
	}
} // End of screen.

/**
 * The message object contains an empty string, that can be set or cleared. 
 */
var message = {
	text: '',
	messageCenter: document.getElementById('message-center'), 
	setText: function(string) {
		this.text = string;
	},
	show: function() {
		this.messageCenter.innerHTML = this.text;
		this.messageCenter.style.visibility = 'visible';
	},
	hide: function() {
		this.messageCenter.style.visibility = 'hidden';
	},
	clearText: function() {
		this.text = '';
	}
} // End of message. 

var score = {
	up: function() {
		var current = parseInt(document.getElementById('score').innerHTML);
		document.getElementById('score').innerHTML = current + 1;
	}
}

/**
 * The mouse object contains the methods to follow the mouse and to track it. 
 */
var mouse = {
	follow: function( x, y ) {
		return "X coords: " + x + ", Y coords: " + y;
	}
} // End of mouse. 

/**
 * The bullet object displays the bullet on the page, writes the coordinates and 
 * moves
 */
var bullet = {
	position: function( x, y ) {
		document.getElementById('testing-box').innerHTML = mouse.follow(x,y);
		bullet.move(y);
	},
	move: function(y) {
		document.getElementById('mouse-position').style.top = y + 'px';
	}
} // End of bullet.

/**
 * The slider object moves the sliding pipes on the page. 
 */
var slider = {
	move: function(obstacle, position, speed) {
		var top = document.getElementById('top'),
			bottom = document.getElementById('bottom'),
			bullet = document.getElementById('mouse-position');
		if(position < screen.getWidth() ) {
			window.setTimeout( function() {
				collision.checkTop(top, bullet, bottom);
				obstacle.style.right = position + 'px';
				slider.move(obstacle, position + 10, speed);
			}, speed);
		} else {
			score.up();
			path.setOpenSpace();
			slider.move(obstacle, 0, speed);
		}
	}
} // End of slider.

/**
 * The calculate object calculates hights for the objects on the page. 
 */
var calculate = {
	heights: function() {
		return Math.floor(Math.random() * screen.getHeight() - 200);
	}
} // End of calculate.

/**
 * The path object handles the math of the open spaces. 
 */
var path = {
	setOpenSpace: function() {
		var top = document.getElementById('top');
			bottom = document.getElementById('bottom');
		console.log(calculate.heights());
		top.style.height = calculate.heights() + 'px';
		bottom.style.height = (screen.getHeight() - parseInt(top.style.height) - 200) + 'px';
	}
} // End of path. 

/**
 * The collision object handles the collisions of objects. 
 */
var collision = {
	checkTop: function(a, b, c) {
		var bulletWidth = b.getBoundingClientRect().right;
			bulletHeight = b.getBoundingClientRect().top - 61;
			bulletBottom = b.getBoundingClientRect().bottom;
			topWidth = a.getBoundingClientRect().left;
			topHeight = a.getBoundingClientRect().bottom;
			bottomWidth = c.getBoundingClientRect().left;
			bottomHeight = c.getBoundingClientRect().top;
		if( topWidth <= bulletWidth && bulletHeight <= topHeight ) {
			console.log('Game Over');
		}
		return false; 
	},
	checkBottom: function(a, b) {

	}
} // End of collision. 

/** 
 * When the DOM is loaded, run these functions. 
 */
document.addEventListener('DOMContentLoaded', function(){ 

	slider.move(document.getElementById('slider'), 0, 10);

	document.addEventListener('mousemove', function(e) {
		bullet.position(e.screenX, e.screenY);
	});

}, false);
