window.onload = function(){

	var data;
	var width = window.innerWidth;
	var height = window.innerHeight;
	var time = -1;
	var dataCount = 0;

	var fps = 30;

	var barWidth = width;

	var svg = d3.select('body').append('svg').attr('width',width).attr('height',height);

	var scale = d3.scale.linear();
	scale.domain([-18,12]);
	scale.range([0,1]);

 	var createBand = function(d,i,dataInTime,group){

 		var rowIndex = i;

 		// starts at 6
 		var thisData = d.slice(6,d.length);

 		d3.select(group).selectAll('rect').data(thisData).enter()
 						.append('rect')
 						.attr('width',function(d,i){
 							return barWidth;
 						})
 						.attr('height',function(d,i){
 							return height/thisData.length;
 						})
				 		.attr('x',function(d,i){
				 			return width-barWidth;
				 		})
				 		.attr('y',function(d,i){
				 			return i*(height/thisData.length);
				 		})
				 		.attr('opacity',function(d,i){
				 			return scale(d);
				 		})
				 		.attr('fill','red')
				 		.attr('opacity',function(d,i){
				 			return scale(d);
				 		});
				 		
 	};

	var moveInTime = function(){

			time += 1;

	 		var dataInTime = data.slice(time,time+1);

	 		// if there is still data in the current dataset
	 		
	 		if(time < 1000){

		 	var dataFeed = svg.selectAll('.bar')
		 		.data(dataInTime,function(d){
		 			// use time column as the key
		 			return d[1];
		 		});

		 	//exiting elements
		 	dataFeed.exit()
		 			.each(function(){
		 				var current_x = parseFloat(d3.select(this).select('rect').attr('x'));
		 				d3.select(this).selectAll('rect').attr('x',current_x-barWidth);
		 				if(current_x < 0){
		 					this.remove();
		 				}
		 			});

		 	// new elements
		 	dataFeed
		 		.enter()
		 		.append('g')
		 		.attr('class','bar')
		 		.each(function(d,i){
		 			createBand(d,i,dataInTime,this);
		 		});

		 	 // text
		 	
		 	var textFeed = svg.selectAll('text')
		 		.data(dataInTime,function(d){
		 			// use time column as the key
		 			return d[1];
		 		});

		
		 	textFeed
		 		.enter()
		 		.append('text')
		 		.text(function(d,i){
		 			return d[1];
		 		})
		 		.attr('x',4)
		 		.attr('y',20)
		 		.attr('font-family','Helvetica')
		 		.attr('fill','white');

		 	textFeed.exit().remove();

		 	}

		 	
		 	// if we need to move to the next dataset
		 	else{
		 		
		 		 dataReady = false;
			 	 time = -1;
		 		 dataCount += 1;
		 		 
		 		 // if there is still another dataset
		 		 if(dataCount < 17){

		 		 	loadData(dataCount,function(){
		 		 		moveInTime(time);
		 		 	});
		 		 }
		 	}

		 	};

	var loadData = function(datacount,callback){
		d3.json('data/log_'+datacount+'.json',function(jsondata){
			console.log("loaded data " + datacount);
			data = jsondata;
			dataReady = true;
			callback();
		});
	}

	var bigBang = function(){

			var tick = function(){
			
			if(dataReady == true){

				moveInTime();
				
				setTimeout(function(){
					requestAnimationFrame(tick);
				},1000/fps);

			}

			else{

				setTimeout(function(){
					requestAnimationFrame(tick);
				},1000/fps);

			}

			}

			requestAnimationFrame(tick);

	}

	loadData(dataCount,function(){
	
		bigBang();
	});
	


}