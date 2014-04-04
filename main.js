window.onload = function(){

	 var width = window.innerWidth;
	 var height = window.innerHeight;

	var svg = d3.select('body').append('svg').attr('width',width).attr('height',height);

	 var drawGraph = function(data){

	 	var scale = d3.scale.linear();
	 	scale.domain([-18,12]);
	 	scale.range([0,1]);

	 	var createBand = function(d,i){

	 		var rowIndex = i;

	 		var thisData = d.slice(6);

	 		d3.select(this).selectAll('rect').data(thisData).enter()
	 						.append('rect')
	 						.attr('width',function(d,i){
	 							return Math.ceil(width/data.length);
	 						})
	 						.attr('height',function(d,i){
	 							return height/thisData.length;
	 						})
					 		.attr('x',function(d,i){
					 			return rowIndex*(width/data.length);
					 		})
					 		.attr('y',function(d,i){
					 			return i*(height/thisData.length);
					 		})
					 		.attr('opacity',function(d,i){
					 			return scale(d);
					 		})
					 		.attr('fill','red');
					 		

			d3.select(this).append('text')
							.text(d[1]).attr('fill','rgba(255,255,255,0.6)')
							.attr('y',height)
							.attr('font-family','Helvetica')
							.attr('font-size','10px')

							.attr('transform',function(){
								return 'rotate(-90 '+(rowIndex*(width/data.length)+(width/data.length)/2)+' '+(height)+')';
							})
							.attr('x',function(d,i){
					 			return rowIndex*(width/data.length)+(width/data.length)/2;
					 		});

	 	};

	 	svg.selectAll('.bar')
	 		.data(data)
	 		.enter()
	 		.append('g')
	 		.attr('class','bar')
	 		.each(createBand);
	}

	d3.json('scannerdata.json',function(data){
		drawGraph(data);
	})



}