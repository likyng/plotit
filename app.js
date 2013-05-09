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

	$('input').on('keypress', function(e) {
		if(13 !== e.which) 
			return;
    	var input = $(this).val();
		var expr = Parser.parse(input);
		graph.clear();
    	graph.drawPlot(expr, 2);
	});

	function Plot(cfg) {
		this.can = document.getElementById(cfg.canId);
		this.minX = cfg.minX;
		this.minY = cfg.minY;
		this.maxX = cfg.maxX;
		this.maxY = cfg.maxY;

		this.ctx = this.can.getContext('2d');
		this.rangeX = this.maxX - this.minX;
		this.rangeY = this.maxY - this.minY;
		this.unitX = this.can.width / this.rangeX;
		this.unitY = this.can.height / this.rangeY;
		this.centerY = Math.round(Math.abs(this.minY / this.rangeY) * this.can.height);
		this.centerX = Math.round(Math.abs(this.minX / this.rangeX) * this.can.width);
		this.iter = (this.maxX - this.minX) / 1000;
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
				break;
			case "y":
				ctx.moveTo(this.centerX, 0);
				ctx.lineTo(this.centerX, this.can.height);
				break;
			default:
				break;
		}
		ctx.lineWidth = this.axisLW;
		ctx.stroke();
		ctx.restore();
	};

	Plot.prototype.clear = function() {
		var ctx = this.ctx;
		ctx.clearRect(0, 0, this.can.width, this.can.height);
	};

	Plot.prototype.drawPlot = function(expr, thickness) {
		var ctx = this.ctx;
		this.drawAxis("y");
		this.drawAxis("x");
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
