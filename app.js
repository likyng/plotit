$(document).ready(function() {

	String.prototype.insertAt = function(index, string) {
    switch(index) {
			case this.index:
				return this + string;
			case 0:
				return string + this;
			default:
				return this.slice(0, index) + string + this.slice(index);
		}};

	function resizeCanvas() {
		$("#can")
			.attr('width', $(window).width() * 0.9)
			.attr('height', $(window).height() * 0.8);
		$("#centered").width($(window).width() * 0.9);
	};

	resizeCanvas();

	$(window).resize(function() {
		resizeCanvas();
		graph.plotIt();
	});


	$('input').on('keypress', function(e) {
		if(13 !== e.which) 
			return;
		graph.plotIt();
	});

	function Plot(cfg) {
		this.can = document.getElementById(cfg.canId);
		this.minX = cfg.minX;
		this.minY = cfg.minY;
		this.maxX = cfg.maxX;
		this.maxY = cfg.maxY;

		this.tickRate = (this.maxX + this.maxY) / 20;
		this.tickSize = 6;
		this.tickFont = '8pt Verdana';

		this.ctx = this.can.getContext('2d');
		//seperation redundant because always square?
		this.rangeX = this.maxX - this.minX;
		this.rangeY = this.maxY - this.minY;
		this.pUnitX = this.can.width / this.rangeX;
		this.pUnitY = this.can.height / this.rangeY;
		this.centerY = Math.round(Math.abs(this.minY / this.rangeY) * this.can.height);
		this.centerX = Math.round(Math.abs(this.minX / this.rangeX) * this.can.width);
		this.iter = (this.maxX - this.minX) / 1000;
		this.scaleX = this.can.width / this.rangeX;
		this.scaleY = this.can.height / this.rangeY;
		this.axisLW = 1;

		this.drawAxis("x");
		this.drawAxis("y");
 	 };

	Plot.prototype.plotIt = function() {
		this.clear();
		var expr = Parser.parse($('input').val());
		this.drawPlot(expr, 2);
	};

	Plot.prototype.setUp = function() {
		this.centerY = Math.round(Math.abs(this.minY / this.rangeY) * this.can.height);
		this.centerX = Math.round(Math.abs(this.minX / this.rangeX) * this.can.width);
		this.rangeX = this.maxX - this.minX;
		this.rangeY = this.maxY - this.minY;
		this.pUnitX = this.can.width / this.rangeX;
		this.pUnitY = this.can.height / this.rangeY;
		this.scaleX = this.can.width / this.rangeX;
		this.scaleY = this.can.height / this.rangeY;
		this.axisLW = 1;

		this.drawAxis("x");
		this.drawAxis("y");
	};

	Plot.prototype.drawAxis = function(axis) {
		var ctx = this.ctx;
		ctx.save();
		ctx.beginPath();
		switch(axis) {
			case "x":
				ctx.moveTo(0, this.centerY);
				ctx.lineTo(this.can.width, this.centerY);
				ctx.lineWidth = this.axisLW;
				ctx.stroke();
				this.drawTickMarks(axis);
				break;
			case "y":
				ctx.moveTo(this.centerX, 0);
				ctx.lineTo(this.centerX, this.can.height);
				ctx.lineWidth = this.axisLW;
				ctx.stroke();
				this.drawTickMarks(axis);
				break;
			default:
				break;
		}

		ctx.restore();
	};

	Plot.prototype.drawTickMarks = function(axis) {
		var ctx = this.ctx;
		ctx.save();
		ctx.beginPath();
		var incr, pos, unit;
		switch(axis) {
			case "x":
				incr = this.tickRate * this.pUnitX;
				pos = 0 + incr;
				unit = this.minX + this.tickRate;
				while(pos < this.can.width) {
					ctx.moveTo(pos, this.centerY - this.tickSize);
					ctx.lineTo(pos, this.centerY + this.tickSize);
					ctx.stroke();
					ctx.fillText(unit, pos, this.centerY + this.tickSize + 3);
					if(unit + this.tickRate >= 0 && unit < 0) {
						pos = this.centerX ;
						unit += this.tickRate;
					}
					unit = Math.round(unit + this.tickRate);
					pos = Math.round(pos + incr);
				}
				break;
			case "y":
				incr = this.tickRate * this.pUnitY;
				pos = this.can.height - incr;
				unit = this.minY + this.tickRate;
				while(pos > 0) {
					ctx.moveTo(this.centerX - this.tickSize, pos);
					ctx.lineTo(this.centerX + this.tickSize, pos);
					ctx.stroke();
					ctx.fillText(unit, this.centerX + this.tickSize + 3, pos);
					if(unit + this.tickRate >= 0 && unit < 0) {
						pos = this.centerY;
						unit += this.tickRate;
					}
					unit = Math.round(unit + this.tickRate);
					pos = Math.round(pos - incr);
				}
				break;
			default:
				break
		}
		ctx.restore();
	};

	Plot.prototype.clear = function() {
		var ctx = this.ctx;
		ctx.clearRect(0, 0, this.can.width, this.can.height);
	};

	Plot.prototype.drawPlot = function(expr, thickness) {
		var ctx = this.ctx;
		this.setUp();
		ctx.save();

		this.transformContext();
		ctx.beginPath();
		ctx.moveTo(this.minX, expr.evaluate({ x: this.minX }));

    	//this.iter = (maxX - minX) / 1000, bei 10,-10 also 0.02
		for(var i = this.minX + this.iter; i <= this.maxX; i += this.iter) 
			ctx.lineTo(i, expr.evaluate({ x: i }));

		ctx.restore();
		ctx.lineWidth = thickness;
		ctx.stroke();
		ctx.restore();
	};
	
	Plot.prototype.transformContext = function() {
		var ctx = this.ctx;
		this.ctx.translate(this.centerX, this.centerY);

		ctx.scale(this.scaleX, -this.scaleY);
	};

	var graph = new Plot({
		canId: 'can',
		minX: -10,
		minY: -10,
		maxX: 10,
		maxY: 10
	});

});
