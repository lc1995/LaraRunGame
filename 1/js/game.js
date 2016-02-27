var game = new Phaser.Game(320,505,Phaser.CANVAS,'game'); //实例化game
game.States = {}; //存放state对象

game.States.boot = function(){
	this.preload = function(){
		if(!game.device.desktop){//移动设备适应
			this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			this.scale.forcePortrait = true;
			this.scale.refresh();
		}
		game.load.image('loading','assets/preloader.gif');
	};
	this.create = function(){
		game.state.start('preload'); //跳转到资源加载页面
	};
}

game.States.preload = function(){
	this.preload = function(){
		var preloadSprite = game.add.sprite(35,game.height/2,'loading'); //创建显示loading进度的sprite
		game.load.setPreloadSprite(preloadSprite);
		//以下为要加载的资源
    	game.load.image('background', 'assets/lara/lara_run_background.png');//背景
    	game.load.image('ground', 'assets/lara/lara_run_ground.png')//地板
    	game.load.image('title', 'assets/lara/lara_run_title.png');//标题
    	game.load.image('btn_play', 'assets/lara/PLAY.png');//PLAY button
    	game.load.image('btn_instruction', 'assets/lara/btn_instruction.png');//btn_instruction button
    	game.load.image('instruction', 'assets/lara/instruction.png');//instruction
    	game.load.image('RETURN', 'assets/lara/RETURN.png');//RETURN button
    	
    	game.load.spritesheet("lara_title", 'assets/lara/lara_for_title.png', 89, 142, 2);//标题鬼畜lara
    	game.load.image('mod1', 'assets/lara/lara_run_mod2.png');//mod1
    	game.load.image('mod2', 'assets/lara/lara_run_mod3.png');//mod2
    	game.load.image('lara_jump', 'assets/lara/lara_run_mod_jump.png');//jump图像
    	game.load.image('triangle', 'assets/lara/triangle.png');//障碍
    	game.load.image('star', 'assets/lara/star.png');//星星
    	//game.load.image('cat', 'assets/lara/cat.png');//猫
    	game.load.spritesheet('eatle', 'assets/lara/eatle.png', 90, 143, 2);//eatle
    	game.load.image('heart', 'assets/lara/heart.png');//heart
    
    	game.load.spritesheet('lara_run', 'assets/lara/Lara_run.png',90,143,4);//run图像
    	game.load.image('ready', 'assets/lara/lara_run_ready.png');//ready图像
    	game.load.image('game_over', 'assets/lara/gameover.png');//gameover图像
    	game.load.image('baozou', 'assets/lara/baozou.png');//baozou文字图像
    	//game.load.image('instruction', 'assets/lara/instruction.png');//instruction图像
	}
	this.create = function(){
		game.state.start('menu');
	}
}

game.States.menu = function(){
	this.create = function(){
		game.add.tileSprite(0,0,game.width,game.height,'background').autoScroll(-10,0); //背景图
		game.add.tileSprite(0,game.height-112,game.width,112,'ground');//地板
		var titleGroup = game.add.group(); //创建存放标题的组
		titleGroup.create(0,0,'title'); //标题
		var lara = game.add.sprite(0, 250, 'lara_title');//添加laraguichu
		lara.animations.add('guichu');//鬼畜起来
		lara.animations.play('guichu', 5, true);//这里5是指频率 true指循环
		
		
		
		titleGroup.x = 135;
		titleGroup.y = 25;
		game.add.tween(titleGroup).to({ x:80 },500,null,true,0,Number.MAX_VALUE,true); //标题的缓动动画
		var btn = game.add.button(200,280,'btn_play',function()
		{//开始按钮
			game.state.start('play');
		});
		//添加一个简介按钮
		var btn_instruction = game.add.button(150, 310,'btn_instruction', function()
		{
			game.state.start('instruction');
		})
		
		btn.anchor.setTo(0.5,0.5);//设置中心点/锚点
	}
}

game.States.instruction = function()
{
	this.create = function()
	{
		game.add.tileSprite(0,0,game.width,game.height,'background').autoScroll(-10,0); //背景图
		game.add.tileSprite(0,game.height-112,game.width,112,'ground');//地板
		game.add.image(0, 0, 'instruction');
		var return_btn = game.add.button(190, 380, 'RETURN', function()
		{
			game.state.start('menu');
		})
	}
}

