var gameOver = false; // Is the game over?
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
 * The gravity object handles all the flying and falling functionality of the game.
 */
var gravity = {
	fired: false,
	listen: function() {
		gravity.fall();
		document.addEventListener('keydown', function(e) {
			if(e.keyCode === 32 && gravity.fired === false) {
				gravity.fired = true;
				gravity.stop();
				gravity.fly();
			} 
		});
	}, 
	fly: function() {
		var top = document.getElementById('bullet').getBoundingClientRect().top
		if(gravity.fired === true && top > 0) {
			window.setTimeout( function() {
				document.getElementById('bullet').style.top = (top - 5) + 'px';
				gravity.fly();
			}, 10);
		}
	},
	stop: function() {
		document.addEventListener('keyup', function(e) {
			gravity.fired = false;
			window.setTimeout( function() {
				gravity.fall();
			}, 100);
		});
	},
	fall: function() {
		var top = document.getElementById('bullet').getBoundingClientRect().top;
		if(gravity.fired === false && top < (screen.getHeight() - 93) ) {
			window.setTimeout( function() {
				document.getElementById('bullet').style.top = (top + 5) + 'px';
				gravity.fall();
			}, 10);
		}
	}
} // End of gravity

/**
 * The slider object moves the sliding pipes on the page. 
 */
var slider = {
	move: function(obstacle, position, speed) {
		if(gameOver === false) {
			var top = document.getElementById('top'),
				bottom = document.getElementById('bottom'),
				bullet = document.getElementById('bullet');
			if(position < screen.getWidth() ) {
				window.setTimeout( function() {
					obstacle.style.right = position + 'px';
					slider.move(obstacle, position + 10, speed);
					collision.detect();
				}, speed);
			} else {
				score.up();
				path.setOpenSpace();
				slider.move(obstacle, 0, speed);
			}
		} else {
			trump.show();
		}
	}
} // End of slider.

/**
 * The trump object handles all situations when the game is over. 
 */
var trump = {
	show: function() {
		document.getElementById('trump').style.visibility = 'visible';
		this.playAgain();
	},
	playAgain: function() {
		window.setTimeout( function() {
			document.getElementById('play-again').style.visibility = 'visible';
		}, 500, trump.reload() );
	},
	reload: function() {
		document.getElementById('play-again').addEventListener('click', function() {
			location.reload();
		});
	}
} // End of trump.

/**
 * The calculate object calculates hights for the objects on the page. 
 */
var calculate = {
	heights: function() {
		return Math.floor(Math.random() * screen.getHeight() - 300);
	}
} // End of calculate.

/**
 * The path object handles the math of the open spaces. 
 */
var path = {
	setOpenSpace: function() {
		var top = document.getElementById('top');
			bottom = document.getElementById('bottom');
		top.style.height = calculate.heights() + 'px';
		bottom.style.height = (screen.getHeight() - parseInt(top.style.height) - 300) + 'px';
	}
} // End of path. 

/**
 * The collision object handles the collisions of objects. 
 */
var collision = {
	bulletBounds: function() {
		var item = document.getElementById('bullet');
		return {
			right: item.getBoundingClientRect().right,
			left: item.getBoundingClientRect().left,
			top: item.getBoundingClientRect().top,
			bottom: item.getBoundingClientRect().bottom
		}
	},
	topBounds: function() {
		var item = document.getElementById('top');
		return {
			right: item.getBoundingClientRect().right,
			left: item.getBoundingClientRect().left,
			top: item.getBoundingClientRect().top,
			bottom: item.getBoundingClientRect().bottom
		}
	},
	bottomBounds: function() {
		var item = document.getElementById('bottom');
		return {
			right: item.getBoundingClientRect().right,
			left: item.getBoundingClientRect().left,
			top: item.getBoundingClientRect().top,
			bottom: item.getBoundingClientRect().bottom
		}
	},
	detect: function() {
		var top = collision.topBounds();
			bottom = collision.bottomBounds();
			bullet = collision.bulletBounds();
		if(top.left < bullet.right && top.right > bullet.left ) {
			if(bullet.top < top.bottom || bullet.bottom > bottom.top){
				gameOver = true;
			}
		}
	}
} // End of collision. 

/**
 * The background object handles the sliding background. 
 */
background = {
	slide: function(pos) {
		if(gameOver === false && pos < 100){
			window.setTimeout( function() {
				document.getElementsByTagName("BODY")[0].style.backgroundPosition = pos + '% 0%';
				background.slide(pos + 0.05);
			}, 10);
		}
	}
} // End of background. 

/** 
 * When the DOM is loaded, run these functions. 
 */
document.addEventListener('DOMContentLoaded', function(){ 
	slider.move(document.getElementById('slider'), 0, 10);
	gravity.listen();
	background.slide(0.01);
}, false);