game.States.play = function(){
	this.create = function(){
		this.bg = game.add.tileSprite(0,0,game.width,game.height,'background');//背景图
//		this.pipeGroup = game.add.group();
//		this.pipeGroup.enableBody = true;
		this.blockGroup = game.add.group();
		this.blockGroup.enableBody = true;
		this.starGroup = game.add.group();
		this.starGroup.enableBody = true;
		//作弊模式
		this.zuobimode = false;

		this.ground = game.add.tileSprite(0,game.height-112,game.width,112,'ground'); //地板
		this.lara = game.add.sprite(55,300,'lara_run'); //lara
		this.lara.animations.add('run',[0,1]);
		this.lara.animations.play('run',5,true);
		this.lara.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.lara,Phaser.Physics.ARCADE); //开启lara的物理系统
		this.lara.body.gravity.y = 0; //lara的重力
		game.physics.enable(this.ground	,Phaser.Physics.ARCADE);//地面
		this.ground.body.immovable = true; //固定不动
		
		this.eatle = game.add.sprite(game.width,300,'eatle'); //eatle
		this.eatle.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.eatle,Phaser.Physics.ARCADE); //开启lara的物理系统
		this.eatle.animations.add('waiting',[0,1]);
		this.eatle.animations.play('waiting',5,true);
		this.eatle.body.gravity.x = -this.gameSpeed;
		var score = 0;
		var scoreText;
		var countText;
		this.scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#ffff'});
		this.countText = game.add.text(15, 38, 'Count: 0', {fontSize: '32px', fill: '#ffff'});

		this.readyText = game.add.image(190, 0, 'ready'); //get ready 文字
		this.readyText.anchor.setTo(0.5, 0);
		this.hasStarted = false; //游戏是否已开始
		game.time.events.loop(1800, this.generateBlocks, this);//循环产生blocks
		game.time.events.loop(1800, this.generateStars, this);//循环产生stars
		game.time.events.stop(false);
		
		game.input.onDown.addOnce(this.statrGame, this);
	};
	this.update = function(){
		if(!this.hasStarted) return; //游戏未开始
		if(this.score > 1000)
		{
			this.ending();
		}
		
		game.physics.arcade.collide(this.lara, this.ground, this.hitGround,null, this);//与地板碰撞
		game.physics.arcade.overlap(this.lara, this.blockGroup, this.hitBlock, null, this); //与三角碰撞
		game.physics.arcade.overlap(this.starGroup, this.ground, this.starFall, null, this);//星星撞到地板
		game.physics.arcade.overlap(this.lara, this.eatle, this.love, null, this); //与三角碰撞
		
	}
	
	this.ending = function()
	{
		this.bg.stopScroll();
		this.ground.stopScroll();
		game.input.onDown.remove(this.jump,this);
		game.time.events.stop(true);
		this.blockGroup.forEachExists(function(block){
			block.destroy();
		}, this);
		this.starGroup.forEachExists(function(star){
			star.destroy();
		});
		this.lara.body.velocity.x = this.gameSpeed;
		this.lara.animations.stop('run', 0);
		
//		game.physics.enable(this.eatle,Phaser.Physics.ARCADE); //开启lara的物理系统
		
		
	}
	
	this.love = function()
	{
		this.eatle.animations.stop('waiting', 1)
		this.heart = game.add.image(190, 0, 'heart'); //heart出现
		game.time.events.add(Phaser.Timer.SECOND * 3, this.showGameOverText(), this);
	}

	this.statrGame = function(){
		this.gameSpeed = 200; //游戏速度
		this.gameIsOver = false;
		this.hasHitBlock = false;
		this.hasHitGround = false;
		this.hasStarted = true;
		this.score = 0;
		this.countstar = 0;//计数星星
		this.baozouState = false;//暴走状态
		
		this.bg.autoScroll(-(this.gameSpeed/10),0);
		this.ground.autoScroll(-this.gameSpeed,0);
		this.lara.body.gravity.y = 1050; //lara的重力


		this.readyText.destroy();
//		game.input.onDown.add(this.jump, this);
//		这里改成只有点击lara才能让lara跳
		this.lara.inputEnabled = true;
		this.lara.input.useHandCursor = true;
		this.lara.events.onInputDown.add(this.jump, this);	
		
		this.starGroup.inputEnabled = true;
		//在这里使star的Input可行，准备把触发事件直接写在generate star里面
		game.time.events.start();
	}

	this.stopGame = function(){
		this.bg.stopScroll();
		this.ground.stopScroll();
		
		//停止刺和星星
		this.blockGroup.forEachExists(function(block){
			block.body.velocity.x = 0;
		}, this);
		this.starGroup.forEachExists(function(star){
			star.body.velocity.y = 0;
		});
		this.lara.animations.stop('run', 0);
		game.input.onDown.remove(this.jump,this);
		game.time.events.stop(true);
	}

	
	this.jump = function(){
		//当lara跳起来时，她不能继续飞
		//但如果是作弊模式，就让她飞吧
		if(this.lara.body.y < 250)
		{
			if(zuobimode == false)
				return;
			else if(zuobimode == true)
			{
				
			}
		}
		this.lara.body.velocity.y = -600;
		//如果是在暴走，不让他动画改变
		if(this.baozouState == true)
		{
			return;
		}
		
		this.lara.animations.stop('run', 2);
		this.lara.frame = 2;
	}

	this.hitBlock = function(){
		if (this.baozouState == true)
		{
			return;
		}
		this.gameOver();
	}
	this.hitGround = function(){
		if (this.baozouState == true)
		{
			return;
		}
		this.lara.animations.play('run', 5, true);
	}
	this.gameOver = function(){
		this.gameIsOver = true;
		this.stopGame();
		this.showGameOverText();
	};

	this.showGameOverText = function(){
		this.scoreText.destroy();
		this.countText.destroy();
		game.bestScore = game.bestScore || 0;
		if(this.score > game.bestScore) game.bestScore = this.score; //最好分数
		if (game.bestScore > 100000)
		{
			this.zuobimode = true;//开启作弊模式
		}
		
		this.gameOverGroup = game.add.group(); //添加一个组
		var gameOverText = this.gameOverGroup.create(game.width/2,0,'game_over'); //game over 文字图片
		var currentScoreText = game.add.text(200, 85, this.score + '', {fontSize: '32px', fill: '#ffff'},this.gameOverGroup); //当前分数,听说加个''就变成string了？
		var bestScoreText = game.add.text(200, 155, game.bestScore + '', {fontSize: '32px', fill: '#ffff'}, this.gameOverGroup); //最好分数
		var replayBtn = game.add.button(game.width/2, 210, 'btn_play', function(){//重玩按钮
			game.state.start('play');
		}, this, null, null, null, null, this.gameOverGroup);
		gameOverText.anchor.setTo(0.5, 0);
		replayBtn.anchor.setTo(0.5, 0);
		this.gameOverGroup.y = 30;
	}
	

	
	this.generateBlocks = function(){
		this.score  = this.score + 100;//分数更新在这里
		this.scoreText.text = 'Score: ' + this.score;
		if(Math.random() > 0.4 )
			var block = game.add.sprite(game.width, game.height - 169, 'triangle', 0 ,this.blockGroup);
		this.blockGroup.setAll('checkWorldBounds',true);
		this.blockGroup.setAll('outOfBoundsKill',true);
		this.blockGroup.setAll('body.velocity.x', -this.gameSpeed);
		
		
		
	}
	
	//产生星星
	this.generateStars = function(){
		
		if(Math.random() > 0.4)
			var star = game.add.sprite(game.width* Math.random(), 0, 'star'	, 0, this.starGroup);
			
			
		this.starGroup.setAll('body.velocity.y', this.gameSpeed);
		this.starGroup.forEachExists(function(star){
			star.inputEnabled = true;
	
		    star.input.useHandCursor = true;
		
		    star.events.onInputDown.add(this.touchStar, this);
		}, this); 
	}
	//星星坠落消失
	this.starFall = function(){
		this.starGroup.getBottom().kill();
		this.starGroup.getBottom().destroy();
	}
	//点击星星事件
	this.touchStar = function(star)
	{
		this.countstar = this.countstar + 1;
		this.countText.text = 'Count: ' + this.countstar;
		this.score = this.score + 500;//额外Bonus
		this.scoreText.text = 'Score: ' + this.score;//更新分数显示
		if (this.countstar == 5)
		{
			this.baozouState = true;//开启暴走状态！！！！
			this.baozou();
			
		}
		star.destroy();
	}
	
	//暴走状态
	this.baozou = function()
	{
		console.log('bao zou la !');
		this.baozouText = game.add.image(45, 0, 'baozou'); //baozou 文字
		this.gameSpeed = 800;//开始加速
		this.lara.animations.stop('run', 2);//让lara暴走
		this.lara.frame = 3;
		this.bg.autoScroll(-(this.gameSpeed/10),0);
		this.ground.autoScroll(-this.gameSpeed,0);
		//持续7秒钟
		game.time.events.add(Phaser.Timer.SECOND * 7, this.stopbaozou, this);
		
	}
	
	//停止暴走
	this.stopbaozou = function()
	{
		console.log('bao zou ting zhi');
		this.baozouText.destroy();
		this.gameSpeed = 200;
		this.bg.autoScroll(-(this.gameSpeed/10),0);
		this.ground.autoScroll(-this.gameSpeed,0);
		this.lara.animations.play('run', 5, true);
		this.baozouState = false;
		//重新计算countstar
		this.countstar = 0;
		
	}

}

//添加state到游戏
game.state.add('boot',game.States.boot);
game.state.add('preload',game.States.preload);
game.state.add('menu',game.States.menu);
game.state.add('play',game.States.play);
game.state.add('instruction',game.States.instruction);
game.state.start('boot'); //启动游戏

